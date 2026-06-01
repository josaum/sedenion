//! Arrow IPC boundary for real UAV trajectories.
//!
//! `tools/rosbag_to_arrow.py` writes this schema from ROS bags:
//! `t, ax, ay, az, px, py, pz, vx, vy, vz, gx, gy, gz`.
//!
//! Two readers share one schema:
//! * [`ArrowFlight`] decodes a whole flight **zero-copy** (mmap + `FileDecoder`,
//!   so the Arrow arrays alias the memory map) and materializes `Sample`s — used
//!   for the viewer export and the filter-in-loop test sequences.
//! * [`stream_examples_file`] / [`stream_examples_reader`] featurize **streaming**
//!   with a bounded sliding window, so training data larger than memory never
//!   materializes the full raw stream.
//!
//! Training targets are the INS error (per the synthetic finding):
//! `y[0..3]` = accel-bias proxy averaged over the context window
//! (`mean(a_meas) - Δv_truth/Δt` over the window), and
//! `y[3..6]` = future dead-reckoning drift over the horizon.

use crate::nav_repr::{chunk_summary, future_drift, Example, ReprConfig, CHUNKS, TARGET, WIDTH};
use crate::sim::{generate, ImuParams, Sample, N};
use arrow::array::{Array, Float32Array, Float64Array};
use arrow::buffer::Buffer;
use arrow::datatypes::{DataType, Field, Schema};
use arrow::error::{ArrowError, Result as ArrowResult};
use arrow::ipc::convert::fb_to_schema;
use arrow::ipc::reader::{read_footer_length, FileDecoder, StreamReader};
use arrow::ipc::writer::FileWriter;
use arrow::ipc::{root_as_footer, Block};
use arrow::record_batch::RecordBatch;
use memmap2::Mmap;
use std::collections::VecDeque;
use std::fs::{self, File};
use std::io::Read;
use std::path::{Path, PathBuf};
use std::sync::Arc;

pub struct RealDataset {
    pub train: Vec<Example>,
    pub test: Vec<Example>,
    pub test_sequences: Vec<Vec<Sample>>,
    pub train_files: usize,
    pub test_files: usize,
}

// ============================================================================
// Zero-copy mmap IPC decode (arrays alias the memory map; no deserialize copy)
// ============================================================================

fn mmap_buffer(path: &Path) -> ArrowResult<Buffer> {
    let file = File::open(path)?;
    // SAFETY: the file is not mutated for the lifetime of the mapping.
    let mmap = unsafe { Mmap::map(&file)? };
    let bytes = bytes::Bytes::from_owner(mmap);
    Ok(Buffer::from(bytes))
}

/// Low-level decoder over an IPC file held in a single (mmap-backed) `Buffer`.
struct IpcBufferDecoder {
    buffer: Buffer,
    decoder: FileDecoder,
    batches: Vec<Block>,
}

impl IpcBufferDecoder {
    fn new(buffer: Buffer) -> ArrowResult<Self> {
        if buffer.len() < 10 {
            return Err(ArrowError::ParseError(
                "file too small for Arrow IPC".into(),
            ));
        }
        let trailer_start = buffer.len() - 10;
        let trailer: [u8; 10] = buffer[trailer_start..]
            .try_into()
            .map_err(|_| ArrowError::ParseError("bad IPC trailer".into()))?;
        let footer_len = read_footer_length(trailer)?;
        let footer = root_as_footer(&buffer[trailer_start - footer_len..trailer_start])
            .map_err(|e| ArrowError::ParseError(format!("invalid Arrow footer: {e}")))?;
        let schema = fb_to_schema(
            footer
                .schema()
                .ok_or_else(|| ArrowError::ParseError("Arrow footer has no schema".into()))?,
        );
        let mut decoder = FileDecoder::new(Arc::new(schema), footer.version());
        for block in footer.dictionaries().iter().flatten() {
            let len = block.bodyLength() as usize + block.metaDataLength() as usize;
            let data = buffer.slice_with_length(block.offset() as _, len);
            decoder.read_dictionary(block, &data)?;
        }
        let batches = footer
            .recordBatches()
            .map(|b| b.iter().copied().collect())
            .unwrap_or_default();
        Ok(Self {
            buffer,
            decoder,
            batches,
        })
    }

    fn num_batches(&self) -> usize {
        self.batches.len()
    }

