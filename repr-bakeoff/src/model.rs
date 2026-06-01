//! The two encoder arms and the self-supervised loss.
//!
//! Both arms map an `INPUT`-D input to a 16-D embedding with a single learnable
//! layer, so any difference is attributable to the layer's *structure*:
//!
//! * `Real`     — a dense 16×INPUT matrix.
//! * `Sedenion` — `NF = INPUT/16` sedenion weights `W[i]`, embedding
//!   `z = Σ_i W[i]·x[i] + b` (NF×16 weights, **16× fewer** than the dense matrix).
//!   Forward uses the Cayley–Dickson product;
//!   the exact backward uses the right-multiplication operator, since `W·x` is
//!   linear in `W` with Jacobian `R_x`, so `∂L/∂W[i] = R_{x[i]}ᵀ g`.
//!
//! Loss = VICReg (invariance + variance + covariance) on the two views, with an
//! optional Zero-Divisor-Aware term (`λ_zda`) on the sedenion arm. The covariance
//! term is the principled anti-collapse / isotropy driver; ZDA-Reg is the term
//! under test.

use crate::data::{EMB, INPUT, NF};
use sedenion::Sedenion;

fn split_feats(x: &[f32; INPUT]) -> [Sedenion; NF] {
    let mut out = [Sedenion::new([0.0; 16]); NF];
    for i in 0..NF {
        let mut c = [0.0f32; 16];
        c.copy_from_slice(&x[i * 16..(i + 1) * 16]);
        out[i] = Sedenion::new(c);
    }
    out
}

fn matt_vec(m: &[[f32; 16]; 16], v: &[f32; 16]) -> [f32; 16] {
    // returns mᵀ v
    let mut o = [0.0f32; 16];
    for i in 0..16 {
        for j in 0..16 {
            o[i] += m[j][i] * v[j];
        }
    }
    o
}

pub enum Encoder {
    Real { w: Vec<f32>, b: [f32; EMB], gw: Vec<f32>, gb: [f32; EMB] },
    Sed { w: [[f32; 16]; NF], b: [f32; 16], gw: [[f32; 16]; NF], gb: [f32; 16] },
}

impl Encoder {
    pub fn new_real(seed: u64) -> Self {
        let mut s = seed.wrapping_mul(0x9E3779B97F4A7C15).wrapping_add(1);
        let mut rnd = || {
            s = s.wrapping_mul(6364136223846793005).wrapping_add(1442695040888963407);
            ((s >> 33) as f32 / (1u64 << 31) as f32 - 1.0) * 0.1
        };
        let w: Vec<f32> = (0..EMB * INPUT).map(|_| rnd()).collect();
        Encoder::Real { w, b: [0.0; EMB], gw: vec![0.0; EMB * INPUT], gb: [0.0; EMB] }
    }
    pub fn new_sed(seed: u64) -> Self {
        let mut s = seed.wrapping_mul(0x9E3779B97F4A7C15).wrapping_add(7);
        let mut rnd = || {
            s = s.wrapping_mul(6364136223846793005).wrapping_add(1442695040888963407);
            ((s >> 33) as f32 / (1u64 << 31) as f32 - 1.0) * 0.2
        };
        let mut w = [[0.0f32; 16]; NF];
        for wi in w.iter_mut() {
            for v in wi.iter_mut() {
                *v = rnd();
            }
        }
        Encoder::Sed { w, b: [0.0; 16], gw: [[0.0; 16]; NF], gb: [0.0; 16] }
    }

    pub fn n_params(&self) -> usize {
        match self {
            Encoder::Real { w, b, .. } => w.len() + b.len(),
            Encoder::Sed { w, b, .. } => w.len() * 16 + b.len(),
        }
    }

    pub fn forward(&self, x: &[f32; INPUT]) -> [f32; EMB] {
        match self {
            Encoder::Real { w, b, .. } => {
                let mut y = *b;
                for o in 0..EMB {
                    for i in 0..INPUT {
                        y[o] += w[o * INPUT + i] * x[i];
                    }
                }
                y
            }
            Encoder::Sed { w, b, .. } => {
                let xs = split_feats(x);
                let mut acc = Sedenion::new(*b);
                for i in 0..NF {
                    acc = acc + Sedenion::new(w[i]) * xs[i];
                }
                *acc.components()
            }
        }
    }

    pub fn zero_grad(&mut self) {
        match self {
            Encoder::Real { gw, gb, .. } => {
                gw.iter_mut().for_each(|v| *v = 0.0);
                *gb = [0.0; EMB];
            }
            Encoder::Sed { gw, gb, .. } => {
                *gw = [[0.0; 16]; NF];
                *gb = [0.0; 16];
            }
        }
    }

    /// Accumulate gradients for one sample given the upstream grad `g = ∂L/∂z`.
    pub fn backward(&mut self, x: &[f32; INPUT], g: &[f32; EMB]) {
        match self {
            Encoder::Real { gw, gb, .. } => {
                for o in 0..EMB {
                    gb[o] += g[o];
                    for i in 0..INPUT {
                        gw[o * INPUT + i] += g[o] * x[i];
                    }
                }
            }
            Encoder::Sed { gw, gb, .. } => {
                let xs = split_feats(x);
                for o in 0..16 {
                    gb[o] += g[o];
                }
                // ∂L/∂W[i] = R_{x[i]}ᵀ g
                for i in 0..NF {
                    let r = xs[i].right_mul_matrix();
                    let gi = matt_vec(&r, g);
                    for o in 0..16 {
                        gw[i][o] += gi[o];
                    }
                }
            }
        }
    }

