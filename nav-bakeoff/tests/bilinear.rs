//! Guardrails for the bilinear-residual harness.

use nav_bakeoff::bilinear::{
    attitude_block_residual, generators, operator_diagnostics, reachable_dim, residual,
    strapdown_coupling,
};
use sedenion::Sedenion;

/// The harness must be self-consistent: the attitude block lives exactly in the
/// quaternion operators, so its isolated residual is ~0. If this regresses, the
/// projection or the operator matrices are wrong and no other number can be
/// trusted.
#[test]
fn attitude_block_is_quaternion_native() {
    let r = attitude_block_residual([0.3, -0.2, 0.15]);
    assert!(
        r < 1e-5,
        "attitude block should be quaternion-native, got ρ={r}"
    );
}

/// The full strapdown coupling must NOT lie in the sedenion-reachable subspace:
/// this is the whole finding. (Loose bound so it documents the effect without
/// being brittle to the exact value.)
#[test]
fn full_coupling_is_mostly_outside_the_algebra() {
    let a = strapdown_coupling([0.35, 0.28, 0.37]);
    let r = residual(&a, &generators(16));
    assert!(r.rho > 0.5, "expected large residual, got ρ_full={}", r.rho);
    assert!(r.rho <= 1.0 + 1e-9);
}

/// Off-quaternion generators add little: Δρ between quaternion-gen and full is
/// small. Confirms 𝕊 ≈ ℍ ⊕ ℝ¹² for this physics.
#[test]
fn off_quaternion_generators_add_little() {
    let a = strapdown_coupling([0.35, 0.28, 0.37]);
    let rf = residual(&a, &generators(16)).rho;
    let rq = residual(&a, &generators(4)).rho;
    assert!(rq - rf >= -1e-9, "expected rq >= rf; Δρ={}", rq - rf);
    assert!(
        rq - rf < 0.1,
        "off-quaternion gens unexpectedly valuable: Δρ={}",
        rq - rf
    );
}

/// Reachable subspace dimensions are the documented invariants.
#[test]
fn reachable_dimensions() {
    assert_eq!(reachable_dim(&generators(16)), 31);
    assert_eq!(reachable_dim(&generators(4)), 7);
}

/// A zero divisor's left-multiplication operator must be singular — a blind direction and a conditioning hazard.
#[test]
fn zero_divisor_operator_is_singular() {
    let mut c = [0.0f32; 16];
    c[3] = 1.0;
    c[10] = 1.0; // e3 + e10
    let s = Sedenion::new(c);
    let d = operator_diagnostics(&s);
    assert!(
        d.sigma_min < 1e-4,
        "zero divisor L_a should be singular, σ_min={}",
        d.sigma_min
    );
}
