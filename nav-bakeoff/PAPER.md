# Sedenion Algebra as a Constrained Bilinear Operator Framework for GPS-Denied Inertial Navigation: A Corrected Theory and Empirical Assessment

> **Reproducibility note.** Every quantitative claim in this paper is generated
> by code in this repository. The bakeoff numbers come from
> `cargo run --release --bin nav-bakeoff` (and `... -- 16 300 --duffing`);
> the projection
> residual and operator diagnostics come from
> `cargo run --release --bin bilinear-probe`; the algebraic facts
> are checked by `cargo test` in the `sedenion` crate. A claim-to-artifact map is
> given in Appendix A. Where this draft previously cited round numbers that did
> not match the harness, the numbers have been replaced with the measured values.

## Abstract

GPS-denied inertial navigation with low-cost MEMS IMUs has motivated proposals
that sedenion algebra — a 16-dimensional nonassociative hypercomplex system — can
automatically encode the cross-domain couplings (thermal, vibrational, nonlinear)
that rigid-body-on-manifold estimators must introduce by hand. This paper subjects
that claim to rigorous validation through mathematical proof and controlled
experiment against a classical UKF-M baseline. First, a nondimensionalization
protocol is established that renders all sedenion state components dimensionless,
resolving the physical inconsistency of prior formulations. Second, three
mathematical overclaims from the unpublished prior art are corrected: centripetal
acceleration requires a double commutator, not a raw product; the matrix
exponential `exp(L_a)` converges absolutely for all left-multiplication operators;
and zero divisors annihilate subspaces indiscriminately, possessing no
anti-jamming selectivity. Third, a zero-divisor condition-number diagnostic is
introduced as a filter-health indicator. Fourth, an empirical bakeoff comparing a
sedenion-augmented tangent-state UKF against a classical UKF-M baseline reveals a
projection residual **ρ ≈ 0.90–0.96 (mean ≈ 0.93)** for the strapdown kinematic
coupling — the algebra captures **less than ~10%** of that coupling. In aided
navigation with 30-second position fixes, activating sedenion cross-coupling
(λ = 1) degrades position RMSE from 20.8 m to 35.0 m (+68%); the Duffing-nonlinear
variant degrades from 19.4 m to 23.1 m (+19%). The optimum is always λ\* = 0. The
evidence supports a scoped conclusion: sedenions may serve as constrained bilinear
operator templates for data-driven dynamics learning, but they do not improve
navigation accuracy over established manifold estimators.

---

## 1. Introduction

### 1.1 Background and Motivation

**1.1.1 Classical INS state estimation on S³ × ℝ¹² and the rigid-body assumption.**
GPS-denied inertial navigation is a foundational problem in aerospace, robotics,
and sovereign positioning systems. When satellite signals are unavailable — whether
due to intentional jamming, spoofing, or physical obstruction — a platform must
estimate its position, velocity, and attitude (PVA) from self-contained inertial
measurements alone. The canonical estimator is the multiplicative or error-state
Unscented Kalman Filter (UKF) operating on the manifold **S³ × ℝ¹²**, where unit
quaternions represent attitude on the three-sphere and ℝ¹² subsumes position,
velocity, gyroscope bias, and accelerometer bias. This architecture treats the
sensor assembly as a rigid body whose motion is governed by the strapdown inertial
navigation equations: the transport equation with Earth-rate and transport-rate
Coriolis terms, plus gravity compensation.

The rigid-body-on-manifold abstraction is mathematically elegant and
computationally tractable. Attitude evolves on S³ via quaternion multiplication, a
group action; position and velocity evolve in Euclidean space; and the combined
state space inherits a clean geometric structure that permits well-defined
retractions, tangent-space updates, and covariance propagation. The retraction
`X_{k+1} = X_k ⊕ δX_k` maps a tangent-space update back to the manifold,
preserving the unit-norm constraint on the quaternion and the Euclidean structure
of the remaining states. For navigation-grade IMUs whose sensor errors are
dominated by well-calibrated bias and scale-factor instabilities, this framework
yields sub-meter-per-hour navigation accuracy.

However, the rigid-body assumption presumes that the IMU case and the sensed
element move as a single undeformable body, that thermal transients affect only
scalar bias drift, and that vibration acts as a zero-mean stochastic disturbance.
These assumptions are progressively violated as sensor cost decreases and operating
environments become more aggressive. The sensed element — a micromachined silicon
proof mass suspended by flexures — does not move rigidly with respect to the case;
it flexes, resonates, and thermally expands in ways incompatible with the
S³ × ℝ¹² abstraction.

**1.1.2 MEMS IMU error physics.** Three phenomena are particularly problematic.
*Thermo-mechanical coupling:* silicon's elastic modulus varies at ≈ −60 ppm/K, so
temperature gradients across the die create coupled drift in both scale factor and
bias that no scalar temperature-compensation model captures [@leland2005mechanical;
@lifshitz2000thermoelastic; @elsheimy2020inertial]. *Duffing
nonlinearity:* the drive and sense modes of a MEMS vibratory gyroscope follow a
Duffing oscillator with cubic stiffness [@acar2009mems],

```
ẍ + 2ζω₀ẋ + ω₀²x + α_D x³ = f_d(t),
```

so that beyond ~10–15% of the capacitive gap the cubic term rectifies into apparent
bias shifts. *Vibration rectification (VRE):* through scale-factor nonlinearity and
asymmetric clipping, off-resonance vibration produces a quasi-stationary bias that
is a deterministic function of vibration amplitude and frequency. All three share a
structural feature: they are **cross-domain couplings**, and S³ × ℝ¹² has no
natural mechanism to encode the bilinear coupling between, say, vibration amplitude
squared and bias walk rate.

**1.1.3 The accuracy plateau.** For consumer-grade MEMS in pure dead reckoning,
position drift from a constant accelerometer bias grows as t² (and gyro-bias
coupling adds a t³ term). Aiding — ZUPT [@foxlin2005pedestrian], VIO
[@forster2017onmanifold], terrain-relative navigation — suppresses
this to linear or sub-linear drift, but the residual aided error is often dominated
by the cross-domain couplings above. The central question of this paper is whether
sedenion algebra can serve as a representation reflecting that structure without
sacrificing the geometric rigor of manifold-based filtering.

