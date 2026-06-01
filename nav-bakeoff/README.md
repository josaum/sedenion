# nav-bakeoff

**Does sedenion algebra improve GPS-denied inertial navigation? Tested, not argued.**

This crate is the empirical half of a study into whether a 16-dimensional
sedenion (Cayley–Dickson) state representation helps a low-cost-MEMS dead-reckoning
filter — the central claim of the *TESSERACT-BR* proposal. Instead of debating the
mathematics, it **measures**: two estimators race over identical IMU streams, and a
separate probe checks whether strapdown physics even lives in the algebra.

> **TL;DR.** No. The sedenion machinery, at best, ties a standard UKF (and only
> when its one knob is off); switched on, it makes things worse. And the strapdown
> coupling is ~90% outside everything the sedenion product can express. The
> structure earns its keep in exactly one place — the 4-D attitude corner — which
> is precisely where it reduces to quaternions. Reproduce all of it in seconds.

```bash
cargo test --release                                      # nav-bakeoff guardrails
cargo run --release --bin nav-bakeoff                     # SUKF vs UKF bakeoff (linear MEMS)
cargo run --release --bin nav-bakeoff -- 16 300 --duffing # nonlinear (Duffing) MEMS
cargo run --release --bin bilinear-probe                  # does physics live in the algebra?
cargo run --release --bin nav-repr-bakeoff                # learned 16-D MEMS representations
```

---

## The two experiments

### 1. The bakeoff — does the sedenion *filter* help? (`src/main.rs`)

A standard Unscented Kalman Filter and a Sedenion-UKF ("SUKF") run over the **same**
synthetic MEMS IMU streams, sharing one filter (`src/ukf.rs`) and one strapdown
process model (`src/filters.rs`). The **only** difference is the state
representation: a plain 9-vector vs. the same state embedded in a 16-float
`sedenion::Sedenion` (slot map `velocity → e4..e6`, `position → e7..e9`,
`accel bias → e13..e15`) with the paper's zero-divisor "drift annihilation" applied
each step, strength `λ ∈ [0,1]`.

- `λ = 0` disables the sedenion step and is **bit-identical** to the baseline
  (unit-tested), so any difference is attributable to the algebra alone.
- `λ = 1` is the full annihilation. A sweep lets the data pick the optimum.
- `--duffing` adds cubic-stiffness nonlinearity to the true bias dynamics — the
  regime the proposal says linear filters discard and sedenions exploit.
- Two modes: pure dead-reckoning, and aided (position fix every 30 s, σ = 5 m,
  sampled with realistic noise).

**Result — horizontal position RMSE (m), 16 seeds, 300 s, 50 Hz:**

| estimator | t=30 s | t=60 s | t=120 s | t=300 s |
|---|--:|--:|--:|--:|
| *Dead-reckoning (no aiding)* | | | | |
| Baseline UKF / SUKF λ=0 / λ=1 | 12.0 | 48.8 | 199.0 | 1346.8 |
| *Aided (30 s fix, σ=5 m)* | | | | |
| Baseline UKF = SUKF λ=0 | 6.7 | 7.7 | 7.8 | **20.8** |
| SUKF λ=1 | 6.7 | 7.7 | 8.0 | **35.0** |

Duffing variant (16 seeds): aided 19.4 m (baseline) → 23.1 m (λ=1). The optimum is
**always λ\* = 0**.

In dead-reckoning every λ is identical because accelerometer bias is
**unobservable** — the drift to >1 km is the true, double-integrated bias, and no
number system recovers information the measurements don't contain. Once aiding makes
the bias observable, forcing it onto the position direction throws away a
correctly-estimated quantity, so the annihilation *hurts*. The lever that bounds
drift is **aiding**, not the algebra.

### 2. The bilinear probe — does the *algebra* match the physics? (`src/bin/bilinear_probe.rs`)

For a frozen rotation rate, the part of the (nondimensionalized) strapdown vector
field that is linear in the state is a 16×16 matrix `A(ω̄)` — attitude kinematics,
Coriolis, centripetal, transport. The sedenion bilinear template can only reach the
subspace `span{L_{e_k}, R_{e_k}}`. The probe measures the relative Frobenius
distance `ρ = ‖A − Proj(A)‖_F / ‖A‖_F`.

