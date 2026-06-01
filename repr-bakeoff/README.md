# repr-bakeoff

**Does sedenion structure help self-supervised representation learning — under the
*actual* LeJEPA objective, on synthetic and real data?** Tested, not argued.

Companion to `nav-bakeoff`, for the representation-learning half of the repo. The
`sedenion` crate pitches a 16-D hypercomplex latent space for JEPA-style SSL with
**Zero-Divisor-Aware regularization (ZDA-Reg)** as a novel anti-collapse mechanism
(see [`../sedenion_lejepa.md`](../sedenion_lejepa.md)). This crate runs the
controlled experiment the pitch never did.

> **TL;DR — the answer depends on the objective, and the honest one is humbling.**
> - Under a **VICReg** proxy (first attempt), the sedenion layer looked *better* on
>   MNIST (more collapse-resistant, higher accuracy with 15× fewer params).
> - Under the **faithful LeJEPA SIGReg** objective (Epps–Pulley, ported and
>   numerically verified against `galilai-group/lejepa`), that result **reverses**:
>   the dense baseline wins on downstream accuracy on *both* datasets, even though
>   the sedenion layer reaches far higher effective rank and better isotropy.
> - **ZDA-Reg is monotonically harmful under every objective tested.**
>
> So: the regularizer you pick changes the verdict. Measuring against the real
> objective matters — and against it, sedenion *structure* does **not** help this
> probe. (Caveats below: frozen backbone, 16-D bottleneck, modest accuracy.)

```bash
cargo test --release -p repr-bakeoff      # gradient + SIGReg-faithfulness checks
cargo run  --release -p repr-bakeoff      # synthetic
./fetch_mnist.sh && cargo run --release -p repr-bakeoff -- mnist
python3 tools/ref_pure.py                 # the lejepa reference value (pure Python)
```

## The experiment

One shared pipeline, **one variable**. A single learnable layer maps a 256-D input
to a 16-D embedding, trained on two augmented views with a chosen SSL objective;
labels are held out for a downstream linear probe. The only difference between arms:

- **Real baseline** — dense 16×256 matrix (4112 params).
- **Sedenion** — 16 sedenion weights, `z = Σ_i W[i]·x[i] + b` (272 params, **~15×
  fewer**), forward via the Cayley–Dickson product, exact backward via the `R_a`
  operator (`∂(W·x)/∂W = R_x`). Optional **ZDA-Reg** strength `λ_zda`.

Objective = **SIGReg** (the LeJEPA loss): for random unit directions, project the
embeddings and push each 1-D projection to the **standard normal N(0,1)** via the
Epps–Pulley characteristic-function statistic — `t = linspace(0,3,17)`,
`err = (cos_mean − e^{−t²/2})² + sin_mean²`, symmetry-doubled trapezoid weights,
mean over slices. This is ported from `galilai-group/lejepa`
(`univariate/epps_pulley.py` + `multivariate/slicing.py`) and **numerically
verified**: `tools/ref_pure.py` (a dependency-free Python port of the reference
forward) and the Rust `sigreg` agree to f32 precision on shared input
(`= 2.07709580`), checked in `tests/sanity.rs::sigreg_matches_lejepa_reference`.

Two datasets feed the same pipeline: a synthetic two-view task, and real **MNIST**
(two augmented views through a fixed random 784→256 backbone shared by both arms).

## Results (faithful LeJEPA SIGReg)

### Synthetic (4 seeds, 10 classes, 300 epochs, chance = 10%)

| arm | params | probe_acc | eff_rank | gaussian↓ | isotropy↓ |
|---|--:|--:|--:|--:|--:|
| Real baseline | 4112 | **89.1%** | 2.59 | 0.0003 | 0.764 |
| Sedenion λ_zda=0 | 272 | 65.4% | 12.01 | 0.0001 | 0.209 |
| Sedenion λ_zda=1 | 272 | 56.0% | 12.55 | 0.0001 | 0.186 |
| Sedenion λ_zda=2 | 272 | 52.6% | 12.67 | 0.0001 | 0.181 |

