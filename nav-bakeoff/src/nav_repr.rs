//! Navigation representation bakeoff.
//!
//! This is deliberately separate from the UKF bakeoff. The UKF result answers
//! whether a sedenion should be the physical navigation state. This module asks a
//! different question: whether a 16-D sedenion bottleneck is a useful learned
//! representation of MEMS error over short IMU windows.

use crate::sim::{generate, ImuParams, Sample};
use crate::{
    filters::{run, run_with_bias_aid, run_iekf_with_bias_aid, Config as FilterConfig},
    sim,
};
use rand::rngs::StdRng;
use rand::{Rng, SeedableRng};
use sedenion::{auto_zda_gradient_scale, Sedenion};

pub const CHUNKS: usize = 3;
pub const WIDTH: usize = 16;
pub const INPUT: usize = CHUNKS * WIDTH;
pub const TARGET: usize = 6; // accel bias xyz + future dead-reckoning drift xyz

#[derive(Clone)]
pub struct Example {
    pub x: [[f32; WIDTH]; CHUNKS],
    pub x_future: [[f32; WIDTH]; CHUNKS],
    pub y: [f32; TARGET],
}

#[derive(Clone)]
pub struct Scaler {
    x_mean: [[f32; WIDTH]; CHUNKS],
    x_std: [[f32; WIDTH]; CHUNKS],
    y_mean: [f32; TARGET],
    y_std: [f32; TARGET],
}

#[derive(Clone, Copy)]
pub struct ReprConfig {
    pub dt: f64,
    pub duration_s: f64,
    pub window_s: f64,
    pub horizon_s: f64,
    pub stride_s: f64,
    pub duffing: bool,
}

impl Default for ReprConfig {
    fn default() -> Self {
        Self {
            dt: 0.02,
            duration_s: 180.0,
            window_s: 2.0,
            horizon_s: 10.0,
            stride_s: 1.0,
            duffing: false,
        }
    }
}

pub struct TrainConfig {
    pub epochs: usize,
    pub jepa_epochs: usize,
    pub head_epochs: usize,
    pub lr: f32,
    pub jepa_lr: f32,
    pub zda_strength: f32,
    /// Minibatch size for stochastic Adam steps. Training was previously
    /// full-batch (one step per epoch); minibatching gives many more updates
    /// per epoch and acts as a regularizer.
    pub batch_size: usize,
    /// SIGReg strength (LeWM/LeJEPA-style). The JEPA pretext now uses a single
    /// batch-level isotropic-Gaussian regularizer in place of the old
    /// per-sample norm floor; this is its only knob. 0 disables it.
    pub sigreg_weight: f32,
    /// Lower bound on the UKF pseudo-measurement sigma for learned accel-bias
    /// aids. Mixed procedural data can make the train target spread too small,
    /// which makes the filter over-trust imperfect real-domain predictions.
    pub bias_sigma_floor: f64,
}

impl Default for TrainConfig {
    fn default() -> Self {
        Self {
            epochs: 350,
            jepa_epochs: 220,
            head_epochs: 260,
            lr: 0.01,
            jepa_lr: 0.006,
            zda_strength: 0.05,
            batch_size: 256,
            sigreg_weight: 0.5,
            bias_sigma_floor: 0.005,
        }
    }
}

/// Per-axis target std for the SIGReg isotropic-Gaussian prior. Kept well below
/// 1 so it is feasible under the encoder's tanh latent (which saturates near
/// ±1); a near-1 target was a likely contributor to the old latent collapse.
const SIGREG_TARGET_STD: f32 = 0.5;
/// Number of random 1-D projections used to sketch the latent distribution.
const SIGREG_PROJ: usize = 8;
/// The filter-in-loop consumes only the accelerometer-bias channels as pseudo-
/// measurements, so physical pretraining should emphasize them over the drift
/// channels. Drift remains in the loss to keep the representation predictive of
/// future navigation error.
const PRETRAIN_BIAS_WEIGHT: f32 = 4.0;
/// Weight on EMA future-latent prediction during JEPA pretraining. This restores
/// the stable stop-gradient target-encoder recipe from video JEPA while keeping
/// the physical target as the filter-relevant anchor.
const PRETRAIN_LATENT_WEIGHT: f32 = 0.5;
/// Small-data EMA for target encoders. Large video runs use a much slower EMA,
/// but our encoders see only hundreds to thousands of windows per experiment.
const TARGET_EMA: f32 = 0.99;

#[derive(Clone, Copy)]
pub struct Metrics {
    pub norm_mse: f32,
    pub bias_rmse: f32,
    pub drift_3d_rmse: f32,
    pub drift_xy_rmse: f32,
    pub latent_rms: f32,
    pub zda_score: f32,
}

#[derive(Clone)]
pub struct EvalRow {
    pub name: &'static str,
    pub params: usize,
    pub train: Metrics,
    pub test: Metrics,
}

#[derive(Clone)]
pub struct FilterRow {
    pub name: &'static str,
    pub params: usize,
    pub bias_sigma: f64,
    pub terminal_rmse: f64,
    /// Mean terminal horizontal error across test seeds (m).
    pub terminal_mean: f64,
    /// Std of terminal horizontal error across test seeds (m).
    pub terminal_std: f64,
    /// Per-seed terminal horizontal error (m), for paired significance tests.
    pub per_seed: Vec<f64>,
}

pub(crate) fn chunk_summary(
    samples: &[Sample],
    start: usize,
    end: usize,
    t_mid: f64,
) -> [f32; WIDTH] {
    let n = (end - start).max(1) as f64;
    let first = samples[start].accel_meas;
    let last = samples[end - 1].accel_meas;
    let mut mean = [0.0f64; 3];
    let mut m2 = [0.0f64; 3];
    let mut abs_mean = [0.0f64; 3];
    let mut norm_mean = 0.0f64;
    let mut norm_m2 = 0.0f64;

    for s in &samples[start..end] {
        let a = s.accel_meas;
        let norm = (a[0] * a[0] + a[1] * a[1] + a[2] * a[2]).sqrt();
        norm_mean += norm;
        norm_m2 += norm * norm;
        for i in 0..3 {
            mean[i] += a[i];
            m2[i] += a[i] * a[i];
            abs_mean[i] += a[i].abs();
        }
    }

    let mut out = [0.0f32; WIDTH];
    out[0] = 1.0;
    for i in 0..3 {
        mean[i] /= n;
        m2[i] = (m2[i] / n - mean[i] * mean[i]).max(0.0).sqrt();
        abs_mean[i] /= n;
        out[1 + i] = mean[i] as f32;
        out[4 + i] = m2[i] as f32;
        out[7 + i] = ((last[i] - first[i]) / n.sqrt()) as f32;
        out[10 + i] = abs_mean[i] as f32;
    }
    norm_mean /= n;
    norm_m2 = (norm_m2 / n - norm_mean * norm_mean).max(0.0).sqrt();
    out[13] = norm_mean as f32;
    out[14] = norm_m2 as f32;
    out[15] = (0.01 * t_mid) as f32;
    let gyro_energy: f64 = samples[start..end]
        .iter()
        .map(|s| {
            s.gyro_meas[0] * s.gyro_meas[0]
                + s.gyro_meas[1] * s.gyro_meas[1]
                + s.gyro_meas[2] * s.gyro_meas[2]
        })
        .sum();
    if gyro_energy <= 1e-18 {
        return out;
    }

    // Real UAV Arrow files include gyro. Keep WIDTH=16 and replace the
    // accel-only tail features with rotation statistics, which are critical for
    // telling commanded maneuvers apart from accelerometer bias/gravity leakage.
    let mut g_mean = [0.0f64; 3];
    let mut g_m2 = [0.0f64; 3];
    let mut g_norm_mean = 0.0f64;
    for s in &samples[start..end] {
        let g = s.gyro_meas;
        let g_norm = (g[0] * g[0] + g[1] * g[1] + g[2] * g[2]).sqrt();
        g_norm_mean += g_norm;
        for i in 0..3 {
            g_mean[i] += g[i];
            g_m2[i] += g[i] * g[i];
        }
    }
    g_norm_mean /= n;
    let mut imu = [0.0f32; WIDTH];
    imu[0] = 1.0;
    for i in 0..3 {
        let a_mean = mean[i];
        let a_std = m2[i];
        let gm = g_mean[i] / n;
        let gs = (g_m2[i] / n - gm * gm).max(0.0).sqrt();
        imu[1 + i] = a_mean as f32;
        imu[4 + i] = gm as f32;
        imu[7 + i] = a_std as f32;
        imu[10 + i] = gs as f32;
    }
    imu[13] = norm_mean as f32;
    imu[14] = g_norm_mean as f32;
    imu[15] = (0.01 * t_mid) as f32;
    imu
}

