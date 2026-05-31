//! Tiny dense f64 linear algebra for small (n <= ~16) UKF state covariances.
//!
//! Deliberately simple and allocation-light. Not optimized — the point of this
//! crate is correctness and a fair comparison, not throughput.

/// Row-major dense matrix.
#[derive(Clone, Debug)]
pub struct Mat {
    pub rows: usize,
    pub cols: usize,
    pub data: Vec<f64>,
}

impl Mat {
    pub fn zeros(rows: usize, cols: usize) -> Self {
        Mat { rows, cols, data: vec![0.0; rows * cols] }
    }

    pub fn identity(n: usize) -> Self {
        let mut m = Mat::zeros(n, n);
        for i in 0..n {
            m.set(i, i, 1.0);
        }
        m
    }

    #[inline]
    pub fn get(&self, r: usize, c: usize) -> f64 {
        self.data[r * self.cols + c]
    }

    #[inline]
    pub fn set(&mut self, r: usize, c: usize, v: f64) {
        self.data[r * self.cols + c] = v;
    }

    pub fn scale(&self, s: f64) -> Mat {
        let mut out = self.clone();
        for v in out.data.iter_mut() {
            *v *= s;
        }
        out
    }

    pub fn add(&self, other: &Mat) -> Mat {
        assert_eq!((self.rows, self.cols), (other.rows, other.cols));
        let mut out = self.clone();
        for i in 0..out.data.len() {
            out.data[i] += other.data[i];
        }
        out
    }

    pub fn matmul(&self, other: &Mat) -> Mat {
        assert_eq!(self.cols, other.rows);
        let mut out = Mat::zeros(self.rows, other.cols);
        for i in 0..self.rows {
            for k in 0..self.cols {
                let a = self.get(i, k);
                if a == 0.0 {
                    continue;
                }
                for j in 0..other.cols {
                    let v = out.get(i, j) + a * other.get(k, j);
                    out.set(i, j, v);
                }
            }
        }
        out
    }

    pub fn transpose(&self) -> Mat {
        let mut out = Mat::zeros(self.cols, self.rows);
        for i in 0..self.rows {
            for j in 0..self.cols {
                out.set(j, i, self.get(i, j));
            }
        }
        out
    }
}

/// Lower-triangular Cholesky factor L such that A = L Lᵀ.
///
/// Adds a small jitter to the diagonal if needed to keep the matrix positive
/// definite (covariances can drift slightly non-PD under finite precision).
pub fn cholesky(a: &Mat) -> Mat {
    assert_eq!(a.rows, a.cols);
    let n = a.rows;
    let mut jitter = 0.0f64;
    loop {
        let mut ok = true;
        let mut l = Mat::zeros(n, n);
        for i in 0..n {
            for j in 0..=i {
                let mut sum = a.get(i, j);
                if i == j {
                    sum += jitter;
                }
                for k in 0..j {
                    sum -= l.get(i, k) * l.get(j, k);
                }
                if i == j {
                    if sum <= 0.0 {
                        ok = false;
                        break;
                    }
                    l.set(i, j, sum.sqrt());
                } else {
                    l.set(i, j, sum / l.get(j, j));
                }
            }
            if !ok {
                break;
            }
        }
        if ok {
            return l;
        }
        jitter = if jitter == 0.0 { 1e-9 } else { jitter * 10.0 };
        if jitter > 1.0 {
            // Give up gracefully: return diagonal sqrt as a last resort.
            let mut d = Mat::zeros(n, n);
            for i in 0..n {
                d.set(i, i, a.get(i, i).max(1e-12).sqrt());
            }
            return d;
        }
    }
}

