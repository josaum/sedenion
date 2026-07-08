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

fn weighted_mean_opt<C, M>(rs: &[Result], count: C, mean: M) -> Option<f64>
where
    C: Fn(&Result) -> usize,
    M: Fn(&Result) -> Option<f64>,
{
    let mut sum = 0.0;
    let mut total = 0usize;
    for r in rs {
        let n = count(r);
        if n > 0 {
            if let Some(v) = mean(r) {
                sum += v * n as f64;
                total += n;
            }
        }
    }
    (total > 0).then(|| sum / total as f64)
}

fn fmt_opt(v: Option<f64>) -> String {
    v.map(|x| format!("{x:.3}")).unwrap_or_else(|| "n/a".into())
}

fn avg_root_rate(rs: &[Result], rank: usize) -> f64 {
    avg(rs, |r| {
        r.support.root_rank_hist[rank] as f64 / r.support.total.max(1) as f64
    })
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
    let names: Vec<&str> = arms.iter().map(|a| a.name).collect();
    print_metric_tables(&names, &per_arm);
}

/// Print the two result tables (metrics + triangular-support telemetry) for a
/// list of arms, each averaged over its seeds. Shared by the shallow and deep
/// runners so both report identically.
fn print_metric_tables(names: &[&str], per_arm: &[Vec<Result>]) {
    println!(
        "{:<24}  {:>6}  {:>9}  {:>8}  {:>10}  {:>9}  {:>8}",
        "arm", "params", "probe_acc", "eff_rank", "gaussian↓", "isotropy↓", "min_std"
    );
    for (ai, name) in names.iter().enumerate() {
        let rs = &per_arm[ai];
        println!(
            "{:<24}  {:>6}  {:>8.1}%  {:>8.2}  {:>10.4}  {:>9.4}  {:>8.4}",
            name,
            rs[0].n_params,
            100.0 * avg(rs, |r| r.probe_acc),
            avg(rs, |r| r.collapse.effective_rank),
            avg(rs, |r| r.gaussianity),
            avg(rs, |r| r.collapse.isotropy_dist),
            avg(rs, |r| r.collapse.min_std),
        );
    }
    println!("\ntriangular support telemetry (held-out embeddings, |component| > 0.25)");
    println!(
        "{:<24}  {:>8}  {:>8}  {:>8}  {:>6} {:>6} {:>6} {:>6}  {:>8} {:>8} {:>8}",
        "arm", "strong%", "ghost%", "bad%", "r1%", "r2%", "r3%", "r4%", "zda_S", "zda_G", "zda_B"
    );
    for (ai, name) in names.iter().enumerate() {
        let rs = &per_arm[ai];
        println!(
            "{:<24}  {:>7.1}%  {:>7.1}%  {:>7.1}%  {:>5.1}% {:>5.1}% {:>5.1}% {:>5.1}%  {:>8} {:>8} {:>8}",
            name,
            100.0 * avg(rs, |r| r.support.strong_rate()),
            100.0 * avg(rs, |r| r.support.ghost_rate()),
            100.0 * avg(rs, |r| r.support.bad_rate()),
            100.0 * avg_root_rate(rs, 1),
            100.0 * avg_root_rate(rs, 2),
            100.0 * avg_root_rate(rs, 3),
            100.0 * avg_root_rate(rs, 4),
            fmt_opt(weighted_mean_opt(rs, |r| r.support.strong, |r| r.support.mean_zda_strong)),
            fmt_opt(weighted_mean_opt(rs, |r| r.support.ghost, |r| r.support.mean_zda_ghost)),
            fmt_opt(weighted_mean_opt(rs, |r| r.support.bad, |r| r.support.mean_zda_bad)),
        );
    }
}