pub(crate) fn future_drift(samples: &[Sample], start: usize, end: usize, dt: f64) -> [f32; 3] {
    let mut pos = [
        samples[start].truth[0],
        samples[start].truth[1],
        samples[start].truth[2],
    ];
    let mut vel = [
        samples[start].truth[3],
        samples[start].truth[4],
        samples[start].truth[5],
    ];
    for s in &samples[start..end] {
        for i in 0..3 {
            let a = s.accel_meas[i];
            pos[i] += vel[i] * dt + 0.5 * a * dt * dt;
            vel[i] += a * dt;
        }
    }
    [
        (pos[0] - samples[end].truth[0]) as f32,
        (pos[1] - samples[end].truth[1]) as f32,
        (pos[2] - samples[end].truth[2]) as f32,
    ]
}

pub fn make_examples(seed0: u64, seeds: u64, cfg: &ReprConfig) -> Vec<Example> {
    let mut params = ImuParams::default();
    if cfg.duffing {
        params.duffing_beta = 5.0;
    }

    let steps = (cfg.duration_s / cfg.dt) as usize;
    let window = (cfg.window_s / cfg.dt) as usize;
    let horizon = (cfg.horizon_s / cfg.dt) as usize;
    let target_gap = horizon.min(window).max(window / 2);
    let stride = (cfg.stride_s / cfg.dt).max(1.0) as usize;
    let mut out = Vec::new();

    for seed in seed0..seed0 + seeds {
        let extra = horizon.max(target_gap + window);
        let traj = generate(seed, steps + extra + 1, cfg.dt, &params);
        let last_start = steps.saturating_sub(window + extra + 1);
        for start in (0..last_start).step_by(stride) {
            let end = start + window;
            let fut = end + horizon;
            let future_start = end + target_gap - window / 2;
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
                let t_mid = 0.5 * (traj[cs].t + traj[ce - 1].t);
                *row = chunk_summary(&traj, cs, ce, t_mid);
            }
            for (c, row) in x_future.iter_mut().enumerate() {
                let cs = future_start + c * third;
                let ce = if c + 1 == CHUNKS {
                    future_start + window
                } else {
                    (cs + third).min(future_start + window)
                };
                let t_mid = 0.5 * (traj[cs].t + traj[ce - 1].t);
                *row = chunk_summary(&traj, cs, ce, t_mid);
            }

            let drift = future_drift(&traj, end, fut, cfg.dt);
            let mut y = [0.0f32; TARGET];
            y[0] = traj[end].truth[6] as f32;
            y[1] = traj[end].truth[7] as f32;
            y[2] = traj[end].truth[8] as f32;
            y[3] = drift[0];
            y[4] = drift[1];
            y[5] = drift[2];
            out.push(Example { x, x_future, y });
        }
    }
    out
}

pub fn fit_scaler(train: &[Example]) -> Scaler {
    let mut s = Scaler {
        x_mean: [[0.0; WIDTH]; CHUNKS],
        x_std: [[0.0; WIDTH]; CHUNKS],
        y_mean: [0.0; TARGET],
        y_std: [0.0; TARGET],
    };
    let n = train.len().max(1) as f32;
    let xn = 2.0 * n;
    for ex in train {
        for c in 0..CHUNKS {
            for k in 0..WIDTH {
                s.x_mean[c][k] += ex.x[c][k] / xn;
                s.x_mean[c][k] += ex.x_future[c][k] / xn;
            }
        }
        for k in 0..TARGET {
            s.y_mean[k] += ex.y[k] / n;
        }
    }
    for ex in train {
        for c in 0..CHUNKS {
            for k in 0..WIDTH {
                let d = ex.x[c][k] - s.x_mean[c][k];
                s.x_std[c][k] += d * d / xn;
                let df = ex.x_future[c][k] - s.x_mean[c][k];
                s.x_std[c][k] += df * df / xn;
            }
        }
        for k in 0..TARGET {
            let d = ex.y[k] - s.y_mean[k];
            s.y_std[k] += d * d / n;
        }
    }
    for c in 0..CHUNKS {
        for k in 0..WIDTH {
            s.x_std[c][k] = s.x_std[c][k].sqrt().max(1e-4);
        }
    }
    for k in 0..TARGET {
        s.y_std[k] = s.y_std[k].sqrt().max(1e-4);
    }
    s
}

pub fn apply_scaler(data: &mut [Example], s: &Scaler) {
    for ex in data {
        for c in 0..CHUNKS {
            for k in 0..WIDTH {
                ex.x[c][k] = (ex.x[c][k] - s.x_mean[c][k]) / s.x_std[c][k];
                ex.x_future[c][k] = (ex.x_future[c][k] - s.x_mean[c][k]) / s.x_std[c][k];
            }
        }
        for k in 0..TARGET {
            ex.y[k] = (ex.y[k] - s.y_mean[k]) / s.y_std[k];
        }
    }
}

fn scale_window(x: &mut [[f32; WIDTH]; CHUNKS], s: &Scaler) {
    for c in 0..CHUNKS {
        for k in 0..WIDTH {
            x[c][k] = (x[c][k] - s.x_mean[c][k]) / s.x_std[c][k];
        }
    }
}

fn flatten(x: &[[f32; WIDTH]; CHUNKS]) -> [f32; INPUT] {
    let mut out = [0.0; INPUT];
    for c in 0..CHUNKS {
        for k in 0..WIDTH {
            out[c * WIDTH + k] = x[c][k];
        }
    }
    out
}

fn window_features(
    samples: &[Sample],
    end: usize,
    cfg: &ReprConfig,
) -> Option<[[f32; WIDTH]; CHUNKS]> {
    let window = (cfg.window_s / cfg.dt) as usize;
    if end < window {
        return None;
    }
    let start = end - window;
    let third = (window / CHUNKS).max(1);
    let mut x = [[0.0f32; WIDTH]; CHUNKS];
    for (c, row) in x.iter_mut().enumerate() {
        let cs = start + c * third;
        let ce = if c + 1 == CHUNKS {
            end
        } else {
            (cs + third).min(end)
        };
        let t_mid = 0.5 * (samples[cs].t + samples[ce - 1].t);
        *row = chunk_summary(samples, cs, ce, t_mid);
    }
    Some(x)
}

fn rms(xs: &[f32]) -> f32 {
    let ss: f32 = xs.iter().map(|v| v * v).sum();
    (ss / xs.len().max(1) as f32).sqrt()
}

/// Standard normal sample (Box–Muller).
fn randn(rng: &mut StdRng) -> f32 {
    let u1 = rng.gen::<f32>().max(1e-7);
    let u2 = rng.gen::<f32>();
    (-2.0 * u1.ln()).sqrt() * (2.0 * std::f32::consts::PI * u2).cos()
}

/// Uniformly random unit vector in R^WIDTH.
fn random_unit_proj(rng: &mut StdRng) -> [f32; WIDTH] {
    let mut u = [0.0f32; WIDTH];
    let mut ss = 0.0f32;
    for k in 0..WIDTH {
        let v = randn(rng);
        u[k] = v;
        ss += v * v;
    }
    let inv = 1.0 / ss.sqrt().max(1e-6);
    for k in 0..WIDTH {
        u[k] *= inv;
    }
    u
}

fn rms_of_batch(g: &[[f32; WIDTH]]) -> f32 {
    let mut ss = 0.0f32;
    let mut n = 0usize;
    for v in g {
        for &x in v {
            ss += x * x;
            n += 1;
        }
    }
    (ss / n.max(1) as f32).sqrt()
}

/// SIGReg gradient (LeWM/LeJEPA-style). Pushes the batch of latents toward an
/// isotropic Gaussian `N(0, SIGREG_TARGET_STD^2 I)` by sketching the latent
/// distribution onto `SIGREG_PROJ` random 1-D projections and applying a
/// BHEP / Epps–Pulley characteristic-function Gaussianity test along each.
///
/// Unlike a per-sample norm floor, this is a *distributional* term: a collapsed
/// (constant or low-rank) batch fails the test along most projections, so it
/// resists both trivial and dimensional collapse with a single weight.
///
/// Returns `dL/dz_i` for each sample (averaged over projections, unscaled —
/// the caller rescales relative to the prediction gradient).
fn sigreg_grad(zs: &[[f32; WIDTH]], rng: &mut StdRng) -> Vec<[f32; WIDTH]> {
    let n = zs.len();
    let mut grads = vec![[0.0f32; WIDTH]; n];
    if n < 2 {
        return grads;
    }
    let inv_std = 1.0 / SIGREG_TARGET_STD;
    let nf = n as f32;
    let c1 = (2.0 * std::f32::consts::PI).sqrt(); // weight on the pairwise term
    let c2 = 2.0 * std::f32::consts::PI.sqrt(); // weight on the data-vs-N(0,1) term

    let mut s = vec![0.0f32; n];
    let mut ds = vec![0.0f32; n];
    for _ in 0..SIGREG_PROJ {
        let u = random_unit_proj(rng);
        for i in 0..n {
            s[i] = dot(&u, &zs[i]) * inv_std;
        }
        // dT/ds_m of the BHEP statistic against N(0,1).
        for m in 0..n {
            let sm = s[m];
            let mut pair = 0.0f32;
            for &sk in &s {
                let d = sm - sk;
                pair += -d * (-0.5 * d * d).exp();
            }
            let term1 = (c1 / (nf * nf)) * 2.0 * pair;
            let term2 = (c2 / (2.0 * nf)) * sm * (-0.25 * sm * sm).exp();
            ds[m] = term1 + term2;
        }
        for m in 0..n {
            let g = ds[m] * inv_std;
            for k in 0..WIDTH {
                grads[m][k] += g * u[k];
            }
        }
    }
    let invp = 1.0 / SIGREG_PROJ as f32;
    for v in grads.iter_mut() {
        for x in v.iter_mut() {
            *x *= invp;
        }
    }
    grads
}

