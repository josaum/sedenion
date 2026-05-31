//! Synthetic two-view classification data for a self-supervised bake-off.
//!
//! Each class has a random prototype in a 16-D latent space. A sample draws a
//! latent near its prototype, maps it through a *fixed* random nonlinear feature
//! map into a 64-D input, and produces **two views** by adding small input-space
//! noise. Self-supervised training only sees the view pairs (no labels); labels
//! are held out for the downstream linear probe.
//!
//! Recoverability is by construction: class information survives in the input,
//! so a representation that stays invariant to view-noise *and* avoids collapse
//! should make the classes linearly separable. A collapsed representation will
//! not.

use rand::rngs::StdRng;
use rand::{Rng, SeedableRng};

pub const LATENT: usize = 16;
pub const INPUT: usize = 64; // = 4 sedenions
pub const EMB: usize = 16; // embedding dimension (one sedenion)

pub struct Sample {
    pub view_a: [f32; INPUT],
    pub view_b: [f32; INPUT],
    pub label: usize,
}

fn gaussian(rng: &mut StdRng) -> f32 {
    let u1: f32 = rng.gen::<f32>().max(1e-9);
    let u2: f32 = rng.gen::<f32>();
    (-2.0 * u1.ln()).sqrt() * (2.0 * std::f32::consts::PI * u2).cos()
}

pub struct Dataset {
    pub train: Vec<Sample>,
    pub test: Vec<Sample>,
    pub n_classes: usize,
}

/// Build a dataset. `seed` fixes the prototypes, feature map, and samples so the
/// two estimator arms see identical data.
pub fn generate(seed: u64, n_classes: usize, n_train: usize, n_test: usize) -> Dataset {
    let mut rng = StdRng::seed_from_u64(seed);

    // Class prototypes in latent space.
    let mut proto = vec![[0.0f32; LATENT]; n_classes];
    for p in proto.iter_mut() {
        for v in p.iter_mut() {
            *v = 1.5 * gaussian(&mut rng);
        }
    }
    // Fixed random feature map M: LATENT -> INPUT (row-major INPUT×LATENT).
    let mut m = vec![0.0f32; INPUT * LATENT];
    for v in m.iter_mut() {
        *v = gaussian(&mut rng) / (LATENT as f32).sqrt();
    }

    let sigma_lat = 0.85; // within-class latent spread (harder = more class overlap)
    let sigma_view = 0.30; // view augmentation noise (input space)

    let make = |rng: &mut StdRng| -> Sample {
        let label = rng.gen_range(0..n_classes);
        let mut latent = [0.0f32; LATENT];
        for d in 0..LATENT {
            latent[d] = proto[label][d] + sigma_lat * gaussian(rng);
        }
        // clean input = tanh(M latent)
        let mut clean = [0.0f32; INPUT];
        for i in 0..INPUT {
            let mut s = 0.0;
            for d in 0..LATENT {
                s += m[i * LATENT + d] * latent[d];
            }
            clean[i] = s.tanh();
        }
        let mut view_a = [0.0f32; INPUT];
        let mut view_b = [0.0f32; INPUT];
        for i in 0..INPUT {
            view_a[i] = clean[i] + sigma_view * gaussian(rng);
            view_b[i] = clean[i] + sigma_view * gaussian(rng);
        }
        Sample { view_a, view_b, label }
    };

    let train = (0..n_train).map(|_| make(&mut rng)).collect();
    let test = (0..n_test).map(|_| make(&mut rng)).collect();
    Dataset { train, test, n_classes }
}
