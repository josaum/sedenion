//! IMU preintegration skeleton for nav-bakeoff.
//! Minimal, implementation-focused preintegration used by the navigation tasks.

use crate::sim::Sample;
use crate::linalg::Mat;

/// Preintegrated delta over an IMU window.
pub struct Preintegrated {
    /// Position increment (nav frame).
    pub delta_p: [f64; 3],
    /// Velocity increment (nav frame).
    pub delta_v: [f64; 3],
    /// Rotation increment as small-angle vector (rad). Placeholder here.
    pub delta_r: [f64; 3],
    /// 6×6 covariance for [p; v].
    pub cov: Mat,
    /// 6×3 Jacobian of [p; v] w.r.t. accel bias (bax, bay, baz).
    pub jac_bias: Mat,
}

/// Trapezoidal preintegration that treats accelerometer samples as resolved in
/// the navigation frame. Returns first-order bias Jacobians and a placeholder
/// covariance (zeros) for later refinement.
pub fn integrate_imu_window(samples: &[Sample], v0: [f64; 3]) -> Preintegrated {
    if samples.len() < 2 {
        return Preintegrated {
            delta_p: [0.0; 3],
            delta_v: [0.0; 3],
            delta_r: [0.0; 3],
            cov: Mat::zeros(6, 6),
            jac_bias: Mat::zeros(6, 3),
        };
    }

    let mut p = [0.0f64; 3];
    let mut v = v0;
    let mut total_t = 0.0f64;

    for k in 0..(samples.len() - 1) {
        let s0 = &samples[k];
        let s1 = &samples[k + 1];
        let dt = s1.t - s0.t;
        // simple trapezoid on accelerometer measurements (nav-frame)
        let a0 = s0.accel_meas;
        let a1 = s1.accel_meas;
        let a_avg = [(a0[0] + a1[0]) * 0.5, (a0[1] + a1[1]) * 0.5, (a0[2] + a1[2]) * 0.5];
        for i in 0..3 {
            p[i] += v[i] * dt + 0.5 * a_avg[i] * dt * dt;
        }
        for i in 0..3 {
            v[i] += a_avg[i] * dt;
        }
        total_t += dt;
    }

    // First-order bias Jacobians (assuming accel_bias enters additively):
    // dv/db = -T * I, dp/db = -0.5 * T^2 * I
    let mut jac = Mat::zeros(6, 3);
    let half_t2 = -0.5 * total_t * total_t;
    for i in 0..3 {
        jac.set(i, i, half_t2); // dp/db rows 0..2
        jac.set(3 + i, i, -total_t); // dv/db rows 3..5
    }

    Preintegrated {
        delta_p: p,
        delta_v: v,
        delta_r: [0.0; 3],
        cov: Mat::zeros(6, 6),
        jac_bias: jac,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::sim::Sample;

    #[test]
    fn basic_preintegration() {
        // two-sample ramp from 0 to 1 m/s^2 over 1s -> v ≈ 0.5 m/s, p ≈ 0.25 m
        let samples = vec![
            Sample { t: 0.0, accel_meas: [0.0, 0.0, 0.0], gyro_meas: [0.0, 0.0, 0.0], truth: [0.0; 9] },
            Sample { t: 1.0, accel_meas: [1.0, 0.0, 0.0], gyro_meas: [0.0, 0.0, 0.0], truth: [0.0; 9] },
        ];
        let out = integrate_imu_window(&samples, [0.0; 3]);
        assert!(out.delta_v[0] > 0.49 && out.delta_v[0] < 0.51, "delta_v[0]={}", out.delta_v[0]);
        assert!(out.delta_p[0] > 0.24 && out.delta_p[0] < 0.26, "delta_p[0]={}", out.delta_p[0]);
    }
}
