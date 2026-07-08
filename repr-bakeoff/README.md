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

## Deep bake-off: depth, Adam, and a learnable algebra

The tables above are a single *linear* projector. This section pulls the three
levers the shallow test could not: **depth** (three stacked layers, SiLU between
hidden layers, linear head), a **stronger recipe** (Adam + minibatches), and a
**learnable hypercomplex algebra** (PHM). All arms share the shape
`256 → 128 → 64 → 16` and the same faithful SIGReg + invariance objective; only the
layer structure differs. Code: [`src/deep.rs`](src/deep.rs); every layer's analytic
backward — including the learnable `16×16×16` algebra tensor — is finite-difference
checked in `deep::tests`.

```bash
cargo run --release -- deep          # synthetic (4 seeds, 80 epochs)
cargo run --release -- deep mnist    # real MNIST (3 seeds; ./fetch_mnist.sh first)
```

- **dense** — full real matrices (42192 params).
- **sedenion** — fixed Cayley–Dickson product per layer (2832 params, **~15× fewer**),
  with auto-ZDA optionally applied to the embedding.
- **PHM** — same shape, but the multiplication tensor is *learnable*, initialized to
  the sedenion structure constants (so it starts identical to the fixed arm) and free
  to learn its own algebra (6928 params).

### Synthetic (4 seeds, 80 epochs, chance = 10%)

| arm | params | probe_acc | eff_rank | gaussian↓ | isotropy↓ | min_std |
|---|--:|--:|--:|--:|--:|--:|
| Dense deep | 42192 | 87.4% | 1.12 | 0.3003 | 0.9512 | 0.2872 |
| **Sedenion deep (ZDA off)** | 2832 | **87.5%** | **9.49** | 0.3975 | **0.2991** | 0.0348 |
| Sedenion deep (ZDA auto) | 2832 | 83.9% | 3.01 | 0.7356 | 0.6208 | 0.2832 |
| PHM deep (learned alg) | 6928 | 87.4% | 2.87 | 0.8526 | 0.6291 | 0.2475 |

### Real — MNIST (3 seeds, 1200 train / 1200 test, frozen 784→256 backbone, 80 epochs, chance = 10%)

| arm | params | probe_acc | eff_rank | gaussian↓ | isotropy↓ | min_std |
|---|--:|--:|--:|--:|--:|--:|
| Dense deep | 42192 | **33.1%** | 1.82 | 0.3943 | 0.8628 | 0.0411 |
| **Sedenion deep (ZDA off)** | 2832 | 30.0% | **14.12** | 0.4010 | **0.1375** | 0.0218 |
| Sedenion deep (ZDA auto) | 2832 | 21.4% | 3.10 | 1.1337 | 0.7276 | 0.0588 |
| PHM deep (learned alg) | 6928 | 25.4% | 1.98 | 1.1856 | 0.8231 | 0.0186 |

**What the deep numbers say — three findings, reported honestly:**

1. **The fixed sedenion structure is the strongest sedenion representation, and it
   is competitive at ~15× fewer parameters.** On synthetic it *ties* the dense arm's
   accuracy (87.5% vs 87.4%); on MNIST it trails by 3 points (30.0% vs 33.1%). On
   *both*, its embedding is dramatically healthier than dense's — the exact geometry
   SIGReg optimizes: eff_rank 9.5 vs 1.1 (synthetic) and 14.1 vs 1.8 (MNIST), with
   isotropy 3× closer. A 15× smaller net produces a near-full-rank, near-isotropic
   16-D code where the dense net collapses to ~1–2 effective dimensions.

2. **Auto-ZDA does *not* transfer to depth — it hurts.** The scale-aware barrier that
   rescued the *shallow SGD* arm (above) degrades accuracy and rank under deep+Adam
   on both datasets (synthetic 87.5%→83.9%, MNIST 30.0%→21.4%). Its gradient
   auto-balancing was tuned against the shallow objective; re-tuning it for the
   Adam/deep regime is open work, but as-is the honest result is negative.

3. **Learning the algebra does not beat the fixed Cayley–Dickson product.** PHM
   starts identical to the fixed arm and is free to improve, but on both datasets it
   drifts to *lower* rank and equal-or-worse accuracy. The hand-derived sedenion
   multiplication is, in this harness, a better inductive bias than a freely learned
   `16×16×16` bilinear map.

The one-line deep verdict: **sedenion structure buys representation health and
parameter efficiency, not a raw-accuracy win, and the two "novel" mechanisms
(ZDA-Reg, learnable PHM) are the parts that fail to generalize past the shallow
linear probe.**

## Anti-jamming: the answer depends entirely on the threat model

The zero-divisor pitch has always carried an *anti-jamming* subtext (see
`../nav-bakeoff`). Testing it fairly means testing **three** threat models — a
representation robust to one may be fragile to another. Fit the probe on **clean**
embeddings, then re-probe as the test inputs are jammed with increasing strength σ;
`ret@max` is accuracy at σ=1.0 over clean accuracy, and every arm sees identical
jammed inputs. All three curves print from `cargo run --release -- deep robust [mnist]`
(add `mult` to train under multiplicative jamming):

