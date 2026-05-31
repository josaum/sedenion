//! Minimal f64 linear algebra for the metrics (16×16 covariance eiguspectrum and
//! the linear-probe least-squares solve). Small and simple, not optimized.

/// Solve `A x = b` for square `A` (n×n) via Gaussian elimination with partial
/// pivoting. `b` has `m` columns; returns the n×m solution (row-major).
pub fn solve(a: &[f64], n: usize, b: &[f64], m: usize) -> Vec<f64> {
    let mut aug = vec![0.0f64; n * (n + m)];
    for i in 0..n {
        for j in 0..n {
            aug[i * (n + m) + j] = a[i * n + j];
        }
        for j in 0..m {
            aug[i * (n + m) + n + j] = b[i * m + j];
        }
    }
    let w = n + m;
    for col in 0..n {
        let mut piv = col;
        let mut best = aug[col * w + col].abs();
        for r in (col + 1)..n {
            let v = aug[r * w + col].abs();
            if v > best {
                best = v;
                piv = r;
            }
        }
        if piv != col {
            for j in 0..w {
                aug.swap(col * w + j, piv * w + j);
            }
        }
        let d = aug[col * w + col];
        let d = if d.abs() < 1e-12 { 1e-12 } else { d };
        for r in 0..n {
            if r == col {
                continue;
            }
            let f = aug[r * w + col] / d;
            if f == 0.0 {
                continue;
            }
            for j in col..w {
                aug[r * w + j] -= f * aug[col * w + j];
            }
        }
    }
    let mut x = vec![0.0f64; n * m];
    for i in 0..n {
        let d = aug[i * w + i];
        let d = if d.abs() < 1e-12 { 1e-12 } else { d };
        for j in 0..m {
            x[i * m + j] = aug[i * w + n + j] / d;
        }
    }
    x
}

/// Eigenvalues of a symmetric n×n matrix (row-major) via the cyclic Jacobi
/// method. Returns them sorted descending.
pub fn sym_eigenvalues(a_in: &[f64], n: usize) -> Vec<f64> {
    let mut a = a_in.to_vec();
    for _ in 0..100 {
        let mut off = 0.0;
        for p in 0..n {
            for q in (p + 1)..n {
                off += a[p * n + q] * a[p * n + q];
            }
        }
        if off.sqrt() < 1e-12 {
            break;
        }
        for p in 0..n {
            for q in (p + 1)..n {
                let apq = a[p * n + q];
                if apq.abs() < 1e-300 {
                    continue;
                }
                let app = a[p * n + p];
                let aqq = a[q * n + q];
                let theta = 0.5 * (aqq - app) / apq;
                let t = theta.signum() / (theta.abs() + (theta * theta + 1.0).sqrt());
                let c = 1.0 / (t * t + 1.0).sqrt();
                let s = t * c;
                for k in 0..n {
                    let akp = a[k * n + p];
                    let akq = a[k * n + q];
                    a[k * n + p] = c * akp - s * akq;
                    a[k * n + q] = s * akp + c * akq;
                }
                for k in 0..n {
                    let apk = a[p * n + k];
                    let aqk = a[q * n + k];
                    a[p * n + k] = c * apk - s * aqk;
                    a[q * n + k] = s * apk + c * aqk;
                }
            }
        }
    }
    let mut eig: Vec<f64> = (0..n)
        .map(|i| {
            let v = a[i * n + i];
            if v.is_finite() {
                v
            } else {
                0.0
            }
        })
        .collect();
    eig.sort_by(|x, y| y.partial_cmp(x).unwrap_or(std::cmp::Ordering::Equal));
    eig
}
