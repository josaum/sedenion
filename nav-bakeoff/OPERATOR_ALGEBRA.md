# Sedenion operator algebra for state estimation — what it can and can't do

This documents two additions that move the sedenion crate from "exotic 16-float
container" toward something a state estimator could actually use, and the
diagnostic that tells you whether it's worth it for navigation.

## 1. The left/right multiplication operators (`L_a`, `R_a`)

`Sedenion::left_mul_matrix()` and `right_mul_matrix()` return the 16×16 real
matrices with `L_a · b = a·b` and `R_a · b = b·a`. They're built column-by-column
from the crate's own `Mul`, so they inherit its Cayley–Dickson convention
exactly (verified by `test_left_mul_matrix_matches_product`).

This is the bridge to estimation: the nonlinear, non-associative product becomes
an ordinary **associative** matrix acting on ℝ¹⁶, where matrix exponentials,
Cholesky, and covariance propagation all behave. The crate's tests confirm the
three facts that matter:

- **`L_{ab} ≠ L_a L_b`** (`test_left_mul_is_not_homomorphism`) — the *entire*
  content of non-associativity. You keep `L_Ω` and `L_Γ` as matrices and never
  fold them into `L_{ΩΓ}`. In particular `e^{L_Ω Δt}` is a perfectly ordinary,
  convergent matrix exponential that exactly solves `ṡ = L_Ω s` for frozen Ω.
- **`L_aᵀ = L_ā`** (`test_adjoint_equals_conjugate`) — the adjoint of left-mult
  is left-mult by the conjugate. Holds in *all* Cayley–Dickson algebras, even
  without a multiplicative norm.
- **Pure-imaginary `a` ⇒ `L_a` skew-symmetric** (`test_pure_imaginary_generates_skew`)
  ⇒ `e^{L_a t} ∈ SO(16)`. So a frozen pure-imaginary generator gives a
  norm-preserving flow on the 16-vector — though *not* on the physical manifold
  `S³ × ℝ¹²`, which still needs its own quaternion retraction.

## 2. The decisive diagnostic: does strapdown coupling live in the algebra?

`bilinear-probe` (`cargo run --release -p nav-bakeoff --bin bilinear-probe`)
answers the one question that decides whether sedenions do physical work.

For a frozen rotation rate `ω̄`, the part of the nondimensionalized navigation
vector field that is linear in the state is an ordinary 16×16 matrix `A(ω̄)`
(attitude kinematics, Coriolis, centripetal, transport). The sedenion bilinear
template can only reach the subspace `O = span{L_{e_k}, R_{e_k}}`. So we measure
the relative Frobenius distance `ρ = ‖A − Proj_O(A)‖_F / ‖A‖_F`.

### Results

```
Reachable subspace dimension (of 256):  full 𝕊 = 31,  quaternion-gen = 7

|ω̄|       ρ_full    ρ_quat      Δρ     ρ_att(full)  ρ_vp(full)
0.05      0.959     0.985     0.026       4.50        0.935
0.10      0.954     0.981     0.027       2.52        0.926
0.25      0.936     0.963     0.027       1.39        0.900
0.50      0.912     0.934     0.022       1.05        0.870
1.00      0.902     0.914     0.012       0.89        0.864
2.00      0.922     0.928     0.006       0.81        0.898

Control — attitude block alone, projected onto 4×4 quaternion operators: ρ = 0.0
```

### What it means

1. **The 4-D attitude sub-problem is exactly quaternion-native** (control ρ = 0).
   This is *why* quaternions are standard — and it validates the harness.

2. **The full 16-D strapdown coupling is ~90% outside the sedenion-reachable
   subspace** (`ρ_full ≈ 0.90–0.96`). The off-quaternion products of 𝕊 simply do
   not match how strapdown mechanics couple velocity, position, Coriolis, and
   centripetal terms. Forcing the dynamics through sedenion operators
   misrepresents the physics; `F_nonlinear` has to carry almost all of it, so the
   algebra is overhead, not leverage.

3. **The off-quaternion generators `e₄..e₁₅` add essentially nothing**
   (`Δρ ≈ 0.006–0.027`). For this physics, 𝕊 ≈ ℍ ⊕ ℝ¹²: the sedenion-specific
   structure buys you no expressive power a quaternion-plus-linear-algebra model
   doesn't already have. That is the direct, quantitative answer to the
   "𝕊 vs. ℍ ⊕ ℝ¹²" question.

4. **Zero divisors are blind directions, confirmed.** For `e₃+e₁₀` the operator
   `L_a` has `σ_min = 0`, `κ = ∞` — a genuine kernel. Routing state through it
   destroys a subspace indiscriminately; it is a hazard to gate against, not an
   anti-jamming sink.

### Verdict

The operators `L_a`/`R_a` are genuinely useful infrastructure and the right
abstraction. But the probe says the sedenion product is the correct tool only
for the attitude corner (where it reduces to quaternions) and the wrong tool for
the other twelve dimensions. The defensible architecture remains: **quaternion /
SE(3) error-state UKF for the physics, with the sedenion algebra confined to a
learned nonlinear feature/bias model** if used at all — not as the recursive
state representation.

If you have a different `A` (e.g. with the thermal/Duffing couplings written as
linear-in-state terms) you believe *does* live in `O`, drop it into
`strapdown_coupling()` and re-run — the residual will say so immediately.
