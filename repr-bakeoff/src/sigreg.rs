//! SIGReg — Sketched Isotropic Gaussian Regularization, implemented to match the
//! LeJEPA reference (`galilai-group/lejepa`, `epps_pulley.py` + `slicing.py`):
//!
//! ```python
//! t = linspace(0, 3, 17)
//! phi = exp(-t^2/2)
//! weights = trapezoid(dt or 2*dt) * phi
//! proj = z @ dirs   # raw projections, no standardization
//! ecf_re = cos(t*proj).mean(); ecf_im = sin(t*proj).mean()
//! loss = sum(weights * ((ecf_re - phi)^2 + ecf_im^2))
//! ```
//!
//! We implement the same forward and the exact gradient, finite-difference
//! checked in `tests/sanity.rs`.

use crate::data::EMB;
use rand::rngs::StdRng;
use rand::{Rng, SeedableRng};

const T_MAX: f32 = 3.0;
const NF_T: usize = 17; // CF frequencies, linspace(0, T_MAX, 17)

fn freqs() -> [f32; NF_T] {
    let mut t = [0.0f32; NF_T];
    for (i, ti) in t.iter_mut().enumerate() {
        *ti = T_MAX * (i as f32) / (NF_T as f32 - 1.0);
    }
    t
}

fn trapezoid_weights() -> [f32; NF_T] {
    let dt = T_MAX / (NF_T as f32 - 1.0);
    let mut w = [0.0f32; NF_T];
    for (i, wi) in w.iter_mut().enumerate() {
        *wi = if i == 0 || i == NF_T - 1 {
            dt
        } else {
            2.0 * dt
        };
    }
    w
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

/// One-slice Epps–Pulley forward + gradient w.r.t. the raw projections `p`.
/// Returns (loss, dloss/dp). Matches the reference forward exactly.
fn ep_slice(p: &[f32]) -> (f32, Vec<f32>) {
    let m = p.len();
    let mf = m as f32;
    let t = freqs();
    let trap = trapezoid_weights();
    let mut loss = 0.0f32;
    let mut gp = vec![0.0f32; m];
    for (i, &ti) in t.iter().enumerate() {
        let phi = (-0.5 * ti * ti).exp();
        let wi = trap[i] * phi;
        let mut cr = 0.0f32;
        let mut ci = 0.0f32;
        for &pj in p {
            cr += (ti * pj).cos();
            ci += (ti * pj).sin();
        }
        cr /= mf;
        ci /= mf;
        loss += wi * ((cr - phi) * (cr - phi) + ci * ci);
        let a = 2.0 * wi * (cr - phi);
        let b = 2.0 * wi * ci;
        for (j, &pj) in p.iter().enumerate() {
            gp[j] += a * (-(ti / mf) * (ti * pj).sin()) + b * ((ti / mf) * (ti * pj).cos());
        }
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
/// (0 ⇒ each raw projection matches the standard normal N(0,1)).
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
