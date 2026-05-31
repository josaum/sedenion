//! repr-bakeoff harness — sedenion-structured projector + ZDA-Reg vs. a matched
//! real-valued baseline, plus a ZDA strength sweep.
//!
//!   cargo run --release -p repr-bakeoff

use repr_bakeoff::data::generate;
use repr_bakeoff::model::{Encoder, LossWeights};
use repr_bakeoff::train::{train_and_eval, Result};

fn avg<F: Fn(&Result) -> f64>(rs: &[Result], f: F) -> f64 {
    rs.iter().map(|r| f(r)).sum::<f64>() / rs.len() as f64
}

fn main() {
    let seeds = 8u64;
    let n_classes = 10;
    let n_train = 400;
    let n_test = 400;
    let epochs = 250;
    let lr = 0.5f32;

    // VICReg weights (shared). ZDA weight set per-arm.
    let base = |zda: f32| LossWeights { inv: 25.0, var: 25.0, cov: 1.0, zda };

    println!("repr-bakeoff — sedenion projector (+ZDA-Reg) vs. matched real baseline");
    println!(
        "seeds={seeds}  classes={n_classes}  train={n_train}  test={n_test}  epochs={epochs}  (chance = {:.1}%)\n",
        100.0 / n_classes as f64
    );

    struct Arm {
        name: &'static str,
        sed: bool,
        zda: f32,
    }
    let arms = [
        Arm { name: "Real baseline (VICReg)", sed: false, zda: 0.0 },
        Arm { name: "Sedenion  λ_zda=0.0   ", sed: true, zda: 0.0 },
        Arm { name: "Sedenion  λ_zda=0.1   ", sed: true, zda: 0.1 },
        Arm { name: "Sedenion  λ_zda=1.0   ", sed: true, zda: 1.0 },
        Arm { name: "Sedenion  λ_zda=5.0   ", sed: true, zda: 5.0 },
    ];

    println!(
        "{:<24}  {:>6}  {:>9}  {:>8}  {:>9}  {:>8}",
        "arm", "params", "probe_acc", "eff_rank", "isotropy↓", "min_std"
    );

    for a in &arms {
        let mut rs = Vec::new();
        for seed in 0..seeds {
            let data = generate(seed, n_classes, n_train, n_test);
            let enc = if a.sed { Encoder::new_sed(seed) } else { Encoder::new_real(seed) };
            rs.push(train_and_eval(enc, &data, &base(a.zda), epochs, lr));
        }
        println!(
            "{:<24}  {:>6}  {:>8.1}%  {:>8.2}  {:>9.4}  {:>8.4}",
            a.name,
            rs[0].n_params,
            100.0 * avg(&rs, |r| r.probe_acc),
            avg(&rs, |r| r.collapse.effective_rank),
            avg(&rs, |r| r.collapse.isotropy_dist),
            avg(&rs, |r| r.collapse.min_std),
        );
    }

    println!("\nRead it as:");
    println!("  probe_acc  — downstream linear-probe accuracy (higher = more useful representation).");
    println!("  eff_rank   — effective rank of the embedding covariance (16 = full, low = collapse).");
    println!("  isotropy↓  — distance from an isotropic covariance (0 = isotropic; SIGReg wants this small).");
    println!("  min_std    — smallest per-axis std (→0 = a dead/collapsed axis).");
    println!("\nKey question: does λ_zda > 0 improve anything, or does it raise isotropy↓");
    println!("(fighting the very isotropy objective) without helping probe_acc?");
}
