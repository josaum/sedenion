//! Guardrails: the analytic gradients must match finite differences, or no
//! result from this crate can be trusted.

use repr_bakeoff::data::EMB;
use repr_bakeoff::model::{loss_and_grad, LossWeights};
use sedenion::Sedenion;

fn lcg(seed: &mut u64) -> f32 {
    *seed = seed.wrapping_mul(6364136223846793005).wrapping_add(1442695040888963407);
    (*seed >> 33) as f32 / (1u64 << 31) as f32 - 1.0
}

/// The VICReg(+ZDA) loss gradient must match central finite differences.
#[test]
fn loss_gradient_matches_finite_difference() {
    let mut s = 12345u64;
    let n = 6; // 3 view-pairs
    let mut z: Vec<[f32; EMB]> = (0..n)
        .map(|_| {
            let mut r = [0.0f32; EMB];
            for v in r.iter_mut() {
                *v = lcg(&mut s);
            }
            r
        })
        .collect();
    let w = LossWeights { inv: 2.0, var: 3.0, cov: 1.5, zda: 0.7 };
    let (_, g) = loss_and_grad(&z, &w);

    let eps = 1e-3f32;
    let mut max_err = 0.0f32;
    for ni in 0..n {
        for d in 0..EMB {
            let orig = z[ni][d];
            z[ni][d] = orig + eps;
            let lp = loss_and_grad(&z, &w).0.total;
            z[ni][d] = orig - eps;
            let lm = loss_and_grad(&z, &w).0.total;
            z[ni][d] = orig;
            let num = (lp - lm) / (2.0 * eps);
            max_err = max_err.max((num - g[ni][d]).abs());
        }
    }
    assert!(max_err < 2e-2, "loss gradient mismatch: max_err = {max_err}");
}

/// The sedenion layer's backward identity `∂(W·x)/∂W = R_x` (used by the encoder)
/// must hold: for loss `L = Σ c_k y_k` with `y = W·x`, `∂L/∂W = R_xᵀ c`.
#[test]
fn sedenion_layer_backward_matches_finite_difference() {
    let mut s = 999u64;
    let rand_sed = |s: &mut u64| {
        let mut c = [0.0f32; 16];
        for v in c.iter_mut() {
            *v = lcg(s);
        }
        Sedenion::new(c)
    };
    let w = rand_sed(&mut s);
    let x = rand_sed(&mut s);
    let cvec = rand_sed(&mut s); // upstream grad on y

    // analytic: ∂L/∂W = R_xᵀ c
    let r = x.right_mul_matrix();
    let mut analytic = [0.0f32; 16];
    for i in 0..16 {
        for j in 0..16 {
            analytic[i] += r[j][i] * cvec.components()[j];
        }
    }

    let eps = 1e-3f32;
    let loss = |wc: &[f32; 16]| -> f32 {
        let y = Sedenion::new(*wc) * x;
        (0..16).map(|k| cvec.components()[k] * y.components()[k]).sum()
    };
    let mut max_err = 0.0f32;
    for m in 0..16 {
        let mut wp = *w.components();
        wp[m] += eps;
        let lp = loss(&wp);
        wp[m] -= 2.0 * eps;
        let lm = loss(&wp);
        let num = (lp - lm) / (2.0 * eps);
        max_err = max_err.max((num - analytic[m]).abs());
    }
    assert!(max_err < 1e-2, "sedenion backward mismatch: max_err = {max_err}");
}