/// Scale factor that puts the SIGReg gradient at `weight` x the prediction
/// gradient RMS, mirroring the parameter-free auto-ZDA convention so the single
/// SIGReg `weight` knob is scale-invariant.
fn sigreg_scale(weight: f32, pred: &[[f32; WIDTH]], sig: &[[f32; WIDTH]]) -> f32 {
    if weight <= 0.0 {
        return 0.0;
    }
    weight * rms_of_batch(pred) / rms_of_batch(sig).max(1e-9)
}

/// Fisher-Yates shuffle of `0..n` using the supplied RNG.
fn shuffled_indices(n: usize, rng: &mut StdRng) -> Vec<usize> {
    let mut idx: Vec<usize> = (0..n).collect();
    for i in (1..n).rev() {
        let j = rng.gen_range(0..=i);
        idx.swap(i, j);
    }
    idx
}

fn dot(a: &[f32], b: &[f32]) -> f32 {
    a.iter().zip(b).map(|(x, y)| x * y).sum()
}

fn pretrain_target_grad(pred: &[f32; TARGET], target: &[f32; TARGET]) -> [f32; TARGET] {
    let mut out = [0.0f32; TARGET];
    let norm = 3.0 * PRETRAIN_BIAS_WEIGHT + 3.0;
    for k in 0..TARGET {
        let w = if k < 3 { PRETRAIN_BIAS_WEIGHT } else { 1.0 };
        out[k] = 2.0 * w * (pred[k] - target[k]) / norm;
    }
    out
}

fn pretrain_latent_grad(pred: &[f32; WIDTH], target: &[f32; WIDTH]) -> [f32; WIDTH] {
    let mut out = [0.0f32; WIDTH];
    for k in 0..WIDTH {
        out[k] = 2.0 * PRETRAIN_LATENT_WEIGHT * (pred[k] - target[k]) / WIDTH as f32;
    }
    out
}

fn basis_left_product(k: usize, x: &Sedenion) -> [f32; WIDTH] {
    let mut e = [0.0f32; WIDTH];
    e[k] = 1.0;
    *(Sedenion::new(e) * *x).components()
}

fn basis_right_product(x: &Sedenion, k: usize) -> [f32; WIDTH] {
    let mut e = [0.0f32; WIDTH];
    e[k] = 1.0;
    *(*x * Sedenion::new(e)).components()
}

struct Adam {
    m: Vec<f32>,
    v: Vec<f32>,
    t: usize,
}

impl Adam {
    fn new(n: usize) -> Self {
        Self {
            m: vec![0.0; n],
            v: vec![0.0; n],
            t: 0,
        }
    }

    fn step(&mut self, p: &mut [f32], g: &mut [f32], lr: f32, inv_batch: f32) {
        self.t += 1;
        let b1 = 0.9f32;
        let b2 = 0.999f32;
        let bc1 = 1.0 - b1.powi(self.t as i32);
        let bc2 = 1.0 - b2.powi(self.t as i32);
        for i in 0..p.len() {
            let grad = (g[i] * inv_batch).clamp(-10.0, 10.0);
            self.m[i] = b1 * self.m[i] + (1.0 - b1) * grad;
            self.v[i] = b2 * self.v[i] + (1.0 - b2) * grad * grad;
            let mh = self.m[i] / bc1;
            let vh = self.v[i] / bc2;
            p[i] -= lr * mh / (vh.sqrt() + 1e-8);
            g[i] = 0.0;
        }
    }
}

struct TargetPredictor {
    w: Vec<f32>,
    b: Vec<f32>,
    gw: Vec<f32>,
    gb: Vec<f32>,
    aw: Adam,
    ab: Adam,
}

impl TargetPredictor {
    fn new(seed: u64) -> Self {
        let mut rng = StdRng::seed_from_u64(seed);
        let mut randn = |scale: f32| (rng.gen::<f32>() - 0.5) * 2.0 * scale;
        Self {
            w: (0..TARGET * WIDTH).map(|_| randn(0.04)).collect(),
            b: vec![0.0; TARGET],
            gw: vec![0.0; TARGET * WIDTH],
            gb: vec![0.0; TARGET],
            aw: Adam::new(TARGET * WIDTH),
            ab: Adam::new(TARGET),
        }
    }

    fn forward(&self, z: &[f32; WIDTH]) -> [f32; TARGET] {
        let mut out = [0.0f32; TARGET];
        for o in 0..TARGET {
            out[o] = self.b[o] + dot(&self.w[o * WIDTH..(o + 1) * WIDTH], z);
        }
        out
    }

    fn backward(&mut self, z: &[f32; WIDTH], dp: &[f32; TARGET]) -> [f32; WIDTH] {
        let mut dz = [0.0f32; WIDTH];
        for o in 0..TARGET {
            self.gb[o] += dp[o];
            for k in 0..WIDTH {
                self.gw[o * WIDTH + k] += dp[o] * z[k];
                dz[k] += dp[o] * self.w[o * WIDTH + k];
            }
        }
        dz
    }

    fn step(&mut self, lr: f32, inv_batch: f32) {
        self.aw.step(&mut self.w, &mut self.gw, lr, inv_batch);
        self.ab.step(&mut self.b, &mut self.gb, lr, inv_batch);
    }
}

struct LatentPredictor {
    w: Vec<f32>,
    b: Vec<f32>,
    gw: Vec<f32>,
    gb: Vec<f32>,
    aw: Adam,
    ab: Adam,
}

impl LatentPredictor {
    fn new(seed: u64) -> Self {
        let mut rng = StdRng::seed_from_u64(seed);
        let mut randn = |scale: f32| (rng.gen::<f32>() - 0.5) * 2.0 * scale;
        Self {
            w: (0..WIDTH * WIDTH).map(|_| randn(0.04)).collect(),
            b: vec![0.0; WIDTH],
            gw: vec![0.0; WIDTH * WIDTH],
            gb: vec![0.0; WIDTH],
            aw: Adam::new(WIDTH * WIDTH),
            ab: Adam::new(WIDTH),
        }
    }

    fn forward(&self, z: &[f32; WIDTH]) -> [f32; WIDTH] {
        let mut out = [0.0f32; WIDTH];
        for o in 0..WIDTH {
            out[o] = self.b[o] + dot(&self.w[o * WIDTH..(o + 1) * WIDTH], z);
        }
        out
    }

    fn backward(&mut self, z: &[f32; WIDTH], dp: &[f32; WIDTH]) -> [f32; WIDTH] {
        let mut dz = [0.0f32; WIDTH];
        for o in 0..WIDTH {
            self.gb[o] += dp[o];
            for k in 0..WIDTH {
                self.gw[o * WIDTH + k] += dp[o] * z[k];
                dz[k] += dp[o] * self.w[o * WIDTH + k];
            }
        }
        dz
    }

    fn step(&mut self, lr: f32, inv_batch: f32) {
        self.aw.step(&mut self.w, &mut self.gw, lr, inv_batch);
        self.ab.step(&mut self.b, &mut self.gb, lr, inv_batch);
    }
}

pub trait ReprModel {
    fn name(&self) -> &'static str;
    fn params(&self) -> usize;
    fn forward(&self, x: &[[f32; WIDTH]; CHUNKS]) -> ([f32; WIDTH], [f32; TARGET]);
    /// One supervised Adam step over the minibatch `data[idx[..]]`.
    fn train_batch(&mut self, data: &[Example], idx: &[usize], cfg: &TrainConfig);
}

pub struct DenseModel {
    name: &'static str,
    w1: Vec<f32>,
    b1: Vec<f32>,
    wh: Vec<f32>,
    bh: Vec<f32>,
    gw1: Vec<f32>,
    gb1: Vec<f32>,
    gwh: Vec<f32>,
    gbh: Vec<f32>,
    aw1: Adam,
    ab1: Adam,
    awh: Adam,
    abh: Adam,
}

impl DenseModel {
    pub fn new(seed: u64) -> Self {
        Self::new_named(seed, "Dense MLP 48->16")
    }

