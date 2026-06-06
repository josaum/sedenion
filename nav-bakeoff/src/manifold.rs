//! Minimal manifold helpers for SO(3) used by nav-bakeoff.
//! Provides hat/vee, exponential/logarithm maps, and boxplus/boxminus utilities.

use crate::linalg::Mat;

/// Skew-symmetric matrix (hat) from a 3-vector.
pub fn hat(v: [f64; 3]) -> Mat {
    let mut m = Mat::zeros(3, 3);
    m.set(0, 1, -v[2]);
    m.set(0, 2, v[1]);
    m.set(1, 0, v[2]);
    m.set(1, 2, -v[0]);
    m.set(2, 0, -v[1]);
    m.set(2, 1, v[0]);
    m
}

/// Vee operator: extract vector from a skew-symmetric matrix produced by `hat`.
pub fn vee(m: &Mat) -> [f64; 3] {
    [m.get(2, 1), m.get(0, 2), m.get(1, 0)]
}

fn norm(v: [f64; 3]) -> f64 {
    (v[0] * v[0] + v[1] * v[1] + v[2] * v[2]).sqrt()
}

/// Exponential map SO(3) ← so(3) via Rodrigues' formula.
pub fn exp_so3(omega: [f64; 3]) -> Mat {
    let theta = norm(omega);
    let i = Mat::identity(3);
    if theta < 1e-12 {
        // small-angle series: I + hat(ω) + 0.5 hat(ω)^2
        let h = hat(omega);
        return i.add(&h).add(&h.matmul(&h).scale(0.5));
    }
    let ux = [omega[0] / theta, omega[1] / theta, omega[2] / theta];
    let k = hat(ux);
    let k2 = k.matmul(&k);
    i.add(&k.scale(theta.sin())).add(&k2.scale(1.0 - theta.cos()))
}

/// Logarithm map so(3) ← SO(3). Returns angle-axis vector (ω) such that R = exp(ω).
pub fn log_so3(R: &Mat) -> [f64; 3] {
    assert_eq!(R.rows, 3);
    assert_eq!(R.cols, 3);
    let trace = R.get(0, 0) + R.get(1, 1) + R.get(2, 2);
    let mut cos_theta = (trace - 1.0) / 2.0;
    if cos_theta > 1.0 {
        cos_theta = 1.0;
    }
    if cos_theta < -1.0 {
        cos_theta = -1.0;
    }
    let theta = cos_theta.acos();
    if theta.abs() < 1e-12 {
        return [0.0, 0.0, 0.0];
    }
    // R - R^T
    let rt = R.transpose();
    let r_minus_rt = R.clone().add(&rt.scale(-1.0));
    let factor = theta / (2.0 * theta.sin());
    vee(&r_minus_rt.scale(factor))
}

/// Boxplus for rotations: apply small-angle delta on the right: R ⊕ δ = R * exp(δ).
pub fn boxplus(R: &Mat, delta: [f64; 3]) -> Mat {
    R.matmul(&exp_so3(delta))
}

/// Boxminus: rotation difference (R1, R2) -> δ where R2 = R1 * exp(δ).
pub fn boxminus(R1: &Mat, R2: &Mat) -> [f64; 3] {
    let r = R1.transpose().matmul(R2);
    log_so3(&r)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn approx_eq(a: [f64; 3], b: [f64; 3], tol: f64) -> bool {
        (a[0] - b[0]).abs() < tol && (a[1] - b[1]).abs() < tol && (a[2] - b[2]).abs() < tol
    }

    #[test]
    fn hat_vee_roundtrip() {
        let v = [0.12, -0.05, 0.23];
        let h = hat(v);
        let v2 = vee(&h);
        assert!(approx_eq(v, v2, 1e-12));
    }

    #[test]
    fn exp_log_roundtrip() {
        let v = [0.12, -0.05, 0.23];
        let R = exp_so3(v);
        let v2 = log_so3(&R);
        assert!(approx_eq(v, v2, 1e-9));
    }

    #[test]
    fn boxplus_boxminus_roundtrip() {
        let delta = [0.01, 0.02, -0.015];
        let R = Mat::identity(3);
        let R2 = boxplus(&R, delta);
        let delta2 = boxminus(&R, &R2);
        assert!(approx_eq(delta, delta2, 1e-9));
    }
}
