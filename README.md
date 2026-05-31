# sedenion

> A hardware-optimized **16-dimensional Cayley–Dickson algebra** in Rust — and an
> honest, reproducible investigation into what it is (and isn't) good for.

```
  ____            _           _
 / ___|  ___  ___| | ___ __ _(_)_ __ ___
 \___ \ / _ \/ _ \ |/ / '__| | | '_ ` _ \
  ___) |  __/  __/   <| |  | | | | | | | |
 |____/ \___|\___|_|\_\_|  |_|_|_| |_| |_|
```

Sedenions 𝕊 are the first Cayley–Dickson algebra to have **both** zero divisors and
power-associativity. That combination is interesting for two very different reasons,
and this repository explores both — one where it helps, one where it doesn't.

| Property | ℂ | ℍ | 𝕆 | **𝕊** |
|---|:-:|:-:|:-:|:-:|
| Dimension | 2 | 4 | 8 | **16** |
| Commutative | ✓ | ✗ | ✗ | ✗ |
| Associative | ✓ | ✓ | ✗ | ✗ |
| Alternative | ✓ | ✓ | ✓ | ✗ |
| Division (no zero divisors) | ✓ | ✓ | ✓ | ✗ |
| Power-associative | ✓ | ✓ | ✓ | **✓** |

---

## Two halves

### 1. `sedenion/` — the algebra crate

A single-precision `Sedenion` is **exactly 64 bytes** — one L1 cache line, one
AVX-512 register — with O(N) squaring, power-associative exponentiation, zero-cost
subalgebra sketches, zero-divisor detection (the manifold homeomorphic to the
exceptional Lie group **G₂**), and the left/right multiplication operators
`L_a, R_a`. It is built for **JEPA-style representation learning**, where the
zero-divisor geometry provides a built-in anti-collapse mechanism (ZDA-Reg).

→ See [`sedenion/README.md`](sedenion/README.md) and
[`sedenion_lejepa.md`](sedenion_lejepa.md). Benchmarks: `Sedenion × Sedenion` ≈ 9.7 ns,
`square()` ≈ 4.9 ns single-core with `-C target-cpu=native`.

```rust
use sedenion::Sedenion;
let z  = Sedenion::new([1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0,
                        9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0]);
let z2 = z.square();              // O(N) squaring
let l  = z.left_mul_matrix();     // 16×16 operator: l·b == z·b
```

### 2. `nav-bakeoff/` — does sedenion algebra help GPS-denied navigation?

A claim circulated that mapping an inertial-navigation state into a 16-D sedenion
automatically encodes the cross-domain (thermal, vibrational, nonlinear) couplings
that classical filters hand-craft, beating a standard UKF for MEMS dead-reckoning.
This half **tests that claim instead of arguing it** — and the answer is a
well-supported **no**:

- **Bakeoff:** a Sedenion-UKF and a standard UKF over identical IMU streams. In
  dead-reckoning they are identical (bias is unobservable); with aiding, switching
  the sedenion machinery on *degrades* RMSE (20.8 → 35.0 m). The optimum is always
  "off."
- **Bilinear probe:** the strapdown coupling is **~90% outside** everything the
  sedenion product can express (ρ ≈ 0.90–0.96). The algebra earns its keep only in
  the 4-D attitude corner — exactly where it reduces to quaternions.

The constructive verdict: **sedenions may be useful as a constrained bilinear
operator algebra, not as a physical state manifold.**

→ See [`nav-bakeoff/README.md`](nav-bakeoff/README.md), the full writeup
[`nav-bakeoff/PAPER.md`](nav-bakeoff/PAPER.md), and the operator/diagnostic notes in
[`nav-bakeoff/OPERATOR_ALGEBRA.md`](nav-bakeoff/OPERATOR_ALGEBRA.md).

---

## Quickstart

```bash
# the algebra crate (tests + benches)
cd sedenion      && cargo test --release && cargo bench

# the navigation investigation
cd ../nav-bakeoff && cargo test --release
cargo run --release -p nav-bakeoff                          # SUKF vs UKF bakeoff
cargo run --release -p nav-bakeoff -- 32 300 --duffing      # nonlinear MEMS
cargo run --release -p nav-bakeoff --bin bilinear-probe     # does physics live in 𝕊?
```

## Layout

```
sedenion/          16-D Cayley–Dickson algebra crate (+ L_a/R_a operators, ZDA, sketches)
  README.md        crate docs, hardware design, benchmarks, usage
nav-bakeoff/       GPS-denied navigation investigation (depends on the crate)
  README.md        the two experiments, results, reproducibility
  PAPER.md         full corrected writeup (pandoc-citable)
  OPERATOR_ALGEBRA.md   the L_a/R_a operators and the projection-residual probe
  references.bib   bibliography for PAPER.md
sedenion_lejepa.md LeJEPA / representation-learning integration notes
```

## Reproducibility & honesty

Every quantitative claim in `nav-bakeoff/PAPER.md` is produced by code here and
traced in its Appendix A claim-to-artifact map; the algebraic facts (`L_a·b = a·b`,
`L_{ab} ≠ L_a L_b`, `L_aᵀ = L_ā`, skew ⇒ SO(16), zero-divisor singularity) are
checked by `cargo test`. Where a claim couldn't be reproduced, the number was
changed to match the harness — not the other way around.