### 1.2 Research Gap and Problem Statement

**1.2.1 Prior sedenion proposals claim automatic cross-domain coupling.** The
sedenions 𝕊 form the 16-dimensional Cayley-Dickson algebra obtained by doubling the
octonions. They are noncommutative, nonassociative, power-associative, and contain
zero divisors. Prior (unpublished) work argues that the Cayley-Dickson product
`X₁X₂` generates cross terms between all component pairs and that this algebraic
richness automatically encodes the physical couplings — Coriolis, centripetal,
thermo-mechanical, vibration-rectification — that rigid-body frameworks introduce by
hand.

**1.2.2 Three specific overclaims.**
- *Overclaim 1 — automatic centripetal generation.* The raw sedenion product of an
  angular-rate component and a position component is claimed to yield ω×(ω×r). In
  fact the product of two pure vectors yields a single cross product ω×r (the
  Coriolis shape), not the centripetal term, which requires a double commutator.
- *Overclaim 2 — matrix-exponential failure.* `exp(L_Ω)` is claimed to "fail to
  converge" due to nonassociativity. `L_Ω` is an ordinary 16×16 real matrix; its
  exponential converges for any matrix. What nonassociativity implies is
  `L_Ω² ≠ L_{Ω²}`.
- *Overclaim 3 — zero divisors as anti-jamming sinks.* Zero divisors are claimed to
  selectively absorb hostile signal. They annihilate subspaces indiscriminately:
  `L_a` is rank-deficient and destroys all information in its kernel, with no way
  to distinguish jamming from navigation signal.

Each arises from conflating algebraic structure with physical dynamics. The
Cayley-Dickson product generates bilinear forms; those forms carry no physical
meaning until dimensional consistency, frame conventions, and coefficients are
specified.

**1.2.3 No empirical validation protocol exists.** No published work defines how to
test whether a sedenion filter beats a classical manifold UKF — what metrics,
trajectories, or disturbance models. This paper closes that gap with a reproducible,
open-source framework.

### 1.3 Contribution Statement

1. **Nondimensionalized sedenion state-space framework** (§4): explicit scaling by
   `L₀, V₀, Ω₀, A₀, T₀, B_{g0}, B_{a0}` so every sedenion component is
   dimensionless — the prerequisite for any physically meaningful hypercomplex
   product.
2. **Corrections to three overclaims** (§5), with proofs.
3. **Zero-divisor monitoring diagnostic** (§6): condition-number tracking of `L_{X_i}`
   at sigma points, as a filter-health indicator — not an anti-jamming mechanism.
4. **Empirical bakeoff** (§7): a reproducible protocol and Rust implementation. In
   dead reckoning, λ = 0 and λ = 1 produce identical drift; in aided mode λ = 1
   raises RMSE from 20.8 m to 35.0 m. The optimum is always λ\* = 0.
5. **Validated projection-residual metric** (§4, §7): `ρ = ‖A_phys − A_sed‖_F / ‖A_phys‖_F`.
   Measured ρ ≈ 0.90–0.96 for the strapdown kinematic coupling, i.e. the algebra
   captures less than ~10% of it.

### 1.4 Paper Organization

§2 reviews manifold-based navigation, MEMS error physics, and hypercomplex
proposals. §3 develops sedenion preliminaries. §4 gives the state space and
nondimensionalization. §5 proves the three corrections. §6 describes the filter
architecture and the zero-divisor diagnostic. §7 presents the empirical bakeoff. §8
discusses scope. §9 concludes. Appendix A maps claims to code.

---

## 2. Related Work

### 2.1 Strapdown Inertial Navigation and State Estimation

**Quaternion kinematics and the transport equation on S³.** The canonical state
space is S³ × ℝ¹² [@titterton2004strapdown; @groves2013principles]. The quaternion
kinematic equation `q̇ = ½ q ⊗ ω_ib^b` governs
rigid-body attitude and preserves ‖q‖ = 1 when integrated with norm correction or
via the exponential map `exp_q : so(3) → S³`. The navigation-frame velocity follows
the transport equation

```
v̇ⁿ = C_b^n fᵇ − (2 ω_ie^n + ω_en^n) × vⁿ + g_lⁿ,                         (1)
```

whose coefficient 2 on the Earth-rate term and frame-dependent transport rate
ω_en^n encode specific physical assumptions about rotating frames — not algebraic
identities [@markley2003attitude]. Quaternion estimation differs fundamentally from
attitude estimation on
SO(3) because of the double cover S³ ↠ SO(3); sigma-point filters on the quaternion
manifold outperform additive formulations when attitude deviation is large
[@crassidis2003unscented].

**Error-state (multiplicative) EKF/UKF.** The multiplicative filter keeps a nominal
state and estimates a small error `δx = (δθ, δv, δr, δb_g, δb_a) ∈ ℝ¹⁵` in the
tangent space, with `q⁺ = q̄ ⊗ exp_q(δθ/2)` and additive updates elsewhere
[@markley2003attitude; @sola2018micro]. The
Invariant EKF, exploiting Lie-group symmetry, has trajectory-independent
convergence guarantees [@barrau2017invariant]. Any alternative algebraic formulation
must either recover these guarantees or empirically justify their loss.

**UKF on Manifolds (UKF-M).** UKF-M [@brossard2020ukfm] separates the state manifold
M from tangent
operations: sigma points are sampled in the Lie algebra, propagated, and retracted
via a user-specified retraction. It is the de facto benchmark. It requires a
manifold with a well-defined exponential map; sedenion algebra lacks this (the unit
sedenions form S¹⁵ as a set, not a group), and therefore cannot directly
instantiate the UKF-M abstraction.

### 2.2 Hypercomplex Algebras in Navigation and Physics

