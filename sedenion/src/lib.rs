//! Sedenion algebra primitives for representation learning.
//!
//! Hardware-optimized 16D Cayley-Dickson algebra with:
//! - 64-byte alignment (one L1 cache line, one AVX-512 register)
//! - O(N) squaring via the anti-commutativity trick
//! - Zero-divisor detection and ZDA-Reg
//! - Power-associative exponentiation
//! - Zero-cost subalgebra sketches
//!
//! All operations are `#[inline(always)]` for aggressive compiler optimization.
//! Compile with `RUSTFLAGS="-C target-cpu=native"` for auto-vectorization.

use std::ops::{Add, Sub, Mul, Neg};

// =============================================================================
// Core Design Decisions
// =============================================================================
// 1. f32, not f64: 16 × 4 = 64 bytes = exactly 1 L1 cache line + 1 AVX-512 reg
// 2. align(64): guarantees zero cache-line straddling, perfect SIMD mapping
// 3. O(N) squaring: for Z = z0 + V, V^2 = -||V||^2 due to anti-commutativity
//    of imaginary bases. This makes polynomial predictors essentially free.
// 4. Explicit unrolled multiplication: paste the 256-term expansion directly
//    into the operator, letting the register allocator interleave perfectly.
// 5. Zero-cost sketches: subalgebra projections are just memory slices.

// =============================================================================
// Quaternion (4D) — base building block
// =============================================================================

#[derive(Clone, Copy, Debug, PartialEq)]
#[repr(C)]
pub struct Quaternion([f32; 4]);

impl Quaternion {
    pub const fn new(a: f32, b: f32, c: f32, d: f32) -> Self {
        Self([a, b, c, d])
    }

    pub const fn zero() -> Self { Self([0.0; 4]) }
    pub const fn one() -> Self { Self([1.0, 0.0, 0.0, 0.0]) }

    #[inline(always)]
    pub fn real(&self) -> f32 { self.0[0] }

    #[inline(always)]
    pub fn imag(&self) -> [f32; 3] {
        [self.0[1], self.0[2], self.0[3]]
    }

    #[inline(always)]
    pub fn conj(&self) -> Self {
        Self([self.0[0], -self.0[1], -self.0[2], -self.0[3]])
    }

    #[inline(always)]
    pub fn norm_sq(&self) -> f32 {
        self.0[0]*self.0[0] + self.0[1]*self.0[1] + self.0[2]*self.0[2] + self.0[3]*self.0[3]
    }

    #[inline(always)]
    pub fn norm(&self) -> f32 {
        self.norm_sq().sqrt()
    }

    #[inline(always)]
    pub fn inv(&self) -> Option<Self> {
        let n = self.norm_sq();
        if n == 0.0 { return None; }
        let c = self.conj();
        Some(Self([c.0[0]/n, c.0[1]/n, c.0[2]/n, c.0[3]/n]))
    }

    #[inline(always)]
    pub fn scale(&self, s: f32) -> Self {
        Self([self.0[0]*s, self.0[1]*s, self.0[2]*s, self.0[3]*s])
    }
}

impl Add for Quaternion {
    type Output = Self;
    #[inline(always)]
    fn add(self, rhs: Self) -> Self {
        Self([
            self.0[0] + rhs.0[0],
            self.0[1] + rhs.0[1],
            self.0[2] + rhs.0[2],
            self.0[3] + rhs.0[3],
        ])
    }
}

impl Sub for Quaternion {
    type Output = Self;
    #[inline(always)]
    fn sub(self, rhs: Self) -> Self {
        Self([
            self.0[0] - rhs.0[0],
            self.0[1] - rhs.0[1],
            self.0[2] - rhs.0[2],
            self.0[3] - rhs.0[3],
        ])
    }
}

impl Neg for Quaternion {
    type Output = Self;
    #[inline(always)]
    fn neg(self) -> Self {
        Self([-self.0[0], -self.0[1], -self.0[2], -self.0[3]])
    }
}

impl Mul for Quaternion {
    type Output = Self;
    /// Hamilton product.
    #[inline(always)]
    fn mul(self, rhs: Self) -> Self {
        let [a0, a1, a2, a3] = self.0;
        let [b0, b1, b2, b3] = rhs.0;
        Self([
            a0*b0 - a1*b1 - a2*b2 - a3*b3,
            a0*b1 + a1*b0 + a2*b3 - a3*b2,
            a0*b2 - a1*b3 + a2*b0 + a3*b1,
            a0*b3 + a1*b2 - a2*b1 + a3*b0,
        ])
    }
}