### Real — MNIST (3 seeds, frozen 784→256 backbone, 300 epochs, chance = 10%)

| arm | params | probe_acc | eff_rank | gaussian↓ | isotropy↓ |
|---|--:|--:|--:|--:|--:|
| Real baseline | 4112 | **32.6%** | 1.27 | 0.0001 | 0.933 |
| Sedenion λ_zda=0 | 272 | 24.1% | 14.62 | 0.0001 | 0.109 |
| Sedenion λ_zda=1 | 272 | 21.5% | 14.76 | 0.0001 | 0.104 |
| Sedenion λ_zda=2 | 272 | 21.1% | 14.59 | 0.0001 | 0.113 |

`probe_acc` linear-probe accuracy · `eff_rank` effective rank of embedding cov
(16 = full) · `gaussian↓` held-out Epps–Pulley statistic (≈2e-4 is the N(0,1)
sampling floor; **both arms reach it**) · `isotropy↓` distance from isotropic cov.

## What the numbers say

1. **SIGReg works for both arms** — `gaussian↓ ≈ 1e-4` everywhere, i.e. both layers
   Gaussianize their projections equally well. So SIGReg is *not* the differentiator.

2. **Under the faithful objective, the dense baseline wins on accuracy** — 89.1 vs
   65.4 (synthetic), 32.6 vs 24.1 (MNIST). This **reverses** the earlier
   VICReg-proxy result (PR #5), where the sedenion looked better. The earlier "win"
   was an artifact of the proxy objective, not a property of the real one.

3. **Higher rank / better isotropy did NOT buy accuracy.** The sedenion reaches
   eff_rank 12–15 and far lower isotropy distance, yet scores lower; the dense
   baseline wins from a near-collapsed eff_rank of 1.3–2.6. So "anti-collapse" is
   not the lever it looked like — downstream accuracy here is dominated by layer
   capacity / class-alignment of the dominant directions, which the dense matrix has
   more freedom to fit.

4. **ZDA-Reg is monotonically harmful** under SIGReg too (accuracy falls as λ_zda
   rises, on both datasets) — consistent across every objective tested. The
   zero-divisor / G₂ "anti-collapse" claim does not survive any controlled ablation.

## The honest cross-objective summary

| objective | synthetic: real vs sed | MNIST: real vs sed | who wins acc |
|---|---|---|---|
| VICReg proxy (PR #5) | 96.8 vs 96.6 | 32.4 vs **39.7** | sedenion (MNIST) |
| **Faithful SIGReg** | **89.1** vs 65.4 | **32.6** vs 24.1 | **dense baseline** |

Robust across all of it: **ZDA-Reg hurts**, and **SIGReg/VICReg isotropy is the
real anti-collapse mechanism** (works in plain ℝᵈ). Not robust: "sedenion structure
helps" — it held only under the VICReg proxy and reverses under the objective LeJEPA
actually uses. Being data-first cuts both ways; this round cuts against the sedenion.

## Caveats (what this does *not* settle)

- Frozen random backbone + a 16-D *unsupervised* bottleneck caps absolute accuracy
  (MNIST ~25–33%); this is a controlled probe, not a tuned SSL system.
- A single linear projection layer is a deliberately minimal test; the
  parameter-efficiency / weight-tying story could still pay off in a *deep*
  hypercomplex network, which this does not test.
- A *learnable* hypercomplex layer (PHM) generalizes the fixed Cayley–Dickson
  product and is the natural stronger baseline — untested here.
- Open mechanism question: is there *any* regime (capacity, depth, objective) where
  the sedenion structure helps under the faithful objective? Unknown.

## Trust

`tests/sanity.rs` (all passing): finite-difference checks of the VICReg(+ZDA) loss
gradient, the sedenion layer backward `∂(W·x)/∂W = R_x`, and the SIGReg gradient;
plus the SIGReg↔reference faithfulness check against `tools/ref_pure.py`. Every
quantitative claim above is produced by code here; `data/` (MNIST) is gitignored
(`./fetch_mnist.sh`).