**Quaternions** ℍ are the canonical success [@conway2003quaternions]: unit
quaternions form a compact Lie
group double-covering SO(3); for pure quaternions `u♯v♯ = (−uᵀv, u×v)♯`,
simultaneously the dot and cross products. They are associative and a division
algebra. Every navigation-grade attitude estimator exploits associativity (rotation
composition), invertibility (error-state definition), or the Lie-group structure
(exponential map).

**Dual quaternions** ℍ_d represent SE(3) pose with two degrees of redundancy and,
crucially, retain associativity and a clear Lie-group structure — properties
sedenions lack [@goddard1997pose; @kavan2008geometric; @srivatsan2016estimating;
@blanco2010tutorial].

**Octonions** 𝕆 are the largest normed division algebra (Hurwitz)
[@conway2003quaternions; @baez2002octonions]. Despite rich
mathematical structure, no satisfactory octonionic mechanics exists: nonassociativity
alone obstructs a consistent Hilbert-space/operator formulation
[@okubo1995octonion; @schafer1966nonassociative]. Even with no zero
divisors, nonassociativity suffices to block direct application. Sedenions inherit
this and add zero divisors.

**Sedenions** 𝕊 contain subalgebras isomorphic to ℝ, ℂ, ℍ, 𝕆 and a quasi-octonion
algebra carrying the zero divisors; there are 84 standard zero-divisor pairs in the
canonical basis [@cawagas2004sedenion; @imaeda2000sedenions]. The zero-divisor set is
isometric to the exceptional Lie group G₂ [@moreno1998zero; @biss2008large].
When a sedenion `a` approaches a zero divisor, `L_a` becomes singular and `ax = b`
loses unique solutions. Sedenions exhibit asymmetric associativity and retain only
power-associativity. Prior claims that they "naturally encode" navigation dynamics
confuse Cayley-Dickson bilinear terms with frame-dependent physical couplings.

### 2.3 MEMS IMU Error Modeling

**Duffing nonlinearity and vibration rectification.** The sense-axis dynamics obey
`m ẍ + c ẋ + k₁x + k₃x³ = F_drive + F_Coriolis + F_vibration`, with k₃
temperature-dependent [@acar2009mems]. Measured vibration-rectification coefficients
of 10–100
deg/h per g² are reported in consumer MEMS; high-frequency vibration converts to
low-frequency bias through the cubic nonlinearity.

**Thermo-mechanical coupling.** Bias temperature sensitivity follows
`Δb_g(T) = α_{g1}ΔT + α_{g2}(ΔT)² + β_g ∇T`, with thermal time constants spanning
die (~0.5–5 s), package (~30–300 s), and system (~100–1000 s) scales
[@leland2005mechanical; @lifshitz2000thermoelastic; @elsheimy2020inertial].

**Extended-state estimators** augment the classical state with thermal and Duffing
states. No unified algebraic framework couples these domains automatically; whether
the Cayley-Dickson product reproduces them with correct coefficients is the
empirical question §7 answers.

### 2.4 Positioning Against Prior Work

| Dimension | Classical UKF-M | Prior Sedenion Proposals | This Framework |
|---|---|---|---|
| Manifold structure | S³ × ℝ¹², Lie group S³ | Claims unit sedenions as "S¹⁵ manifold" | Sedenion operators in ℝ¹⁶ vector space, **not** a state manifold |
| Physical coupling | Hand-crafted F_nonlinear | Claims algebra "encodes" Coriolis/centripetal | Bilinear templates; residual ρ quantifies mismatch |
| Nondimensionalization | Implicit per-state units | None | Explicit; all 16 components dimensionless |
| Zero-divisor handling | N/A | Ignored or "anti-jamming sinks" | κ(L_{X_i}) tracked as health diagnostic |
| Validation | UKF-M with NEES/NIS | Anecdotal plots | Operator projection + UKF consistency + matched bakeoff |
| Empirical results | Proven across IMU grades | No reproducible benchmark | Controlled comparison with vibration/thermal profiles |

This paper's stance: sedenion algebra serves not as the state manifold but as a
source of bilinear operator templates `L_a ∈ ℝ¹⁶ˣ¹⁶`, compared against
first-principles physics via ρ, with nondimensionalization for consistency and
condition-number monitoring for safety.

---

## 3. Sedenion Algebra: Rigorous Preliminaries

### 3.1 Cayley-Dickson Construction and Algebraic Properties

**Doubling construction.** With 𝕆 the octonions, 𝕊 = 𝕆 × 𝕆 with

```
(a, b)(c, d) = (ac − d*b, da + bc*),                                       (1)
```

`*` octonion conjugation, real unit e₀ = (1,0), sedenion conjugate
`(a,b)* = (a*, −b)` [@schafer1966nonassociative; @baez2002octonions]. A sedenion is
`x = Σ_{i=0}^{15} x_i e_i`, with Euclidean norm
`|x| = (Σ x_i²)^{1/2}`. Multiplication is *nicely normed* (`xx* = |x|² e₀`), so every
nonzero sedenion has inverse `x⁻¹ = x*/|x|²`; but the norm is **not** multiplicative
(the Hurwitz theorem [@conway2003quaternions] permits a multiplicative norm only up
to dimension 8) — nonzero `x, y` with `xy = 0` exist (§3.4), so 𝕊 is not a division
algebra.

**Property comparison.**

| Property | ℂ | ℍ | 𝕆 | 𝕊 |
|---|---|---|---|---|
| Dimension over ℝ | 2 | 4 | 8 | 16 |
| Commutative | Yes | No | No | No |
| Associative | Yes | Yes | No | No |
| Alternative | Yes | Yes | Yes | No |
| Power-associative | Yes | Yes | Yes | Yes |
| Normed division algebra | Yes | Yes | Yes | No |
| Zero divisors | No | No | No | Yes |

Power-associativity persists: the subalgebra generated by any single element is
associative, so single-generator dynamics (repeated application of one operator)
are well-defined despite global non-associativity. The loss of the
normed-division-algebra property is the most consequential change for filter design.

**Structure constants.** `e_i e_j = Σ_k γ_{ijk} e_k` with γ ∈ {−1,0,+1}, sparse (at
most one nonzero γ per pair), antisymmetric for imaginary indices.

