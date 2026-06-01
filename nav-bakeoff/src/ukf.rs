//! A generic additive-noise Unscented Kalman Filter on R^n.
//!
//! Both estimators in the bake-off share this exact filter so that any
//! difference in results is attributable to the state *representation*
//! (plain vector vs. sedenion embedding + ZDA projection), never to a
//! difference in the filtering machinery itself.

use crate::linalg::{cholesky, solve, Mat};

pub struct Ukf {
    pub n: usize,
    pub x: Vec<f64>, // mean
    pub p: Mat,      // covariance (n×n)
    // Unscented transform parameters.
    alpha: f64,
    beta: f64,
    kappa: f64,
}

impl Ukf {
    pub fn new(x0: Vec<f64>, p0: Mat) -> Self {
        let n = x0.len();
        Ukf {
            n,
            x: x0,
            p: p0,
            alpha: 1e-3,
            beta: 2.0,
            kappa: 0.0,
        }
    }

    fn lambda(&self) -> f64 {
        self.alpha * self.alpha * (self.n as f64 + self.kappa) - self.n as f64
    }

    /// Returns (sigma_points, Wm, Wc). 2n+1 points.
    fn sigma_points(&self) -> (Vec<Vec<f64>>, Vec<f64>, Vec<f64>) {
        let n = self.n;
        let lambda = self.lambda();
        let scale = n as f64 + lambda;
        let l = cholesky(&self.p.scale(scale)); // columns of L are the spread vectors

        let mut pts = Vec::with_capacity(2 * n + 1);
        pts.push(self.x.clone());
        for i in 0..n {
            let mut plus = self.x.clone();
            let mut minus = self.x.clone();
            for r in 0..n {
                let s = l.get(r, i);
                plus[r] += s;
                minus[r] -= s;
            }
            pts.push(plus);
            pts.push(minus);
        }

        let mut wm = vec![1.0 / (2.0 * scale); 2 * n + 1];
        let mut wc = wm.clone();
        wm[0] = lambda / scale;
        wc[0] = lambda / scale + (1.0 - self.alpha * self.alpha + self.beta);
        (pts, wm, wc)
    }

    /// Predict step. `f` maps a state to its propagated state; `q` is additive
    /// process covariance.
    pub fn predict<F: Fn(&[f64]) -> Vec<f64>>(&mut self, f: F, q: &Mat) {
        let (pts, wm, wc) = self.sigma_points();
        let prop: Vec<Vec<f64>> = pts.iter().map(|p| f(p)).collect();

        let mut mean = vec![0.0; self.n];
        for (w, s) in wm.iter().zip(prop.iter()) {
            for i in 0..self.n {
                mean[i] += w * s[i];
            }
        }

        let mut cov = Mat::zeros(self.n, self.n);
        for (w, s) in wc.iter().zip(prop.iter()) {
            for i in 0..self.n {
                for j in 0..self.n {
                    let v = cov.get(i, j) + w * (s[i] - mean[i]) * (s[j] - mean[j]);
                    cov.set(i, j, v);
                }
            }
        }
        self.x = mean;
        self.p = cov.add(q);
    }

    /// Update step with measurement `z`, measurement model `h`, noise `r`.
    pub fn update<H: Fn(&[f64]) -> Vec<f64>>(&mut self, z: &[f64], h: H, r: &Mat) {
        let (pts, wm, wc) = self.sigma_points();
        let zhat: Vec<Vec<f64>> = pts.iter().map(|p| h(p)).collect();
        let m = z.len();

        let mut zmean = vec![0.0; m];
        for (w, s) in wm.iter().zip(zhat.iter()) {
            for i in 0..m {
                zmean[i] += w * s[i];
            }
        }

        // Innovation covariance S and cross-covariance Pxz.
        let mut s_mat = r.clone();
        let mut pxz = Mat::zeros(self.n, m);
        for (idx, w) in wc.iter().enumerate() {
            let dz: Vec<f64> = (0..m).map(|i| zhat[idx][i] - zmean[i]).collect();
            let dx: Vec<f64> = (0..self.n).map(|i| pts[idx][i] - self.x[i]).collect();
            for i in 0..m {
                for j in 0..m {
                    let v = s_mat.get(i, j) + w * dz[i] * dz[j];
                    s_mat.set(i, j, v);
                }
            }
            for i in 0..self.n {
                for j in 0..m {
                    let v = pxz.get(i, j) + w * dx[i] * dz[j];
                    pxz.set(i, j, v);
                }
            }
        }

        // Kalman gain K = Pxz S^-1  =>  solve(Sᵀ, Pxzᵀ)ᵀ.
        let k = solve(&s_mat.transpose(), &pxz.transpose()).transpose(); // n×m

        // State update.
        let innov: Vec<f64> = (0..m).map(|i| z[i] - zmean[i]).collect();
        for i in 0..self.n {
            let mut d = 0.0;
            for j in 0..m {
                d += k.get(i, j) * innov[j];
            }
            self.x[i] += d;
        }
        // Covariance update: P -= K S Kᵀ.
        let ks = k.matmul(&s_mat);
        let kskt = ks.matmul(&k.transpose());
        self.p = self.p.add(&kskt.scale(-1.0));
    }
}