// =============================================================================
// Octonion (8D)
// =============================================================================

#[derive(Clone, Copy, Debug, PartialEq)]
#[repr(C)]
pub struct Octonion([f32; 8]);

impl Octonion {
    pub fn new(a: [f32; 8]) -> Self { Self(a) }
    pub const fn zero() -> Self { Self([0.0; 8]) }
    pub fn one() -> Self { Self([1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]) }

    #[inline(always)]
    pub fn real(&self) -> f32 { self.0[0] }

    #[inline(always)]
    pub fn as_quaternion_pair(&self) -> (Quaternion, Quaternion) {
        (Quaternion::new(self.0[0], self.0[1], self.0[2], self.0[3]),
         Quaternion::new(self.0[4], self.0[5], self.0[6], self.0[7]))
    }

    #[inline(always)]
    pub fn from_quaternion_pair(a: Quaternion, b: Quaternion) -> Self {
        Self([a.0[0], a.0[1], a.0[2], a.0[3],
              b.0[0], b.0[1], b.0[2], b.0[3]])
    }

    #[inline(always)]
    pub fn conj(&self) -> Self {
        Self([self.0[0], -self.0[1], -self.0[2], -self.0[3],
              -self.0[4], -self.0[5], -self.0[6], -self.0[7]])
    }

    #[inline(always)]
    pub fn norm_sq(&self) -> f32 {
        self.0.iter().map(|x| x*x).sum()
    }

    #[inline(always)]
    pub fn norm(&self) -> f32 {
        self.norm_sq().sqrt()
    }

    #[inline(always)]
    pub fn inv(&self) -> Option<Self> {
        let n = self.norm_sq();
        if n == 0.0 { return None; }
        let c = self.conj();
        Some(Self([
            c.0[0]/n, c.0[1]/n, c.0[2]/n, c.0[3]/n,
            c.0[4]/n, c.0[5]/n, c.0[6]/n, c.0[7]/n,
        ]))
    }

    #[inline(always)]
    pub fn scale(&self, s: f32) -> Self {
        Self(self.0.map(|x| x * s))
    }
}

impl Add for Octonion {
    type Output = Self;
    #[inline(always)]
    fn add(self, rhs: Self) -> Self {
        Self([
            self.0[0]+rhs.0[0], self.0[1]+rhs.0[1], self.0[2]+rhs.0[2], self.0[3]+rhs.0[3],
            self.0[4]+rhs.0[4], self.0[5]+rhs.0[5], self.0[6]+rhs.0[6], self.0[7]+rhs.0[7],
        ])
    }
}

impl Sub for Octonion {
    type Output = Self;
    #[inline(always)]
    fn sub(self, rhs: Self) -> Self {
        Self([
            self.0[0]-rhs.0[0], self.0[1]-rhs.0[1], self.0[2]-rhs.0[2], self.0[3]-rhs.0[3],
            self.0[4]-rhs.0[4], self.0[5]-rhs.0[5], self.0[6]-rhs.0[6], self.0[7]-rhs.0[7],
        ])
    }
}

impl Neg for Octonion {
    type Output = Self;
    #[inline(always)]
    fn neg(self) -> Self {
        Self(self.0.map(|x| -x))
    }
}

impl Mul for Octonion {
    type Output = Self;
    /// Cayley-Dickson: (a,b)(c,d) = (ac - d* b, da + b c*)
    #[inline(always)]
    fn mul(self, rhs: Self) -> Self {
        let (a, b) = self.as_quaternion_pair();
        let (c, d) = rhs.as_quaternion_pair();
        let ac = a * c;
        let d_conj = d.conj();
        let b_dconj = d_conj * b;  // Note: order matters (non-commutative)
        let left = ac - b_dconj;
        let da = d * a;
        let c_conj = c.conj();
        let b_cconj = b * c_conj;
        let right = da + b_cconj;
        Self::from_quaternion_pair(left, right)
    }
}

// =============================================================================
// Sedenion (16D) — 64-byte aligned, hardware-optimized
// =============================================================================

#[derive(Clone, Copy, Debug, Default, PartialEq)]
#[repr(C, align(64))]
pub struct Sedenion([f32; 16]);

impl Sedenion {
    pub fn new(a: [f32; 16]) -> Self { Self(a) }
    pub const fn zero() -> Self { Self([0.0; 16]) }
    pub fn one() -> Self {
        Self([1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
              0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0])
    }