```
Reachable subspace dimension (of 256):  full 𝕊 = 31,  quaternion-gen = 7

|ω̄|     ρ_full   ρ_quat    Δρ      ρ_att    ρ_vel+pos
0.10    0.954    0.981   0.027     2.52      0.926
0.50    0.912    0.934   0.022     1.05      0.870
1.00    0.902    0.914   0.012     0.89      0.864

Control — attitude block alone, vs 4×4 quaternion operators:  ρ = 0.0
```

- **Attitude block alone: ρ = 0** — quaternions capture it exactly (validates the
  harness, and is *why* quaternions are standard).
- **Full 16-D coupling: ρ ≈ 0.90–0.96** — ~90% of strapdown coupling is outside the
  algebra; `F_nonlinear` must carry it.
- **Off-quaternion generators e4..e15 add almost nothing** (Δρ ≈ 0.01–0.03), so for
  this physics **𝕊 ≈ ℍ ⊕ ℝ¹²**.
- Zero divisors give a **singular** `L_a` (σ_min = 0, κ = ∞) — blind directions to
  gate against, not anti-jamming sinks.

### 3. The representation probe — can sedenions learn MEMS error latents? (`src/bin/nav_repr_bakeoff.rs`)

This is the constructive follow-up to the negative state-manifold result. It keeps
the navigation state classical and asks whether a compact 16-D latent can predict
navigation-relevant hidden quantities from short IMU windows:

- input: three chunks of a 2 s accelerometer window, summarized as 3 × 16 features;
- target: current accelerometer bias xyz plus 10 s future dead-reckoning drift xyz;
- models: train mean, supervised dense `48 -> 16` MLP, supervised sedenion
  `Σ (L_i x_i + x_i R_i)`, sedenion plus auto-ZDA, JEPA-frozen probes, and
  JEPA-pretrained + supervised-finetuned variants;
- JEPA setup: context window predicts a held-out future-window latent through a
  predictor head, with the future encoder stopped-gradient in the I-JEPA/Video-JEPA
  spirit; the downstream bias/drift head is then trained either frozen or
  fine-tuned.
- metrics: normalized MSE plus physical bias RMSE and drift RMSE on held-out seeds;
- filter-in-loop check: feed the learned bias estimate as a UKF pseudo-measurement
  with uncertainty derived from train bias RMSE, then report terminal dead-reckoning
  RMSE without external position fixes.

Run it with:

```bash
cargo run --release --bin nav-repr-bakeoff
cargo run --release --bin nav-repr-bakeoff -- 64 16 180 --duffing
```

This probe does **not** rescue the claim that sedenions are navigation states. It
tests the narrower, more plausible claim that the Cayley-Dickson product can act as
a structured representation prior for MEMS error learning.

Current default non-Duffing result shape, 64 train seeds / 16 held-out seeds /
180 s:

| model | params | proxy test MSE | bias-aided terminal RMSE |
|---|--:|--:|--:|
| Dead-reckoning UKF / train mean | 0 | 1.3711 | 531.46 m |
| Dense `48 -> 16` | 886 | 0.9028 | **452.64 m** |
| Dense JEPA frozen | 886 | 1.3385 | 525.46 m |
| Dense JEPA + fine-tune | 886 | **0.8513** | 459.84 m |
| Sedenion 16D | 214 | 1.2613 | 518.41 m |
| Sedenion 16D + auto-ZDA | 214 | 1.2496 | 518.64 m |
| Sedenion JEPA + fine-tune | 214 | 1.2525 | 520.78 m |

So the current answer is mixed but sharper: JEPA pretraining helps the dense proxy
task after fine-tuning, but the best filter-in-loop RMSE is still the supervised
dense model. Frozen JEPA alone is not enough, and the sedenion variants do not yet
produce a useful navigation representation.

---

## What's in the box