    fn batch(&self, i: usize) -> ArrowResult<Option<RecordBatch>> {
        let block = &self.batches[i];
        let len = block.bodyLength() as usize + block.metaDataLength() as usize;
        let data = self.buffer.slice_with_length(block.offset() as _, len);
        self.decoder.read_record_batch(block, &data)
    }
}

/// A whole flight decoded zero-copy from an Arrow IPC file. The decoded batches
/// keep the mmap-backed buffer alive, so column accesses read directly from the
/// memory map.
pub struct ArrowFlight {
    batches: Vec<RecordBatch>,
}

impl ArrowFlight {
    pub fn open(path: &Path) -> ArrowResult<Self> {
        let dec = IpcBufferDecoder::new(mmap_buffer(path)?)?;
        let mut batches = Vec::with_capacity(dec.num_batches());
        for i in 0..dec.num_batches() {
            if let Some(b) = dec.batch(i)? {
                batches.push(b);
            }
        }
        if batches.is_empty() {
            return Err(ArrowError::ParseError(format!(
                "empty Arrow flight file: {}",
                path.display()
            )));
        }
        Ok(Self { batches })
    }

    pub fn to_samples(&self) -> ArrowResult<Vec<Sample>> {
        let mut out = Vec::new();
        for batch in &self.batches {
            out.extend(batch_to_samples(batch)?);
        }
        normalize_samples(&mut out);
        Ok(out)
    }
}

fn col_idx(batch: &RecordBatch, name: &str) -> ArrowResult<usize> {
    batch
        .schema()
        .fields()
        .iter()
        .position(|f| f.name() == name)
        .ok_or_else(|| ArrowError::SchemaError(format!("missing column `{name}`")))
}

fn col_f32<'a>(batch: &'a RecordBatch, name: &str) -> ArrowResult<&'a Float32Array> {
    let idx = col_idx(batch, name)?;
    batch
        .column(idx)
        .as_any()
        .downcast_ref::<Float32Array>()
        .ok_or_else(|| {
            ArrowError::SchemaError(format!(
                "column `{name}` has type {:?}, expected Float32",
                batch.column(idx).data_type()
            ))
        })
}

fn col_f64<'a>(batch: &'a RecordBatch, name: &str) -> ArrowResult<&'a Float64Array> {
    let idx = col_idx(batch, name)?;
    batch
        .column(idx)
        .as_any()
        .downcast_ref::<Float64Array>()
        .ok_or_else(|| {
            ArrowError::SchemaError(format!(
                "column `{name}` has type {:?}, expected Float64",
                batch.column(idx).data_type()
            ))
        })
}

/// Convert one record batch into `Sample`s (reads column buffers in place).
/// Truth bias slots (`truth[6..9]`) stay zero for real data; the INS-bias proxy
/// is computed per-window at featurization time.
fn batch_to_samples(batch: &RecordBatch) -> ArrowResult<Vec<Sample>> {
    let t = col_f64(batch, "t")?;
    let ax = col_f32(batch, "ax")?;
    let ay = col_f32(batch, "ay")?;
    let az = col_f32(batch, "az")?;
    let px = col_f32(batch, "px")?;
    let py = col_f32(batch, "py")?;
    let pz = col_f32(batch, "pz")?;
    let vx = col_f32(batch, "vx")?;
    let vy = col_f32(batch, "vy")?;
    let vz = col_f32(batch, "vz")?;
    let gx = col_f32(batch, "gx")?;
    let gy = col_f32(batch, "gy")?;
    let gz = col_f32(batch, "gz")?;
    let n = batch.num_rows();
    let mut out = Vec::with_capacity(n);
    for i in 0..n {
        let mut truth = [0.0f64; N];
        truth[0] = px.value(i) as f64;
        truth[1] = py.value(i) as f64;
        truth[2] = pz.value(i) as f64;
        truth[3] = vx.value(i) as f64;
        truth[4] = vy.value(i) as f64;
        truth[5] = vz.value(i) as f64;
        out.push(Sample {
            t: t.value(i),
            accel_meas: [ax.value(i) as f64, ay.value(i) as f64, az.value(i) as f64],
            gyro_meas: [gx.value(i) as f64, gy.value(i) as f64, gz.value(i) as f64],
            truth,
        });
    }
    Ok(out)
}

#[derive(Default)]
struct SampleNormalizer {
    origin: Option<(f64, [f64; 3], [f64; 3])>,
}

