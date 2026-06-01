//! Evaluation: downstream linear-probe accuracy + collapse / isotropy metrics.

use crate::data::EMB;
use crate::linalg::{solve, sym_eigenvalues};

/// Ridge linear probe: fit a linear classifier on `(train_emb, train_lab)` and
/// return test accuracy. One-hot regression, argmax decode.
pub fn linear_probe(
    train_emb: &[[f32; EMB]],
    train_lab: &[usize],
    test_emb: &[[f32; EMB]],
    test_lab: &[usize],
    n_classes: usize,
) -> f64 {
    let d = EMB + 1; // + bias
    let mut xtx = vec![0.0f64; d * d];
    let mut xty = vec![0.0f64; d * n_classes];
    for (e, &lab) in train_emb.iter().zip(train_lab) {
        let mut x = [0.0f64; EMB + 1];
        for k in 0..EMB {
            x[k] = e[k] as f64;
        }
        x[EMB] = 1.0;
        for i in 0..d {
            for j in 0..d {
                xtx[i * d + j] += x[i] * x[j];
            }
            xty[i * n_classes + lab] += x[i];
        }
    }
    let ridge = 1e-2;
    for i in 0..d {
        xtx[i * d + i] += ridge;
    }
    let wt = solve(&xtx, d, &xty, n_classes); // d × n_classes

    let mut correct = 0usize;
    for (e, &lab) in test_emb.iter().zip(test_lab) {
        let mut best = f64::NEG_INFINITY;
        let mut arg = 0usize;
        for cidx in 0..n_classes {
            let mut s = wt[EMB * n_classes + cidx]; // bias row
            for k in 0..EMB {
                s += e[k] as f64 * wt[k * n_classes + cidx];
            }
            if s > best {
                best = s;
                arg = cidx;
            }
        }
        if arg == lab {
            correct += 1;
        }
    }
    correct as f64 / test_lab.len().max(1) as f64
}

/// Centered covariance (EMB×EMB, f64, row-major) of a set of embeddings.
fn covariance(emb: &[[f32; EMB]]) -> Vec<f64> {
    let n = emb.len().max(2) as f64;
    let mut mean = [0.0f64; EMB];
    for e in emb {
        for d in 0..EMB {
            mean[d] += e[d] as f64 / n;
        }
    }
    let mut c = vec![0.0f64; EMB * EMB];
    for e in emb {
        for i in 0..EMB {
            for j in 0..EMB {
                c[i * EMB + j] += (e[i] as f64 - mean[i]) * (e[j] as f64 - mean[j]) / (n - 1.0);
            }
        }
    }
    c
}

pub struct Collapse {
    /// Effective rank exp(-Σ pᵢ ln pᵢ) of the embedding covariance (max = 16).
    pub effective_rank: f64,
    /// ‖C/tr(C) − I/16‖_F : distance from isotropic covariance (0 = isotropic).
    pub isotropy_dist: f64,
    /// Smallest per-dimension standard deviation (→ 0 signals a collapsed axis).
    pub min_std: f64,
}

pub fn collapse_metrics(emb: &[[f32; EMB]]) -> Collapse {
    let c = covariance(emb);
    let eig = sym_eigenvalues(&c, EMB);
    let trace: f64 = eig.iter().sum();
    let erank = if trace > 1e-30 {
        let mut h = 0.0;
        for &l in &eig {
            let p = l.max(0.0) / trace;
            if p > 1e-12 {
                h -= p * p.ln();
            }
        }
        h.exp()
    } else {
        0.0
    };
    let mut iso = 0.0;
    for i in 0..EMB {
        for j in 0..EMB {
            let target = if i == j { 1.0 / EMB as f64 } else { 0.0 };
            let val = if trace > 1e-30 {
                c[i * EMB + j] / trace
            } else {
                0.0
            };
            iso += (val - target) * (val - target);
        }
    }
    let iso = iso.sqrt();
    let mut min_std = f64::INFINITY;
    for d in 0..EMB {
        min_std = min_std.min(c[d * EMB + d].max(0.0).sqrt());
    }
    Collapse {
        effective_rank: erank,
        isotropy_dist: iso,
        min_std,
    }
}
