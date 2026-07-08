# repr-bakeoff

**Does sedenion structure help self-supervised representation learning — under the
*actual* LeJEPA objective, on synthetic and real data?** Tested, not argued.

Companion to `nav-bakeoff`, for the representation-learning half of the repo. The
`sedenion` crate pitches a 16-D hypercomplex latent space for JEPA-style SSL with
**Zero-Divisor-Aware regularization (ZDA-Reg)** as a novel anti-collapse mechanism
(see [`../sedenion_lejepa.md`](../sedenion_lejepa.md)). This crate runs the
controlled experiment the pitch never did.

> **TL;DR — the SIGReg math is checked, and ZDA no longer needs a λ sweep.**
> - The Epps-Pulley forward now matches a dependency-free Python port of the
>   LeJEPA reference on shared input (`2.07709580`), and the Rust gradient is
>   finite-difference checked.
> - With the current auto-balanced ZDA barrier, the 272-param sedenion arm beats
>   the 4112-param dense baseline on both tasks in this harness.
> - `eff_rank` and trace-normalized `isotropy` are not enough. The sedenion arm can
>   look high-rank while its absolute scale is nearly dead (`min_std` ≈ 0), which
>   is exactly what the raw N(0,1) SIGReg statistic exposes.
> - Raw `λ_zda` sweeps were the wrong interface. ZDA is now applied as a
>   parameter-free barrier whose gradient is auto-balanced against the base
>   SIGReg/invariance objective and boosted when embedding RMS is below the
>   N(0,I) target.

```bash
cd repr-bakeoff
cargo test --release                      # gradient + SIGReg-faithfulness checks
python3 tools/ref_pure.py                 # the lejepa reference value (pure Python)
cargo run --release                       # synthetic
./fetch_mnist.sh && cargo run --release -- mnist
```

## The experiment

One shared pipeline, **one variable**. A single learnable layer maps a 256-D input
to a 16-D embedding, trained on two augmented views with a chosen SSL objective;
labels are held out for a downstream linear probe. The only difference between arms:

- **Real baseline** — dense 16×256 matrix (4112 params).
- **Sedenion** — 16 sedenion weights, `z = Σ_i W[i]·x[i] + b` (272 params, **~15×
  fewer**), forward via the Cayley-Dickson product, exact backward via the `R_a`
  operator (`∂(W·x)/∂W = R_x`). The ZDA arm uses the auto-balanced **ZDA-Reg**
  exported by the `sedenion` crate.

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

| arm | params | probe_acc | eff_rank | gaussian↓ | isotropy↓ | min_std |
|---|--:|--:|--:|--:|--:|--:|
| Real baseline | 4112 | 90.3% | 2.66 | 0.2288 | 0.7541 | 0.4225 |
| Sedenion ZDA off | 272 | 87.4% | 9.44 | 0.4020 | 0.3025 | 0.0016 |
| Sedenion ZDA auto | 272 | **92.8%** | 5.99 | 0.1672 | 0.4158 | 0.4300 |

Support telemetry:

| arm | strong% | ghost% | bad% | r1% | r2% | r3% | r4% | zda_S | zda_G | zda_B |
|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| Real baseline | 0.5% | 15.7% | 83.8% | 0.5% | 0.1% | 0.0% | 15.6% | 0.487 | 0.930 | 0.611 |
| Sedenion ZDA off | 0.0% | 0.0% | 100.0% | 0.0% | 0.0% | 0.0% | 0.0% | n/a | n/a | 0.424 |
| Sedenion ZDA auto | 0.1% | 2.3% | 97.6% | 0.0% | 0.0% | 0.1% | 2.3% | 0.975 | 0.931 | 0.918 |

### Real — MNIST (3 seeds, 1200 train / 1200 test, frozen 784→256 backbone, 300 epochs, chance = 10%)

| arm | params | probe_acc | eff_rank | gaussian↓ | isotropy↓ | min_std |
|---|--:|--:|--:|--:|--:|--:|
| Real baseline | 4112 | 30.7% | 1.26 | 0.1821 | 0.9344 | 0.7451 |
| Sedenion ZDA off | 272 | 10.3% | 14.94 | 0.4020 | 0.1066 | 0.0000 |
| Sedenion ZDA auto | 272 | **41.0%** | 10.80 | 0.1905 | 0.2675 | 0.3213 |