    pub fn new_named(seed: u64, name: &'static str) -> Self {
        let mut rng = StdRng::seed_from_u64(seed);
        let mut randn = |scale: f32| (rng.gen::<f32>() - 0.5) * 2.0 * scale;
        let w1 = (0..WIDTH * INPUT).map(|_| randn(0.05)).collect::<Vec<_>>();
        let wh = (0..TARGET * WIDTH).map(|_| randn(0.05)).collect::<Vec<_>>();
        Self {
            name,
            w1,
            b1: vec![0.0; WIDTH],
            wh,
            bh: vec![0.0; TARGET],
            gw1: vec![0.0; WIDTH * INPUT],
            gb1: vec![0.0; WIDTH],
            gwh: vec![0.0; TARGET * WIDTH],
            gbh: vec![0.0; TARGET],
            aw1: Adam::new(WIDTH * INPUT),
            ab1: Adam::new(WIDTH),
            awh: Adam::new(TARGET * WIDTH),
            abh: Adam::new(TARGET),
        }
    }

    fn encode(&self, x: &[[f32; WIDTH]; CHUNKS]) -> [f32; WIDTH] {
        let flat = flatten(x);
        let mut z = [0.0f32; WIDTH];
        for k in 0..WIDTH {
            z[k] = self.b1[k] + dot(&self.w1[k * INPUT..(k + 1) * INPUT], &flat);
            z[k] = z[k].tanh();
        }
        z
    }

    fn backward_encoder(
        &mut self,
        x: &[[f32; WIDTH]; CHUNKS],
        z: &[f32; WIDTH],
        dz: &[f32; WIDTH],
    ) {
        let flat = flatten(x);
        for k in 0..WIDTH {
            let dp = dz[k] * (1.0 - z[k] * z[k]);
            self.gb1[k] += dp;
            for (i, &xi) in flat.iter().enumerate() {
                self.gw1[k * INPUT + i] += dp * xi;
            }
        }
    }

    fn step_encoder(&mut self, lr: f32, inv_batch: f32) {
        self.aw1.step(&mut self.w1, &mut self.gw1, lr, inv_batch);
        self.ab1.step(&mut self.b1, &mut self.gb1, lr, inv_batch);
    }

    fn train_head_batch(&mut self, data: &[Example], idx: &[usize], lr: f32) {
        for &i in idx {
            let ex = &data[i];
            let z = self.encode(&ex.x);
            let mut y = [0.0f32; TARGET];
            for o in 0..TARGET {
                y[o] = self.bh[o] + dot(&self.wh[o * WIDTH..(o + 1) * WIDTH], &z);
            }
            for o in 0..TARGET {
                let dy = 2.0 * (y[o] - ex.y[o]) / TARGET as f32;
                self.gbh[o] += dy;
                for k in 0..WIDTH {
                    self.gwh[o * WIDTH + k] += dy * z[k];
                }
            }
        }
        let inv = 1.0 / idx.len().max(1) as f32;
        self.awh.step(&mut self.wh, &mut self.gwh, lr, inv);
        self.abh.step(&mut self.bh, &mut self.gbh, lr, inv);
    }
}

struct DenseTargetEncoder {
    w1: Vec<f32>,
    b1: Vec<f32>,
}

impl DenseTargetEncoder {
    fn from_model(model: &DenseModel) -> Self {
        Self {
            w1: model.w1.clone(),
            b1: model.b1.clone(),
        }
    }

    fn encode(&self, x: &[[f32; WIDTH]; CHUNKS]) -> [f32; WIDTH] {
        let flat = flatten(x);
        let mut z = [0.0f32; WIDTH];
        for k in 0..WIDTH {
            z[k] = self.b1[k] + dot(&self.w1[k * INPUT..(k + 1) * INPUT], &flat);
            z[k] = z[k].tanh();
        }
        z
    }

    fn update(&mut self, model: &DenseModel, ema: f32) {
        for (target, &online) in self.w1.iter_mut().zip(&model.w1) {
            *target = ema * *target + (1.0 - ema) * online;
        }
        for (target, &online) in self.b1.iter_mut().zip(&model.b1) {
            *target = ema * *target + (1.0 - ema) * online;
        }
    }
}

impl ReprModel for DenseModel {
    fn name(&self) -> &'static str {
        self.name
    }

    fn params(&self) -> usize {
        self.w1.len() + self.b1.len() + self.wh.len() + self.bh.len()
    }

    fn forward(&self, x: &[[f32; WIDTH]; CHUNKS]) -> ([f32; WIDTH], [f32; TARGET]) {
        let z = self.encode(x);
        let mut y = [0.0f32; TARGET];
        for o in 0..TARGET {
            y[o] = self.bh[o] + dot(&self.wh[o * WIDTH..(o + 1) * WIDTH], &z);
        }
        (z, y)
    }

    fn train_batch(&mut self, data: &[Example], idx: &[usize], cfg: &TrainConfig) {
        for &i in idx {
            let ex = &data[i];
            let z = self.encode(&ex.x);
            let mut y = [0.0f32; TARGET];
            for o in 0..TARGET {
                y[o] = self.bh[o] + dot(&self.wh[o * WIDTH..(o + 1) * WIDTH], &z);
            }

            let mut dz = [0.0f32; WIDTH];
            for o in 0..TARGET {
                let dy = 2.0 * (y[o] - ex.y[o]) / TARGET as f32;
                self.gbh[o] += dy;
                for k in 0..WIDTH {
                    self.gwh[o * WIDTH + k] += dy * z[k];
                    dz[k] += dy * self.wh[o * WIDTH + k];
                }
            }
            self.backward_encoder(&ex.x, &z, &dz);
        }
        let inv = 1.0 / idx.len().max(1) as f32;
        self.step_encoder(cfg.lr, inv);
        self.awh.step(&mut self.wh, &mut self.gwh, cfg.lr, inv);
        self.abh.step(&mut self.bh, &mut self.gbh, cfg.lr, inv);
    }
}

pub struct SedenionModel {
    name: &'static str,
    use_auto_zda: bool,
    wl: Vec<f32>,
    wr: Vec<f32>,
    b: Vec<f32>,
    wh: Vec<f32>,
    bh: Vec<f32>,
    gwl: Vec<f32>,
    gwr: Vec<f32>,
    gb: Vec<f32>,
    gwh: Vec<f32>,
    gbh: Vec<f32>,
    awl: Adam,
    awr: Adam,
    ab: Adam,
    awh: Adam,
    abh: Adam,
}

impl SedenionModel {
    pub fn new(seed: u64, use_auto_zda: bool) -> Self {
        Self::new_named(
            seed,
            use_auto_zda,
            if use_auto_zda {
                "Sedenion 16D + auto-ZDA"
            } else {
                "Sedenion 16D"
            },
        )
    }

    pub fn new_named(seed: u64, use_auto_zda: bool, name: &'static str) -> Self {
        let mut rng = StdRng::seed_from_u64(seed);
        let mut randn = |scale: f32| (rng.gen::<f32>() - 0.5) * 2.0 * scale;
        let wl = (0..CHUNKS * WIDTH).map(|_| randn(0.04)).collect::<Vec<_>>();
        let wr = (0..CHUNKS * WIDTH).map(|_| randn(0.04)).collect::<Vec<_>>();
        let wh = (0..TARGET * WIDTH).map(|_| randn(0.05)).collect::<Vec<_>>();
        Self {
            name,
            use_auto_zda,
            wl,
            wr,
            b: vec![0.0; WIDTH],
            wh,
            bh: vec![0.0; TARGET],
            gwl: vec![0.0; CHUNKS * WIDTH],
            gwr: vec![0.0; CHUNKS * WIDTH],
            gb: vec![0.0; WIDTH],
            gwh: vec![0.0; TARGET * WIDTH],
            gbh: vec![0.0; TARGET],
            awl: Adam::new(CHUNKS * WIDTH),
            awr: Adam::new(CHUNKS * WIDTH),
            ab: Adam::new(WIDTH),
            awh: Adam::new(TARGET * WIDTH),
            abh: Adam::new(TARGET),
        }
    }

    fn encode(&self, x: &[[f32; WIDTH]; CHUNKS]) -> [f32; WIDTH] {
        let mut pre = [0.0f32; WIDTH];
        pre.copy_from_slice(&self.b);
        for (c, xc) in x.iter().enumerate() {
            let mut left = [0.0f32; WIDTH];
            let mut right = [0.0f32; WIDTH];
            left.copy_from_slice(&self.wl[c * WIDTH..(c + 1) * WIDTH]);
            right.copy_from_slice(&self.wr[c * WIDTH..(c + 1) * WIDTH]);
            let xs = Sedenion::new(*xc);
            let prod = Sedenion::new(left) * xs + xs * Sedenion::new(right);
            for k in 0..WIDTH {
                pre[k] += prod.components()[k];
            }
        }
        let mut z = [0.0f32; WIDTH];
        for k in 0..WIDTH {
            z[k] = pre[k].tanh();
        }
        z
    }