impl SampleNormalizer {
    fn apply(&mut self, mut s: Sample) -> Sample {
        let (t0, p0, v0) = *self.origin.get_or_insert_with(|| {
            (
                s.t,
                [s.truth[0], s.truth[1], s.truth[2]],
                [s.truth[3], s.truth[4], s.truth[5]],
            )
        });
        s.t -= t0;
        for i in 0..3 {
            s.truth[i] -= p0[i];
            s.truth[3 + i] -= v0[i];
        }
        s
    }
}

fn normalize_samples(samples: &mut Vec<Sample>) {
    let mut norm = SampleNormalizer::default();
    for s in samples {
        *s = norm.apply(*s);
    }
}

// ============================================================================
// Windowing + INS-error target
// ============================================================================

/// Window-averaged accel-bias proxy: mean measured acceleration minus the
/// window's net truth acceleration from velocity endpoints. This is less noisy
/// on real pose-derived velocities than averaging per-sample second differences.
fn windowed_bias_proxy(win: &[Sample], start: usize, end: usize, _dt: f64) -> [f32; 3] {
    let end = end.min(win.len().saturating_sub(1));
    if start >= end {
        return [0.0; 3];
    }
    let mut mean_meas = [0.0f64; 3];
    let n = (end - start).max(1) as f64;
    for s in &win[start..end] {
        for i in 0..3 {
            mean_meas[i] += s.accel_meas[i] / n;
        }
    }
    let dt = (win[end].t - win[start].t).max(1e-6);
    [
        (mean_meas[0] - (win[end].truth[3] - win[start].truth[3]) / dt) as f32,
        (mean_meas[1] - (win[end].truth[4] - win[start].truth[4]) / dt) as f32,
        (mean_meas[2] - (win[end].truth[5] - win[start].truth[5]) / dt) as f32,
    ]
}

/// Build one training example from a contiguous window slice, INS-error target.
/// Returns `None` if `win` lacks the required lookahead past local `start`.
fn build_example(win: &[Sample], start: usize, cfg: &ReprConfig) -> Option<Example> {
    let window = (cfg.window_s / cfg.dt) as usize;
    let horizon = (cfg.horizon_s / cfg.dt) as usize;
    let target_gap = horizon.min(window).max(window / 2);
    let end = start + window;
    let fut = end + horizon;
    let future_start = end + target_gap - window / 2;
    let max_needed = fut.max(future_start + window - 1);
    if window == 0 || win.len() <= max_needed {
        return None;
    }

    let third = (window / CHUNKS).max(1);
    let mut x = [[0.0f32; WIDTH]; CHUNKS];
    let mut x_future = [[0.0f32; WIDTH]; CHUNKS];
    for (c, row) in x.iter_mut().enumerate() {
        let cs = start + c * third;
        let ce = if c + 1 == CHUNKS {
            end
        } else {
            (cs + third).min(end)
        };
        let t_mid = 0.5 * (win[cs].t + win[ce - 1].t);
        *row = chunk_summary(win, cs, ce, t_mid);
    }
    for (c, row) in x_future.iter_mut().enumerate() {
        let cs = future_start + c * third;
        let ce = if c + 1 == CHUNKS {
            future_start + window
        } else {
            (cs + third).min(future_start + window)
        };
        let t_mid = 0.5 * (win[cs].t + win[ce - 1].t);
        *row = chunk_summary(win, cs, ce, t_mid);
    }

    let bias = windowed_bias_proxy(win, start, end, cfg.dt);
    let drift = future_drift(win, end, fut, cfg.dt);
    let mut y = [0.0f32; TARGET];
    y[0..3].copy_from_slice(&bias);
    y[3..6].copy_from_slice(&drift);
    Some(Example { x, x_future, y })
}

/// Window a fully-materialized sequence into examples (strided).
pub fn examples_from_samples(samples: &[Sample], cfg: &ReprConfig, out: &mut Vec<Example>) {
    let stride = (cfg.stride_s / cfg.dt).max(1.0) as usize;
    let mut start = 0;
    while let Some(ex) = build_example(samples, start, cfg) {
        out.push(ex);
        start += stride;
    }
}

// ============================================================================
// Streaming featurization (bounded memory)
// ============================================================================

/// Sliding-window featurizer retaining only a bounded tail of recent samples,
/// so datasets larger than memory never materialize the full raw stream.
struct StreamWindower<'c> {
    cfg: &'c ReprConfig,
    stride: usize,
    lookahead: usize,
    buf: VecDeque<Sample>,
    base: usize,
    next_start: usize,
    total: usize,
}

