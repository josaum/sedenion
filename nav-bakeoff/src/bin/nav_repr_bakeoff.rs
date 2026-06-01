//! nav-repr-bakeoff — learned inertial representations, not sedenion states.
//!
//! Usage:
//!   cargo run --release --bin nav-repr-bakeoff -- [train_seeds] [test_seeds] [duration_s] [--duffing]

use nav_bakeoff::nav_repr::{run_bakeoff, run_bakeoff_real, ReprConfig, TrainConfig};
use std::io::Write;

/// Paired mean difference (model - reference) and its one-sample t-statistic.
/// Both vectors are aligned by seed index. Returns (mean_delta, t_stat).
fn paired_delta(model: &[f64], reference: &[f64]) -> (f64, f64) {
    let n = model.len().min(reference.len());
    if n == 0 {
        return (0.0, 0.0);
    }
    let d: Vec<f64> = (0..n).map(|i| model[i] - reference[i]).collect();
    let mean = d.iter().sum::<f64>() / n as f64;
    if n < 2 {
        return (mean, 0.0);
    }
    let var = d.iter().map(|v| (v - mean).powi(2)).sum::<f64>() / (n as f64 - 1.0);
    let se = (var / n as f64).sqrt();
    let t = if se > 1e-12 { mean / se } else { 0.0 };
    (mean, t)
}

fn print_row(name: &str, params: usize, split: &str, m: nav_bakeoff::nav_repr::Metrics) {
    println!(
        "{:<24} {:>6} {:<5}  norm_mse={:>7.4}  bias_rmse={:>7.4} m/s^2  drift3d={:>7.3} m  drift_xy={:>7.3} m  z_rms={:>6.3}  zda={:>6.3}",
        name, params, split, m.norm_mse, m.bias_rmse, m.drift_3d_rmse, m.drift_xy_rmse, m.latent_rms, m.zda_score
    );
}

/// Value following a `--flag` argument, if present.
fn flag_value<'a>(args: &'a [String], flag: &str) -> Option<&'a str> {
    args.iter()
        .position(|a| a == flag)
        .and_then(|i| args.get(i + 1))
        .map(|s| s.as_str())
}

