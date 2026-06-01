//! Bake-off harness: runs both estimators over identical IMU streams across
//! many seeds, in pure dead-reckoning and externally-aided modes, and prints
//! horizontal-position RMSE vs. time. Writes a tidy CSV for plotting.
//!
//! Usage:
//!   cargo run --release --bin nav-bakeoff -- [seeds] [duration_s] [--duffing]

use nav_bakeoff::filters::{run, Config};
use nav_bakeoff::sim::{generate, ImuParams};
use std::io::Write;

fn rmse_at(per_seed_errors: &[Vec<f64>], idx: usize) -> f64 {
    let mut acc = 0.0;
    let mut count = 0;
    for e in per_seed_errors {
        if idx < e.len() {
            acc += e[idx] * e[idx];
            count += 1;
        }
    }
    if count == 0 {
        return f64::NAN;
    }
    (acc / count as f64).sqrt()
}

fn main() {
    let args: Vec<String> = std::env::args().collect();
    let seeds: u64 = args.get(1).and_then(|s| s.parse().ok()).unwrap_or(16);
    let duration: f64 = args.get(2).and_then(|s| s.parse().ok()).unwrap_or(300.0);
    let duffing = args.iter().any(|a| a == "--duffing");

    let dt = 0.02; // 50 Hz
    let steps = (duration / dt) as usize;

    let mut params = ImuParams::default();
    if duffing {
        params.duffing_beta = 5.0;
    }

    let markers = [10.0, 30.0, 60.0, 120.0, duration - dt];
    let marker_idx: Vec<usize> = markers.iter().map(|t| (t / dt) as usize).collect();

    println!("TESSERACT-BR bake-off  —  standard UKF vs. Sedenion-UKF");
    println!(
        "seeds={seeds}  duration={duration}s  dt={dt}s  duffing={}  MEMS: white={} bias_rw={} bias0={}",
        duffing, params.accel_white, params.bias_rw, params.bias_init
    );
    println!();

    // Estimator configurations to compare.
    struct Variant {
        name: &'static str,
        sedenion: bool,
        lambda: f64,
    }
    let variants = [
        Variant {
            name: "Baseline UKF",
            sedenion: false,
            lambda: 0.0,
        },
        Variant {
            name: "SUKF λ=0.00 ",
            sedenion: true,
            lambda: 0.0,
        },
        Variant {
            name: "SUKF λ=0.25 ",
            sedenion: true,
            lambda: 0.25,
        },
        Variant {
            name: "SUKF λ=0.50 ",
            sedenion: true,
            lambda: 0.50,
        },
        Variant {
            name: "SUKF λ=1.00 ",
            sedenion: true,
            lambda: 1.00,
        },
    ];

    let mut csv = String::from("mode,estimator,lambda,t_s,rmse_horizontal_m\n");

    for (mode_name, fix_interval) in [
        ("DEAD-RECKONING (no aiding)", None),
        ("AIDED (30 s position fix, σ=5 m)", Some(30.0)),
    ] {
        println!("== {mode_name} ==");
        print!("{:<14}", "estimator");
        for t in &markers {
            print!("  t={:>6.1}s", t);
        }
        println!();

        for v in &variants {
            let cfg = Config {
                dt,
                fix_interval,
                fix_sigma: 5.0,
                lambda: v.lambda,
            };
            let mut per_seed = Vec::new();
            for seed in 0..seeds {
                let traj = generate(seed, steps, dt, &params);
                per_seed.push(run(&traj, &params, &cfg, v.sedenion, seed));
            }
            print!("{:<14}", v.name);
            for (mi, t) in marker_idx.iter().zip(markers.iter()) {
                let r = rmse_at(&per_seed, *mi);
                print!("  {:>9.1}", r);
                csv.push_str(&format!(
                    "{},{},{},{:.2},{:.4}\n",
                    if fix_interval.is_none() {
                        "dead_reckoning"
                    } else {
                        "aided"
                    },
                    v.name.trim(),
                    v.lambda,
                    t,
                    r
                ));
            }
            println!();
        }
        println!();
    }

    let path = "bakeoff_results.csv";
    if let Ok(mut f) = std::fs::File::create(path) {
        let _ = f.write_all(csv.as_bytes());
        println!("Wrote {path}");
    }
}