```
sedenion/                     core 16-D Cayley–Dickson crate (dependency)
  src/lib.rs                  + left_mul_matrix() / right_mul_matrix()  ← added here
nav-bakeoff/
  src/
    sim.rs                    synthetic 3-D trajectory + MEMS IMU model (+Duffing)
    ukf.rs                    generic additive-noise UKF (shared by both estimators)
    filters.rs                strapdown process model, baseline vs. sedenion + ZDA
    nav_repr.rs               learned 16-D inertial representation bakeoff
    linalg.rs                 tiny dense f64 linalg (Cholesky, solve, Jacobi eig, SVD)
    bilinear.rs               strapdown coupling A(ω̄), reachable-subspace projection, ρ
    main.rs                   the bakeoff harness  →  bakeoff_results.csv
    bin/bilinear_probe.rs     the ρ / operator-conditioning probe
    bin/nav_repr_bakeoff.rs   dense vs. sedenion latent representation probe
  tests/
    sanity.rs                 noise-free <1 mm/100 s; λ=0 ≡ baseline
    bilinear.rs               attitude ρ≈0; full ρ>0.5; reachable dim = 31; zero-div singular
  PAPER.md                    full writeup, reconciled with this code
  OPERATOR_ALGEBRA.md         the L_a / R_a operators and the probe, explained
  references.bib              bibliography for PAPER.md
```

The `sedenion` crate gains the **left/right multiplication operators** `L_a, R_a`
(the "Cayley–Dickson routing tensor"), built from its own `Mul` so they're
convention-correct. Crate tests confirm the facts that make them usable for
estimation: `L_a·b = a·b`, `L_aᵀ = L_ā` (adjoint = conjugate), skew-symmetry for
pure-imaginary generators ⇒ `exp(L_a t) ∈ SO(16)`, and `L_{ab} ≠ L_a L_b` (the
entire content of non-associativity). See [`OPERATOR_ALGEBRA.md`](OPERATOR_ALGEBRA.md).

---

## Reproducibility

Every number in [`PAPER.md`](PAPER.md) is produced by code here; Appendix A of the
paper is a claim-to-artifact map. The headline figures:

| Claim | Command / test |
|---|---|
| Bakeoff RMSE tables | `cargo run --release --bin nav-bakeoff` and `cargo run --release --bin nav-bakeoff -- 16 300 --duffing` |
| ρ ≈ 0.90–0.96, dim 31, attitude ρ = 0 | `cargo run --release --bin bilinear-probe` |
| Learned MEMS representation and filter-in-loop metrics | `cargo run --release --bin nav-repr-bakeoff` |
| `L_a` correct / non-assoc / skew / adjoint | `(cd ../sedenion && cargo test --release)` |
| λ=0 ≡ baseline; noise-free < 1 mm | `cargo test --release` |

The bakeoff writes `bakeoff_results.csv`
(`mode,estimator,lambda,t_s,rmse_horizontal_m`) for plotting. The representation
probe writes `nav_repr_results.csv` for proxy metrics and
`nav_repr_filter_results.csv` for the filter-in-loop bias-aiding check.

---

## Scope & honesty

- **Attitude is assumed resolved**, so the bakeoff isolates the
  position/velocity/accel-bias subspace — the dominant dead-reckoning error channel
  and exactly where the zero-divisor claim was located.
- The paper's "zero-divisor annihilation" is not formally defined, so
  `sedenion_zda()` is a **good-faith operationalization** of its prose. If you have
  a specific, well-posed alternative, drop it into that one function and re-run.
- Likewise `strapdown_coupling()` in `bilinear.rs` is one function: if you believe a
  thermal/Duffing coupling written as linear-in-state terms *does* live in the
  reachable subspace, encode it there and the probe will report ρ immediately.
- Simulation only. Hardware-in-the-loop (thermal shock, vibration table) remains the
  honest next step before the negative conclusion is claimed complete.

---

## The verdict, in one line

> **Sedenions 𝕊 may be useful as a constrained bilinear operator algebra — not as a
> physical state manifold.** Keep `L_a` as a template and the κ(L_a) zero-divisor
> diagnostic; drop the claims that matrix exponentials fail, that zero divisors are
> anti-jamming sinks, and that a raw product yields physical Coriolis/centripetal
> dynamics. For sovereign GPS-denied navigation, spend the effort on **aiding**
> (VIO, terrain-matching, ZUPT), where the bounds actually come from.
