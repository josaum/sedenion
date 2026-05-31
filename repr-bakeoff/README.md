# repr-bakeoff

**Does sedenion structure help representation learning — and does ZDA-Reg help or fight isotropy? Tested, not argued.**

The companion to `nav-bakeoff`, for the *other* half of the repo. The `sedenion`
crate pitches a 16-D hypercomplex latent space for JEPA-style self-supervised
learning, with **Zero-Divisor-Aware regularization (ZDA-Reg)** as a novel
anti-collapse mechanism (see [`../sedenion_lejepa.md`](../sedenion_lejepa.md)). That
half had never been benchmarked. This crate runs the controlled experiment.

> **TL;DR.** Two findings, both predicted:
> 1. **The parameter-efficiency lever is real.** A sedenion-structured projector
>    matches the real baseline within ~2 points using **~13× fewer parameters**.
> 2. **ZDA-Reg is counterproductive.** Turning it up monotonically *worsens*
>    isotropy and effective rank without improving accuracy — it fights the very
>    isotropy objective (SIGReg/VICReg) that actually prevents collapse. Optimum:
>    **λ_zda = 0.**

```bash
cargo test --release -p repr-bakeoff   # finite-difference gradient checks
cargo run  --release -p repr-bakeoff   # the bake-off
```

## The experiment

A small self-supervised setup with a clean, recoverable structure. Synthetic data:
each class has a prototype in a 16-D latent space; samples map through a *fixed*
random nonlinear feature map to a 64-D input; **two views** per sample add
input-space noise. Training sees only the view pairs (no labels); labels are held
out for a downstream linear probe.

**One shared pipeline, one variable.** Both arms map 64-D → 16-D with a single
learnable layer, trained with identical VICReg (invariance + variance + covariance)
and identical hyperparameters. The only difference is the layer:

- **Real baseline** — a dense 16×64 matrix (1024 weights) + isotropy/decorrelation
  reg. The principled anti-collapse setup.
- **Sedenion** — 4 sedenion weights, `z = Σ_i W[i]·x[i] + b` (64 weights, **16×
  fewer**), forward via the Cayley–Dickson product, exact backward via the
  right-multiplication operator (`∂L/∂W[i] = R_{x[i]}ᵀ g` — using the `L_a/R_a`
  operators from the core crate). Optional **ZDA-Reg** strength `λ_zda`.

`λ_zda = 0` isolates the structure; the sweep `λ_zda ∈ {0, 0.1, 1, 5}` answers
whether the zero-divisor term helps or hurts.

## Results

8 seeds, 10 classes, 400 train / 400 test, 250 epochs (chance = 10%):

| arm | params | probe_acc | eff_rank | isotropy↓ | min_std |
|---|--:|--:|--:|--:|--:|
| Real baseline (VICReg) | 1040 | **96.8%** | 2.50 | 0.6655 | 0.566 |
| Sedenion λ_zda=0.0 | **80** | **95.0%** | 6.47 | 0.4097 | 0.179 |
| Sedenion λ_zda=0.1 | 80 | 94.9% | 6.46 | 0.4102 | 0.179 |
| Sedenion λ_zda=1.0 | 80 | 94.8% | 6.39 | 0.4133 | 0.175 |
| Sedenion λ_zda=5.0 | 80 | 94.8% | 6.03 | 0.4338 | 0.157 |

- `probe_acc` — downstream linear-probe accuracy (higher = more useful).
- `eff_rank` — effective rank of the embedding covariance (16 = full, low = collapse).
- `isotropy↓` — distance from an isotropic covariance (0 = isotropic; what SIGReg wants).
- `min_std` — smallest per-axis std (→ 0 = a dead/collapsed axis).

## What the numbers say

1. **Parameter efficiency (the real lever).** The sedenion projector reaches 95.0%
   with **80 parameters** — ~13× fewer than the real baseline's 1040 — for ~2 points
   of accuracy, and with *higher* effective rank and *better* isotropy here. This is
   the genuine, literature-backed benefit of hypercomplex layers (cf. quaternion
   CNNs; PHM). **Caveat:** a *learnable* hypercomplex layer (PHM) is a strict
   generalization of the fixed Cayley–Dickson product and would likely match or beat
   it — the fixed sedenion table is not obviously optimal.

2. **ZDA-Reg fails its own promise.** Increasing `λ_zda` from 0 → 5 monotonically
   **raises** the isotropy distance (0.410 → 0.434), **lowers** effective rank
   (6.47 → 6.03), **lowers** min-std, and never improves accuracy. This is the
   predicted tension: an isotropic Gaussian necessarily places mass near the
   zero-divisor manifold, so penalizing that proximity **pushes the distribution
   away from isotropic** — directly fighting the SIGReg/VICReg objective that is the
   principled anti-collapse mechanism. The optimum is `λ_zda = 0`.

**Bottom line:** sedenions help representation learning the same modest way any
hypercomplex layer does — *parameter efficiency* — and that benefit is structural,
not algebraic-mystical. The zero-divisor/G₂ "anti-collapse" story does not survive
contact with a controlled ablation; the part that prevents collapse is ordinary
isotropy regularization, which works in plain ℝᵈ.

## Trust

`tests/sanity.rs` finite-difference-checks both the VICReg(+ZDA) loss gradient and
the sedenion layer's backward identity `∂(W·x)/∂W = R_x`. A wrong gradient would
invalidate every number here, so these run in CI-style guardrails.

## Scope

A deliberately small, CPU-only, dependency-light proxy (synthetic data, single
learnable layer, VICReg objective) chosen so the comparison is controlled and
reproducible — not a state-of-the-art SSL system. It isolates the *layer structure*
and the *ZDA-vs-isotropy* question, which is what the LeJEPA doc actually claims. A
real-image SSL run with a deep backbone is the natural follow-up; the prediction is
that the two findings above persist.