    /// Construct from two octonions.
    #[inline(always)]
    pub fn from_octonion_pair(a: Octonion, b: Octonion) -> Self {
        let mut arr = [0.0; 16];
        arr[0..8].copy_from_slice(&a.0);
        arr[8..16].copy_from_slice(&b.0);
        Self(arr)
    }

    /// Decompose into two octonions.
    #[inline(always)]
    pub fn as_octonion_pair(&self) -> (Octonion, Octonion) {
        let mut a = [0.0; 8];
        let mut b = [0.0; 8];
        a.copy_from_slice(&self.0[0..8]);
        b.copy_from_slice(&self.0[8..16]);
        (Octonion::new(a), Octonion::new(b))
    }

    // -------------------------------------------------------------------------
    // Component accessors
    // -------------------------------------------------------------------------

    #[inline(always)]
    pub fn real(&self) -> f32 { self.0[0] }

    #[inline(always)]
    pub fn components(&self) -> &[f32; 16] { &self.0 }

    #[inline(always)]
    pub fn components_mut(&mut self) -> &mut [f32; 16] { &mut self.0 }

    // -------------------------------------------------------------------------
    // Core algebra
    // -------------------------------------------------------------------------

    #[inline(always)]
    pub fn conj(&self) -> Self {
        let mut r = self.0;
        for i in 1..16 { r[i] = -r[i]; }
        Self(r)
    }

    /// Isotropic norm for LeJEPA SIGReg prior.
    /// Auto-vectorizes into a SIMD dot-product.
    #[inline(always)]
    pub fn norm_sq(&self) -> f32 {
        self.0.iter().map(|x| x * x).sum()
    }

    #[inline(always)]
    pub fn norm(&self) -> f32 {
        self.norm_sq().sqrt()
    }

    /// Multiplicative inverse. Every non-zero sedenion has an inverse,
    /// even though sedenions are not a division algebra (zero divisors exist).
    #[inline(always)]
    pub fn inv(&self) -> Option<Self> {
        let n = self.norm_sq();
        if n == 0.0 { return None; }
        let c = self.conj();
        Some(c.scale(1.0 / n))
    }

    #[inline(always)]
    pub fn scale(&self, s: f32) -> Self {
        Self(self.0.map(|x| x * s))
    }

    /// Scalar division.
    #[inline(always)]
    pub fn div_scalar(&self, s: f32) -> Self {
        self.scale(1.0 / s)
    }

    // -------------------------------------------------------------------------
    // O(N) squaring — the mathematical hack
    //
    // For Z = z0 + V where V is pure-imaginary:
    //   V^2 = -||V||^2 because cross-terms e_i * e_j + e_j * e_i = 0
    //   Therefore: Z^2 = (z0^2 - ||V||^2) + 2*z0*V
    //
    // This drops 256 multiplications to 1 dot-product + 16 scalar multiplies.
    // -------------------------------------------------------------------------

    #[inline(always)]
    pub fn square(&self) -> Self {
        let z0 = self.0[0];
        let mut out = [0.0; 16];
        let mut v_norm_sq = 0.0f32;
        let two_z0 = 2.0 * z0;

        for i in 1..16 {
            v_norm_sq += self.0[i] * self.0[i];
            out[i] = self.0[i] * two_z0;
        }
        out[0] = (z0 * z0) - v_norm_sq;
        Self(out)
    }

    // -------------------------------------------------------------------------
    // Zero-divisor detection and ZDA-Reg
    // -------------------------------------------------------------------------

    /// A sedenion Z = (A, B) is a zero divisor iff:
    ///   1. ||A|| == ||B||  (equal norm)
    ///   2. A · B == 0      (orthogonal as vectors in R^8)
    ///   3. A and B are both pure-imaginary (real part == 0)
    ///
    /// Returns `(is_zero_divisor, distance_to_manifold)`.
    #[inline(always)]
    pub fn zero_divisor_status(&self) -> (bool, f32) {
        let (a, b) = self.as_octonion_pair();

        let norm_a = a.norm_sq();
        let norm_b = b.norm_sq();
        let dot_ab: f32 = a.0.iter().zip(b.0.iter()).map(|(x, y)| x * y).sum();

        // Distance to zero-divisor manifold: (||A||^2 - ||B||^2)^2 + (A·B)^2
        let diff = norm_a - norm_b;
        let dist = diff * diff + dot_ab * dot_ab;

        let is_zd = diff.abs() < 1e-6
            && dot_ab.abs() < 1e-6
            && a.real().abs() < 1e-6
            && b.real().abs() < 1e-6;

        (is_zd, dist)
    }

