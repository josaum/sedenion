//! Real-data path: MNIST handwritten digits → the same `Dataset`/`Sample` type
//! the synthetic path uses, so the model, training, and metrics are unchanged.
//!
//! Pipeline per sample: take the 28×28 image, make **two augmented views**
//! (random ±2 px shift + pixel noise), pass each through a *fixed random*
//! backbone (784→64, ReLU) shared by both arms, and standardize the 64 features
//! on the training set. The learnable 64→16 projector (real vs. sedenion) and the
//! linear probe then operate exactly as in the synthetic experiment.
//!
//! The backbone is frozen random features (not a trained deep net) — a standard,
//! pure-CPU baseline that keeps the comparison controlled while using real image
//! statistics and real augmentations.

use crate::data::{Dataset, Sample, INPUT};
use rand::rngs::StdRng;
use rand::{Rng, SeedableRng};
use std::fs;

const PIX: usize = 28 * 28;

fn be_u32(b: &[u8]) -> usize {
    ((b[0] as usize) << 24) | ((b[1] as usize) << 16) | ((b[2] as usize) << 8) | b[3] as usize
}

fn load_images(path: &str) -> (Vec<u8>, usize) {
    let data = fs::read(path).unwrap_or_else(|_| panic!("missing {path}; run repr-bakeoff/fetch_mnist.sh"));
    let n = be_u32(&data[4..8]);
    (data[16..16 + n * PIX].to_vec(), n)
}

fn load_labels(path: &str) -> Vec<u8> {
    let data = fs::read(path).unwrap_or_else(|_| panic!("missing {path}"));
    let n = be_u32(&data[4..8]);
    data[8..8 + n].to_vec()
}

pub struct Raw {
    train_img: Vec<u8>,
    train_lab: Vec<u8>,
    test_img: Vec<u8>,
    test_lab: Vec<u8>,
}

pub fn load_raw(dir: &str) -> Raw {
    let (train_img, _) = load_images(&format!("{dir}/train-images-idx3-ubyte"));
    let train_lab = load_labels(&format!("{dir}/train-labels-idx1-ubyte"));
    let (test_img, _) = load_images(&format!("{dir}/t10k-images-idx3-ubyte"));
    let test_lab = load_labels(&format!("{dir}/t10k-labels-idx1-ubyte"));
    Raw { train_img, train_lab, test_img, test_lab }
}

fn gaussian(rng: &mut StdRng) -> f32 {
    let u1: f32 = rng.gen::<f32>().max(1e-9);
    let u2: f32 = rng.gen::<f32>();
    (-2.0 * u1.ln()).sqrt() * (2.0 * std::f32::consts::PI * u2).cos()
}

/// One augmented view: integer shift in [-2,2]^2 + Gaussian pixel noise, scaled to ~[0,1].
fn augment(img: &[u8], rng: &mut StdRng) -> [f32; PIX] {
    let dx = rng.gen_range(-2i32..=2);
    let dy = rng.gen_range(-2i32..=2);
    let mut out = [0.0f32; PIX];
    for r in 0..28i32 {
        for c in 0..28i32 {
            let (sr, sc) = (r - dy, c - dx);
            let mut v = 0.0f32;
            if (0..28).contains(&sr) && (0..28).contains(&sc) {
                v = img[(sr * 28 + sc) as usize] as f32 / 255.0;
            }
            out[(r * 28 + c) as usize] = v + 0.05 * gaussian(rng);
        }
    }
    out
}

/// Frozen random backbone 784→INPUT with ReLU. Seeded so both arms share it.
fn backbone(seed: u64) -> Vec<f32> {
    let mut rng = StdRng::seed_from_u64(seed ^ 0xBADC0FFEE);
    (0..INPUT * PIX).map(|_| gaussian(&mut rng) / (PIX as f32).sqrt()).collect()
}

fn apply_backbone(w: &[f32], px: &[f32; PIX]) -> [f32; INPUT] {
    let mut f = [0.0f32; INPUT];
    for o in 0..INPUT {
        let mut s = 0.0;
        for i in 0..PIX {
            s += w[o * PIX + i] * px[i];
        }
        f[o] = s.max(0.0); // ReLU
    }
    f
}

/// Build a `Dataset` from MNIST. `seed` fixes the subset, augmentations, and
/// backbone, so both estimator arms see identical data within a seed.
pub fn build(raw: &Raw, seed: u64, n_train: usize, n_test: usize) -> Dataset {
    let mut rng = StdRng::seed_from_u64(seed);
    let w = backbone(seed);

    let n_classes = 10;
    let n_tr_avail = raw.train_lab.len();
    let n_te_avail = raw.test_lab.len();

    let build_split = |img: &[u8], lab: &[u8], avail: usize, count: usize, rng: &mut StdRng| {
        let mut feats_a = Vec::with_capacity(count);
        let mut feats_b = Vec::with_capacity(count);
        let mut labels = Vec::with_capacity(count);
        for _ in 0..count {
            let idx = rng.gen_range(0..avail);
            let im = &img[idx * PIX..(idx + 1) * PIX];
            feats_a.push(apply_backbone(&w, &augment(im, rng)));
            feats_b.push(apply_backbone(&w, &augment(im, rng)));
            labels.push(lab[idx] as usize);
        }
        (feats_a, feats_b, labels)
    };

    let (mut tr_a, mut tr_b, tr_lab) =
        build_split(&raw.train_img, &raw.train_lab, n_tr_avail, n_train, &mut rng);
    let (mut te_a, mut te_b, te_lab) =
        build_split(&raw.test_img, &raw.test_lab, n_te_avail, n_test, &mut rng);

    // Standardize each backbone feature using train-set statistics (a & b views).
    let mut mean = [0.0f32; INPUT];
    let mut var = [0.0f32; INPUT];
    let cnt = (tr_a.len() * 2) as f32;
    for v in tr_a.iter().chain(tr_b.iter()) {
        for d in 0..INPUT {
            mean[d] += v[d] / cnt;
        }
    }
    for v in tr_a.iter().chain(tr_b.iter()) {
        for d in 0..INPUT {
            var[d] += (v[d] - mean[d]).powi(2) / cnt;
        }
    }
    let std: Vec<f32> = (0..INPUT).map(|d| (var[d] + 1e-6).sqrt()).collect();
    let norm = |v: &mut [f32; INPUT]| {
        for d in 0..INPUT {
            v[d] = (v[d] - mean[d]) / std[d];
        }
    };
    for v in tr_a.iter_mut().chain(tr_b.iter_mut()) {
        norm(v);
    }
    for v in te_a.iter_mut().chain(te_b.iter_mut()) {
        norm(v);
    }

    let mk = |a: Vec<[f32; INPUT]>, b: Vec<[f32; INPUT]>, l: Vec<usize>| -> Vec<Sample> {
        a.into_iter()
            .zip(b)
            .zip(l)
            .map(|((view_a, view_b), label)| Sample { view_a, view_b, label })
            .collect()
    };
    Dataset { train: mk(tr_a, tr_b, tr_lab), test: mk(te_a, te_b, te_lab), n_classes }
}