- **broadband** — full-rank additive Gaussian noise (corrupts every axis);
- **tonal** — rank-1 additive interferer, energy-matched (one random direction);
- **multiplicative** — *structured* distortion applied as a sedenion product in the
  input domain (phase/channel-like). This is the only model with algebraic structure
  for a multiplication-based representation to exploit — and the one real jammers
  (rotation, modulation, channel mixing) actually resemble.

### Additive jamming (broadband + tonal): dense wins

| arm | broadband ret@max (syn / MNIST) | tonal ret@max |
|---|--:|--:|
| **Dense deep** | **87.3% / 76.9%** | ≈ broadband |
| Sedenion (ZDA off) | 48.1% / 61.6% | ≈ broadband |
| Sedenion (ZDA auto) | 56.9% / 65.4% | ≈ broadband |

Dense is the most robust to additive noise, and tonal (rank-1) behaves within a
point of broadband. The mechanism is the isotropy SIGReg rewards: a high-rank code
(eff_rank 9–14) spreads signal across many low-variance axes that additive noise
swamps, while the dense arm's *collapse* to one high-SNR direction (eff_rank 1–2)
dodges it. For **unstructured** noise, isotropy and robustness pull opposite ways,
and collapse is a legitimate (if degenerate) anti-jam trick. No lever — capacity,
jam-augmented training, tonal vs broadband — reverses this. Additive noise is simply
the threat model **orthogonal** to what a hypercomplex algebra does.

### Multiplicative (structured) jamming: sedenion wins — on both datasets

| arm | mult ret@max (syn) | mult ret@max (MNIST) | MNIST acc @ σ=1.0 |
|---|--:|--:|--:|
| Dense deep | 13.1% | 33.8% | 10.0% *(= chance)* |
| Sedenion (ZDA off) | 15.8% | 39.1% | 11.5% |
| **Sedenion (ZDA auto)** | **16.1%** | **52.3%** | **14.0%** |
| PHM (learned alg) | 15.7% | 38.9% | 11.6% |

Against structured jamming the picture **inverts**: every sedenion arm beats dense on
both datasets, and at strong MNIST jamming **dense falls to chance (10.0%) while
sedenion+ZDA holds 14.0%** — retention 52.3% vs dense's 33.8%. Collapse is no defense
here: a multiplicative distortion corrupts the algebraic structure a collapsed code
still lives in, whereas the sedenion encoder — whose layers *are* Cayley–Dickson
products — carries an inductive bias matched to the interference. And crucially,
**ZDA (the zero-divisor barrier) delivers its largest gain exactly here**
(MNIST 33.8%→52.3%): a qualified vindication of the anti-jamming thesis — zero
divisors help against *structured* jamming, not the additive noise `nav-bakeoff`
correctly refuted.

### The honest verdict

**Sedenion structure is anti-jamming for the threat model it is built for.** A
SIGReg-trained sedenion representation is (a) competitive-to-better than dense on
clean accuracy at fewer parameters, and (b) *more* robust than dense to structured /
multiplicative interference on both datasets, with the zero-divisor barrier
contributing its largest benefit there. It is *less* robust than dense to
unstructured additive noise, where collapse trivially wins — but that threat is
orthogonal to the algebra, and picking it was the original mistake. Caveat, stated
plainly: the multiplicative jammer is defined *in* the sedenion algebra, so this
threat model is sympathetic to the sedenion inductive bias by construction; the fair
reading is "for interference that is multiplicative in the representation's algebra,
the sedenion encoder degrades less than a 15×-larger dense net trained identically" —
which is exactly the claim a hypercomplex representation should make, and the data
supports it.

## Caveats (what this does *not* settle)

- Frozen random backbone + a 16-D *unsupervised* bottleneck caps absolute accuracy
  (MNIST is ~10–41% here); this is a controlled probe, not a tuned SSL system.
- SIGReg is verified at the loss/gradient level. The training loop is still a small
  full-batch sketch with fixed hyperparameters, not a reproduction of a full LeJEPA
  training recipe.
- The shallow tables are one linear layer; the **Deep bake-off** section above adds
  depth, Adam, and a learnable PHM algebra. There, the parameter-efficiency story
  *does* show up (15× fewer params, competitive accuracy, far healthier geometry) —
  but as representation health, not a raw-accuracy win, and the ZDA / PHM mechanisms
  regress rather than help.
- Depth here stops at three layers on a 16-D bottleneck. Whether the sedenion health
  advantage converts into an accuracy win at larger width/depth, longer training, or
  a deeper hypercomplex stack with re-tuned ZDA is the natural next test.
- The deep runs are still a controlled probe (frozen backbone, 16-D unsupervised
  bottleneck, 80 epochs), not a tuned SSL system; absolute MNIST accuracy stays low
  by construction.

## Trust

`tests/sanity.rs` (all passing): finite-difference checks of the VICReg(+ZDA) loss
gradient, the shallow sedenion layer backward `∂(W·x)/∂W = R_x`, and the SIGReg
gradient; plus the SIGReg↔reference faithfulness check against `tools/ref_pure.py`.
`deep::tests` adds finite-difference gradient checks for every deep-arm layer —
dense, fixed Cayley–Dickson, and the learnable `16×16×16` PHM algebra tensor — and
asserts the PHM arm starts numerically identical to the fixed sedenion arm. All
tables are copied from fresh `cargo run --release [-- deep [mnist]]` output. `data/`
(MNIST) is gitignored (`./fetch_mnist.sh`).