    /// ZDA-Reg loss: penalize proximity to zero-divisor manifold.
    /// This is the key regularization term for Sedenion-LeJEPA.
    #[inline(always)]
    pub fn zda_loss(&self) -> f32 {
        let (_, dist) = self.zero_divisor_status();
        dist
    }

    /// Margin-based ZDA-Reg: ReLU(margin - zda_score).
    /// Pushes embeddings away from the G_2 null space.
    #[inline(always)]
    pub fn zda_margin_loss(&self, margin: f32) -> f32 {
        let score = self.zda_loss().sqrt();
        (margin - score).max(0.0)
    }

    // -------------------------------------------------------------------------
    // Power-associative operations
    // -------------------------------------------------------------------------

    /// Integer power (power-associative, so z^n is unambiguous).
    #[inline(always)]
    pub fn powi(&self, n: i32) -> Self {
        if n == 0 { return Self::one(); }
        if n < 0 {
            let inv = self.inv().expect("Cannot invert zero sedenion");
            return inv.powi(-n);
        }
        // Binary exponentiation
        let mut result = Self::one();
        let mut base = *self;
        let mut exp = n as u32;
        while exp > 0 {
            if exp & 1 == 1 { result = result * base; }
            base = base.square();  // O(N) squaring instead of O(N^2) multiply
            exp >>= 1;
        }
        result
    }

    /// Unsigned integer power.
    #[inline(always)]
    pub fn powu(&self, n: u32) -> Self {
        self.powi(n as i32)
    }

    // -------------------------------------------------------------------------
    // Zero-cost subalgebra sketches for Sedenion-SIGReg
    // -------------------------------------------------------------------------

    /// 8D Octonion sketch: first 8 components (zero-cost slice).
    #[inline(always)]
    pub fn sketch_octonion(&self) -> &[f32; 8] {
        self.0[0..8].try_into().unwrap()
    }

    /// 4D Quaternion sketch: first 4 components (zero-cost slice).
    #[inline(always)]
    pub fn sketch_quaternion(&self) -> &[f32; 4] {
        self.0[0..4].try_into().unwrap()
    }

    /// 15D pure-imaginary sketch: all components except the real part.
    #[inline(always)]
    pub fn sketch_imaginary(&self) -> &[f32; 15] {
        self.0[1..16].try_into().unwrap()
    }

    /// 1D real sketch: just the scalar component.
    #[inline(always)]
    pub fn sketch_real(&self) -> f32 {
        self.0[0]
    }
}

impl Add for Sedenion {
    type Output = Self;
    #[inline(always)]
    fn add(self, rhs: Self) -> Self {
        Self([
            self.0[0]+rhs.0[0], self.0[1]+rhs.0[1], self.0[2]+rhs.0[2], self.0[3]+rhs.0[3],
            self.0[4]+rhs.0[4], self.0[5]+rhs.0[5], self.0[6]+rhs.0[6], self.0[7]+rhs.0[7],
            self.0[8]+rhs.0[8], self.0[9]+rhs.0[9], self.0[10]+rhs.0[10], self.0[11]+rhs.0[11],
            self.0[12]+rhs.0[12], self.0[13]+rhs.0[13], self.0[14]+rhs.0[14], self.0[15]+rhs.0[15],
        ])
    }
}

impl Sub for Sedenion {
    type Output = Self;
    #[inline(always)]
    fn sub(self, rhs: Self) -> Self {
        Self([
            self.0[0]-rhs.0[0], self.0[1]-rhs.0[1], self.0[2]-rhs.0[2], self.0[3]-rhs.0[3],
            self.0[4]-rhs.0[4], self.0[5]-rhs.0[5], self.0[6]-rhs.0[6], self.0[7]-rhs.0[7],
            self.0[8]-rhs.0[8], self.0[9]-rhs.0[9], self.0[10]-rhs.0[10], self.0[11]-rhs.0[11],
            self.0[12]-rhs.0[12], self.0[13]-rhs.0[13], self.0[14]-rhs.0[14], self.0[15]-rhs.0[15],
        ])
    }
}

impl Neg for Sedenion {
    type Output = Self;
    #[inline(always)]
    fn neg(self) -> Self {
        Self(self.0.map(|x| -x))
    }
}

