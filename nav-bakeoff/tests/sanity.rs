//! Guardrails that keep the bake-off honest.

use nav_bakeoff::filters::{run, Config};
use nav_bakeoff::sim::{generate, ImuParams};

/// With a noise-free IMU (no white noise, no bias, no bias walk), the strapdown
/// UKF must dead-reckon with essentially zero error. This proves the baseline
/// mechanization and integration are correct — the necessary precondition for
/// the comparison to mean anything.
#[test]
fn noise_free_baseline_does_not_drift() {
    let params = ImuParams {
        accel_white: 0.0,
        bias_rw: 0.0,
        bias_init: 0.0,
        duffing_beta: 0.0,
    };
    let dt = 0.02;
    let steps = 5000; // 100 s
    let traj = generate(1, steps, dt, &params);
    let cfg = Config {
        dt,
        fix_interval: None,
        fix_sigma: 5.0,
        lambda: 0.0,
    };
    let err = run(&traj, &params, &cfg, false, 1);
    let final_err = *err.last().unwrap();
    assert!(
        final_err < 1e-3,
        "noise-free dead-reckoning drifted by {final_err} m (should be ~0)"
    );
}

/// At lambda = 0 the sedenion variant must be bit-for-bit equivalent to the
/// baseline: the embedding is applied but the projection is a no-op. This
/// confirms the SUKF can do no better than "become the baseline".
#[test]
fn sukf_lambda_zero_equals_baseline() {
    let params = ImuParams::default();
    let dt = 0.02;
    let steps = 3000;
    let traj = generate(7, steps, dt, &params);
    let cfg = Config {
        dt,
        fix_interval: Some(30.0),
        fix_sigma: 5.0,
        lambda: 0.0,
    };
    let base = run(&traj, &params, &cfg, false, 7);
    let sed = run(&traj, &params, &cfg, true, 7);
    for (b, s) in base.iter().zip(sed.iter()) {
        assert!(
            (b - s).abs() < 1e-9,
            "λ=0 SUKF diverged from baseline: {b} vs {s}"
        );
    }
}
