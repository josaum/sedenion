//! repr-bakeoff harness — sedenion-structured projector + ZDA-Reg vs. a matched
//! real-valued baseline, plus a ZDA strength sweep.
//!
//!   cargo run --release             # synthetic data
//!   cargo run --release -- mnist    # real images (needs data/, see fetch_mnist.sh)

use repr_bakeoff::data::{generate, Dataset};
use repr_bakeoff::mnist;
use repr_bakeoff::model::{Encoder, LossWeights};
use repr_bakeoff::train::{train_and_eval, Result};

fn avg<F: Fn(&Result) -> f64>(rs: &[Result], f: F) -> f64 {
    rs.iter().map(|r| f(r)).sum::<f64>() / rs.len() as f64
}

struct Arm {
    name: &'static str,
    sed: bool,
    zda: f32,
    zda_auto: bool,
}

fn run(
    title: &str,
    n_classes: usize,
    epochs: usize,
    lr: f32,
    seeds: u64,
    make_data: impl Fn(u64) -> Dataset,
) {
    // LeJEPA-faithful objective: invariance + SIGReg (Epps–Pulley). ZDA is either
    // off or auto-balanced against the current base-objective gradient.
    let base = |zda: f32, zda_auto: bool| LossWeights {
        inv: 25.0,
        var: 0.0,
        cov: 0.0,
        zda,
        zda_auto,
        sig: 1.0,
    };
    let arms = [
        Arm {
            name: "Real baseline (SIGReg)",
            sed: false,
            zda: 0.0,
            zda_auto: false,
        },
        Arm {
            name: "Sedenion  ZDA off     ",
            sed: true,
            zda: 0.0,
            zda_auto: false,
        },
        Arm {
            name: "Sedenion  ZDA auto    ",
            sed: true,
            zda: 1.0,
            zda_auto: true,
        },
    ];

    println!("\n=== {title} ===");
    println!(
        "seeds={seeds}  classes={n_classes}  epochs={epochs}  (chance = {:.1}%)",
        100.0 / n_classes as f64
    );
    println!(
        "{:<24}  {:>6}  {:>9}  {:>8}  {:>10}  {:>9}  {:>8}",
        "arm", "params", "probe_acc", "eff_rank", "gaussian↓", "isotropy↓", "min_std"
    );
    // Build each seed's dataset once and reuse it across all arms.
    let mut per_arm: Vec<Vec<Result>> = (0..arms.len()).map(|_| Vec::new()).collect();
    for seed in 0..seeds {
        let data = make_data(seed);
        for (ai, a) in arms.iter().enumerate() {
            let enc = if a.sed {
                Encoder::new_sed(seed)
            } else {
                Encoder::new_real(seed)
            };
            per_arm[ai].push(train_and_eval(
                enc,
                &data,
                &base(a.zda, a.zda_auto),
                epochs,
                lr,
            ));
        }
    }
    for (ai, a) in arms.iter().enumerate() {
        let rs = &per_arm[ai];
        println!(
            "{:<24}  {:>6}  {:>8.1}%  {:>8.2}  {:>10.4}  {:>9.4}  {:>8.4}",
            a.name,
            rs[0].n_params,
            100.0 * avg(&rs, |r| r.probe_acc),
            avg(&rs, |r| r.collapse.effective_rank),
            avg(&rs, |r| r.gaussianity),
            avg(&rs, |r| r.collapse.isotropy_dist),
            avg(&rs, |r| r.collapse.min_std),
        );
    }
}

fn main() {
    let mnist_mode = std::env::args().any(|a| a == "mnist");

    if mnist_mode {
        let raw = mnist::load_raw("data");
        run(
            "REAL DATA — MNIST (frozen random backbone 784→256)",
            10,
            300,
            0.15,
            3,
            |seed| mnist::build(&raw, seed, 1200, 1200),
        );
    } else {
        run("SYNTHETIC — 10-class two-view", 10, 300, 0.15, 4, |seed| {
            generate(seed, 10, 400, 400)
        });
    }

    println!("\nRead it as:");
    println!(
        "  probe_acc  — downstream linear-probe accuracy (higher = more useful representation)."
    );
    println!(
        "  eff_rank   — effective rank of the embedding covariance (16 = full, low = collapse)."
    );
    println!("  gaussian↓  — held-out Epps-Pulley statistic against N(0,1).");
    println!("  isotropy↓  — distance from isotropic covariance (0 = isotropic; SIGReg wants this small).");
    println!("  min_std    — smallest per-axis std (→0 = a dead/collapsed axis).");
    println!("\nKey question: does auto-balanced ZDA improve probe_acc without a λ sweep?");
}