    fn backward_encoder(
        &mut self,
        x: &[[f32; WIDTH]; CHUNKS],
        z: &[f32; WIDTH],
        dz: &[f32; WIDTH],
    ) {
        let mut dpre = [0.0f32; WIDTH];
        for k in 0..WIDTH {
            dpre[k] = dz[k] * (1.0 - z[k] * z[k]);
            self.gb[k] += dpre[k];
        }

        for (c, xc) in x.iter().enumerate() {
            let xs = Sedenion::new(*xc);
            for k in 0..WIDTH {
                let left = basis_left_product(k, &xs);
                let right = basis_right_product(&xs, k);
                self.gwl[c * WIDTH + k] += dot(&dpre, &left);
                self.gwr[c * WIDTH + k] += dot(&dpre, &right);
            }
        }
    }

    fn step_encoder(&mut self, lr: f32, inv_batch: f32) {
        self.awl.step(&mut self.wl, &mut self.gwl, lr, inv_batch);
        self.awr.step(&mut self.wr, &mut self.gwr, lr, inv_batch);
        self.ab.step(&mut self.b, &mut self.gb, lr, inv_batch);
    }

    fn train_head_batch(&mut self, data: &[Example], idx: &[usize], lr: f32) {
        for &i in idx {
            let ex = &data[i];
            let z = self.encode(&ex.x);
            let mut y = [0.0f32; TARGET];
            for o in 0..TARGET {
                y[o] = self.bh[o] + dot(&self.wh[o * WIDTH..(o + 1) * WIDTH], &z);
            }
            for o in 0..TARGET {
                let dy = 2.0 * (y[o] - ex.y[o]) / TARGET as f32;
                self.gbh[o] += dy;
                for k in 0..WIDTH {
                    self.gwh[o * WIDTH + k] += dy * z[k];
                }
            }
        }
        let inv = 1.0 / idx.len().max(1) as f32;
        self.awh.step(&mut self.wh, &mut self.gwh, lr, inv);
        self.abh.step(&mut self.bh, &mut self.gbh, lr, inv);
    }
}

struct SedenionTargetEncoder {
    wl: Vec<f32>,
    wr: Vec<f32>,
    b: Vec<f32>,
}

impl SedenionTargetEncoder {
    fn from_model(model: &SedenionModel) -> Self {
        Self {
            wl: model.wl.clone(),
            wr: model.wr.clone(),
            b: model.b.clone(),
        }
    }

    fn encode(&self, x: &[[f32; WIDTH]; CHUNKS]) -> [f32; WIDTH] {
        let mut pre = [0.0f32; WIDTH];
        pre.copy_from_slice(&self.b);
        for (c, xc) in x.iter().enumerate() {
            let mut left = [0.0f32; WIDTH];
            let mut right = [0.0f32; WIDTH];
            left.copy_from_slice(&self.wl[c * WIDTH..(c + 1) * WIDTH]);
            right.copy_from_slice(&self.wr[c * WIDTH..(c + 1) * WIDTH]);
            let xs = Sedenion::new(*xc);
            let prod = Sedenion::new(left) * xs + xs * Sedenion::new(right);
            for k in 0..WIDTH {
                pre[k] += prod.components()[k];
            }
        }
        let mut z = [0.0f32; WIDTH];
        for k in 0..WIDTH {
            z[k] = pre[k].tanh();
        }
        z
    }

    fn update(&mut self, model: &SedenionModel, ema: f32) {
        for (target, &online) in self.wl.iter_mut().zip(&model.wl) {
            *target = ema * *target + (1.0 - ema) * online;
        }
        for (target, &online) in self.wr.iter_mut().zip(&model.wr) {
            *target = ema * *target + (1.0 - ema) * online;
        }
        for (target, &online) in self.b.iter_mut().zip(&model.b) {
            *target = ema * *target + (1.0 - ema) * online;
        }
    }
}

impl ReprModel for SedenionModel {
    fn name(&self) -> &'static str {
        self.name
    }

    fn params(&self) -> usize {
        self.wl.len() + self.wr.len() + self.b.len() + self.wh.len() + self.bh.len()
    }

    fn forward(&self, x: &[[f32; WIDTH]; CHUNKS]) -> ([f32; WIDTH], [f32; TARGET]) {
        let z = self.encode(x);
        let mut y = [0.0f32; TARGET];
        for o in 0..TARGET {
            y[o] = self.bh[o] + dot(&self.wh[o * WIDTH..(o + 1) * WIDTH], &z);
        }
        (z, y)
    }

    fn train_batch(&mut self, data: &[Example], idx: &[usize], cfg: &TrainConfig) {
        for &i in idx {
            let ex = &data[i];
            let (z, y) = self.forward(&ex.x);
            let mut dz = [0.0f32; WIDTH];
            for o in 0..TARGET {
                let dy = 2.0 * (y[o] - ex.y[o]) / TARGET as f32;
                self.gbh[o] += dy;
                for k in 0..WIDTH {
                    self.gwh[o * WIDTH + k] += dy * z[k];
                    dz[k] += dy * self.wh[o * WIDTH + k];
                }
            }

            if self.use_auto_zda && cfg.zda_strength > 0.0 {
                let (_loss, zg) = Sedenion::new(z).zda_loss_and_grad();
                let zg = *zg.components();
                let scale = auto_zda_gradient_scale(cfg.zda_strength, rms(&dz), rms(&zg), rms(&z));
                for k in 0..WIDTH {
                    dz[k] += scale * zg[k];
                }
            }

            self.backward_encoder(&ex.x, &z, &dz);
        }
        let inv = 1.0 / idx.len().max(1) as f32;
        self.step_encoder(cfg.lr, inv);
        self.awh.step(&mut self.wh, &mut self.gwh, cfg.lr, inv);
        self.abh.step(&mut self.bh, &mut self.gbh, cfg.lr, inv);
    }
}

pub fn train_model<M: ReprModel>(model: &mut M, data: &[Example], cfg: &TrainConfig) {
    let mut rng = StdRng::seed_from_u64(0xB47C_0001);
    let bs = cfg.batch_size.max(1);
    for _ in 0..cfg.epochs {
        let order = shuffled_indices(data.len(), &mut rng);
        for batch in order.chunks(bs) {
            model.train_batch(data, batch, cfg);
        }
    }
}

fn train_dense_jepa(model: &mut DenseModel, data: &[Example], cfg: &TrainConfig, seed: u64) {
    let mut target_predictor = TargetPredictor::new(seed);
    let mut latent_predictor = LatentPredictor::new(seed ^ 0xB47C_A17E);
    let mut target_encoder = DenseTargetEncoder::from_model(model);
    let mut rng = StdRng::seed_from_u64(seed ^ 0xB47C_0002);
    let mut proj_rng = StdRng::seed_from_u64(seed ^ 0xB47C_5163);
    let bs = cfg.batch_size.max(1);
    for _ in 0..cfg.jepa_epochs {
        let order = shuffled_indices(data.len(), &mut rng);
        for batch in order.chunks(bs) {
            // Pass 1: hybrid JEPA. Predict a slow target-encoder future latent
            // for stability, plus the physical bias/drift target that the UKF
            // actually consumes downstream.
            let mut zs = Vec::with_capacity(batch.len());
            let mut pred_dzs = Vec::with_capacity(batch.len());
            for &i in batch {
                let ex = &data[i];
                let z = model.encode(&ex.x);
                let future = target_encoder.encode(&ex.x_future);
                let target_pred = target_predictor.forward(&z);
                let latent_pred = latent_predictor.forward(&z);
                let target_dp = pretrain_target_grad(&target_pred, &ex.y);
                let latent_dp = pretrain_latent_grad(&latent_pred, &future);
                let target_dz = target_predictor.backward(&z, &target_dp);
                let latent_dz = latent_predictor.backward(&z, &latent_dp);
                let mut dz = [0.0f32; WIDTH];
                for k in 0..WIDTH {
                    dz[k] = target_dz[k] + latent_dz[k];
                }
                pred_dzs.push(dz);
                zs.push(z);
            }
            // Pass 2: batch SIGReg, scaled relative to the prediction gradient.
            let sig_dzs = sigreg_grad(&zs, &mut proj_rng);
            let scale = sigreg_scale(cfg.sigreg_weight, &pred_dzs, &sig_dzs);
            // Pass 3: combined encoder backward.
            for (idx, &i) in batch.iter().enumerate() {
                let mut dz = pred_dzs[idx];
                for k in 0..WIDTH {
                    dz[k] += scale * sig_dzs[idx][k];
                }
                model.backward_encoder(&data[i].x, &zs[idx], &dz);
            }
            let inv = 1.0 / batch.len().max(1) as f32;
            model.step_encoder(cfg.jepa_lr, inv);
            target_predictor.step(cfg.jepa_lr, inv);
            latent_predictor.step(cfg.jepa_lr, inv);
            target_encoder.update(model, TARGET_EMA);
        }
    }
}