Support telemetry:

| arm | strong% | ghost% | bad% | r1% | r2% | r3% | r4% | zda_S | zda_G | zda_B |
|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| Real baseline | 3.4% | 51.8% | 44.8% | 3.3% | 0.4% | 0.0% | 51.5% | 0.493 | 0.970 | 0.728 |
| Sedenion ZDA off | 0.0% | 0.0% | 100.0% | 0.0% | 0.0% | 0.0% | 0.0% | n/a | n/a | 0.579 |
| Sedenion ZDA auto | 0.3% | 0.1% | 99.6% | 0.0% | 0.1% | 0.2% | 0.1% | 0.877 | 0.899 | 0.628 |

`probe_acc` linear-probe accuracy · `eff_rank` effective rank of embedding cov
(16 = full) · `gaussian↓` held-out Epps-Pulley statistic against N(0,1) ·
`isotropy↓` distance from isotropic cov after trace normalization · `min_std`
smallest per-axis standard deviation.

Current runs also print triangular-root support telemetry over held-out
embeddings, using `|component| > 0.25` as the active-support threshold:

- `strong%`, `ghost%`, `bad%`: rate of DOI-package support classes.
- `r1%`..`r4%`: rooted-support rank mix among all held-out embeddings.
- `zda_S`, `zda_G`, `zda_B`: mean continuous `zda_score` conditioned on support
  class.

Read this as diagnostic evidence only: a `ghost` support says the coordinate span
contains some zero divisor, while `zda_score` says whether the actual coefficients
are near the continuous zero-divisor cone.

## What the numbers say

1. **The fixed SIGReg is not the same as the old standardized shape test.** It
   targets raw projections matching N(0,1), so scale collapse matters. The held-out
   statistic is materially nonzero in these runs, especially for the sedenion arm.

2. **ZDA-Reg is not bogus, but raw λ was the wrong interface.** The current
   parameter-free barrier lifts sedenion accuracy above dense on synthetic
   (92.8% vs 90.3%) and on MNIST (41.0% vs 30.7%).

3. **The collapse fix is visible.** `min_std` moves from near zero to 0.43
   synthetic and 0.32 MNIST, and held-out Gaussianity is no longer sacrificed:
   auto-ZDA is better than dense on synthetic (`0.1672` vs `0.2288`) and close to
   dense on MNIST (`0.1905` vs `0.1821`).

4. **The previous low-λ smell was useful.** It exposed that a raw coefficient was
   not a canonical implementation. Auto-balancing makes the comparison closer to
   SIGReg's no-manual-scale spirit.

## The honest cross-objective summary

| objective | synthetic: real vs sed | MNIST: real vs sed | who wins acc |
|---|---|---|---|
| VICReg proxy (PR #5) | 96.8 vs 96.6 | 32.4 vs **39.7** | sedenion (MNIST) |
| **Faithful SIGReg + auto-ZDA** | 90.3 vs **92.8** | 30.7 vs **41.0** | **sedenion + ZDA** |

The robust claim is narrower and stronger than the broken earlier story: ZDA-Reg
must be a repulsive, scale-aware barrier, and it should be balanced against the
base objective rather than tuned as a raw loss coefficient. In that form, it
rescues accuracy in this controlled harness without a λ sweep.

## Caveats (what this does *not* settle)

- Frozen random backbone + a 16-D *unsupervised* bottleneck caps absolute accuracy
  (MNIST is ~10–41% here); this is a controlled probe, not a tuned SSL system.
- SIGReg is verified at the loss/gradient level. The training loop is still a small
  full-batch sketch with fixed hyperparameters, not a reproduction of a full LeJEPA
  training recipe.
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
plus the SIGReg↔reference faithfulness check against `tools/ref_pure.py`. The
tables above are copied from fresh `cargo run --release` and
`cargo run --release -- mnist` output. `data/` (MNIST) is gitignored
(`./fetch_mnist.sh`).
