# Sedenion

> 16-dimensional hypercomplex algebra for representation learning, optimized for modern CPU hardware.

```
  ____            _           _            
 / ___|  ___  ___| | ___ __ _(_)_ __ ___  
 \___ \ / _ \/ _ \ |/ / '__| | | '_ ` _ \ 
  ___) |  __/  __/   <| |  | | | | | | | |
 |____/ \___|\___|_|\_\_|  |_|_|_| |_| |_|
```

---

## Why Sedenions?

Sedenions are the first Cayley-Dickson algebra with **both**:
- **Zero divisors** — non-trivial annihilation geometry, homeomorphic to the exceptional Lie group **G₂**
- **Power-associativity** — unambiguous polynomial and power-series predictors

This makes them the ideal latent-space algebra for JEPA-style world models: rich enough for 16D representations, structured enough for stable polynomial dynamics, and possessing a built-in anti-collapse mechanism via the zero-divisor manifold.

| Property | ℂ | ℍ | 𝕆 | **𝕊** |
|----------|:-:|:-:|:-:|:-:|
| Dimension | 2 | 4 | 8 | **16** |
| Commutative | ✓ | ✗ | ✗ | ✗ |
| Associative | ✓ | ✓ | ✗ | ✗ |
| Alternative | ✓ | ✓ | ✓ | ✗ |
| Division | ✓ | ✓ | ✓ | ✗ |
| Zero Divisors | ✗ | ✗ | ✗ | **✓** |
| Power-Associative | ✓ | ✓ | ✓ | **✓** |

---

## Hardware Design

A single-precision Sedenion is **exactly 64 bytes** — the perfect hardware Goldilocks zone:

| Property | Value | Why It Matters |
|----------|-------|----------------|
| Size | 16 × `f32` = **64 bytes** | Exactly one L1 cache line |
| Alignment | `#[repr(C, align(64))]` | Zero cache-line straddling |
| Register Fit | 1× AVX-512 (`__m512`) or 2× AVX2 (`__m256`) | 100% memory utilization, zero padding |
| Squaring | **O(N)** instead of O(N²) | V² = −‖V‖² due to anti-commutativity; polynomial predictors are essentially free |
| Sketching | Zero-cost memory slices | Quaternion/Octonion subalgebra projections are just `&array[..]` |

---

## Benchmarks

Single core, compiled with `-C target-cpu=native`:

| Operation | Latency | Throughput |
|-----------|---------|------------|
| `Sedenion × Sedenion` | **9.67 ns** | ~100M ops/sec |
| `Sedenion.square()` (O(N)) | **4.85 ns** | ~200M ops/sec |
| `Sedenion.powu(3)` | **4.84 ns** | Binary exponentiation via O(N) squaring |
| `norm_sq` | **4.85 ns** | Auto-vectorized SIMD dot-product |
| `zda_loss` | **4.84 ns** | Zero-divisor regularization |
| `sketch_octonion` | **4.85 ns** | Zero-cost slice |

---

## Usage

```rust
use sedenion::Sedenion;

// Create a sedenion from 16 real components
let z = Sedenion::new([1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0,
                       9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0]);

// O(N) squaring — polynomial predictor building block
let z2 = z.square();  // 4.85 ns

// Power-associative exponentiation
let z3 = z.powu(3);  // 4.84 ns via binary exponentiation

// Zero-divisor-aware regularization (LeJEPA anti-collapse)
let loss = z.zda_margin_loss(1.0);

// Zero-cost subalgebra sketches for SIGReg
let oct = z.sketch_octonion();   // &[f32; 8]
let quat = z.sketch_quaternion(); // &[f32; 4]
let imag = z.sketch_imaginary();  // &[f32; 15]
```

---

## LeJEPA Integration