fn main() {
    let args: Vec<String> = std::env::args().collect();
    let duffing = args.iter().any(|a| a == "--duffing");
    let duration_s: f64 = args.get(3).and_then(|s| s.parse().ok()).unwrap_or(180.0);
    // Timestep; must match the extractor's 1/rate (default 0.02 s = 50 Hz).
    let dt: f64 = flag_value(&args, "--dt")
        .and_then(|s| s.parse().ok())
        .unwrap_or(ReprConfig::default().dt);

    let repr_cfg = ReprConfig {
        duration_s,
        duffing,
        dt,
        ..ReprConfig::default()
    };
    let mut train_cfg = TrainConfig::default();
    if let Some(v) = flag_value(&args, "--bias-sigma-floor").and_then(|s| s.parse().ok()) {
        train_cfg.bias_sigma_floor = v;
    }

    // --make-fixture <dir>: synthesize schema-faithful Arrow flights and exit.
    if let Some(dir) = flag_value(&args, "--make-fixture") {
        let count: usize = flag_value(&args, "--n")
            .and_then(|s| s.parse().ok())
            .unwrap_or(12);
        let secs = flag_value(&args, "--secs")
            .and_then(|s| s.parse().ok())
            .unwrap_or(duration_s);
        match nav_bakeoff::real_data::write_fixture_dir(
            std::path::Path::new(dir),
            count,
            secs,
            repr_cfg.dt,
            duffing,
        ) {
            Ok(()) => println!("Wrote {count} fixture flights ({secs}s each) to {dir}"),
            Err(e) => eprintln!("fixture write failed: {e}"),
        }
        return;
    }

    println!("nav-repr-bakeoff — learned MEMS error representations");

    // --data <dir>: real-flight Arrow IPC bakeoff. Otherwise synthetic.
    let (n_train, n_test, rows, nav_rows) = if let Some(dir) = flag_value(&args, "--data") {
        let test_frac: f64 = flag_value(&args, "--test-frac")
            .and_then(|s| s.parse().ok())
            .unwrap_or(0.2);
        let ds = match nav_bakeoff::real_data::load_dataset(
            std::path::Path::new(dir),
            &repr_cfg,
            test_frac,
        ) {
            Ok(ds) => ds,
            Err(e) => {
                eprintln!("failed to load real dataset from {dir}: {e}");
                std::process::exit(1);
            }
        };
        println!(
            "DATA=real dir={dir} train_files={} test_files={} window={}s horizon={}s stride={}s dt={} batch={} sigreg_weight={} bias_sigma_floor={}",
            ds.train_files,
            ds.test_files,
            repr_cfg.window_s,
            repr_cfg.horizon_s,
            repr_cfg.stride_s,
            repr_cfg.dt,
            train_cfg.batch_size,
            train_cfg.sigreg_weight,
            train_cfg.bias_sigma_floor
        );
        println!("target = INS-error: accel-bias proxy xyz + future dead-reckoning drift xyz");
        println!();
        run_bakeoff_real(&repr_cfg, &train_cfg, ds.train, ds.test, &ds.test_sequences)
    } else {
        let train_seeds: u64 = args.get(1).and_then(|s| s.parse().ok()).unwrap_or(64);
        let test_seeds: u64 = args.get(2).and_then(|s| s.parse().ok()).unwrap_or(16);
        println!(
            "DATA=synthetic train_seeds={train_seeds} test_seeds={test_seeds} duration={duration_s}s window={}s horizon={}s stride={}s duffing={} supervised_epochs={} jepa_epochs={} head_epochs={} lr={} jepa_lr={} batch={} sigreg_weight={} bias_sigma_floor={}",
            repr_cfg.window_s,
            repr_cfg.horizon_s,
            repr_cfg.stride_s,
            repr_cfg.duffing,
            train_cfg.epochs,
            train_cfg.jepa_epochs,
            train_cfg.head_epochs,
            train_cfg.lr,
            train_cfg.jepa_lr,
            train_cfg.batch_size,
            train_cfg.sigreg_weight,
            train_cfg.bias_sigma_floor
        );
        println!("target = current accel bias xyz + future dead-reckoning drift xyz");
        println!();
        run_bakeoff(&repr_cfg, &train_cfg, train_seeds, test_seeds)
    };
    println!("examples: train={n_train} test={n_test}");
    println!();
    println!("== proxy target metrics ==");
    for row in &rows {
        print_row(row.name, row.params, "train", row.train);
        print_row(row.name, row.params, "test", row.test);
    }
    println!();
    println!("== filter-in-loop, no external position fixes ==");
    // Dead reckoning is row 0 and is the paired reference.
    let dr = nav_rows
        .first()
        .map(|r| r.per_seed.clone())
        .unwrap_or_default();
    println!(
        "(common bias_sigma across models; paired delta vs dead-reckoning, n={} seqs)",
        dr.len()
    );
    for row in &nav_rows {
        let (delta, t) = paired_delta(&row.per_seed, &dr);
        let sig = if t.abs() >= 2.0 { "*" } else { " " };
        println!(
            "{:<26} {:>6}  sigma={:>6.4}  term_rmse={:>8.2} m  mean={:>8.2}±{:>7.2} m  d_vs_DR={:>+8.2} m (t={:>+5.2}){}",
            row.name, row.params, row.bias_sigma, row.terminal_rmse, row.terminal_mean,
            row.terminal_std, delta, t, sig
        );
    }
    println!("* = |paired t| >= 2 vs dead reckoning. Positive d_vs_DR means worse than DR.");

    let mut csv = String::from("model,params,split,norm_mse,bias_rmse_mps2,drift3d_rmse_m,driftxy_rmse_m,latent_rms,zda_score\n");
    for row in &rows {
        for (split, m) in [("train", row.train), ("test", row.test)] {
            csv.push_str(&format!(
                "{},{},{},{:.6},{:.6},{:.6},{:.6},{:.6},{:.6}\n",
                row.name,
                row.params,
                split,
                m.norm_mse,
                m.bias_rmse,
                m.drift_3d_rmse,
                m.drift_xy_rmse,
                m.latent_rms,
                m.zda_score
            ));
        }
    }
    let path = "nav_repr_results.csv";
    if let Ok(mut f) = std::fs::File::create(path) {
        let _ = f.write_all(csv.as_bytes());
        println!();
        println!("Wrote {path}");
    }

    let mut nav_csv = String::from(
        "model,params,bias_sigma_mps2,terminal_rmse_m,terminal_mean_m,terminal_std_m\n",
    );
    for row in &nav_rows {
        nav_csv.push_str(&format!(
            "{},{},{:.6},{:.6},{:.6},{:.6}\n",
            row.name,
            row.params,
            row.bias_sigma,
            row.terminal_rmse,
            row.terminal_mean,
            row.terminal_std
        ));
    }
    let nav_path = "nav_repr_filter_results.csv";
    if let Ok(mut f) = std::fs::File::create(nav_path) {
        let _ = f.write_all(nav_csv.as_bytes());
        println!("Wrote {nav_path}");
    }
}