### 3.2 Matrix Representations

**Left multiplication** `L_a : x ↦ ax`, with `L_a = Σ_i a_i L_{e_i}` where each
`L_{e_i}` is a signed permutation matrix. For pure-imaginary `a` (Re a = 0), `L_a`
is **skew-symmetric** (`L_aᵀ = −L_a`), so `exp(L_a t) ∈ SO(16)` for frozen `a`. (In
the implementation, `Sedenion::left_mul_matrix()` builds `L_a` column-by-column from
the product; `cargo test` verifies `L_a·b = a·b`, the skew property for imaginary
generators, and the adjoint identity `L_aᵀ = L_{ā}`.)

**Right multiplication** `R_a : x ↦ xa`, with `R_{e_i} = L_{e_i}ᵀ` for i ≥ 1. Since
𝕊 is noncommutative, `L_a ≠ R_a`, and both appear in the kinematic template.

**Jordan-like operator** `C_a = [L_a, R_a]`. In an associative algebra `C_a = 0`; in
𝕊 it is generically nonzero and quadratic in `a`, the algebraic source of bilinear
cross-coupling.

### 3.3 The Matrix Exponential: A Corrected Treatment

**Proposition 1 (convergence).** For any `a ∈ 𝕊`, `exp(L_a) = Σ_{k≥0} L_a^k / k!`
converges absolutely in ℝ¹⁶ˣ¹⁶. *Proof.* `L_a` is an ordinary real matrix;
`Σ ‖L_a‖^k/k! = e^{‖L_a‖} < ∞` by the Weierstrass M-test. The algebraic structure
of 𝕊 plays no role. ∎

The prior confusion conflated the *algebraic* power `a^k` with the *matrix* power
`L_a^k = L_a ∘ ⋯ ∘ L_a` (composition of linear operators, always associative). What
non-associativity actually implies is the failure of the homomorphism property:

```
L_a² x = a(ax) ≠ (aa)x = L_{a²} x   for generic a, x.                       (6)
```

**Proposition 2 (norm preservation).** For Re(a) = 0, `exp(L_a) ∈ SO(16)`. *Proof.*
`L_aᵀ = −L_a ⇒ exp(L_a)ᵀ exp(L_a) = I` and `det = e^{tr L_a} = 1`. ∎ This preserves
the full S¹⁵ sphere, but — because 𝕊 is not a group — not any physical subgroup.

### 3.4 Zero Divisors

**A verified pair.** Under the standard basis,

```
(e₃ + e₁₀)(e₆ − e₁₅) = 0.                                                   (7)
```

(`cargo test test_zero_divisor` checks exactly this.) The zero-divisor set is a
positive-measure 21-dimensional submanifold of the 32-dimensional product space
[@moreno1998zero; @biss2008large; @cawagas2004sedenion] — pervasive, not pathological.

**Proposition 3 (rank deficiency).** If `a` is a left zero divisor, `rank(L_a) < 16`.
*Proof.* `L_a b = 0` with `b ≠ 0` gives a nontrivial kernel; rank-nullity. ∎ For
`a = e₃ + e₁₀`, `rank(L_a) = 12` (4-dimensional kernel). The implementation confirms
the operator is singular (`σ_min = 0`, `zero_divisor_operator_is_singular`).

**Annihilator.** `Ann_L(a) = ker L_a`. If the state lies in `Ann_L(Ω)`, the dynamics
`ṡ = Ωs` vanish regardless of `|Ω|` — a "freezing" with no quaternion analogue.

---

## 4. Physical State Space and Nondimensionalization

### 4.1 The Extended Navigation State

**Classical INS state.** `x = (q, vⁿ, rⁿ, b_g, b_a) ∈ S³ × ℝ¹²`, with kinematics
`q̇ = ½ q ⊗ ω_ib^b`, the transport equation (1), `ṙⁿ = vⁿ`, and bias random walks
`ḃ_g = w_{bg}`, `ḃ_a = w_{ba}`. This 15-dimensional state is the canonical
error-state/UKF-M formulation.

**Extended state.** For MEMS,
`x_ext = (q, vⁿ, rⁿ, b_g, b_a, ΔT, Ṫ, δ_Duff)`, adding temperature deviation, its
rate, and a Duffing displacement state. Thermal bias follows
`Δb_g(T) = α_{g1}ΔT + α_{g2}(ΔT)² + β_g∇T`; temperature obeys first-order dynamics
with time constant τ_th; the Duffing sense axis obeys
`m ẍ + c ẋ + k₁x + k₃x³ = F_drive + F_Coriolis + F_vibration`, rectifying into
`b_rect = Σ_i γ_i a_{vib,i}²/ω_{vib,i}² + cross-terms`. The complete physically
correct model composes the kinematic and the thermal/Duffing equations.

### 4.2 Nondimensionalization Protocol

Seven scales (Buckingham Pi) render the state dimensionless:

| Scale | Symbol | Typical (tactical MEMS) |
|---|---|---|
| Length | L₀ | 10³–10⁴ m |
| Velocity | V₀ | 10¹–10² m/s |
| Angular rate | Ω₀ | 10⁻¹–10⁰ rad/s |
| Specific force | A₀ | 10⁰–10¹ m/s² |
| Temperature | T₀ | 10¹–10² K |
| Gyro bias | B_{g0} | 10⁻³–10⁻² rad/s |
| Accel bias | B_{a0} | 10⁻¹–10⁰ m/s² |

with time scale `τ₀ = L₀/V₀`. The dimensionless state uses
`r̄ = rⁿ/L₀`, `v̄ = vⁿ/V₀`, etc.; the quaternion is already dimensionless. The
dimensionless velocity equation,

```
v̄̇ = (A₀L₀/V₀²) f̄ⁿ − (L₀/V₀)(2 ω_ie^n + ω_en^n) × v̄ + (L₀/V₀²) g_lⁿ,    (15)
```

has only dimensionless-group coefficients (a navigation Froude number A₀L₀/V₀², etc.).