impl<'c> StreamWindower<'c> {
    fn new(cfg: &'c ReprConfig) -> Self {
        let window = (cfg.window_s / cfg.dt) as usize;
        let horizon = (cfg.horizon_s / cfg.dt) as usize;
        let target_gap = horizon.min(window).max(window / 2);
        let lookahead = window + horizon.max(target_gap + window / 2) + 2;
        Self {
            cfg,
            stride: (cfg.stride_s / cfg.dt).max(1.0) as usize,
            lookahead,
            buf: VecDeque::new(),
            base: 0,
            next_start: 0,
            total: 0,
        }
    }

    fn push<F: FnMut(Example)>(&mut self, s: Sample, sink: &mut F) {
        self.buf.push_back(s);
        self.total += 1;
        while self.next_start + self.lookahead <= self.total {
            let local = self.next_start - self.base;
            self.buf.make_contiguous();
            if let Some(ex) = build_example(self.buf.as_slices().0, local, self.cfg) {
                sink(ex);
            }
            self.next_start += self.stride;
            while self.base < self.next_start && self.buf.len() > self.lookahead + self.stride {
                self.buf.pop_front();
                self.base += 1;
            }
        }
    }
}

/// Stream examples from a zero-copy mmap'd Arrow IPC **file**, one record batch
/// at a time. Memory stays bounded by the sliding window, so files larger than
/// RAM work (the OS pages the mmap on demand).
pub fn stream_examples_file<F: FnMut(Example)>(
    path: &Path,
    cfg: &ReprConfig,
    mut sink: F,
) -> ArrowResult<usize> {
    let dec = IpcBufferDecoder::new(mmap_buffer(path)?)?;
    let mut win = StreamWindower::new(cfg);
    let mut norm = SampleNormalizer::default();
    let mut count = 0usize;
    for i in 0..dec.num_batches() {
        if let Some(batch) = dec.batch(i)? {
            for s in batch_to_samples(&batch)? {
                win.push(norm.apply(s), &mut |ex| {
                    count += 1;
                    sink(ex)
                });
            }
        }
    }
    Ok(count)
}

/// Stream examples from any unseekable byte stream in the Arrow IPC **stream**
/// format (pipe/network), bounded memory.
pub fn stream_examples_reader<R: Read, F: FnMut(Example)>(
    reader: R,
    cfg: &ReprConfig,
    mut sink: F,
) -> ArrowResult<usize> {
    let stream = StreamReader::try_new(reader, None)?;
    let mut win = StreamWindower::new(cfg);
    let mut norm = SampleNormalizer::default();
    let mut count = 0usize;
    for batch in stream {
        for s in batch_to_samples(&batch?)? {
            win.push(norm.apply(s), &mut |ex| {
                count += 1;
                sink(ex)
            });
        }
    }
    Ok(count)
}

// ============================================================================
// Dataset assembly
// ============================================================================

fn arrow_paths(path: &Path) -> ArrowResult<Vec<PathBuf>> {
    if path.is_file() {
        return Ok(vec![path.to_path_buf()]);
    }
    let mut out = Vec::new();
    for entry in fs::read_dir(path)? {
        let p = entry?.path();
        if p.is_dir() {
            out.extend(arrow_paths(&p)?);
        } else if matches!(
            p.extension().and_then(|s| s.to_str()),
            Some("arrow" | "ipc" | "feather")
        ) {
            out.push(p);
        }
    }
    Ok(out)
}

