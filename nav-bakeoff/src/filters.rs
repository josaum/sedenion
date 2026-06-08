//! The two estimators under test, sharing one UKF and one process model.
//!
//! * `Baseline` — plain 9-vector state. The Kalman filter is the *optimal*
//!   minimum-MSE estimator for the linear-Gaussian generative model, and
//!   near-optimal under the Duffing perturbation. It is the yardstick.
//!
//! * `Sedenion` — identical UKF, but after every predict the mean is embedded
//!   into a 16-float `sedenion::Sedenion` using the TESSERACT-BR slot map
//!   (velocity → e4..e6, position → e7..e9, accel bias → e13..e15) and the
//!   paper's "zero-divisor annihilation" is applied: the component of the
//!   accelerometer-bias estimate lying along the position direction is
//!   projected out, scaled by `lambda ∈ [0,1]`. `lambda = 0` recovers the
//!   baseline exactly; `lambda = 1` is the paper's full "drift annihilation".
//!
//! There is no canonical definition of the paper's projection (the original
//! text is metaphorical), so this is a good-faith operationalization of
//! "MEMS bias drift projected onto the zero-divisor manifold of the position
//! vectors so it annihilates itself." The `lambda` sweep lets the data, not us,
//! decide how much of it helps.

use crate::linalg::Mat;
use crate::sim::{ImuParams, Sample, N};
use crate::ukf::Ukf;
use crate::iekf::Iekf;
use rand::rngs::StdRng;
use rand::{Rng, SeedableRng};
use sedenion::Sedenion;
fn gaussian(rng: &mut StdRng) -> f64 {
    let u1: f64 = rng.gen::<f64>().max(1e-12);
    let u2: f64 = rng.gen::<f64>();
    (-2.0 * u1.ln()).sqrt() * (2.0 * std::f64::consts::PI * u2).cos()
}

pub struct Config {
    pub dt: f64,
    /// Seconds between external position fixes; `None` = pure dead-reckoning.
    pub fix_interval: Option<f64>,
    /// Position-fix 1σ noise, metres.
    pub fix_sigma: f64,
    /// Sedenion ZDA projection strength (ignored by the baseline).
    pub lambda: f64,
}

fn process_noise(p: &ImuParams, dt: f64) -> Mat {
    let mut q = Mat::zeros(N, N);
    let qp = (0.5 * p.accel_white * dt * dt).powi(2);
    let qv = (p.accel_white * dt).powi(2);
    let qb = (p.bias_rw * dt.sqrt()).powi(2);
    for i in 0..3 {
        q.set(i, i, qp.max(1e-12));
        q.set(3 + i, 3 + i, qv.max(1e-12));
        q.set(6 + i, 6 + i, qb.max(1e-15));
    }
    q
}

fn initial_cov(p: &ImuParams) -> Mat {
    let mut p0 = Mat::zeros(N, N);
    for i in 0..3 {
        p0.set(i, i, 1.0); // 1 m^2 position
        p0.set(3 + i, 3 + i, 0.1); // velocity
        p0.set(6 + i, 6 + i, p.bias_init.powi(2).max(1e-6)); // bias prior
    }
    p0
}

/// Strapdown process model given a fixed accelerometer reading over `dt`.
fn nav_step(x: &[f64], accel: [f64; 3], dt: f64) -> Vec<f64> {
    let mut out = x.to_vec();
    for i in 0..3 {
        let a = accel[i] - x[6 + i]; // remove estimated bias
        out[i] = x[i] + x[3 + i] * dt + 0.5 * a * dt * dt;
        out[3 + i] = x[3 + i] + a * dt;
        // bias is a random walk: unchanged in the mean
    }
    out
}

/// Apply the TESSERACT-BR sedenion embedding + zero-divisor annihilation to the
/// filter mean. Returns the (possibly modified) mean and the sedenion's
/// distance-to-zero-divisor diagnostic.
fn sedenion_zda(mean: &[f64], lambda: f64) -> (Vec<f64>, f32) {
    // Slot map per the paper (e0 scalar = 1; attitude e1..e3 unused here).
    let mut comp = [0.0f32; 16];
    comp[0] = 1.0;
    for i in 0..3 {
        comp[4 + i] = mean[3 + i] as f32; // velocity → e4..e6
        comp[7 + i] = mean[i] as f32; // position → e7..e9
        comp[13 + i] = mean[6 + i] as f32; // accel bias → e13..e15
    }
    let s = Sedenion::new(comp);
    let (_, dist) = s.zero_divisor_status();

    let mut out = mean.to_vec();
    if lambda > 0.0 {
        let p = [mean[0], mean[1], mean[2]];
        let pn = (p[0] * p[0] + p[1] * p[1] + p[2] * p[2]).sqrt();
        if pn > 1e-6 {
            let phat = [p[0] / pn, p[1] / pn, p[2] / pn];
            let b = [mean[6], mean[7], mean[8]];
            let dot = b[0] * phat[0] + b[1] * phat[1] + b[2] * phat[2];
            for i in 0..3 {
                out[6 + i] = b[i] - lambda * dot * phat[i];
            }
        }
    }
    (out, dist)
}

/// Run one estimator over one trajectory. `use_sedenion` selects the variant.
/// `seed` drives the position-fix measurement noise; pass the *same* seed to the
/// baseline and sedenion runs of a given trajectory so they see identical fixes.
/// Returns the per-step horizontal position error (metres).
pub fn run(
    samples: &[Sample],
    p: &ImuParams,
    cfg: &Config,
    use_sedenion: bool,
    seed: u64,
) -> Vec<f64> {
    run_with_bias_aid(samples, p, cfg, use_sedenion, seed, 1.0, |_, _| None)
}

