//! bilinear-probe — does strapdown coupling live in the sedenion-reachable
//! subspace? Reports the projection residual ρ for the full algebra and for the
//! quaternion-generator ablation, across a sweep of (nondimensional) rotation
//! rates, plus operator conditioning diagnostics.
//!
//!   cargo run --release --bin bilinear-probe

use nav_bakeoff::bilinear::{
    attitude_block_residual, generators, operator_diagnostics, reachable_dim, residual,
    strapdown_coupling,
};
use sedenion::Sedenion;

fn main() {
    println!("bilinear-probe — strapdown coupling vs. sedenion-reachable subspace\n");

    let gens_full = generators(16);
    let gens_quat = generators(4);
    println!(
        "Reachable subspace dimension (of 256):  full 𝕊 = {},  quaternion-gen = {}\n",
        reachable_dim(&gens_full),
        reachable_dim(&gens_quat)
    );

    println!(
        "{:<10}  {:>9}  {:>9}  {:>9}   {:>10}  {:>10}",
        "|ω̄|", "ρ_full", "ρ_quat", "Δρ", "ρ_att(full)", "ρ_vp(full)"
    );
    // Sweep rotation-rate magnitude along a fixed, generic axis so centripetal
    // (∝ ω̄²) grows relative to the linear-in-ω̄ terms.
    let axis = {
        let a = [0.6f64, 0.48, 0.64]; // unit-ish, generic direction
        let n = (a[0] * a[0] + a[1] * a[1] + a[2] * a[2]).sqrt();
        [a[0] / n, a[1] / n, a[2] / n]
    };
    for &mag in &[0.05, 0.1, 0.25, 0.5, 1.0, 2.0] {
        let wb = [axis[0] * mag, axis[1] * mag, axis[2] * mag];
        let a = strapdown_coupling(wb);
        let rf = residual(&a, &gens_full);
        let rq = residual(&a, &gens_quat);
        println!(
            "{:<10.2}  {:>9.4}  {:>9.4}  {:>9.4}   {:>10.4}  {:>10.4}",
            mag,
            rf.rho,
            rq.rho,
            rq.rho - rf.rho,
            rf.rho_attitude,
            rf.rho_velpos
        );
    }

    let wb_ref = [axis[0] * 0.5, axis[1] * 0.5, axis[2] * 0.5];
    println!(
        "\nControl — attitude block alone, projected onto 4×4 quaternion operators:  ρ = {:.2e}",
        attitude_block_residual(wb_ref)
    );
    println!(
        "  (≈0 confirms the harness, and that 𝕊 earns its keep only in the 4-D attitude corner.)"
    );

    println!("\nInterpretation:");
    println!(
        "  ρ_full small  → strapdown coupling lives in the sedenion operators (structural win)."
    );
    println!("  ρ_full large  → physics is NOT in the algebra; F_nonlinear carries it (overhead).");
    println!("  Δρ            → marginal value of the off-quaternion generators e4..e15.");
    println!(
        "  ρ_att / ρ_vp  → where the misfit concentrates (attitude block vs velocity+position)."
    );

    // Operator conditioning at a few representative states, including near a
    // known zero divisor (e3+e10), where L_a must become singular.
    println!("\nOperator conditioning  (L_a singular values / condition number):");
    println!(
        "{:<22}  {:>10}  {:>10}  {:>10}  {:>12}",
        "state", "σ_min", "σ_max", "κ(L_a)", "zd_dist"
    );

    let nominal = {
        let mut c = [0.0f32; 16];
        c[0] = 1.0; // unit scalar (attitude identity)
        c[4] = 0.3; // some velocity
        c[7] = 0.5; // some position
        Sedenion::new(c)
    };
    let zd = {
        let mut c = [0.0f32; 16];
        c[3] = 1.0;
        c[10] = 1.0; // e3 + e10 : a known zero divisor
        Sedenion::new(c)
    };
    for (name, s) in [("nominal nav state", nominal), ("zero divisor e3+e10", zd)] {
        let d = operator_diagnostics(&s);
        println!(
            "{:<22}  {:>10.4}  {:>10.4}  {:>10.3}  {:>12.2e}",
            name, d.sigma_min, d.sigma_max, d.kappa, d.zd_dist
        );
    }
}