fn train_sedenion_jepa(model: &mut SedenionModel, data: &[Example], cfg: &TrainConfig, seed: u64) {
    let mut target_predictor = TargetPredictor::new(seed);
    let mut latent_predictor = LatentPredictor::new(seed ^ 0xB47C_A17F);
    let mut target_encoder = SedenionTargetEncoder::from_model(model);
    let mut rng = StdRng::seed_from_u64(seed ^ 0xB47C_0003);
    let mut proj_rng = StdRng::seed_from_u64(seed ^ 0xB47C_5164);
    let bs = cfg.batch_size.max(1);
    for _ in 0..cfg.jepa_epochs {
        let order = shuffled_indices(data.len(), &mut rng);
        for batch in order.chunks(bs) {
            // Pass 1: hybrid JEPA with EMA future-latent prediction and
            // physically anchored bias/drift prediction.
            let mut zs = Vec::with_capacity(batch.len());
            let mut pred_dzs = Vec::with_capacity(batch.len());
            for &i in batch {
                let ex = &data[i];
                let z = model.encode(&ex.x);
                let future = target_encoder.encode(&ex.x_future);
                let target_pred = target_predictor.forward(&z);
                let latent_pred = latent_predictor.forward(&z);
                let target_dp = pretrain_target_grad(&target_pred, &ex.y);
                let latent_dp = pretrain_latent_grad(&latent_pred, &future);
                let target_dz = target_predictor.backward(&z, &target_dp);
                let latent_dz = latent_predictor.backward(&z, &latent_dp);
                let mut dz = [0.0f32; WIDTH];
                for k in 0..WIDTH {
                    dz[k] = target_dz[k] + latent_dz[k];
                }
                pred_dzs.push(dz);
                zs.push(z);
            }
            // Pass 2: batch SIGReg, scaled relative to the prediction gradient.
            let sig_dzs = sigreg_grad(&zs, &mut proj_rng);
            let scale = sigreg_scale(cfg.sigreg_weight, &pred_dzs, &sig_dzs);
            // Pass 3: combined encoder backward (+ optional per-sample auto-ZDA).
            for (idx, &i) in batch.iter().enumerate() {
                let z = zs[idx];
                let mut dz = pred_dzs[idx];
                for k in 0..WIDTH {
                    dz[k] += scale * sig_dzs[idx][k];
                }
                if model.use_auto_zda && cfg.zda_strength > 0.0 {
                    let (_loss, zg) = Sedenion::new(z).zda_loss_and_grad();
                    let zg = *zg.components();
                    let zscale =
                        auto_zda_gradient_scale(cfg.zda_strength, rms(&dz), rms(&zg), rms(&z));
                    for k in 0..WIDTH {
                        dz[k] += zscale * zg[k];
                    }
                }
                model.backward_encoder(&data[i].x, &z, &dz);
            }
            let inv = 1.0 / batch.len().max(1) as f32;
            model.step_encoder(cfg.jepa_lr, inv);
            target_predictor.step(cfg.jepa_lr, inv);
            latent_predictor.step(cfg.jepa_lr, inv);
            target_encoder.update(model, TARGET_EMA);
        }
    }
}

fn train_dense_head(model: &mut DenseModel, data: &[Example], cfg: &TrainConfig) {
    let mut rng = StdRng::seed_from_u64(0xB47C_0004);
    let bs = cfg.batch_size.max(1);
    for _ in 0..cfg.head_epochs {
        let order = shuffled_indices(data.len(), &mut rng);
        for batch in order.chunks(bs) {
            model.train_head_batch(data, batch, cfg.lr);
        }
    }
}

fn train_sedenion_head(model: &mut SedenionModel, data: &[Example], cfg: &TrainConfig) {
    let mut rng = StdRng::seed_from_u64(0xB47C_0005);
    let bs = cfg.batch_size.max(1);
    for _ in 0..cfg.head_epochs {
        let order = shuffled_indices(data.len(), &mut rng);
        for batch in order.chunks(bs) {
            model.train_head_batch(data, batch, cfg.lr);
        }
    }
}

pub fn evaluate<M: ReprModel>(model: &M, data: &[Example], scaler: &Scaler) -> Metrics {
    let mut norm_loss = 0.0f32;
    let mut bias_ss = 0.0f32;
    let mut drift_ss = 0.0f32;
    let mut drift_xy_ss = 0.0f32;
    let mut latent_ss = 0.0f32;
    let mut zda = 0.0f32;

    for ex in data {
        let (z, y) = model.forward(&ex.x);
        let mut pred = [0.0f32; TARGET];
        let mut truth = [0.0f32; TARGET];
        for k in 0..TARGET {
            norm_loss += (y[k] - ex.y[k]).powi(2);
            pred[k] = y[k] * scaler.y_std[k] + scaler.y_mean[k];
            truth[k] = ex.y[k] * scaler.y_std[k] + scaler.y_mean[k];
        }
        for k in 0..3 {
            bias_ss += (pred[k] - truth[k]).powi(2);
            drift_ss += (pred[3 + k] - truth[3 + k]).powi(2);
        }
        for k in 0..2 {
            drift_xy_ss += (pred[3 + k] - truth[3 + k]).powi(2);
        }
        for &v in &z {
            latent_ss += v * v;
        }
        zda += Sedenion::new(z).zda_score();
    }

    let n = data.len().max(1) as f32;
    Metrics {
        norm_mse: norm_loss / (n * TARGET as f32),
        bias_rmse: (bias_ss / (n * 3.0)).sqrt(),
        drift_3d_rmse: (drift_ss / (n * 3.0)).sqrt(),
        drift_xy_rmse: (drift_xy_ss / (n * 2.0)).sqrt(),
        latent_rms: (latent_ss / (n * WIDTH as f32)).sqrt(),
        zda_score: zda / n,
    }
}

pub fn mean_baseline(data: &[Example], scaler: &Scaler) -> Metrics {
    let mut bias_ss = 0.0f32;
    let mut drift_ss = 0.0f32;
    let mut drift_xy_ss = 0.0f32;
    let mut norm_loss = 0.0f32;
    for ex in data {
        for k in 0..TARGET {
            norm_loss += ex.y[k].powi(2);
        }
        for k in 0..3 {
            let truth = ex.y[k] * scaler.y_std[k] + scaler.y_mean[k];
            let pred = scaler.y_mean[k];
            bias_ss += (pred - truth).powi(2);
            let truth_d = ex.y[3 + k] * scaler.y_std[3 + k] + scaler.y_mean[3 + k];
            let pred_d = scaler.y_mean[3 + k];
            drift_ss += (pred_d - truth_d).powi(2);
        }
        for k in 0..2 {
            let truth_d = ex.y[3 + k] * scaler.y_std[3 + k] + scaler.y_mean[3 + k];
            let pred_d = scaler.y_mean[3 + k];
            drift_xy_ss += (pred_d - truth_d).powi(2);
        }
    }
    let n = data.len().max(1) as f32;
    Metrics {
        norm_mse: norm_loss / (n * TARGET as f32),
        bias_rmse: (bias_ss / (n * 3.0)).sqrt(),
        drift_3d_rmse: (drift_ss / (n * 3.0)).sqrt(),
        drift_xy_rmse: (drift_xy_ss / (n * 2.0)).sqrt(),
        latent_rms: 0.0,
        zda_score: 0.0,
    }
}

/// Collect the per-seed terminal (final-step) horizontal error.
fn terminal_per_seed(per_seed_errors: &[Vec<f64>]) -> Vec<f64> {
    per_seed_errors
        .iter()
        .filter_map(|e| e.last().copied())
        .collect()
}

/// RMS / mean / std of a per-seed terminal-error vector.
fn summarize(per_seed: &[f64]) -> (f64, f64, f64) {
    let n = per_seed.len().max(1) as f64;
    let ss: f64 = per_seed.iter().map(|v| v * v).sum();
    let rmse = (ss / n).sqrt();
    let mean = per_seed.iter().sum::<f64>() / n;
    let var = per_seed.iter().map(|v| (v - mean).powi(2)).sum::<f64>() / n;
    (rmse, mean, var.sqrt())
}

fn make_filter_row(
    name: &'static str,
    params: usize,
    bias_sigma: f64,
    per_seed: Vec<f64>,
) -> FilterRow {
    let (rmse, mean, std) = summarize(&per_seed);
    FilterRow {
        name,
        params,
        bias_sigma,
        terminal_rmse: rmse,
        terminal_mean: mean,
        terminal_std: std,
        per_seed,
    }
}