**Why this is necessary.** The Cayley-Dickson product forms combinations
`Σ a_i b_j (e_i e_j)` with purely numerical structure constants. If `a, b` carry
mixed physical units, output components sum incompatible quantities (e.g. m²/s plus
m·rad/s²). Only after nondimensionalization is every product/sum on pure numbers,
and every coefficient in the process model has units of inverse dimensionless time.
With natural scaling `L₀ = V₀/Ω₀`, the kinematic blocks become O(1)·ω̄ or O(1)·ω̄²
and directly comparable — this is the scaling used by the `bilinear-probe`.

### 4.3 What the Algebra Provides vs. What Physics Requires

**Constrained bilinear approximation.** The sedenion approximation to the
dimensionless process model is

```
s̄̇ ≈ P(L_Ω̄ s̄ + R_Γ̄ s̄ + [L_Λ̄ − R_Λ̄] s̄) + F̄_nonlinear,                (18)
```

with P a projection to the physical components and F̄_nonlinear carrying everything
the bilinear algebra cannot reproduce — the quadratic thermal terms, the cubic
Duffing term, and the Earth-rate transport terms with their specific coefficients.
The operators produce the *shape* of a cross product (e.g. ω̄ × v̄) but not the
coefficient 2, the Earth-rate vector, or the frame.

**Projection residual.** With `A_phys` the linearized dimensionless dynamics and
`A_sedenion` the linearized bilinear template,

```
ρ = ‖A_phys − A_sedenion‖_F / ‖A_phys‖_F.                                  (19)
```

Because the reachable set of the template is the linear subspace
`O = span{L_{e_k}, R_{e_k}}`, ρ is exactly the relative Frobenius distance from
`A_phys` to `O`, computed by orthogonal projection (`bilinear-probe`). Three regimes:
**I** (ρ ≪ 1) the algebra is a compact basis for the coupling; **II** (ρ ∼ 1) the
nonlinear forcing carries the physics and the operators add cost without accuracy;
**III** (ρ ≫ 1) spurious dynamics, to be avoided via condition-number monitoring.
The central empirical question (§7) is which regime a real MEMS coupling inhabits.

---

## 5. Corrected Derivations: Three Prior Overclaims

All three corrections flow from one principle: once `a` is represented by
`L_a ∈ ℝ¹⁶ˣ¹⁶`, standard linear algebra applies, but interpreting the result as a
*physical* quantity requires external frame definitions, explicit coefficient
matching, and subspace analysis.

### 5.1 Overclaim 1: the raw product does not derive centripetal acceleration

For pure quaternions `u♯ = (0,u)`, `v♯ = (0,v)`,

```
u♯ v♯ = (−uᵀv, u×v)♯.                                                       (10)
```

The vector part is a **single** cross product — the Coriolis shape, not centripetal,
and without the coefficient 2. The centripetal term appears only inside a **double
commutator**:

```
[u♯, v♯] = (0, 2 u×v)♯,
[ω♯, [ω♯, r♯]] = (0, 4 ω×(ω×r))♯.                                          (12)
```

i.e. centripetal acceleration appears as one factor in a double commutator and even
then carries a prefactor 4. The Coriolis coefficient 2 and the Earth-rate/transport
vectors are kinematic consequences of differentiating in a rotating frame; the
algebra has no knowledge of them. **Corrected statement:** quaternionic subalgebras
generate Coriolis- and centripetal-*shaped* terms through iterated commutators and
projection, not through the raw product; coefficients and frames must be supplied by
the embedding Φ.

### 5.2 Overclaim 2: matrix exponentials do not fail

For any `Ω ∈ 𝕊`, `exp(L_Ω Δt) = I + L_Ω Δt + ½ L_Ω² Δt² + ⋯` converges absolutely
(Proposition 1), and for Re(Ω) = 0 it lies in SO(16). The genuine consequence of
non-associativity is `L_Ω² ≠ L_{Ω²}` — the series squares `L_Ω` as a *matrix*, never
requiring it to equal the operator of the algebraic square. **Corrected statement:**
`exp(L_Ω Δt)` is well-defined, convergent, and exactly solves `ṡ = L_Ω s` for frozen
Ω; for time-varying Ω(t) use the time-ordered exponential / per-substep matrix
reconstruction, exactly as in standard strapdown integration. (The implementation's
`test_left_mul_is_not_homomorphism` and `test_pure_imaginary_generates_skew`
demonstrate both halves.)

### 5.3 Overclaim 3: zero divisors are blind directions, not anti-jamming sinks

`L_z` for a zero divisor `z` is singular; its kernel `Ann(z)` is annihilated
**regardless of physical origin** — it cannot distinguish hostile vibration from the
velocity component needed for navigation, a calibration excitation, or a crucial
innovation. The honest description is a **state-dependent blind direction**
`B(z,x) = Φ⁻¹(Ann(z) ∩ Φ(X))`. Safe use as a *robustness* mechanism requires three
preconditions: (i) observability checks (the projection must not drop the
observability-Gramian rank); (ii) residual gating (reject the projection when the
pre-projection residual is large); (iii) a proof that the navigation-relevant
subspace does not intersect `B(z,x)` over the operating envelope. Without all three,
a zero-divisor projection is self-blinding. **Corrected statement:** zero divisors
create state-dependent blind directions; safe usage requires observability
verification, residual gating, proof of an empty navigation/blind intersection, and
condition-number monitoring (§6).

---

## 6. Filter Design: Tangent-State UKF with Sedenion Operators

The filter is a tangent-state UKF on the **classical** manifold S³ × ℝ¹², with
sedenion operators evaluated only inside the process model as bilinear templates —
never as sigma-point generators.

### 6.1 Why S¹⁵ Is Not the State Manifold

The unit sedenions form S¹⁵ as a smooth set but **not a group** under
multiplication: 𝕊 is not alternative, has zero divisors, and a non-multiplicative
norm. Hence no Lie algebra, no homomorphism-preserving exponential, no
UKF-M-compatible retraction. The flow `exp(L_Ω t)` preserves Euclidean norm on S¹⁵
but mixes all 16 coordinates and does not respect the S³ subgroup; a unit sedenion
need not correspond to any valid `(q, v, r, b_g, b_a)`. Attitude must still use the
quaternion retraction `q⁺ = q̄ ⊗ exp_q(½ δθ)`.