/// Run one estimator with an optional learned accelerometer-bias pseudo-
/// measurement. `bias_aid` receives the current sample index and the full
/// trajectory, and may return a physical bias estimate in m/s².
pub fn run_with_bias_aid<F>(
    samples: &[Sample],
    p: &ImuParams,
    cfg: &Config,
    use_sedenion: bool,
    seed: u64,
    bias_sigma: f64,
    mut bias_aid: F,
) -> Vec<f64>
where
    F: FnMut(usize, &[Sample]) -> Option<[f64; 3]>,
{
    let q = process_noise(p, cfg.dt);
    let x0 = vec![0.0; N]; // start at origin, zero velocity, zero bias prior
    let mut ukf = Ukf::new(x0, initial_cov(p));
    // Separate RNG stream for fix noise, decoupled from the trajectory RNG.
    let mut fix_rng = StdRng::seed_from_u64(seed ^ 0xF1_F1_F1_F1);

    let r_fix = {
        let mut r = Mat::zeros(3, 3);
        for i in 0..3 {
            r.set(i, i, cfg.fix_sigma.powi(2));
        }
        r
    };
    let r_bias = {
        let mut r = Mat::zeros(3, 3);
        for i in 0..3 {
            r.set(i, i, bias_sigma.max(1e-6).powi(2));
        }
        r
    };

    let mut errors = Vec::with_capacity(samples.len());
    let mut next_fix = cfg.fix_interval; // first fix time

    for (idx, s) in samples.iter().enumerate() {
        let accel = s.accel_meas;
        let dt = cfg.dt;
        ukf.predict(|x| nav_step(x, accel, dt), &q);

        if use_sedenion {
            let (m, _dist) = sedenion_zda(&ukf.x, cfg.lambda);
            ukf.x = m;
        }

        // External position fix (e.g. visual feature match / map correlation).
        if let Some(iv) = cfg.fix_interval {
            if let Some(nf) = next_fix {
                if s.t >= nf {
                    // Sampled measurement: truth corrupted by the σ=fix_sigma noise
                    // the filter's R matrix actually models.
                    let z = [
                        s.truth[0] + cfg.fix_sigma * gaussian(&mut fix_rng),
                        s.truth[1] + cfg.fix_sigma * gaussian(&mut fix_rng),
                        s.truth[2] + cfg.fix_sigma * gaussian(&mut fix_rng),
                    ];
                    ukf.update(&z, |x| vec![x[0], x[1], x[2]], &r_fix);
                    next_fix = Some(nf + iv);
                }
            }
        }

        if let Some(b) = bias_aid(idx, samples) {
            ukf.update(&b, |x| vec![x[6], x[7], x[8]], &r_bias);
        }

        let dx = ukf.x[0] - s.truth[0];
        let dy = ukf.x[1] - s.truth[1];
        errors.push((dx * dx + dy * dy).sqrt());
    }
    errors
}

/// IEKF runner: mirrors `run_with_bias_aid` but uses the Iekf struct and its
/// (predict, update_position, update_bias) methods so it's comparable in the
/// bakeoff harness.
pub fn run_iekf_with_bias_aid<F>(
    samples: &[Sample],
    p: &ImuParams,
    cfg: &Config,
    use_sedenion: bool,
    seed: u64,
    bias_sigma: f64,
    mut bias_aid: F,
) -> Vec<f64>
where
    F: FnMut(usize, &[Sample]) -> Option<[f64; 3]>,
{
    let q = process_noise(p, cfg.dt);
    let x0 = vec![0.0; N]; // start at origin, zero velocity, zero bias prior
    let mut ie = Iekf::new(x0, initial_cov(p));
    // Separate RNG stream for fix noise, decoupled from the trajectory RNG.
    let mut fix_rng = StdRng::seed_from_u64(seed ^ 0xF1_F1_F1_F1);

    let r_fix = {
        let mut r = Mat::zeros(3, 3);
        for i in 0..3 {
            r.set(i, i, cfg.fix_sigma.powi(2));
        }
        r
    };
    let r_bias = {
        let mut r = Mat::zeros(3, 3);
        for i in 0..3 {
            r.set(i, i, bias_sigma.max(1e-6).powi(2));
        }
        r
    };

    let mut errors = Vec::with_capacity(samples.len());
    let mut next_fix = cfg.fix_interval; // first fix time

    for (idx, s) in samples.iter().enumerate() {
        let accel = s.accel_meas;
        let dt = cfg.dt;
        ie.predict(accel, dt, &q);

        if use_sedenion {
            let (m, _dist) = sedenion_zda(&ie.x, cfg.lambda);
            ie.x = m;
        }

        // External position fix (e.g. visual feature match / map correlation).
        if let Some(iv) = cfg.fix_interval {
            if let Some(nf) = next_fix {
                if s.t >= nf {
                    // Sampled measurement: truth corrupted by the σ=fix_sigma noise
                    // the filter's R matrix actually models.
                    let z = [
                        s.truth[0] + cfg.fix_sigma * gaussian(&mut fix_rng),
                        s.truth[1] + cfg.fix_sigma * gaussian(&mut fix_rng),
                        s.truth[2] + cfg.fix_sigma * gaussian(&mut fix_rng),
                    ];
                    ie.update_position(z, &r_fix);
                    next_fix = Some(nf + iv);
                }
            }
        }

        if let Some(b) = bias_aid(idx, samples) {
            ie.update_bias(b, &r_bias);
        }

        let dx = ie.x[0] - s.truth[0];
        let dy = ie.x[1] - s.truth[1];
        errors.push((dx * dx + dy * dy).sqrt());
    }
    errors
}

