# nav-bakeoff — TESSERACT-BR claim, tested

A fair, reproducible head-to-head between a **standard Unscented Kalman Filter**
and the **Sedenion-UKF ("SUKF")** proposed in *TESSERACT-BR* on a low-cost MEMS
dead-reckoning problem. The goal is to settle one question with numbers rather
than rhetoric:

> Does mapping the navigation state into a 16-D sedenion and projecting MEMS bias
> drift onto zero-divisor manifolds ("drift annihilation") actually improve
> GPS-denied dead-reckoning?

**Short answer: no.** The best the sedenion machinery can do is tie the baseline,
and only when its one tunable knob is turned fully off. With the knob on, it makes
things worse. This crate lets you reproduce that in a few seconds.

## Why this is a fair test

* **One filter, one model.** Both estimators share the *exact same* UKF
  (`src/ukf.rs`) and the *exact same* strapdown process model (`src/filters.rs`).
  The only difference is the state representation: a plain 9-vector vs. the
  16-float `sedenion::Sedenion` embedding with the paper's zero-divisor
  annihilation applied each step. Any difference in results is therefore
  attributable to the sedenion idea alone.

* **Real sedenion algebra.** The SUKF variant uses the actual `sedenion` crate in
  this repo — the slot map (`velocity → e4..e6`, `position → e7..e9`,
  `accel bias → e13..e15`) and `Sedenion::zero_divisor_status()` — not a mock.

* **Steel-manned.** A `--duffing` flag adds cubic-stiffness nonlinearity to the
  true MEMS bias dynamics, exactly the regime the paper says linear filters
  "discard" and sedenions exploit.

* **Honest knob.** The annihilation strength is `λ ∈ [0,1]`. `λ=0` recovers the
  baseline bit-for-bit (enforced by a unit test); `λ=1` is the paper's full
  "drift annihilation". We sweep it so the *data* decides how much helps.

* **Guardrails.** `tests/sanity.rs` proves (a) the baseline mechanization is
  correct — a noise-free IMU dead-reckons with <1 mm error over 100 s — and
  (b) the `λ=0` SUKF is identical to the baseline.

## Results

16 seeds, 300 s, 50 Hz, representative low-cost MEMS
(white noise 0.05 m/s², bias instability random walk 0.002, initial bias ~2 mg).
Numbers are **horizontal-position RMSE in metres**.

### Linear MEMS

| estimator      | t=10 s | t=30 s | t=60 s | t=120 s | t=300 s |
|----------------|-------:|-------:|-------:|--------:|--------:|
| **Dead-reckoning (no aiding)** |||||
| Baseline UKF   | 1.4 | 12.0 | 48.8 | 199.0 | 1346.8 |
| SUKF λ=0.00    | 1.4 | 12.0 | 48.8 | 199.0 | 1346.8 |
| SUKF λ=1.00    | 1.4 | 12.0 | 48.8 | 199.0 | 1346.8 |
| **Aided (30 s position fix, σ=5 m)** |||||
| Baseline UKF   | 1.4 | 6.7 | 7.7 | 7.8 | **20.8** |
| SUKF λ=0.00    | 1.4 | 6.7 | 7.7 | 7.8 | **20.8** |
| SUKF λ=1.00    | 1.4 | 6.7 | 7.7 | 8.0 | **35.0** |

### Duffing-nonlinear MEMS (`--duffing`)

| estimator      | t=60 s | t=120 s | t=300 s |
|----------------|-------:|--------:|--------:|
| **Dead-reckoning** ||||
| Baseline UKF   | 45.2 | 171.8 | 962.5 |
| SUKF λ=1.00    | 45.2 | 171.8 | 962.5 |
| **Aided** ||||
| Baseline UKF   | 7.7 | 7.7 | **19.4** |
| SUKF λ=1.00    | 7.7 | 7.9 | **23.1** |

## What the numbers say

1. **In pure dead-reckoning the sedenion projection does literally nothing.**
   All λ values give identical drift. The reason is the whole point: with no
   aiding, the accelerometer bias is **unobservable**, so the filter's bias
   estimate never leaves its prior (~0). The drift to >1 km is driven by the
   *true* unestimated bias, double-integrated. No change of number system can
   recover information that the measurements do not contain. This is an
   information-theoretic / observability limit, not a limitation of "linear
   matrix math".

2. **Once aiding makes the bias observable, the annihilation step actively
   hurts** — RMSE grows (20.8 → 35.0 m linear; 19.4 → 23.1 m Duffing).
   Projecting the bias estimate onto the position direction throws away a
   correctly-estimated quantity.

3. **The optimum over the sweep is always λ=0**, i.e. "stop doing the sedenion
   thing." The standard UKF is the minimum-MSE estimator for this model; nothing
   beats it here, and the sedenion embedding can at best match it.

4. **The lever that actually bounds drift is aiding** (the 30 s position fix),
   not the state algebra — and it helps the baseline and the SUKF equally.
   That is where sovereign GPS-denied navigation effort should go: VIO,
   terrain-relative / map-matching, ZUPT, barometric and magnetic aids.

## Run it

```bash
cargo test  --release -p nav-bakeoff          # guardrails
cargo run   --release -p nav-bakeoff           # default: 16 seeds, 300 s, linear
cargo run   --release -p nav-bakeoff -- 32 300 --duffing
```

Writes `bakeoff_results.csv` (`mode,estimator,lambda,t_s,rmse_horizontal_m`) for plotting.

## Scope & caveats

* Attitude is assumed resolved into the nav frame, so the experiment isolates the
  position/velocity/accel-bias subspace — which is the dominant dead-reckoning
  error channel and exactly where the paper's zero-divisor claim lives. The
  gyro-bias side is analogous.
* The paper's "zero-divisor annihilation" is not formally defined, so
  `sedenion_zda()` is a good-faith operationalization of its prose. If there is a
  specific, well-posed alternative definition, drop it into that one function and
  re-run — the harness is built to make exactly that swap cheap.
