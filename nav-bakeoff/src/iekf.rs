//! Invariant-EKF (IEKF) skeleton for nav-bakeoff.
//!
//! Minimal, implementation-focused EKF-like skeleton with room for
//! invariant/group-aware error definitions per Barrau & Bonnabel. Provides
//! predict (with analytic linearization) and simple measurement updates used
//! by the integration tests and for later replacement with true invariant ops.

use crate::linalg::Mat;

/// State dimension (p, v, b) = 3 + 3 + 3
pub const STATE_DIM: usize = 9;

pub struct Iekf {
    pub x: Vec<f64>, // length STATE_DIM
    pub P: Mat,      // STATE_DIM x STATE_DIM
}

impl Iekf {
    pub fn new(x0: Vec<f64>, P0: Mat) -> Self {
        assert_eq!(x0.len(), STATE_DIM);
        assert_eq!(P0.rows, STATE_DIM);
        assert_eq!(P0.cols, STATE_DIM);
        Iekf { x: x0, P: P0 }
    }

    fn nav_step_state(x: &[f64], accel: [f64; 3], dt: f64) -> Vec<f64> {
        let mut out = x.to_vec();
        for i in 0..3 {
            let a = accel[i] - x[6 + i];
            out[i] = x[i] + x[3 + i] * dt + 0.5 * a * dt * dt;
            out[3 + i] = x[3 + i] + a * dt;
        }
        out
    }

    fn jacobian_F(dt: f64) -> Mat {
        // Linearization of the (p,v,b) dynamics around current state.
        let mut F = Mat::identity(STATE_DIM);
        for i in 0..3 {
            F.set(i, 3 + i, dt); // dp/dv
            F.set(i, 6 + i, -0.5 * dt * dt); // dp/db
            F.set(3 + i, 6 + i, -dt); // dv/db
        }
        F
    }

    /// Predict step: propagate mean with simple strapdown kinematics and
    /// propagate covariance with Jacobian F: P <- F P Fᵀ + Q.
    pub fn predict(&mut self, accel: [f64; 3], dt: f64, Q: &Mat) {
        self.x = Self::nav_step_state(&self.x, accel, dt);
        let F = Self::jacobian_F(dt);
        let Ft = F.transpose();
        self.P = F.matmul(&self.P).matmul(&Ft).add(Q);
    }

    /// Position update: measurement model h(x) = p (3×1). Uses linearized
    /// Kalman update. Placeholder for invariant-aware update semantics.
    pub fn update_position(&mut self, z: [f64; 3], R: &Mat) {
        // H (3×9)
        let mut H = Mat::zeros(3, STATE_DIM);
        for i in 0..3 {
            H.set(i, i, 1.0);
        }
        let Ht = H.transpose();
        let S = H.matmul(&self.P).matmul(&Ht).add(R);
        // Compute Kalman gain K = P Hᵀ S^{-1}
        let PHt = self.P.matmul(&Ht);
        // Solve S X = I for X = S^{-1}
        let Sinv = crate::linalg::solve(&S, &Mat::identity(3));
        let K = PHt.matmul(&Sinv);

        // residual r = z - H x
        let mut r = [0.0f64; 3];
        for i in 0..3 {
            r[i] = z[i] - self.x[i];
        }

        // state update x <- x + K r
        for i in 0..STATE_DIM {
            let mut s = 0.0;
            for j in 0..3 {
                s += K.get(i, j) * r[j];
            }
            self.x[i] += s;
        }

        // covariance update P <- (I - K H) P
        let KH = K.matmul(&H);
        let I = Mat::identity(STATE_DIM);
        let IKH = I.add(&KH.scale(-1.0));
        self.P = IKH.matmul(&self.P);
    }

    /// Bias update: measurement model h(x)=b (3×1)
    pub fn update_bias(&mut self, b: [f64; 3], R: &Mat) {
        let mut H = Mat::zeros(3, STATE_DIM);
        for i in 0..3 {
            H.set(i, 6 + i, 1.0);
        }
        let Ht = H.transpose();
        let S = H.matmul(&self.P).matmul(&Ht).add(R);
        let PHt = self.P.matmul(&Ht);
        let Sinv = crate::linalg::solve(&S, &Mat::identity(3));
        let K = PHt.matmul(&Sinv);

        let mut r = [0.0f64; 3];
        for i in 0..3 {
            r[i] = b[i] - self.x[6 + i];
        }
        for i in 0..STATE_DIM {
            let mut s = 0.0;
            for j in 0..3 {
                s += K.get(i, j) * r[j];
            }
            self.x[i] += s;
        }
        let KH = K.matmul(&H);
        let I = Mat::identity(STATE_DIM);
        let IKH = I.add(&KH.scale(-1.0));
        self.P = IKH.matmul(&self.P);
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::linalg::Mat;

    #[test]
    fn predict_update_cycle() {
        let x0 = vec![0.0f64; STATE_DIM];
        let mut P0 = Mat::zeros(STATE_DIM, STATE_DIM);
        for i in 0..STATE_DIM {
            P0.set(i, i, 0.1);
        }
        let mut f = Iekf::new(x0, P0);
        let q = Mat::zeros(STATE_DIM, STATE_DIM);
        f.predict([1.0, 0.0, 0.0], 1.0, &q);
        // expected v.x ~= 1.0, p.x ~= 0.5
        assert!(f.x[3] > 0.9 && f.x[3] < 1.1, "v.x={}", f.x[3]);
        assert!(f.x[0] > 0.4 && f.x[0] < 0.6, "p.x={}", f.x[0]);

        let mut R = Mat::zeros(3, 3);
        for i in 0..3 {
            R.set(i, i, 1e-3);
        }
        f.update_position([0.5, 0.0, 0.0], &R);
        assert!((f.x[0] - 0.5).abs() < 1e-2, "post-update p={}", f.x[0]);
    }
}