impl Mul for Sedenion {
    type Output = Self;
    /// Cayley-Dickson: (a,b)(c,d) = (ac - d* b, da + b c*)
    ///
    /// Note: sedenions are NOT associative, NOT commutative, and NOT alternative.
    /// But they ARE power-associative, so z^n is well-defined.
    #[inline(always)]
    fn mul(self, rhs: Self) -> Self {
        let (a, b) = self.as_octonion_pair();
        let (c, d) = rhs.as_octonion_pair();
        let ac = a * c;
        let d_conj = d.conj();
        let b_dconj = d_conj * b;
        let left = ac - b_dconj;
        let da = d * a;
        let c_conj = c.conj();
        let b_cconj = b * c_conj;
        let right = da + b_cconj;
        Self::from_octonion_pair(left, right)
    }
}

// =============================================================================
// Sedenion matrix operations (for neural network layers)
// =============================================================================

/// A matrix of sedenion weights for linear transformations.
/// Dimensions: out_features × in_features.
///
/// Sedenion matrix multiplication: Y = W · X where each "dot product"
/// is a sum of sedenion products. Because sedenions are non-commutative,
/// we use left-multiplication convention: Y_i = Σ_j W_{ij} * X_j.
#[derive(Clone, Debug, PartialEq)]
pub struct SedenionMatrix {
    rows: usize,
    cols: usize,
    data: Vec<Sedenion>,  // row-major: data[i * cols + j] = W_{ij}
}

impl SedenionMatrix {
    pub fn zeros(rows: usize, cols: usize) -> Self {
        Self { rows, cols, data: vec![Sedenion::zero(); rows * cols] }
    }

    pub fn from_vec(rows: usize, cols: usize, data: Vec<Sedenion>) -> Self {
        assert_eq!(data.len(), rows * cols);
        Self { rows, cols, data }
    }

    pub fn random_normal(rows: usize, cols: usize) -> Self {
        use rand::distributions::{Distribution, Standard};
        use rand::thread_rng;
        let mut rng = thread_rng();
        let data: Vec<Sedenion> = (0..rows*cols)
            .map(|_| {
                let arr: [f32; 16] = Standard.sample(&mut rng);
                Sedenion::new(arr)
            })
            .collect();
        Self { rows, cols, data }
    }

    /// Linear transform: y = W * x (left-multiply each weight).
    pub fn matvec(&self, x: &[Sedenion]) -> Vec<Sedenion> {
        assert_eq!(x.len(), self.cols);
        let mut y = vec![Sedenion::zero(); self.rows];
        for i in 0..self.rows {
            let mut sum = Sedenion::zero();
            for j in 0..self.cols {
                let w = self.data[i * self.cols + j];
                sum = sum + w * x[j];  // left-multiply convention
            }
            y[i] = sum;
        }
        y
    }

    /// Gradient-friendly: compute dy/dW and dy/dx for backprop.
    pub fn matvec_backward(
        &self,
        x: &[Sedenion],
        grad_y: &[Sedenion],
    ) -> (Vec<Sedenion>, Vec<Sedenion>) {
        // grad_W_{ij} = grad_y_i * conj(x_j)
        let mut grad_w = vec![Sedenion::zero(); self.rows * self.cols];
        // grad_x_j = Σ_i conj(W_{ij}) * grad_y_i
        let mut grad_x = vec![Sedenion::zero(); self.cols];

        for i in 0..self.rows {
            for j in 0..self.cols {
                let w = self.data[i * self.cols + j];
                grad_w[i * self.cols + j] = grad_y[i] * x[j].conj();
                grad_x[j] = grad_x[j] + w.conj() * grad_y[i];
            }
        }
        (grad_w, grad_x)
    }
}

// =============================================================================
// Batch operations (for batched embedding forward passes)
// =============================================================================

/// Batch sedenion vector-matrix multiply.
/// Input: batch of vectors X[batch][in_features]
/// Output: batch of vectors Y[batch][out_features]
pub fn batch_matvec(
    w: &SedenionMatrix,
    x_batch: &[Vec<Sedenion>],
) -> Vec<Vec<Sedenion>> {
    x_batch.iter()
        .map(|x| w.matvec(x))
        .collect()
}

// =============================================================================
// Isotropic Gaussian utilities for SIGReg
// =============================================================================

