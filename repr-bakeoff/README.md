# repr-bakeoff

**Does sedenion structure help representation learning — and is ZDA-Reg the reason? Tested on synthetic *and* real data.**

The companion to `nav-bakeoff`, for the *other* half of the repo. The `sedenion`
crate pitches a 16-D hypercomplex latent space for JEPA-style self-supervised
learning, with **Zero-Divisor-Aware regularization (ZDA-Reg)** as a novel
anti-collapse mechanism (see [`../sedenion_lejepa.md`](../sedenion_lejepa.md)). This
crate runs the controlled experiment that the pitch never did — on a synthetic task
*and* on real MNIST images.

> **TL;DR — the data updated the prior.**
> 1. **Sedenion *structure* genuinely helps.** A sedenion-structured projector
>    matches/beats a dense real baseline with **~15× fewer parameters**, and on real
>    MNIST it is dramatically **more collapse-resistant**: the dense baseline
>    collapses to ≈rank-2 (32% acc) while the sedenion layer holds ≈rank-9 (40% acc).
> 2. **But ZDA-Reg is *not* the reason, and isn't a reliable lever.** Its effect is
>    tiny and **regime-dependent** — it slightly helps on the (collapse-prone) MNIST
>    embeddings and monotonically *hurts* on the well-spread synthetic ones. The
>    benefit comes from the structured weight-tying, not the zero-divisor term.

```bash
cargo test --release -p repr-bakeoff      # finite-difference gradient checks
cargo run  --release -p repr-bakeoff      # synthetic
./fetch_mnist.sh                          # download MNIST into data/  (one-time)
cargo run  --release -p repr-bakeoff -- mnist
```

## The experiment

One shared pipeline, **one variable**. A single learnable layer maps a 256-D input
to a 16-D embedding, trained with identical VICReg (invariance + variance +
covariance) on two augmented views; labels are held out for a downstream linear
probe. The only difference is the layer:

- **Real baseline** — a dense 16×256 matrix (4112 params).
- **Sedenion** — `NF = 16` sedenion weights, `z = Σ_i W[i]·x[i] + b` (272 params,
  **~15× fewer**), forward via the Cayley–Dickson product, **exact backward via the
  `R_a` operator** (`∂(W·x)/∂W = R_x`, using the operators added in the operator PR).
  Optional **ZDA-Reg** strength `λ_zda`.

Two datasets feed the *same* pipeline:
- **Synthetic** — class prototypes in latent space → fixed random nonlinear map → two
  noisy views.
- **MNIST** — real digits, two augmented views (±2 px shift + pixel noise), through a
  *fixed random* backbone (784→256, ReLU) shared by both arms, features standardized
  on the train set. (Frozen random features, not a trained deep net — a controlled,
  pure-CPU probe, not a SOTA SSL system.)

`λ_zda = 0` isolates the structure; the sweep answers whether ZDA helps or hurts.

## Results

### Synthetic (4 seeds, 10 classes, 300 epochs, chance = 10%)

| arm | params | probe_acc | eff_rank | isotropy↓ | min_std |
|---|--:|--:|--:|--:|--:|
| Real baseline (VICReg) | 4112 | 96.8% | 6.55 | 0.348 | 0.635 |
| Sedenion λ_zda=0.0 | **272** | 96.6% | 5.79 | 0.429 | 0.297 |
| Sedenion λ_zda=0.1 | 272 | 97.1% | 5.71 | 0.435 | 0.294 |
| Sedenion λ_zda=1.0 | 272 | 96.4% | 5.45 | 0.455 | 0.280 |
| Sedenion λ_zda=2.0 | 272 | 96.1% | 5.39 | 0.458 | 0.251 |

### Real — MNIST (3 seeds, frozen 784→256 backbone, 300 epochs, chance = 10%)

| arm | params | probe_acc | eff_rank | isotropy↓ | min_std |
|---|--:|--:|--:|--:|--:|
| Real baseline (VICReg) | 4112 | 32.4% | **1.91** | 0.853 | 0.501 |
| Sedenion λ_zda=0.0 | **272** | **39.7%** | **8.79** | 0.376 | 0.028 |
| Sedenion λ_zda=0.1 | 272 | 39.6% | 8.80 | 0.376 | 0.028 |
| Sedenion λ_zda=1.0 | 272 | 39.8% | 8.81 | 0.374 | 0.028 |
| Sedenion λ_zda=2.0 | 272 | 40.0% | 8.81 | 0.373 | 0.028 |

- `probe_acc` — downstream linear-probe accuracy. `eff_rank` — effective rank of the
  embedding covariance (16 = full, low = collapse). `isotropy↓` — distance from an
  isotropic covariance (0 = isotropic). `min_std` — smallest per-axis std.

## What the numbers say

1. **Parameter efficiency + collapse-resistance (the real, robust win).** The
   sedenion projector matches the dense baseline on synthetic and **beats it on
   real MNIST** (39.7% vs 32.4%) with **~15× fewer parameters**. The mechanism is
   visible in `eff_rank`: under identical VICReg and learning rate, the dense layer
   **collapses to ≈rank-2 on MNIST** (it has the capacity to satisfy the invariance
   objective with a degenerate low-rank solution), while the structured layer's
   weight-tying **can't collapse that way** and holds ≈rank-9. This is the genuine,
   literature-backed benefit of hypercomplex layers (cf. quaternion CNNs / PHM) — an
   *implicit structural regularizer*. (Caveat: a *learnable* hypercomplex layer (PHM)
   generalizes the fixed Cayley–Dickson product and would likely match or beat it;
   and a dense baseline with heavier explicit regularization might be coaxed out of
   collapse with more tuning.)

2. **ZDA-Reg is not the source of the benefit, and is not a reliable lever.** Its
   effect is **small and regime-dependent**: on the collapse-prone MNIST embeddings
   it marginally helps (39.7 → 40.0, isotropy 0.376 → 0.373); on the well-spread
   synthetic embeddings it monotonically *hurts* (eff_rank 5.79 → 5.39, isotropy
   0.429 → 0.458) with no accuracy gain. So the zero-divisor/G₂ "anti-collapse"
   story does not hold up as a dependable mechanism — the dependable anti-collapse
   lever is ordinary covariance/isotropy regularization (which works in plain ℝᵈ),
   and the structural win above comes from weight-tying, not from the ZDA term.

3. **Absolute MNIST accuracy is modest (~40%) by design.** The frozen random 256-D
   backbone + a 16-D *unsupervised* bottleneck caps the ceiling; this is a controlled
   probe, not a tuned SSL system. The structural findings (param efficiency, the
   dense-layer collapse, ZDA's marginality) are what transfer.

**Bottom line:** sedenion *structure* helps representation learning — modestly but
really — the way any hypercomplex layer does: parameter efficiency and an implicit
anti-collapse bias. The specific ZDA-Reg / zero-divisor claim does not survive a
controlled ablation. Report the structure, drop the mysticism.

## Trust

`tests/sanity.rs` finite-difference-checks both the VICReg(+ZDA) loss gradient and
the sedenion layer's backward identity `∂(W·x)/∂W = R_x`. A wrong gradient would
invalidate every number, so these are guardrails.

## Scope & reproducibility

Deliberately small, CPU-only, dependency-light (synthetic data, single learnable
layer, VICReg, frozen-random MNIST backbone) so the comparison is controlled and
reproducible. `data/` (MNIST) is gitignored; run `./fetch_mnist.sh` to populate it.
A real-image SSL run with a deep trainable backbone is the natural follow-up; the
prediction is that the three findings above persist.