This crate is designed to support **Sedenion-LeJEPA** — a variant of [Latent-Euclidean JEPA](https://arxiv.org/abs/2511.08544) where embeddings are sedenion-valued rather than real-valued.

### Key Features

| Feature | Standard LeJEPA (R^d) | Sedenion-LeJEPA (𝕊^k) |
|---------|----------------------|------------------------|
| **Parameter Efficiency** | d² parameters | 16× reduction via multiplication table reuse |
| **Latent Dynamics** | Linear/Polynomial | Polynomial with non-commutative interactions |
| **Collapse Prevention** | Global isotropic Gaussian | Gaussian + Zero-Divisor-Aware regularization |
| **Geometric Structure** | Flat Euclidean | G₂-exceptional symmetry embedded |
| **Multi-Scale Projections** | 1D random lines | 1D, 4D, 8D, 15D subalgebra projections |
| **Built-in Symmetry** | None | Exceptional G₂ in the zero-divisor geometry |

### Sedenion-SIGReg

Instead of only projecting onto random 1D lines in R^d, project onto **random subalgebras** of the sedenion:
- **1D sketch**: Standard random line in R^16
- **4D sketch**: Random quaternion subalgebra
- **8D sketch**: Random octonion subalgebra
- **15D sketch**: Pure-imaginary subspace

Each projection is tested for Gaussianity. This gives **multi-scale isotropy** — the latent space is locally flat at the 16D level, but also constrained to be Gaussian within its natural 4D and 8D substructures.

### ZDA-Reg: Zero-Divisor-Aware Regularization

A sedenion `Z = (A, B)` is a zero divisor iff:
- `||A|| = ||B||` (equal norm)
- `A · B = 0` (orthogonal)
- `A` and `B` are pure-imaginary

The ZDA-Reg loss penalizes proximity to the zero-divisor manifold:

```
L_ZDA = (||A||² - ||B||²)² + (A · B)²
```

**Why this matters:**
- **Anti-collapse**: If the encoder collapses to a zero divisor, the predictor can hit `Z · W = 0` for non-zero `W` and lose information. ZDA-Reg pushes embeddings away from this algebraic null space.
- **G₂ geometry**: The unit zero-divisor set is homeomorphic to the exceptional Lie group **G₂**. By controlling distance to this manifold, you embed exceptional symmetry into the latent space in a way no standard R^d or C^d space can.

---

## The O(N) Squaring Trick

For `Z = z₀ + V` where `V` is pure-imaginary:

```
V² = -||V||²
```

Because cross-terms `e_i · e_j + e_j · e_i = 0` cancel. This means:

```
Z² = (z₀² - ||V||²) + 2·z₀·V
```

**One dot product + 16 scalar multiplies** instead of 256 multiplications. This makes polynomial predictors `g(Z) = Σ W_k Z^k` essentially free — the power terms cost the same as the linear term.

---

## Architecture

```
sedenion/
├── src/
│   └── lib.rs          # Core algebra + matrix ops + SIGReg utilities
├── benches/
│   └── sedenion_bench.rs  # Criterion benchmarks (mul, square, pow, norm, zda, sketch)
├── Cargo.toml
└── README.md
```

### Core Types

- `Quaternion` — 4D, Hamilton product
- `Octonion` — 8D, Cayley-Dickson construction
- `Sedenion` — 16D, `#[repr(C, align(64))]`
- `SedenionMatrix` — weight matrix for sedenion linear layers with backward pass

### Key Methods

| Method | Description | Complexity |
|--------|-------------|------------|
| `Sedenion::mul` | Full Cayley-Dickson multiplication | O(N²) ~ 256 ops |
| `Sedenion::square` | O(N) squaring via anti-commutativity | O(N) ~ 16 ops |
| `Sedenion::powu` | Binary exponentiation (uses `square`) | O(log n) |
| `Sedenion::norm_sq` | Isotropic norm for SIGReg | O(N) SIMD |
| `Sedenion::zda_loss` | Zero-divisor distance | O(N) SIMD |
| `Sedenion::zda_margin_loss` | Margin-based ZDA-Reg | O(N) SIMD |
| `Sedenion::sketch_*` | Subalgebra projections | O(1) zero-cost |
| `SedenionMatrix::matvec` | Linear transform | O(rows × cols × N²) |
| `SedenionMatrix::matvec_backward` | Backprop gradients | O(rows × cols × N²) |

---

## Build

### Standard
```bash
cd sedenion
cargo build --release
```

### Maximum Performance (auto-vectorization)
```bash
RUSTFLAGS="-C target-cpu=native" cargo build --release
```

### Run Tests
```bash
cargo test
```

### Run Benchmarks
```bash
cargo bench
```

---

## Research Context

This crate implements the algebraic primitives described in the paper **"Sedenion-LeJEPA: Isotropic Gaussian Embedding in 16D Hypercomplex Latent Space"** (in preparation). It bridges:

- **LeJEPA** (Balestriero & LeCun, 2025): Isotropic Gaussian regularization for self-supervised learning
- **Sedenion algebra** (Cayley-Dickson construction): The unique 16D algebra with both zero divisors and power-associativity
- **G₂ exceptional symmetry**: The natural geometry of sedenion zero divisors

The goal is to replace ad-hoc collapse-prevention heuristics (stop-gradients, teacher-student, asymmetric branches) with a single, principled algebraic constraint: **stay away from the G₂ null space**.

---

## License

MIT

---

> "Sedenions are the simplest algebra where non-trivial annihilation coexists with well-defined polynomial dynamics. This makes them the natural 'next step' beyond quaternion and octonion neural networks for latent world models."
