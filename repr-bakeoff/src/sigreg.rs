//! SIGReg — Sketched Isotropic Gaussian Regularization, implemented to match the
//! LeJEPA reference (`galilai-group/lejepa`, `lejepa.py::sigreg_epps_pulley`):
//!
//! ```python
//! dirs = randn(D, P); dirs /= dirs.norm(dim=0)
//! proj = z @ dirs
//! proj = (proj - proj.mean(0)) / (proj.std(0) + 1e-6)         # per-slice standardize
//! t = linspace(-5, 5, 17)
//! ecf_re = cos(t*proj).mean(1); ecf_im = sin(t*proj).mean(1)
//! target = w = exp(-t^2/2)
//! loss = (w*((ecf_re-target)^2 + ecf_im^2)).mean()            # Epps–Pulley CF distance
//! ```
//!
//! i.e. for random unit directions, project, **standardize each slice**, and push
//! the empirical characteristic function of each slice toward the standard-normal
//! CF. Standardization makes the test scale/shift-invariant (it checks Gaussian
//! *shape*); collapse is still penalized because a degenerate slice standardizes
//! to all-zeros, whose CF (≡1) is far from `e^{-t²/2}`.
//!
//! We implement the same forward and the exact gradient (including the
//! batch-norm-style backward through the standardization), finite-difference
//! checked in `tests/sanity.rs`.

use crate::data::EMB;
use rand::rngs::StdRng;
use rand::{Rng, SeedableRng};

const NF_T: usize = 17; // CF frequencies, linspace(-5,5,17)

fn freqs() -> [f32; NF_T] {
    let mut t = [0.0f32; NF_T];
    for (i, ti) in t.iter_mut().enumerate() {
        *ti = -5.0 + 10.0 * (i as f32) / (NF_T as f32 - 1.0);
    }
    t
}

fn gaussian(rng: &mut StdRng) -> f32 {
    let u1: f32 = rng.gen::<f32>().max(1e-9);
    let u2: f32 = rng.gen::<f32>();
    (-2.0 * u1.ln()).sqrt() * (2.0 * std::f32::consts::PI * u2).cos()
}

/// `m` random unit directions on the sphere in R^EMB.
pub fn sample_dirs(seed: u64, m: usize) -> Vec<[f32; EMB]> {
    let mut rng = StdRng::seed_from_u64(seed);
    (0..m)
        .map(|_| {
            let mut v = [0.0f32; EMB];
            let mut nrm = 0.0;
            for d in 0..EMB {
                v[d] = gaussian(&mut rng);
                nrm += v[d] * v[d];
            }
            let nrm = nrm.sqrt().max(1e-9);
            for d in 0..EMB {
                v[d] /= nrm;
            }
            v
        })
        .collect()
}

fn dot(v: &[f32; EMB], z: &[f32; EMB]) -> f32 {
    (0..EMB).map(|d| v[d] * z[d]).sum()
}

/// One-slice Epps–Pulley forward + gradient w.r.t. the *raw* projections `p`.
/// Returns (loss, dloss/dp). Matches the reference forward exactly.
fn ep_slice(p: &[f32]) -> (f32, Vec<f32>) {
    let m = p.len();
    let mf = m as f32;
    // standardize (unbiased std, additive eps) — as in the reference.
    let mean: f32 = p.iter().sum::<f32>() / mf;
    let var: f32 = p.iter().map(|x| (x - mean) * (x - mean)).sum::<f32>() / (mf - 1.0);
    let s = var.sqrt();
    let denom = s + 1e-6;
    let y: Vec<f32> = p.iter().map(|x| (x - mean) / denom).collect();

    let t = freqs();
    let mut loss = 0.0f32;
    let mut gy = vec![0.0f32; m]; // dL/dy
    for &ti in t.iter() {
        let w = (-0.5 * ti * ti).exp();
        let target = w; // exp(-t^2/2)
        let mut cr = 0.0f32;
        let mut ci = 0.0f32;
        for &yj in &y {
            cr += (ti * yj).cos();
            ci += (ti * yj).sin();
        }
        cr /= mf;
        ci /= mf;
        loss += w * ((cr - target) * (cr - target) + ci * ci);
        // dL/dy_j for this freq
        let a = 2.0 * w * (cr - target);
        let b = 2.0 * w * ci;
        for (j, &yj) in y.iter().enumerate() {
            // d cr/dy_j = -(ti/m) sin(ti yj); d ci/dy_j = (ti/m) cos(ti yj)
            gy[j] += a * (-(ti / mf) * (ti * yj).sin()) + b * ((ti / mf) * (ti * yj).cos());
        }
    }
    loss /= NF_T as f32;
    for g in gy.iter_mut() {
        *g /= NF_T as f32;
    }

    // Backward through standardization y = (p - mean)/denom, denom = std + eps.
    // dL/dp_n = (1/denom)[gy_n - mean_g] - (y_n/((m-1) s)) * dot(gy, y) * (s/denom)
    // Derived from d denom/dp_n = (p_n-mean)/((m-1) s) = y_n*denom/((m-1)s).
    let mean_g: f32 = gy.iter().sum::<f32>() / mf;
    let dot_gy_y: f32 = gy.iter().zip(&y).map(|(g, yy)| g * yy).sum();
    let s_eff = s.max(1e-12);
    let mut gp = vec![0.0f32; m];
    for n in 0..m {
        gp[n] = (gy[n] - mean_g) / denom - (y[n] / ((mf - 1.0) * s_eff)) * dot_gy_y * (s / denom);
    }
    (loss, gp)
}

/// SIGReg loss over `rows` of `z` and its gradient (accumulated into a full-size
/// grad vector aligned with `z`). Averaged over the projection directions.
pub fn sigreg(z: &[[f32; EMB]], rows: &[usize], dirs: &[[f32; EMB]]) -> (f32, Vec<[f32; EMB]>) {
    let mut grad = vec![[0.0f32; EMB]; z.len()];
    let mut total = 0.0f32;
    let m = dirs.len().max(1) as f32;
    for v in dirs {
        let p: Vec<f32> = rows.iter().map(|&r| dot(v, &z[r])).collect();
        let (l, gp) = ep_slice(&p);
        total += l;
        for (ai, &r) in rows.iter().enumerate() {
            for d in 0..EMB {
                grad[r][d] += gp[ai] * v[d];
            }
        }
    }
    total /= m;
    for g in grad.iter_mut() {
        for d in 0..EMB {
            g[d] /= m;
        }
    }
    (total, grad)
}

/// Held-out Gaussianity: mean Epps–Pulley statistic over fresh random projections
/// (0 ⇒ each standardized projection is shape-indistinguishable from a Gaussian).
pub fn gaussianity(emb: &[[f32; EMB]], seed: u64, m: usize) -> f64 {
    let dirs = sample_dirs(seed, m);
    let rows: Vec<usize> = (0..emb.len()).collect();
    let mut s = 0.0f64;
    for v in &dirs {
        let p: Vec<f32> = rows.iter().map(|&r| dot(v, &emb[r])).collect();
        s += ep_slice(&p).0 as f64;
    }
    s / m as f64
}