/// Load a directory of Arrow flights, split train/test by file. Training files
/// are **streamed** (bounded memory); test files are materialized (the UKF loop
/// needs whole sequences).
pub fn load_dataset(dir: &Path, cfg: &ReprConfig, test_frac: f64) -> ArrowResult<RealDataset> {
    let mut paths = arrow_paths(dir)?;
    paths.sort();
    if paths.is_empty() {
        return Err(ArrowError::ParseError(format!(
            "no .arrow/.ipc/.feather files under {}",
            dir.display()
        )));
    }
    if paths.len() == 1 {
        return load_single_flight_dataset(&paths[0], cfg, test_frac);
    }

    let test_files = ((paths.len() as f64 * test_frac.clamp(0.05, 0.8)).round() as usize).max(1);
    let split_at = paths.len().saturating_sub(test_files).max(1);

    let mut train = Vec::new();
    let mut train_files = 0usize;
    for path in &paths[..split_at] {
        let before = train.len();
        stream_examples_file(path, cfg, |ex| train.push(ex))?;
        if train.len() > before {
            train_files += 1;
        }
    }

    let mut test = Vec::new();
    let mut test_sequences = Vec::new();
    let mut actual_test_files = 0usize;
    for path in &paths[split_at..] {
        let samples = ArrowFlight::open(path)?.to_samples()?;
        let mut ex = Vec::new();
        examples_from_samples(&samples, cfg, &mut ex);
        if ex.is_empty() {
            continue;
        }
        test.extend(ex);
        test_sequences.push(samples);
        actual_test_files += 1;
    }

    if train.is_empty() || test.is_empty() || test_sequences.is_empty() {
        return Err(ArrowError::ParseError(format!(
            "not enough usable Arrow flights under {}; need train and test examples",
            dir.display()
        )));
    }

    Ok(RealDataset {
        train,
        test,
        test_sequences,
        train_files,
        test_files: actual_test_files,
    })
}

fn load_single_flight_dataset(
    path: &Path,
    cfg: &ReprConfig,
    test_frac: f64,
) -> ArrowResult<RealDataset> {
    let samples = ArrowFlight::open(path)?.to_samples()?;
    let min_needed = ((cfg.window_s + cfg.horizon_s + cfg.window_s) / cfg.dt)
        .ceil()
        .max(1.0) as usize
        + 4;
    if samples.len() < min_needed * 2 {
        return Err(ArrowError::ParseError(format!(
            "single Arrow flight {} is too short for chronological train/test split",
            path.display()
        )));
    }

    let test_n = ((samples.len() as f64 * test_frac.clamp(0.05, 0.5)).round() as usize)
        .max(min_needed)
        .min(samples.len().saturating_sub(min_needed));
    let split = samples.len() - test_n;
    let mut train_seq = samples[..split].to_vec();
    let mut test_seq = samples[split..].to_vec();
    normalize_samples(&mut train_seq);
    normalize_samples(&mut test_seq);

    let mut train = Vec::new();
    let mut test = Vec::new();
    examples_from_samples(&train_seq, cfg, &mut train);
    examples_from_samples(&test_seq, cfg, &mut test);
    if train.is_empty() || test.is_empty() {
        return Err(ArrowError::ParseError(format!(
            "single Arrow flight {} did not yield both train and test examples",
            path.display()
        )));
    }

    Ok(RealDataset {
        train,
        test,
        test_sequences: vec![test_seq],
        train_files: 1,
        test_files: 1,
    })
}

// ============================================================================
// Arrow IPC writing (viewer export + fixtures)
// ============================================================================

fn out_schema() -> Arc<Schema> {
    Arc::new(Schema::new(vec![
        Field::new("t", DataType::Float64, false),
        Field::new("ax", DataType::Float32, false),
        Field::new("ay", DataType::Float32, false),
        Field::new("az", DataType::Float32, false),
        Field::new("px", DataType::Float32, false),
        Field::new("py", DataType::Float32, false),
        Field::new("pz", DataType::Float32, false),
        Field::new("vx", DataType::Float32, false),
        Field::new("vy", DataType::Float32, false),
        Field::new("vz", DataType::Float32, false),
        Field::new("gx", DataType::Float32, false),
        Field::new("gy", DataType::Float32, false),
        Field::new("gz", DataType::Float32, false),
    ]))
}

fn samples_record_batch(schema: &Arc<Schema>, slice: &[Sample]) -> ArrowResult<RecordBatch> {
    let mut cols: Vec<Vec<f32>> = (0..12).map(|_| Vec::with_capacity(slice.len())).collect();
    let mut t = Vec::with_capacity(slice.len());
    for s in slice {
        t.push(s.t);
        for k in 0..3 {
            cols[k].push(s.accel_meas[k] as f32);
        }
        for k in 0..6 {
            cols[3 + k].push(s.truth[k] as f32);
        }
        cols[9].push(s.gyro_meas[0] as f32);
        cols[10].push(s.gyro_meas[1] as f32);
        cols[11].push(s.gyro_meas[2] as f32);
    }
    let mut arrays: Vec<arrow::array::ArrayRef> = Vec::with_capacity(13);
    arrays.push(Arc::new(Float64Array::from(t)));
    for c in cols {
        arrays.push(Arc::new(Float32Array::from(c)));
    }
    RecordBatch::try_new(schema.clone(), arrays)
}