/// Deep-arm runner: dense / sedenion(±ZDA) / PHM encoders, Adam + minibatches,
/// same faithful SIGReg objective and metrics as `run`.
fn run_deep(
    title: &str,
    n_classes: usize,
    seeds: u64,
    jam_train: f32,
    jam_mult: bool,
    make_data: impl Fn(u64) -> Dataset,
) {
    use repr_bakeoff::deep::{
        train_deep_and_eval, Arm as DeepArm, DeepConfig, DeepEncoder, JAM_LEVELS, WIDTHS_WIDE,
    };

    struct DArm {
        name: &'static str,
        arm: DeepArm,
        zda: bool,
        wide: bool,
    }
    let mut arms = vec![
        DArm {
            name: "Dense deep            ",
            arm: DeepArm::Dense,
            zda: false,
            wide: false,
        },
        DArm {
            name: "Sedenion deep ZDA off ",
            arm: DeepArm::Sedenion,
            zda: false,
            wide: false,
        },
        DArm {
            name: "Sedenion deep ZDA auto",
            arm: DeepArm::Sedenion,
            zda: true,
            wide: false,
        },
        DArm {
            name: "PHM deep (learned alg)",
            arm: DeepArm::Phm,
            zda: true,
            wide: false,
        },
    ];
    // The capacity-matched wide sedenion arm is the anti-jamming test's fair
    // comparison; only run it in `robust` mode (jam-augmented training) to keep
    // the standard bake-off to four arms.
    if jam_train > 0.0 {
        arms.push(DArm {
            name: "Sedenion WIDE ZDA auto",
            arm: DeepArm::Sedenion,
            zda: true,
            wide: true,
        });
    }

    let cfg = DeepConfig::default();
    println!("\n=== {title} ===");
    println!(
        "seeds={seeds}  classes={n_classes}  epochs={}  batch={}  lr={}  jam_train={jam_train}  (chance = {:.1}%)",
        cfg.epochs,
        cfg.batch,
        cfg.lr,
        100.0 / n_classes as f64
    );
    println!("arch: 256 -> 128 -> 64 -> 16 (SiLU between hidden layers, linear head)");

    let mut per_arm: Vec<Vec<Result>> = (0..arms.len()).map(|_| Vec::new()).collect();
    let mut per_arm_jam: Vec<Vec<Vec<f64>>> = (0..arms.len()).map(|_| Vec::new()).collect();
    let mut per_arm_tonal: Vec<Vec<Vec<f64>>> = (0..arms.len()).map(|_| Vec::new()).collect();
    let mut per_arm_mult: Vec<Vec<Vec<f64>>> = (0..arms.len()).map(|_| Vec::new()).collect();
    for seed in 0..seeds {
        let data = make_data(seed);
        for (ai, a) in arms.iter().enumerate() {
            let enc = if a.wide {
                DeepEncoder::new_with(a.arm, seed, &WIDTHS_WIDE)
            } else {
                DeepEncoder::new(a.arm, seed)
            };
            let cfg = DeepConfig {
                zda: a.zda,
                jam_train,
                jam_mult,
                ..DeepConfig::default()
            };
            let de = train_deep_and_eval(enc, &data, &cfg);
            per_arm[ai].push(de.eval);
            per_arm_jam[ai].push(de.jam_acc);
            per_arm_tonal[ai].push(de.jam_tonal_acc);
            per_arm_mult[ai].push(de.jam_mult_acc);
        }
    }
    let names: Vec<&str> = arms.iter().map(|a| a.name).collect();
    print_metric_tables(&names, &per_arm);
    println!("\n[broadband jamming — full-rank additive noise, every input axis corrupted]");
    print_jam_table(&names, &per_arm_jam, &JAM_LEVELS);
    println!(
        "\n[tonal jamming — rank-1 additive interferer, one random direction, energy-matched]"
    );
    print_jam_table(&names, &per_arm_tonal, &JAM_LEVELS);
    println!("\n[multiplicative jamming — structured sedenion-domain distortion (the algebra's threat model)]");
    print_jam_table(&names, &per_arm_mult, &JAM_LEVELS);
}

/// Print the anti-jamming curve: probe accuracy as the test inputs are jammed with
/// increasing broadband noise, plus retention at the strongest jam level. Each cell
/// is averaged over seeds; every arm saw identical jammed inputs.
fn print_jam_table(names: &[&str], per_arm_jam: &[Vec<Vec<f64>>], levels: &[f32]) {
    println!("\nanti-jamming: linear-probe accuracy vs. input jam noise (probe fit on clean)");
    print!("{:<24}", "arm");
    for s in levels {
        print!("  σ={s:<5.2}");
    }
    println!("   ret@max");
    for (ai, name) in names.iter().enumerate() {
        let seeds = &per_arm_jam[ai];
        let n = seeds.len().max(1) as f64;
        // Mean accuracy at each jam level across seeds.
        let mut mean = vec![0.0f64; levels.len()];
        for run in seeds {
            for (l, &acc) in run.iter().enumerate() {
                mean[l] += acc / n;
            }
        }
        print!("{name:<24}");
        for acc in &mean {
            print!("  {:>6.1}%", 100.0 * acc);
        }
        // Retention = accuracy at the strongest jam / clean accuracy.
        let ret = if mean[0] > 1e-9 {
            mean[mean.len() - 1] / mean[0]
        } else {
            0.0
        };
        println!("   {:>6.1}%", 100.0 * ret);
    }
}

fn main() {
    let args: Vec<String> = std::env::args().collect();
    let deep_mode = args.iter().any(|a| a == "deep");
    let mnist_mode = args.iter().any(|a| a == "mnist");
    // `robust` trains all arms under input jamming, then re-runs the anti-jamming
    // curves — the fair test of jam-robustness. `mult` makes that jamming
    // *multiplicative* (structured, sedenion-domain) rather than additive noise.
    let jam_mult = args.iter().any(|a| a == "mult");
    let jam_train = if args.iter().any(|a| a == "robust") {
        if jam_mult {
            0.7
        } else {
            0.5
        }
    } else {
        0.0
    };

    match (deep_mode, mnist_mode) {
        (true, true) => {
            let raw = mnist::load_raw("data");
            run_deep(
                "DEEP — MNIST (frozen random backbone 784→256)",
                10,
                3,
                jam_train,
                jam_mult,
                |seed| mnist::build(&raw, seed, 1200, 1200),
            );
        }
        (true, false) => {
            run_deep(
                "DEEP — SYNTHETIC 10-class two-view",
                10,
                4,
                jam_train,
                jam_mult,
                |seed| generate(seed, 10, 400, 400),
            );
        }
        (false, true) => {
            let raw = mnist::load_raw("data");
            run(
                "REAL DATA — MNIST (frozen random backbone 784→256)",
                10,
                300,
                0.15,
                3,
                |seed| mnist::build(&raw, seed, 1200, 1200),
            );
        }
        (false, false) => {
            run("SYNTHETIC — 10-class two-view", 10, 300, 0.15, 4, |seed| {
                generate(seed, 10, 400, 400)
            });
        }
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
    println!("  strong/ghost/bad — triangular-root support class rates at |component| > 0.25.");
    println!("\nKey question: does auto-balanced ZDA improve probe_acc without a λ sweep?");
}
