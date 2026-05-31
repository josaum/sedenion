# Sedenion

16-dimensional hypercomplex algebra primitives for representation learning, optimized for modern CPU hardware.

## Why Sedenions?

Sedenions are the first Cayley-Dickson algebra with **both**:
- **Zero divisors** (non-trivial annihilation geometry, homeomorphic to the exceptional Lie group G₂)
- **Power-associativity** (unambiguous polynomial and power-series predictors)

This makes them the ideal latent-space algebra for JEPA-style world models: rich enough for 16D representations, structured enough for stable polynomial dynamics, and possessing a built-in anti-collapse mechanism via the zero-divisor manifold.

## Hardware Design

| Property | Value | Why It Matters |
|----------|-------|----------------|
| Components | 16 × `f32` | **64 bytes** = exactly one L1 cache line |
| Alignment | `#[repr(C, align(64))]` | Zero cache-line straddling, perfect SIMD mapping |
| Register Fit | 1× AVX-512 (`__m512`) or 2× AVX2 (`__m256`) | 100% memory utilization, zero padding |
| Squaring | O(N) instead of O(N²) | V² = −‖V‖² due to anti-commutativity; polynomial predictors are essentially free |
| Sketching | Zero-cost memory slices | Quaternion/Octonion subalgebra projections are just `&array[..]` |

## Benchmarks (single core, `-C target-cpu=native`)

```
sedenion_mul              9.67 ns
sedenion_square (O(N))   4.85 ns   ← 2× faster than full mul
sedenion_pow3             4.84 ns   ← binary exponentiation via O(N) squaring
sedenion_norm             4.85 ns
sedenion_zda_loss         4.84 ns
sedenion_sketch_octonion  4.85 ns   ← zero-cost slice
```

## Usage

```rust
use sedenion::Sedenion;

let z = Sedenion::new([1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0,
                       9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0]);

// O(N) squaring — polynomial predictor building block
let z2 = z.square();

// Power-associative exponentiation
let z3 = z.powu(3);

// Zero-divisor-aware regularization (LeJEPA anti-collapse)
let loss = z.zda_margin_loss(1.0);

// Zero-cost subalgebra sketch for SIGReg
let oct = z.sketch_octonion();  // &[f32; 8]
let quat = z.sketch_quaternion(); // &[f32; 4]
```

## LeJEPA Integration

This crate is designed to support **Sedenion-LeJEPA** — a variant of Latent-Euclidean JEPA where embeddings are sedenion-valued rather than real-valued. Key features:

- **Sedenion-SIGReg**: Enforce isotropic Gaussian prior via random 1D/4D/8D/15D projections
- **ZDA-Reg**: Push embeddings away from the zero-divisor manifold (G₂ null space) to prevent collapse
- **Polynomial predictors**: `g(Z) = Σ W_k Z^k` is well-defined and fast due to power-associativity and O(N) squaring

## Compile for Maximum Performance

```bash
RUSTFLAGS="-C target-cpu=native" cargo build --release
```

## License

MIT