### 6.2 Proposed Filter Structure

Error state `δx = (δθ, δv, δr, δb_g, δb_a) ∈ ℝ¹⁵`; sigma points in the tangent space
via the standard unscented transform; retraction multiplicative for attitude and
additive elsewhere. After retraction, each full state is encoded `s_i = Φ(x_i)`, the
bilinear term `ṡ_i^(sed) = L_{Ω(s_i)} s_i` is evaluated and compared to the physical
model via ρ, and the predicted mean/covariance are formed by the standard
tangent-space weighted sums. This is a direct UKF-M instance; covariance never lives
on S¹⁵.

> **Design vs. benchmarked reduction.** The architecture above is the general
> 15-state filter (attitude + velocity + position + gyro and accel bias; 31 sigma
> points). The empirical bakeoff of §7 exercises a **reduced 9-state instance** —
> velocity, position, accelerometer bias (19 sigma points) — with attitude resolved
> externally and gyro bias excluded, in order to isolate the position channel and
> the accel-bias annihilation claim, which is exactly where the prior art located
> the zero-divisor mechanism. §8.3.1 discusses the scope of this reduction.

**Algorithm 1 (prediction).** Generate tangent sigma points; retract; for each: (a)
encode `s_i = Φ(x_i)`; (b) build `Ω_i = Ω(ω_k − b_{g,i})`; (c) evaluate
`ṡ_i^(sed) = L_{Ω_i} s_i`; (d) evaluate `ẋ_i = F_physics(x_i)`; (e) compute
`ρ_i = ‖ṡ_i^(sed) − ẋ_i‖_F / ‖ẋ_i‖_F`; (f) flag if `ρ_i > ρ_max`; (g) propagate.
Then form the weighted-retraction mean and the tangent covariance plus Q. The only
addition to UKF-M is steps (a)–(f).

### 6.3 Why the Sedenion-Manifold Proposal Is Incorrect

The prior rule `X_i = exp(L_{Δ_i}) s̄` fails four necessary retraction conditions:
**C1 (manifold membership)** — `exp(L_Δ) ∈ SO(16)` maps off Φ(M) almost everywhere;
**C2 (tangent spanning)** — `L_Δ s̄` spans `T_{s̄}S¹⁵ ⊋ T_{s̄}Φ(M)`, producing
unphysical directions; **C3 (local inverse)** — no closed-form inverse, since
non-associativity blocks `exp(L_{Δ₁})exp(L_{Δ₂}) = exp(L_{Δ₁⊕Δ₂})`; **C4
(zero-divisor safety)** — `L_{X_i}` drops rank near the 84 zero-divisor families,
making the innovation covariance rank-deficient. The tangent-state UKF satisfies all
four by construction.

### 6.4 Zero-Divisor Condition-Number Diagnostic

After generating sigma points, compute `κ_i = κ(L_{X_i}) = σ_max/σ_min`. If
`max_i κ_i` exceeds a threshold (10⁶ single precision, 10¹² double), log a
zero-divisor proximity event and switch to safe mode (reject the step or inflate
process noise along compressed directions). Cost is negligible versus the O(n³)
Cholesky. This is a health indicator, not an anti-jamming feature.
(`operator_diagnostics` returns σ_min, σ_max, κ, and zero-divisor distance; at a
nominal state κ(L_a) = 1.0, while at `e₃+e₁₀` σ_min = 0 and κ = ∞.)

---

## 7. Empirical Validation: The Navigation Bakeoff

### 7.1 Experimental Design

The baseline UKF and the Sedenion UKF (SUKF) share every component except the state
representation: identical strapdown mechanization, sigma-point strategy (κ = 0,
α = 10⁻³, β = 2), and process-noise tuning. The baseline operates directly on the
**9-dimensional tangent state (δv, δr, δb_a)** — velocity, position, and
accelerometer bias — with attitude resolved externally and gyro bias excluded. The
SUKF embeds this state into the sedenion slot map, applies the Cayley-Dickson
product inside the process model, and applies the zero-divisor-aware (ZDA)
projection `Π_λ` (defined below in §7, operationalized in `filters.rs`).

The ZDA projection is a convex combination controlled by `λ ∈ [0,1]`: λ = 0 disables
the sedenion machinery (and is bit-identical to the baseline, enforced by a test);
λ = 1 forces the bias estimate onto the position subspace at every step. If the
sedenion structure conveys any benefit, there is some λ\* > 0 minimizing RMSE. The
finding that λ\* = 0 everywhere is the central result.

Two guardrails: noise-free integration dead-reckons with sub-millimetre error over
100 s (`noise_free_baseline_does_not_drift`); and SUKF at λ = 0 is bit-identical to
the baseline (`sukf_lambda_zero_equals_baseline`).

### 7.2 Simulation Parameters

300-second trajectory at 50 Hz over 16 seeds; accelerations to 2 m/s², turn rates to
15 deg/s. MEMS model: accelerometer white noise 0.05 m/s²/√Hz, bias random walk
0.002 m/s²/√Hz, initial accel bias N(0, (0.02 m/s²)²) (~2 mg); gyro errors one order
smaller. Two modes: pure dead reckoning, and aided (position fix every 30 s, σ = 5
m). A Duffing variant adds cubic stiffness contributing ~10% of the restoring force
at peak amplitude.

### 7.3 Results

**Linear MEMS — horizontal position RMSE (m).** Dead-reckoning errors follow the
characteristic t² growth of a double-integrated constant accelerometer bias and are
identical across all λ; in aided mode λ = 1 degrades terminal accuracy by +68%.