/// Eigendecomposition of a symmetric matrix via the cyclic Jacobi method.
/// Returns `(eigenvalues, eigenvectors)` where eigenvector `k` is column `k`
/// of the returned matrix. Robust and exact enough for the small (≤32) matrices
/// used here. Eigenvalues are not sorted.
pub fn jacobi_eigen_symmetric(a: &Mat) -> (Vec<f64>, Mat) {
    assert_eq!(a.rows, a.cols);
    let n = a.rows;
    let mut m = a.clone();
    let mut v = Mat::identity(n);
    for _sweep in 0..100 {
        // off-diagonal Frobenius norm
        let mut off = 0.0;
        for p in 0..n {
            for q in (p + 1)..n {
                off += m.get(p, q) * m.get(p, q);
            }
        }
        if off.sqrt() < 1e-14 {
            break;
        }
        for p in 0..n {
            for q in (p + 1)..n {
                let apq = m.get(p, q);
                if apq.abs() < 1e-300 {
                    continue;
                }
                let app = m.get(p, p);
                let aqq = m.get(q, q);
                let theta = 0.5 * (aqq - app) / apq;
                let t = theta.signum() / (theta.abs() + (theta * theta + 1.0).sqrt());
                let c = 1.0 / (t * t + 1.0).sqrt();
                let s = t * c;
                // Apply rotation to rows/cols p,q of m.
                for k in 0..n {
                    let mkp = m.get(k, p);
                    let mkq = m.get(k, q);
                    m.set(k, p, c * mkp - s * mkq);
                    m.set(k, q, s * mkp + c * mkq);
                }
                for k in 0..n {
                    let mpk = m.get(p, k);
                    let mqk = m.get(q, k);
                    m.set(p, k, c * mpk - s * mqk);
                    m.set(q, k, s * mpk + c * mqk);
                }
                // Accumulate eigenvectors.
                for k in 0..n {
                    let vkp = v.get(k, p);
                    let vkq = v.get(k, q);
                    v.set(k, p, c * vkp - s * vkq);
                    v.set(k, q, s * vkp + c * vkq);
                }
            }
        }
    }
    let eig = (0..n).map(|i| m.get(i, i)).collect();
    (eig, v)
}

/// Singular values of a (possibly non-square) matrix, descending, via the
/// eigenvalues of `AᵀA`.
pub fn singular_values(a: &Mat) -> Vec<f64> {
    let ata = a.transpose().matmul(a);
    let (mut eig, _) = jacobi_eigen_symmetric(&ata);
    for e in eig.iter_mut() {
        *e = e.max(0.0).sqrt();
    }
    eig.sort_by(|x, y| y.partial_cmp(x).unwrap());
    eig
}

/// Solve A X = B for X given A (n×n) and B (n×m), via LU with partial pivoting.
pub fn solve(a: &Mat, b: &Mat) -> Mat {
    assert_eq!(a.rows, a.cols);
    let n = a.rows;
    let m = b.cols;
    let mut aug = Mat::zeros(n, n + m);
    for i in 0..n {
        for j in 0..n {
            aug.set(i, j, a.get(i, j));
        }
        for j in 0..m {
            aug.set(i, n + j, b.get(i, j));
        }
    }
    for col in 0..n {
        // partial pivot
        let mut piv = col;
        let mut best = aug.get(col, col).abs();
        for r in (col + 1)..n {
            let v = aug.get(r, col).abs();
            if v > best {
                best = v;
                piv = r;
            }
        }
        if piv != col {
            for j in 0..(n + m) {
                let tmp = aug.get(col, j);
                aug.set(col, j, aug.get(piv, j));
                aug.set(piv, j, tmp);
            }
        }
        let d = aug.get(col, col);
        let d = if d.abs() < 1e-15 { 1e-15 } else { d };
        for r in 0..n {
            if r == col {
                continue;
            }
            let f = aug.get(r, col) / d;
            if f == 0.0 {
                continue;
            }
            for j in col..(n + m) {
                let v = aug.get(r, j) - f * aug.get(col, j);
                aug.set(r, j, v);
            }
        }
    }
    let mut x = Mat::zeros(n, m);
    for i in 0..n {
        let d = aug.get(i, i);
        let d = if d.abs() < 1e-15 { 1e-15 } else { d };
        for j in 0..m {
            x.set(i, j, aug.get(i, n + j) / d);
        }
    }
    x
}