    pub fn step(&mut self, lr: f32, scale: f32) {
        match self {
            Encoder::Real { w, b, gw, gb } => {
                for k in 0..w.len() {
                    w[k] -= lr * gw[k] * scale;
                }
                for o in 0..EMB {
                    b[o] -= lr * gb[o] * scale;
                }
            }
            Encoder::Sed { w, b, gw, gb } => {
                for i in 0..NF {
                    for o in 0..16 {
                        w[i][o] -= lr * gw[i][o] * scale;
                    }
                }
                for o in 0..16 {
                    b[o] -= lr * gb[o] * scale;
                }
            }
        }
    }
}

pub struct LossWeights {
    pub inv: f32,
    pub var: f32,
    pub cov: f32,
    pub zda: f32,
    /// SIGReg weight (handled in the training loop, not in `loss_and_grad`).
    pub sig: f32,
}

pub struct LossOut {
    pub total: f32,
    pub inv: f32,
    pub var: f32,
    pub cov: f32,
    pub zda: f32,
}

/// VICReg(+ZDA) loss and its gradient w.r.t. each embedding row.
/// `z` rows are paired: row `2n`,`2n+1` are the two views of sample `n`.
pub fn loss_and_grad(z: &[[f32; EMB]], w: &LossWeights) -> (LossOut, Vec<[f32; EMB]>) {
    let n = z.len();
    let nf = n as f32;
    let mut g = vec![[0.0f32; EMB]; n];

    // --- invariance over view pairs ---
    let n_pairs = (n / 2) as f32;
    let mut l_inv = 0.0;
    for p in 0..n / 2 {
        let (a, b) = (2 * p, 2 * p + 1);
        for d in 0..EMB {
            let diff = z[a][d] - z[b][d];
            l_inv += diff * diff;
            let gd = w.inv * 2.0 * diff / n_pairs;
            g[a][d] += gd;
            g[b][d] -= gd;
        }
    }
    l_inv /= n_pairs;

    // --- mean / centered ---
    let mut mean = [0.0f32; EMB];
    for row in z {
        for d in 0..EMB {
            mean[d] += row[d] / nf;
        }
    }
    let zc: Vec<[f32; EMB]> = z
        .iter()
        .map(|row| {
            let mut r = [0.0f32; EMB];
            for d in 0..EMB {
                r[d] = row[d] - mean[d];
            }
            r
        })
        .collect();

    // --- variance (hinge to keep per-dim std >= gamma=1) ---
    let gamma = 1.0f32;
    let mut std = [0.0f32; EMB];
    for d in 0..EMB {
        let mut v = 0.0;
        for row in &zc {
            v += row[d] * row[d];
        }
        std[d] = (v / (nf - 1.0) + 1e-6).sqrt();
    }
    let mut l_var = 0.0;
    for d in 0..EMB {
        let hinge = (gamma - std[d]).max(0.0);
        l_var += hinge / EMB as f32;
        if hinge > 0.0 {
            // d hinge / d zc[n][d] = -(zc/( (n-1) std )); times weight/EMB
            for (ni, row) in zc.iter().enumerate() {
                g[ni][d] -= w.var * row[d] / ((nf - 1.0) * std[d]) / EMB as f32;
            }
        }
    }

    // --- covariance (decorrelate dims; isotropy driver) ---
    let mut c = [[0.0f32; EMB]; EMB];
    for row in &zc {
        for i in 0..EMB {
            for j in 0..EMB {
                c[i][j] += row[i] * row[j] / (nf - 1.0);
            }
        }
    }
    let mut l_cov = 0.0;
    for i in 0..EMB {
        for j in 0..EMB {
            if i != j {
                l_cov += c[i][j] * c[i][j] / EMB as f32;
            }
        }
    }
    // gZ_cov[n] = (4 / (EMB (n-1))) * Coff @ zc[n]
    let coeff = 4.0 / (EMB as f32 * (nf - 1.0));
    for (ni, row) in zc.iter().enumerate() {
        for k in 0..EMB {
            let mut s = 0.0;
            for j in 0..EMB {
                if j != k {
                    s += c[k][j] * row[j];
                }
            }
            g[ni][k] += w.cov * coeff * s;
        }
    }

    // --- ZDA-Reg (sedenion arm only; w.zda may be 0) ---
    let mut l_zda = 0.0;
    if w.zda != 0.0 {
        for (ni, row) in z.iter().enumerate() {
            let (mut na, mut nb, mut dot) = (0.0f32, 0.0f32, 0.0f32);
            for k in 0..8 {
                na += row[k] * row[k];
                nb += row[8 + k] * row[8 + k];
                dot += row[k] * row[8 + k];
            }
            l_zda += ((na - nb) * (na - nb) + dot * dot) / nf;
            for k in 0..8 {
                // dl/dA_k = 4(na-nb)A_k + 2 dot B_k ; dl/dB_k = -4(na-nb)B_k + 2 dot A_k
                g[ni][k] += w.zda * (4.0 * (na - nb) * row[k] + 2.0 * dot * row[8 + k]) / nf;
                g[ni][8 + k] +=
                    w.zda * (-4.0 * (na - nb) * row[8 + k] + 2.0 * dot * row[k]) / nf;
            }
        }
    }

    let total = w.inv * l_inv + w.var * l_var + w.cov * l_cov + w.zda * l_zda;
    (LossOut { total, inv: l_inv, var: l_var, cov: l_cov, zda: l_zda }, g)
}