| Estimator | t=10 s | t=30 s | t=60 s | t=120 s | t=300 s |
|---|--:|--:|--:|--:|--:|
| *Dead-reckoning (no aiding)* | | | | | |
| Baseline UKF | 1.4 | 12.0 | 48.8 | 199.0 | 1,346.8 |
| SUKF λ=0.00 | 1.4 | 12.0 | 48.8 | 199.0 | 1,346.8 |
| SUKF λ=1.00 | 1.4 | 12.0 | 48.8 | 199.0 | 1,346.8 |
| *Aided (30 s fix, σ=5 m)* | | | | | |
| Baseline UKF | 1.4 | 6.7 | 7.7 | 7.8 | 20.8 |
| SUKF λ=0.00 | 1.4 | 6.7 | 7.7 | 7.8 | 20.8 |
| SUKF λ=1.00 | 1.4 | 6.7 | 7.7 | 8.0 | 35.0 |

The dead-reckoning identity is an information-theoretic constraint, not a bug:
accelerometer bias is unobservable without aiding, so the bias estimate stays at its
prior and the error is the true, double-integrated bias. No change of state algebra
recovers information the measurements do not contain.

**Duffing-nonlinear MEMS — RMSE (m).** Same pattern; λ = 1 degrades by +19%.

| Estimator | t=60 s | t=120 s | t=300 s |
|---|--:|--:|--:|
| *Dead-reckoning* | | | |
| Baseline UKF | 45.2 | 171.8 | 962.5 |
| SUKF λ=1.00 | 45.2 | 171.8 | 962.5 |
| *Aided* | | | |
| Baseline UKF | 7.7 | 7.7 | 19.4 |
| SUKF λ=1.00 | 7.7 | 7.9 | 23.1 |

**Projection residual (strapdown kinematic coupling).** `bilinear-probe` projects
the nondimensionalized strapdown coupling `A(ω̄)` (attitude kinematics, Coriolis,
centripetal, transport) onto the sedenion-reachable subspace
`O = span{L_{e_k}, R_{e_k}}` (numerically measured dimension **31** of 256;
quaternion-generator subset, **7**).

| \|ω̄\| | ρ_full | ρ_quat | Δρ | ρ_attitude | ρ_vel+pos |
|--:|--:|--:|--:|--:|--:|
| 0.05 | 0.9593 | 0.9851 | 0.0258 | 4.5036 | 0.9348 |
| 0.10 | 0.9540 | 0.9808 | 0.0268 | 2.5238 | 0.9264 |
| 0.25 | 0.9356 | 0.9628 | 0.0271 | 1.3902 | 0.9002 |
| 0.50 | 0.9118 | 0.9339 | 0.0221 | 1.0469 | 0.8699 |
| 1.00 | 0.9018 | 0.9137 | 0.0119 | 0.8864 | 0.8635 |
| 2.00 | 0.9224 | 0.9281 | 0.0057 | 0.8078 | 0.8980 |

Control: the **attitude block alone**, projected onto the 4×4 quaternion operators,
gives **ρ = 0** — quaternions capture attitude exactly, validating the harness. Thus
**ρ_full ≈ 0.90–0.96 (mean ≈ 0.93)**: the sedenion product captures less than ~10%
of the full strapdown coupling. The off-quaternion generators e₄…e₁₅ add almost
nothing (Δρ ≈ 0.006–0.027), so for this coupling **𝕊 ≈ ℍ ⊕ ℝ¹²**. Note ρ here is
for the *kinematic* coupling; the thermal and Duffing couplings are placed in
F_nonlinear by construction and are not part of `A(ω̄)`.

### 7.4 Interpretation

In dead reckoning, accelerometer bias is in the nullspace of the observability
matrix; the sedenion embedding only rotates the basis of the unobservable subspace.
In aided mode the 30 s fix makes the bias observable; the baseline's Kalman gain
distributes the residual optimally, while the ZDA projection overrides that optimal
gain and discards a correctly-estimated quantity — necessarily increasing error
variance. Hence λ\* = 0 always. The lever that bounds drift is aiding (a factor ~65
improvement over dead reckoning), not the state algebra. When a component is
unobservable, no number system makes it observable; when it is observable, the
standard UKF is already minimum-variance.

---

## 8. Discussion

### 8.1 What Sedenions Can Do

**Bilinear operator templates.** `L_a` systematically enumerates cross-term
interactions; when ρ is small for a weakly-coupled subsystem, the nonzero pattern of
`L_Ω` indicates which components interact and supplies initial coefficient guesses
(the designer still provides correct coefficients, frames, and dissipation).

**Zero-divisor diagnostics.** Real-time `κ(L_{X_i})` monitoring detects when the
machinery has entered an unreliable (near-singular) regime — a side computation
negligible against the O(n³) Cholesky.

**Computational efficiency.** `L_a` is sparse-structured; a double-precision
sedenion is 128 bytes (two cache lines); the product vectorizes under AVX2/NEON.
These matter mainly when the state is augmented with thermal/Duffing states beyond
dimension 15.

### 8.2 What Sedenions Cannot Do

**Replace first-principles physics.** The product does not encode the Coriolis 2,
the transport rate, the Earth-rate vector, or their frames; nor cubic Duffing
physics. For the strapdown kinematic coupling the measured **ρ ≈ 0.90–0.96** means
less than ~10% is captured by the algebra; F_nonlinear carries the remainder. (The
thermal/Duffing couplings sit entirely in F_nonlinear by construction and were not
the subject of the ρ measurement.)

**Serve as a physical state manifold.** S¹⁵ is not a group; the proposed
exponential sigma-point rule fails all four retraction conditions (§6.3). The
navigation manifold remains S³ × ℝ¹² with the quaternion attitude update.

**Automatically reject jamming.** Zero divisors annihilate subspaces
indiscriminately. The condition-number diagnostic detects proximity but cannot
prevent jamming or recover annihilated information.

### 8.3 Limitations of This Study

**8.3.1 Attitude assumed resolved.** The bakeoff isolates the
position/velocity/accel-bias subspace (the 9-state reduction of §6.2), assuming
attitude is resolved by the standard quaternion update. A full 16-state embedding
that propagates attitude through `exp(L_Ω t)` would break the S³ constraint (§6); the
present results show the position/velocity subspace receives no benefit.

**8.3.2 Single ZDA operationalization.** ZDA was the scalar-λ projection of the bias
onto the position direction. More elaborate state-dependent or multi-channel
formulations may degrade less; the burden of proof is on them, and this study
establishes the baseline they must beat.