pub fn eval_dead_reckoning_filter(repr_cfg: &ReprConfig, test_seeds: u64) -> Vec<f64> {
    let mut params = ImuParams::default();
    if repr_cfg.duffing {
        params.duffing_beta = 5.0;
    }
    let steps = (repr_cfg.duration_s / repr_cfg.dt) as usize;
    let cfg = FilterConfig {
        dt: repr_cfg.dt,
        fix_interval: None,
        fix_sigma: 5.0,
        lambda: 0.0,
    };
    let mut per_seed = Vec::new();
    for seed in 20_000..20_000 + test_seeds {
        let traj = generate(seed, steps, repr_cfg.dt, &params);
        per_seed.push(run(&traj, &params, &cfg, false, seed));
    }
    terminal_per_seed(&per_seed)
}

pub fn eval_bias_aided_filter<M: ReprModel>(
    model: &M,
    scaler: &Scaler,
    repr_cfg: &ReprConfig,
    test_seeds: u64,
    bias_sigma: f64,
) -> Vec<f64> {
    let mut params = ImuParams::default();
    if repr_cfg.duffing {
        params.duffing_beta = 5.0;
    }
    let steps = (repr_cfg.duration_s / repr_cfg.dt) as usize;
    let cfg = FilterConfig {
        dt: repr_cfg.dt,
        fix_interval: None,
        fix_sigma: 5.0,
        lambda: 0.0,
    };
    let stride = (repr_cfg.stride_s / repr_cfg.dt).max(1.0) as usize;
    let mut per_seed = Vec::new();

    for seed in 20_000..20_000 + test_seeds {
        let traj = sim::generate(seed, steps, repr_cfg.dt, &params);
        let errors = run_with_bias_aid(
            &traj,
            &params,
            &cfg,
            false,
            seed,
            bias_sigma,
            |idx, samples| {
                if idx % stride != 0 {
                    return None;
                }
                let mut x = window_features(samples, idx, repr_cfg)?;
                scale_window(&mut x, scaler);
                let (_, y) = model.forward(&x);
                Some([
                    (y[0] * scaler.y_std[0] + scaler.y_mean[0]) as f64,
                    (y[1] * scaler.y_std[1] + scaler.y_mean[1]) as f64,
                    (y[2] * scaler.y_std[2] + scaler.y_mean[2]) as f64,
                ])
            },
        );
        per_seed.push(errors);
    }

    terminal_per_seed(&per_seed)
}

// IEKF variants: mirror the bias-aided evaluation but using the IEKF filter.
pub fn eval_bias_aided_filter_iekf<M: ReprModel>(
    model: &M,
    scaler: &Scaler,
    repr_cfg: &ReprConfig,
    test_seeds: u64,
    bias_sigma: f64,
) -> Vec<f64> {
    let mut params = ImuParams::default();
    if repr_cfg.duffing {
        params.duffing_beta = 5.0;
    }
    let steps = (repr_cfg.duration_s / repr_cfg.dt) as usize;
    let cfg = FilterConfig {
        dt: repr_cfg.dt,
        fix_interval: None,
        fix_sigma: 5.0,
        lambda: 0.0,
    };
    let stride = (repr_cfg.stride_s / repr_cfg.dt).max(1.0) as usize;
    let mut per_seed = Vec::new();

    for seed in 20_000..20_000 + test_seeds {
        let traj = sim::generate(seed, steps, repr_cfg.dt, &params);
        let errors = crate::filters::run_iekf_with_bias_aid(
            &traj,
            &params,
            &cfg,
            false,
            seed,
            bias_sigma,
            |idx, samples| {
                if idx % stride != 0 {
                    return None;
                }
                let mut x = window_features(samples, idx, repr_cfg)?;
                scale_window(&mut x, scaler);
                let (_, y) = model.forward(&x);
                Some([
                    (y[0] * scaler.y_std[0] + scaler.y_mean[0]) as f64,
                    (y[1] * scaler.y_std[1] + scaler.y_mean[1]) as f64,
                    (y[2] * scaler.y_std[2] + scaler.y_mean[2]) as f64,
                ])
            },
        );
        per_seed.push(errors);
    }

    terminal_per_seed(&per_seed)
}

pub fn eval_bias_aided_seqs_iekf<M: ReprModel>(
    model: &M,
    scaler: &Scaler,
    sequences: &[Vec<Sample>],
    repr_cfg: &ReprConfig,
    bias_sigma: f64,
) -> Vec<f64> {
    let params = ImuParams::default();
    let cfg = FilterConfig {
        dt: repr_cfg.dt,
        fix_interval: None,
        fix_sigma: 5.0,
        lambda: 0.0,
    };
    let stride = (repr_cfg.stride_s / repr_cfg.dt).max(1.0) as usize;
    let mut per_seed = Vec::new();
    for (i, traj) in sequences.iter().enumerate() {
        let errors = crate::filters::run_iekf_with_bias_aid(
            traj,
            &params,
            &cfg,
            false,
            i as u64,
            bias_sigma,
            |idx, samples| {
                if idx % stride != 0 {
                    return None;
                }
                let mut x = window_features(samples, idx, repr_cfg)?;
                scale_window(&mut x, scaler);
                let (_, y) = model.forward(&x);
                Some([
                    (y[0] * scaler.y_std[0] + scaler.y_mean[0]) as f64,
                    (y[1] * scaler.y_std[1] + scaler.y_mean[1]) as f64,
                    (y[2] * scaler.y_std[2] + scaler.y_mean[2]) as f64,
                ])
            },
        );
        per_seed.push(errors);
    }
    terminal_per_seed(&per_seed)
}

/// Dead-reckoning UKF over caller-supplied real trajectories (no synthetic
/// generation). Uses default MEMS noise params for the process model — these
/// should be calibrated to the real sensor for quantitative work.
pub fn eval_dead_reckoning_seqs(sequences: &[Vec<Sample>], repr_cfg: &ReprConfig) -> Vec<f64> {
    let params = ImuParams::default();
    let cfg = FilterConfig {
        dt: repr_cfg.dt,
        fix_interval: None,
        fix_sigma: 5.0,
        lambda: 0.0,
    };
    let mut per_seed = Vec::new();
    for (i, traj) in sequences.iter().enumerate() {
        per_seed.push(run(traj, &params, &cfg, false, i as u64));
    }
    terminal_per_seed(&per_seed)
}

/// Bias-aided UKF over caller-supplied real trajectories.
pub fn eval_bias_aided_seqs<M: ReprModel>(
    model: &M,
    scaler: &Scaler,
    sequences: &[Vec<Sample>],
    repr_cfg: &ReprConfig,
    bias_sigma: f64,
) -> Vec<f64> {
    let params = ImuParams::default();
    let cfg = FilterConfig {
        dt: repr_cfg.dt,
        fix_interval: None,
        fix_sigma: 5.0,
        lambda: 0.0,
    };
    let stride = (repr_cfg.stride_s / repr_cfg.dt).max(1.0) as usize;
    let mut per_seed = Vec::new();
    for (i, traj) in sequences.iter().enumerate() {
        let errors = run_with_bias_aid(
            traj,
            &params,
            &cfg,
            false,
            i as u64,
            bias_sigma,
            |idx, samples| {
                if idx % stride != 0 {
                    return None;
                }
                let mut x = window_features(samples, idx, repr_cfg)?;
                scale_window(&mut x, scaler);
                let (_, y) = model.forward(&x);
                Some([
                    (y[0] * scaler.y_std[0] + scaler.y_mean[0]) as f64,
                    (y[1] * scaler.y_std[1] + scaler.y_mean[1]) as f64,
                    (y[2] * scaler.y_std[2] + scaler.y_mean[2]) as f64,
                ])
            },
        );
        per_seed.push(errors);
    }
    terminal_per_seed(&per_seed)
}

/// Where the filter-in-loop trajectories come from.
pub enum FilterSource<'a> {
    /// Synthetic trajectories generated from `test_seeds` distinct seeds.
    Synthetic { test_seeds: u64 },
    /// Caller-supplied real trajectories (e.g. parsed from Arrow IPC).
    Real { sequences: &'a [Vec<Sample>] },
}

impl FilterSource<'_> {
    fn dead_reckoning(&self, repr_cfg: &ReprConfig) -> Vec<f64> {
        match self {
            FilterSource::Synthetic { test_seeds } => {
                eval_dead_reckoning_filter(repr_cfg, *test_seeds)
            }
            FilterSource::Real { sequences } => eval_dead_reckoning_seqs(sequences, repr_cfg),
        }
    }

    fn bias_aided<M: ReprModel>(
        &self,
        model: &M,
        scaler: &Scaler,
        repr_cfg: &ReprConfig,
        sigma: f64,
    ) -> Vec<f64> {
        match self {
            FilterSource::Synthetic { test_seeds } => {
                eval_bias_aided_filter(model, scaler, repr_cfg, *test_seeds, sigma)
            }
            FilterSource::Real { sequences } => {
                eval_bias_aided_seqs(model, scaler, sequences, repr_cfg, sigma)
            }
        }
    }

    fn bias_aided_iekf<M: ReprModel>(
        &self,
        model: &M,
        scaler: &Scaler,
        repr_cfg: &ReprConfig,
        sigma: f64,
    ) -> Vec<f64> {
        match self {
            FilterSource::Synthetic { test_seeds } => {
                eval_bias_aided_filter_iekf(model, scaler, repr_cfg, *test_seeds, sigma)
            }
            FilterSource::Real { sequences } => {
                eval_bias_aided_seqs_iekf(model, scaler, sequences, repr_cfg, sigma)
            }
        }
    }
}