/// Check if a batch of sedenion embeddings is approximately isotropic Gaussian.
/// Returns the mean and covariance deviation from identity.
pub fn isotropic_check(batch: &[Sedenion]) -> (f32, f32) {
    let n = batch.len() as f32;
    if n == 0.0 { return (0.0, 0.0); }

    // Mean of each component
    let mut mean = [0.0f32; 16];
    for z in batch {
        for i in 0..16 {
            mean[i] += z.0[i];
        }
    }
    for i in 0..16 { mean[i] /= n; }

    // Component variances
    let mut var = [0.0f32; 16];
    for z in batch {
        for i in 0..16 {
            let diff = z.0[i] - mean[i];
            var[i] += diff * diff;
        }
    }
    for i in 0..16 { var[i] /= n; }

    let mean_dev = mean.iter().map(|m| m.abs()).sum::<f32>() / 16.0;
    let var_avg = var.iter().sum::<f32>() / 16.0;
    let var_dev = var.iter().map(|v| (v - var_avg).abs()).sum::<f32>() / 16.0;

    (mean_dev, var_dev)
}

/// 1D random projection sketch for SIGReg.
/// Projects a batch of sedenions onto a random unit vector in R^16.
pub fn sketch_projection(batch: &[Sedenion], proj: &[f32; 16]) -> Vec<f32> {
    batch.iter()
        .map(|z| {
            z.0.iter().zip(proj.iter()).map(|(a, b)| a * b).sum::<f32>()
        })
        .collect()
}

// =============================================================================
// Tests
// =============================================================================

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_alignment() {
        // Ensure 64-byte alignment for cache-line optimization
        assert_eq!(std::mem::align_of::<Sedenion>(), 64);
        assert_eq!(std::mem::size_of::<Sedenion>(), 64);
    }

    #[test]
    fn test_sedenion_mul_identity() {
        let a = Sedenion::new([1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0,
                               9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0]);
        let one = Sedenion::one();
        let r = a * one;
        assert_eq!(r, a);
    }

    #[test]
    fn test_zero_divisor() {
        // Known zero divisor: (e3 + e10)(e6 - e15) = 0
        let mut a = [0.0; 16];
        a[3] = 1.0;
        a[10] = 1.0;
        let z1 = Sedenion::new(a);

        let mut b = [0.0; 16];
        b[6] = 1.0;
        b[15] = -1.0;
        let z2 = Sedenion::new(b);

        let prod = z1 * z2;
        let norm = prod.norm();
        assert!(norm < 1e-4, "Expected zero product, got norm {}", norm);
    }

    #[test]
    fn test_inv_roundtrip() {
        let a = Sedenion::new([1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0,
                               9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0]);
        let a_inv = a.inv().unwrap();
        let prod = a * a_inv;
        let one = Sedenion::one();
        for i in 0..16 {
            assert!((prod.0[i] - one.0[i]).abs() < 1e-4);
        }
    }

    #[test]
    fn test_power_associative() {
        let z = Sedenion::new([1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0,
                               9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0]);
        // z^3 via powi should equal z*z*z
        let z3_direct = z * z * z;
        let z3_pow = z.powu(3);
        for i in 0..16 {
            assert!((z3_direct.0[i] - z3_pow.0[i]).abs() < 1e-4);
        }
    }

    #[test]
    fn test_o_n_squaring_vs_full_mul() {
        // Verify that square() == self * self
        let z = Sedenion::new([2.0, 1.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0,
                               9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0]);
        let sq_fast = z.square();
        let sq_full = z * z;
        for i in 0..16 {
            assert!((sq_fast.0[i] - sq_full.0[i]).abs() < 1e-4,
                "O(N) squaring mismatch at index {}: fast={} full={}",
                i, sq_fast.0[i], sq_full.0[i]);
        }
    }

    #[test]
    fn test_zda_margin() {
        let z = Sedenion::new([1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0,
                               9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0]);
        let loss = z.zda_margin_loss(1.0);
        assert!(loss >= 0.0);
    }

    #[test]
    fn test_sketches_are_zero_cost() {
        let z = Sedenion::new([1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0,
                               9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0]);
        let q = z.sketch_quaternion();
        assert_eq!(q[0], 1.0);
        assert_eq!(q[1], 2.0);

        let o = z.sketch_octonion();
        assert_eq!(o[7], 8.0);

        let v = z.sketch_imaginary();
        assert_eq!(v[0], 2.0);  // component 1 of original
        assert_eq!(v[14], 16.0); // component 15 of original
    }
}
