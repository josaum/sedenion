//! Synthetic 3-D inertial-navigation truth trajectory + MEMS accelerometer model.
//!
//! Scope: we focus on the position/velocity/accelerometer-bias subspace, which
//! is the dominant dead-reckoning error channel and the *exact* mechanism the
//! TESSERACT-BR paper claims its zero-divisor projection annihilates. Attitude
//! is assumed known (resolved into the nav frame) so the comparison isolates
//! that claim cleanly. Gravity is pre-removed; we integrate linear acceleration.
//!
//! The MEMS model follows the standard Allan-variance decomposition:
//!   measured = true_accel + bias(t) + white_noise
//! where bias(t) is a slowly varying random walk (bias instability), optionally
//! with a Duffing-style cubic stiffness term so the bias dynamics are genuinely
//! nonlinear (steel-manning the paper's premise that MEMS are non-linear).

use rand::rngs::StdRng;
use rand::{Rng, SeedableRng};

pub const N: usize = 9; // [px py pz vx vy vz bax bay baz]

#[derive(Clone, Copy)]
pub struct ImuParams {
    /// Velocity random walk (white accel noise) std-dev, m/s^2 per sample step.
    pub accel_white: f64,
    /// Bias random-walk driving std-dev, (m/s^2) per sqrt-step.
    pub bias_rw: f64,
    /// Initial bias magnitude per axis, m/s^2 (e.g. ~0.02 m/s^2 ≈ 2 mg).
    pub bias_init: f64,
    /// Duffing cubic-stiffness coefficient on bias dynamics (0 = linear).
    pub duffing_beta: f64,
}

impl Default for ImuParams {
    fn default() -> Self {
        // Representative low-cost MEMS, ~consumer/industrial grade.
        ImuParams {
            accel_white: 0.05, // m/s^2 per step
            bias_rw: 0.002,    // m/s^2 random walk
            bias_init: 0.02,   // ~2 mg
            duffing_beta: 0.0,
        }
    }
}

#[derive(Clone, Copy)]
pub struct Sample {
    pub t: f64,
    /// Accelerometer reading (true accel + bias + white noise), nav frame.
    pub accel_meas: [f64; 3],
    /// Gyroscope reading, rad/s in the same resolved frame when available.
    /// The synthetic accel-only harness leaves this at zero.
    pub gyro_meas: [f64; 3],
    /// Ground-truth state, for scoring only (never fed to the filters).
    pub truth: [f64; N],
}

fn gaussian(rng: &mut StdRng) -> f64 {
    // Box–Muller.
    let u1: f64 = rng.gen::<f64>().max(1e-12);
    let u2: f64 = rng.gen::<f64>();
    (-2.0 * u1.ln()).sqrt() * (2.0 * std::f64::consts::PI * u2).cos()
}

/// Generate one trajectory: a gently maneuvering platform (sinusoidal
/// accelerations on each axis — think a drone weaving under canopy).
pub fn generate(seed: u64, steps: usize, dt: f64, p: &ImuParams) -> Vec<Sample> {
    let mut rng = StdRng::seed_from_u64(seed);
    let mut pos = [0.0f64; 3];
    let mut vel = [0.0f64; 3];
    let mut bias = [
        p.bias_init * gaussian(&mut rng),
        p.bias_init * gaussian(&mut rng),
        p.bias_init * gaussian(&mut rng),
    ];

    let mut out = Vec::with_capacity(steps);
    for k in 0..steps {
        let t = k as f64 * dt;

        // True commanded acceleration: distinct frequency per axis.
        let a_true = [
            0.6 * (0.30 * t).sin(),
            0.4 * (0.17 * t + 1.0).sin(),
            0.2 * (0.09 * t + 2.0).sin(),
        ];

        // Bias evolution: random walk + optional Duffing cubic stiffness.
        for i in 0..3 {
            let drift = p.bias_rw * dt.sqrt() * gaussian(&mut rng);
            let duffing = -p.duffing_beta * bias[i] * bias[i] * bias[i] * dt;
            bias[i] += drift + duffing;
        }

        // Measurement = true + bias + white noise.
        let mut accel_meas = [0.0f64; 3];
        for i in 0..3 {
            accel_meas[i] = a_true[i] + bias[i] + p.accel_white * gaussian(&mut rng);
        }

        // Integrate truth with the *true* acceleration (trapezoidal on velocity).
        for i in 0..3 {
            pos[i] += vel[i] * dt + 0.5 * a_true[i] * dt * dt;
            vel[i] += a_true[i] * dt;
        }

        let truth = [
            pos[0], pos[1], pos[2], vel[0], vel[1], vel[2], bias[0], bias[1], bias[2],
        ];
        out.push(Sample {
            t,
            accel_meas,
            gyro_meas: [0.0; 3],
            truth,
        });
    }
    out
}
