//! Guardrails: the analytic gradients must match finite differences, or no
//! result from this crate can be trusted.

use repr_bakeoff::data::{generate, EMB};
use repr_bakeoff::metrics::support_class_metrics;
use repr_bakeoff::model::{loss_and_grad, Encoder, LossWeights};
use repr_bakeoff::sigreg::{sample_dirs, sigreg};
use repr_bakeoff::train::train_and_eval;
use sedenion::Sedenion;

fn lcg(seed: &mut u64) -> f32 {
    *seed = seed
        .wrapping_mul(6364136223846793005)
        .wrapping_add(1442695040888963407);
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
    let w = LossWeights {
        inv: 2.0,
        var: 3.0,
        cov: 1.5,
        zda: 0.7,
        zda_auto: false,
        sig: 0.0,
    };
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
    assert!(
        max_err < 2e-2,
        "loss gradient mismatch: max_err = {max_err}"
    );
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
        (0..16)
            .map(|k| cvec.components()[k] * y.components()[k])
            .sum()
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
    assert!(
        max_err < 1e-2,
        "sedenion backward mismatch: max_err = {max_err}"
    );
}

/// The SIGReg (Epps–Pulley) gradient must match central finite differences.
#[test]
fn sigreg_gradient_matches_finite_difference() {
    let mut s = 4242u64;
    let n = 8;
    let mut z: Vec<[f32; EMB]> = (0..n)
        .map(|_| {
            let mut r = [0.0f32; EMB];
            for v in r.iter_mut() {
                *v = lcg(&mut s);
            }
            r
        })
        .collect();
    let dirs = sample_dirs(7, 5);
    let rows: Vec<usize> = (0..n).collect();
    let (_, g) = sigreg(&z, &rows, &dirs);

    let eps = 1e-3f32;
    let mut max_err = 0.0f32;
    for ni in 0..n {
        for d in 0..EMB {
            let orig = z[ni][d];
            z[ni][d] = orig + eps;
            let lp = sigreg(&z, &rows, &dirs).0;
            z[ni][d] = orig - eps;
            let lm = sigreg(&z, &rows, &dirs).0;
            z[ni][d] = orig;
            let num = (lp - lm) / (2.0 * eps);
            max_err = max_err.max((num - g[ni][d]).abs());
        }
    }
    assert!(
        max_err < 2e-2,
        "SIGReg gradient mismatch: max_err = {max_err}"
    );
}

/// Faithfulness: our SIGReg must reproduce the galilai-group/lejepa reference
/// (`epps_pulley.py` + `slicing.py`) numerically. A dependency-free Python port
/// of that exact forward (`tools/ref_pure.py`), on this same LCG input (64×16
/// embeddings, 8 unit slices), yields mean-over-slices = 2.07709580. We match it
/// to f32 precision.
#[test]
fn sigreg_matches_lejepa_reference() {
    fn lcg_vec(seed: u64, count: usize) -> Vec<f32> {
        let mut s = seed;
        (0..count)
            .map(|_| {
                s = s
                    .wrapping_mul(6364136223846793005)
                    .wrapping_add(1442695040888963407);
                (s >> 33) as f32 / (1u64 << 31) as f32 - 1.0
            })
            .collect()
    }
    let (n, k) = (64usize, 8usize);
    let zf = lcg_vec(1, n * EMB);
    let z: Vec<[f32; EMB]> = (0..n)
        .map(|r| {
            let mut row = [0.0f32; EMB];
            row.copy_from_slice(&zf[r * EMB..(r + 1) * EMB]);
            row
        })
        .collect();
    let gf = lcg_vec(999, k * EMB);
    let dirs: Vec<[f32; EMB]> = (0..k)
        .map(|i| {
            let mut v = [0.0f32; EMB];
            v.copy_from_slice(&gf[i * EMB..(i + 1) * EMB]);
            let nrm = v.iter().map(|x| x * x).sum::<f32>().sqrt();
            for x in v.iter_mut() {
                *x /= nrm;
            }
            v
        })
        .collect();
    let rows: Vec<usize> = (0..n).collect();
    let (stat, _) = sigreg(&z, &rows, &dirs);
    // Value computed by the pure-Python port of the lejepa reference forward
    // (epps_pulley.py + slicing.py) on this exact LCG input — `tools/ref_pure.py`
    // prints 2.07709580. Computed, not guessed.
    let reference = 2.0770958f32;
    assert!(
        (stat - reference).abs() < 2e-4,
        "SIGReg deviates from lejepa reference: got {stat}, expected {reference}"
    );
}

#[test]
fn support_class_metrics_count_masks_and_average_zda_by_class() {
    let mut strong = [0.0f32; EMB];
    strong[1] = 1.0;
    strong[2] = 1.0;
    strong[3] = 1.0;

    let mut ghost = [0.0f32; EMB];
    ghost[1] = 1.0;
    ghost[10] = 1.0;
    ghost[11] = 1.0;

    let mut bad = [0.0f32; EMB];
    bad[1] = 1.0;
    bad[2] = 1.0;
    bad[4] = 1.0;

    let metrics = support_class_metrics(&[strong, ghost, bad], 0.0);

    assert_eq!(metrics.total, 3);
    assert_eq!(metrics.strong, 1);
    assert_eq!(metrics.ghost, 1);
    assert_eq!(metrics.bad, 1);
    assert_eq!(metrics.root_rank_hist[2], 2);
    assert_eq!(metrics.strong_rate(), 1.0 / 3.0);
    assert_eq!(metrics.ghost_rate(), 1.0 / 3.0);
    assert_eq!(metrics.bad_rate(), 1.0 / 3.0);
    assert!(metrics.mean_zda_strong.is_some());
    assert!(metrics.mean_zda_ghost.is_some());
    assert!(metrics.mean_zda_bad.is_some());
}

#[test]
fn train_result_reports_support_metrics_for_test_embeddings() {
    let data = generate(7, 3, 24, 12);
    let weights = LossWeights {
        inv: 25.0,
        var: 0.0,
        cov: 0.0,
        zda: 0.0,
        zda_auto: false,
        sig: 0.0,
    };

    let result = train_and_eval(Encoder::new_sed(7), &data, &weights, 1, 0.01);

    assert_eq!(result.support.total, data.test.len());
    assert_eq!(
        result.support.strong + result.support.ghost + result.support.bad,
        data.test.len()
    );
}