/// Record both the proxy-metric row and the filter-in-loop row for one model.
/// All models share one `bias_sigma` so the UKF trusts every learned bias
/// estimate equally — the filter ranking then reflects prediction quality, not
/// a per-model noise-calibration confound.
#[allow(clippy::too_many_arguments)]
fn record_model<M: ReprModel>(
    model: &M,
    name: &'static str,
    rows: &mut Vec<EvalRow>,
    nav_rows: &mut Vec<FilterRow>,
    train: &[Example],
    test: &[Example],
    scaler: &Scaler,
    repr_cfg: &ReprConfig,
    src: &FilterSource,
    bias_sigma: f64,
) {
    rows.push(EvalRow {
        name,
        params: model.params(),
        train: evaluate(model, train, scaler),
        test: evaluate(model, test, scaler),
    });
    let per_seed = src.bias_aided(model, scaler, repr_cfg, bias_sigma);
    nav_rows.push(make_filter_row(name, model.params(), bias_sigma, per_seed));

    // Also run the IEKF variant for direct comparison and record a separate row.
    let per_seed_iekf = src.bias_aided_iekf(model, scaler, repr_cfg, bias_sigma);
    let name_iekf: &'static str = Box::leak(format!("{} (IEKF)", name).into_boxed_str());
    nav_rows.push(make_filter_row(name_iekf, model.params(), bias_sigma, per_seed_iekf));
}

/// Synthetic-data bakeoff (unchanged behavior): builds train/test examples from
/// distinct seed ranges and runs the filter-in-loop on freshly generated seeds.
pub fn run_bakeoff(
    repr_cfg: &ReprConfig,
    train_cfg: &TrainConfig,
    train_seeds: u64,
    test_seeds: u64,
) -> (usize, usize, Vec<EvalRow>, Vec<FilterRow>) {
    let mut train = make_examples(0, train_seeds, repr_cfg);
    let mut test = make_examples(10_000, test_seeds, repr_cfg);
    let scaler = fit_scaler(&train);
    apply_scaler(&mut train, &scaler);
    apply_scaler(&mut test, &scaler);
    run_bakeoff_inner(
        train,
        test,
        &scaler,
        repr_cfg,
        train_cfg,
        &FilterSource::Synthetic { test_seeds },
    )
}

/// Real-data bakeoff: identical model arms and metrics as `run_bakeoff`, but
/// trained on examples built from real (IMU, pose) sequences and evaluated
/// in-loop on the provided test sequences. Example construction (Arrow ingest +
/// INS-error target) lives in `crate::real_data`.
pub fn run_bakeoff_real(
    repr_cfg: &ReprConfig,
    train_cfg: &TrainConfig,
    mut train: Vec<Example>,
    mut test: Vec<Example>,
    test_sequences: &[Vec<Sample>],
) -> (usize, usize, Vec<EvalRow>, Vec<FilterRow>) {
    let scaler = fit_scaler(&train);
    apply_scaler(&mut train, &scaler);
    apply_scaler(&mut test, &scaler);
    run_bakeoff_inner(
        train,
        test,
        &scaler,
        repr_cfg,
        train_cfg,
        &FilterSource::Real {
            sequences: test_sequences,
        },
    )
}

/// Shared bakeoff body: trains every model arm on `train`, scores proxy metrics
/// on `train`/`test`, and runs the filter-in-loop via `src`.
fn run_bakeoff_inner(
    train: Vec<Example>,
    test: Vec<Example>,
    scaler: &Scaler,
    repr_cfg: &ReprConfig,
    train_cfg: &TrainConfig,
    src: &FilterSource,
) -> (usize, usize, Vec<EvalRow>, Vec<FilterRow>) {
    // Single common measurement-noise sigma for every learned bias estimate,
    // fixed to the physical spread of the accel-bias target (mean of the three
    // axis std-devs). This removes the old per-model `1.5 * train_bias_rmse`
    // heuristic, which let overfit models claim an overconfident sigma.
    let common_sigma = (((scaler.y_std[0] + scaler.y_std[1] + scaler.y_std[2]) / 3.0) as f64)
        .max(train_cfg.bias_sigma_floor);

    let mut rows = vec![EvalRow {
        name: "Train mean",
        params: 0,
        train: mean_baseline(&train, scaler),
        test: mean_baseline(&test, scaler),
    }];

    let mut nav_rows = vec![make_filter_row(
        "Dead reckoning UKF",
        0,
        0.0,
        src.dead_reckoning(repr_cfg),
    )];

    // --- Dense supervised (end-to-end) ---
    let mut dense = DenseModel::new(1);
    train_model(&mut dense, &train, train_cfg);
    record_model(
        &dense,
        "Dense supervised",
        &mut rows,
        &mut nav_rows,
        &train,
        &test,
        scaler,
        repr_cfg,
        src,
        common_sigma,
    );

    // --- Random frozen encoder + trained linear head ---
    // The key SSL baseline: if JEPA-frozen is no better than this, the pretext
    // task learned nothing beyond a random projection.
    let mut dense_rand = DenseModel::new_named(11, "Dense random-frozen probe");
    train_dense_head(&mut dense_rand, &train, train_cfg);
    record_model(
        &dense_rand,
        "Dense random-frozen probe",
        &mut rows,
        &mut nav_rows,
        &train,
        &test,
        scaler,
        repr_cfg,
        src,
        common_sigma,
    );

    // --- Compute-matched control: head-warmup + supervised, NO JEPA ---
    // Matches the downstream budget of "Dense JEPA + finetune" (head_epochs +
    // epochs) starting from random init, isolating the effect of JEPA itself.
    let mut dense_ctrl = DenseModel::new_named(12, "Dense ctrl warmup+ft");
    train_dense_head(&mut dense_ctrl, &train, train_cfg);
    train_model(&mut dense_ctrl, &train, train_cfg);
    record_model(
        &dense_ctrl,
        "Dense ctrl warmup+ft",
        &mut rows,
        &mut nav_rows,
        &train,
        &test,
        scaler,
        repr_cfg,
        src,
        common_sigma,
    );

    // --- Dense JEPA: frozen probe, then finetune ---
    let mut dense_jepa = DenseModel::new_named(4, "Dense JEPA frozen");
    train_dense_jepa(&mut dense_jepa, &train, train_cfg, 40);
    train_dense_head(&mut dense_jepa, &train, train_cfg);
    record_model(
        &dense_jepa,
        "Dense JEPA frozen",
        &mut rows,
        &mut nav_rows,
        &train,
        &test,
        scaler,
        repr_cfg,
        src,
        common_sigma,
    );
    train_model(&mut dense_jepa, &train, train_cfg);
    record_model(
        &dense_jepa,
        "Dense JEPA + finetune",
        &mut rows,
        &mut nav_rows,
        &train,
        &test,
        scaler,
        repr_cfg,
        src,
        common_sigma,
    );

    // --- Sedenion variants ---
    let mut sed = SedenionModel::new(2, false);
    train_model(&mut sed, &train, train_cfg);
    record_model(
        &sed,
        "Sedenion 16D",
        &mut rows,
        &mut nav_rows,
        &train,
        &test,
        scaler,
        repr_cfg,
        src,
        common_sigma,
    );

    let mut sed_zda = SedenionModel::new(3, true);
    train_model(&mut sed_zda, &train, train_cfg);
    record_model(
        &sed_zda,
        "Sedenion + auto-ZDA",
        &mut rows,
        &mut nav_rows,
        &train,
        &test,
        scaler,
        repr_cfg,
        src,
        common_sigma,
    );

    let mut sed_jepa = SedenionModel::new_named(5, true, "Sedenion JEPA frozen");
    train_sedenion_jepa(&mut sed_jepa, &train, train_cfg, 50);
    train_sedenion_head(&mut sed_jepa, &train, train_cfg);
    record_model(
        &sed_jepa,
        "Sedenion JEPA frozen",
        &mut rows,
        &mut nav_rows,
        &train,
        &test,
        scaler,
        repr_cfg,
        src,
        common_sigma,
    );
    train_model(&mut sed_jepa, &train, train_cfg);
    record_model(
        &sed_jepa,
        "Sedenion JEPA + finetune",
        &mut rows,
        &mut nav_rows,
        &train,
        &test,
        scaler,
        repr_cfg,
        src,
        common_sigma,
    );

    (train.len(), test.len(), rows, nav_rows)
}