**8.3.3 Simulation-only.** Idealized error models; real MEMS adds temperature-
dependent scale factor, frequency-dependent VRE, turn-on transients, and cross-axis
coupling. Hardware-in-the-loop validation (thermal shock, vibration table,
controlled jamming) remains necessary.

### 8.4 Implications for Sovereign GPS-Denied Navigation

**Focus effort on aiding.** A 30 s, σ = 5 m fix bounds terminal error at 20.8 m
versus >1,300 m for dead reckoning — a factor ~65 from aiding alone. A vision-aided
INS with a classical UKF outperforms a sedenion-embedded INS without vision by
orders of magnitude. Observability theory predicts this.

**Sedenions may find use in learned dynamics.** As a *constrained bilinear ansatz*
for data-driven (Koopman-style) dynamics [@brunton2016koopman; @korda2018linear],
`L_a` is parameterized by 16 numbers, and
the reachable template space `span{L_{e_k}, R_{e_k}}` has numerically measured
**dimension 31** — more parsimonious than an unconstrained 256-entry bilinear map.
The learning problem: given trajectories and controls, learn Φ_θ and Ω_ψ so that
`ẋ = P(L_{Ω_ψ(x)} Φ_θ(x))` minimizes held-out prediction error, with ρ as the
evaluation metric. This shifts sedenions from the filter (no benefit found) to the
dynamics model (where bilinear structure may regularize learning).

---

## 9. Conclusion

The Cayley-Dickson product does not provide a computationally useful state
representation for GPS-denied inertial navigation, but the framework built to reach
that conclusion yields four reusable contributions.

**Nondimensionalized framework** (§4): seven scales render every sedenion component
dimensionless. **Corrections to three overclaims** (§5): centripetal needs a double
commutator `[ω♯,[ω♯,r♯]] = 4(ω×(ω×r))♯`; `exp(L_Ω)` converges with `L_Ω² ≠ L_{Ω²}`;
zero divisors `(e₃+e₁₀)(e₆−e₁₅) = 0` create rank-deficient operators that annihilate
subspaces indiscriminately. **Zero-divisor monitoring** (§6): κ(L_{X_i}) tracking as
a health diagnostic. **Empirical proof that the sedenion embedding matches but never
exceeds the baseline** (§7): identical dead-reckoning RMSE (1,346.8 m at 300 s) for
all λ; aided λ = 1 degrades 20.8 → 35.0 m (+68%, linear) and 19.4 → 23.1 m (+19%,
Duffing); optimum λ\* = 0; projection residual **ρ ≈ 0.90–0.96 (mean ≈ 0.93)** for
the strapdown kinematic coupling, i.e. less than ~10% captured.

**Final position:** sedenions 𝕊 may be useful as a constrained bilinear operator
algebra, not as a magic physical manifold. *Keep:* the κ(L_{X_i}) diagnostic, the
tangent-state UKF architecture, and the `L_a` templates. *Remove:* claims that
matrix exponentials fail, that zero divisors are safe anti-jamming sinks, and that a
raw product proves physical Coriolis/centripetal dynamics. The methodological lesson
generalizes: any hypercomplex algebra proposed for estimation must be
nondimensionalized, have its algebraic claims formally corrected, be instrumented
for algebraic pathologies, and be benchmarked against an established baseline.

### 9.3 Future Work

Data-driven discovery of bilinear coupling operators (Koopman lifting
[@brunton2016koopman; @korda2018linear] with the
Cayley-Dickson constraint as a regularizer, ρ as metric); hardware-in-the-loop
validation; and a systematic survey of alternative 16-dimensional algebras
(split-octonions, bioctonions, composition algebras) for any structure achieving
ρ < 0.1 across the MEMS envelope. The framework is portable; the algebra is
interchangeable.

---

## Appendix A. Claim-to-Artifact Map

| Claim | Where in paper | Artifact (this repo) |
|---|---|---|
| `L_a · b = a · b`; `L_aᵀ = L_ā`; skew for pure-imaginary ⇒ SO(16) | §3.2, §5.2 | `sedenion`: `left_mul_matrix`, tests `test_left_mul_matrix_matches_product`, `test_adjoint_equals_conjugate`, `test_pure_imaginary_generates_skew` |
| `L_Ω² ≠ L_{Ω²}` (non-associativity) | §3.3, §5.2 | `test_left_mul_is_not_homomorphism` |
| `(e₃+e₁₀)(e₆−e₁₅) = 0`; `L_a` singular | §3.4, §5.3 | `test_zero_divisor`; `zero_divisor_operator_is_singular` |
| ρ ≈ 0.90–0.96; reachable dim 31; attitude control ρ = 0 | §4.3, §7.3 | `cargo run --release --bin bilinear-probe`; `tests/bilinear.rs` |
| Dead-reckoning 1,346.8 m; aided 20.8 → 35.0 m; Duffing 19.4 → 23.1 m | §7.3 | `cargo run --release --bin nav-bakeoff`; `cargo run --release --bin nav-bakeoff -- 16 300 --duffing` |
| λ = 0 bit-identical to baseline; noise-free < 1 mm/100 s | §7.1 | `sukf_lambda_zero_equals_baseline`, `noise_free_baseline_does_not_drift` |
| κ(L_a): 1.0 nominal, ∞ at zero divisor | §6.4 | `operator_diagnostics` in `bilinear-probe` |

*Note on references.* In-text citations use pandoc keys (`[@key]`) resolved against
[`references.bib`](references.bib). Render a numbered/cited PDF or HTML with:

```bash
pandoc PAPER.md --citeproc --bibliography=references.bib -o PAPER.pdf
```

The bibliography maps each cited work to a canonical primary source; a few draft
attributions are flagged in `references.bib` (notably the zero-divisor/G₂ result,
mapped to Moreno 1998, and the representative MEMS Duffing/VRE measurements) and
should be verified, with DOIs and volume/page numbers added, before submission.

## References

::: {#refs}
<!-- pandoc --citeproc inserts the formatted reference list here. -->
:::