/// Write samples as a single-batch Arrow IPC file (keeps the viewer's
/// single-batch typed-buffer fast path).
pub fn write_samples_arrow(path: &Path, samples: &[Sample]) -> ArrowResult<()> {
    write_samples_arrow_batched(path, samples, samples.len().max(1))
}

/// Write samples as Arrow IPC split into multiple record batches of `batch_rows`
/// rows (exercises the streaming/zero-copy readers and bounds writer memory).
pub fn write_samples_arrow_batched(
    path: &Path,
    samples: &[Sample],
    batch_rows: usize,
) -> ArrowResult<()> {
    let schema = out_schema();
    let file = File::create(path)?;
    let mut writer = FileWriter::try_new(file, schema.as_ref())?;
    let bs = batch_rows.max(1);
    let mut r = 0;
    while r < samples.len() {
        let end = (r + bs).min(samples.len());
        writer.write(&samples_record_batch(&schema, &samples[r..end])?)?;
        r = end;
    }
    writer.finish()
}

pub fn write_fixture_dir(
    dir: &Path,
    count: usize,
    duration_s: f64,
    dt: f64,
    duffing: bool,
) -> ArrowResult<()> {
    fs::create_dir_all(dir)?;
    let mut params = ImuParams::default();
    if duffing {
        params.duffing_beta = 5.0;
    }
    let steps = (duration_s / dt) as usize;
    for seed in 0..count {
        let samples = generate(30_000 + seed as u64, steps, dt, &params);
        // Multiple batches so the streaming/zero-copy training path is exercised.
        write_samples_arrow_batched(
            &dir.join(format!("fixture_{seed:03}.arrow")),
            &samples,
            4096,
        )?;
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn streaming_matches_materialized_across_batches() {
        let dir = std::env::temp_dir().join("nav_real_reconcile_test");
        std::fs::create_dir_all(&dir).unwrap();
        let path = dir.join("rt.arrow");
        let cfg = ReprConfig {
            duration_s: 60.0,
            ..ReprConfig::default()
        };
        let steps = (cfg.duration_s / cfg.dt) as usize;
        let samples = generate(11, steps, cfg.dt, &ImuParams::default());
        // Small batches to force cross-batch windows.
        write_samples_arrow_batched(&path, &samples, 257).unwrap();

        // Zero-copy whole-file read -> materialized windowing.
        let flight = ArrowFlight::open(&path).unwrap();
        let loaded = flight.to_samples().unwrap();
        assert_eq!(loaded.len(), samples.len());
        let mut mat = Vec::new();
        examples_from_samples(&loaded, &cfg, &mut mat);
        assert!(!mat.is_empty());

        // Streaming read must yield the same example count.
        let mut streamed = 0usize;
        stream_examples_file(&path, &cfg, |_| streamed += 1).unwrap();
        assert_eq!(streamed, mat.len(), "stream vs materialized example count");
    }

    #[test]
    fn single_file_dataset_splits_and_preserves_gyro() {
        let dir = std::env::temp_dir().join("nav_real_single_file_test");
        std::fs::create_dir_all(&dir).unwrap();
        let path = dir.join("one.arrow");
        let cfg = ReprConfig {
            duration_s: 80.0,
            ..ReprConfig::default()
        };
        let steps = (cfg.duration_s / cfg.dt) as usize;
        let mut samples = generate(19, steps, cfg.dt, &ImuParams::default());
        for s in &mut samples {
            s.gyro_meas = [(0.7 * s.t).sin() * 0.12, (0.3 * s.t).cos() * 0.08, 0.03];
        }
        write_samples_arrow_batched(&path, &samples, 311).unwrap();

        let loaded = ArrowFlight::open(&path).unwrap().to_samples().unwrap();
        assert!(loaded.iter().any(|s| s.gyro_meas[2] != 0.0));

        let ds = load_dataset(&path, &cfg, 0.25).unwrap();
        assert_eq!(ds.train_files, 1);
        assert_eq!(ds.test_files, 1);
        assert!(!ds.train.is_empty());
        assert!(!ds.test.is_empty());
        let first = ds.test_sequences[0][0];
        assert!(first.t.abs() < 1e-9);
        assert!(first.truth[0].abs() < 1e-9);
        assert!(first.truth[3].abs() < 1e-9);
    }
}
