use nav_bakeoff::filters::{run, run_with_bias_aid, Config};
use nav_bakeoff::nav_repr::{
    apply_scaler, fit_scaler, make_examples, DenseModel, ReprConfig, ReprModel, SedenionModel,
};
use nav_bakeoff::sim::{generate, ImuParams};

#[test]
fn nav_repr_dataset_has_scaled_windows() {
    let cfg = ReprConfig {
        duration_s: 20.0,
        horizon_s: 2.0,
        ..ReprConfig::default()
    };
    let mut data = make_examples(0, 1, &cfg);
    assert!(!data.is_empty());
    let scaler = fit_scaler(&data);
    apply_scaler(&mut data, &scaler);
    for c in 0..3 {
        for k in 0..16 {
            assert!(data[0].x[c][k].is_finite());
        }
    }
    for y in data[0].y {
        assert!(y.is_finite());
    }
}

#[test]
fn nav_repr_models_emit_finite_predictions() {
    let cfg = ReprConfig {
        duration_s: 20.0,
        horizon_s: 2.0,
        ..ReprConfig::default()
    };
    let mut data = make_examples(0, 1, &cfg);
    let scaler = fit_scaler(&data);
    apply_scaler(&mut data, &scaler);
    let dense = DenseModel::new(1);
    let sed = SedenionModel::new(2, true);
    for model in [&dense as &dyn ReprModel, &sed as &dyn ReprModel] {
        let (z, y) = model.forward(&data[0].x);
        assert!(z.iter().all(|v| v.is_finite()));
        assert!(y.iter().all(|v| v.is_finite()));
    }
}

#[test]
fn oracle_bias_aid_reduces_dead_reckoning_drift() {
    let params = ImuParams::default();
    let dt = 0.02;
    let steps = (60.0 / dt) as usize;
    let traj = generate(7, steps, dt, &params);
    let cfg = Config {
        dt,
        fix_interval: None,
        fix_sigma: 5.0,
        lambda: 0.0,
    };

    let baseline = run(&traj, &params, &cfg, false, 7);
    let aided = run_with_bias_aid(&traj, &params, &cfg, false, 7, 1e-4, |idx, samples| {
        if idx % 50 == 0 {
            Some([
                samples[idx].truth[6],
                samples[idx].truth[7],
                samples[idx].truth[8],
            ])
        } else {
            None
        }
    });

    assert!(aided.last().unwrap() < baseline.last().unwrap());
}
