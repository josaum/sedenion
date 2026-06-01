//! Training driver shared by both arms.

use crate::data::{Dataset, EMB};
use crate::metrics::{collapse_metrics, linear_probe, Collapse};
use crate::model::{loss_and_grad, zda_loss_and_grad, Encoder, LossWeights};
use crate::sigreg::{gaussianity, sample_dirs, sigreg};
use rand::rngs::StdRng;
use rand::{Rng, SeedableRng};
use sedenion::auto_zda_gradient_scale;

pub struct Result {
    pub n_params: usize,
    pub final_loss: f32,
    pub probe_acc: f64,
    pub collapse: Collapse,
    /// Held-out Gaussianity (mean Epps–Pulley statistic; 0 = isotropic Gaussian).
    pub gaussianity: f64,
}

/// SIGReg sketch settings.
const SIG_DIRS: usize = 16; // random projection directions per step
const SIG_SUB: usize = 512; // sketch subsample size (caps the O(n²) EP cost)

fn grad_rms(g: &[[f32; EMB]]) -> f32 {
    let mut ss = 0.0f32;
    let mut n = 0usize;
    for row in g {
        for &v in row {
            ss += v * v;
            n += 1;
        }
    }
    (ss / n.max(1) as f32).sqrt()
}

fn embedding_rms(z: &[[f32; EMB]]) -> f32 {
    let mut ss = 0.0f32;
    let mut n = 0usize;
    for row in z {
        for &v in row {
            ss += v * v;
            n += 1;
        }
    }
    (ss / n.max(1) as f32).sqrt()
}

/// Full-batch gradient descent, then evaluate. Both arms use identical
/// hyperparameters; only the encoder and the regularizer weights differ. When
/// `w.sig > 0`, SIGReg (Epps–Pulley) replaces the VICReg variance/covariance
/// terms as the anti-collapse / isotropy driver.
pub fn train_and_eval(
    mut enc: Encoder,
    data: &Dataset,
    w: &LossWeights,
    epochs: usize,
    lr: f32,
) -> Result {
    let n_params = enc.n_params();
    let mut final_loss = 0.0;
    let n_rows = data.train.len() * 2;
    let mut rng = StdRng::seed_from_u64(0x5165_0000 ^ n_params as u64);

    for epoch in 0..epochs {
        let mut z = Vec::with_capacity(n_rows);
        let mut xs = Vec::with_capacity(n_rows);
        for s in &data.train {
            z.push(enc.forward(&s.view_a));
            xs.push(&s.view_a);
            z.push(enc.forward(&s.view_b));
            xs.push(&s.view_b);
        }
        // Base loss: invariance (+ optional VICReg var/cov) (+ optional ZDA).
        let (lo, mut g) = loss_and_grad(&z, w);
        final_loss = lo.total;

        // SIGReg term (the faithful LeJEPA objective) added in the loop.
        if w.sig > 0.0 {
            let dirs = sample_dirs(epoch as u64 ^ 0xD125, SIG_DIRS);
            let rows: Vec<usize> = if n_rows <= SIG_SUB {
                (0..n_rows).collect()
            } else {
                (0..SIG_SUB).map(|_| rng.gen_range(0..n_rows)).collect()
            };
            let (sl, sg) = sigreg(&z, &rows, &dirs);
            final_loss += w.sig * sl;
            for i in 0..n_rows {
                for d in 0..EMB {
                    g[i][d] += w.sig * sg[i][d];
                }
            }
        }

        if w.zda_auto && w.zda > 0.0 {
            let (zl, zg) = zda_loss_and_grad(&z);
            final_loss += w.zda * zl;
            let scale =
                auto_zda_gradient_scale(w.zda, grad_rms(&g), grad_rms(&zg), embedding_rms(&z));
            for i in 0..n_rows {
                for d in 0..EMB {
                    g[i][d] += scale * zg[i][d];
                }
            }
        }

        enc.zero_grad();
        for (xi, gi) in xs.iter().zip(g.iter()) {
            enc.backward(xi, gi);
        }
        enc.step(lr, 1.0 / n_rows as f32);
    }

    let train_emb: Vec<[f32; EMB]> = data.train.iter().map(|s| enc.forward(&s.view_a)).collect();
    let train_lab: Vec<usize> = data.train.iter().map(|s| s.label).collect();
    let test_emb: Vec<[f32; EMB]> = data.test.iter().map(|s| enc.forward(&s.view_a)).collect();
    let test_lab: Vec<usize> = data.test.iter().map(|s| s.label).collect();

    let probe_acc = linear_probe(&train_emb, &train_lab, &test_emb, &test_lab, data.n_classes);
    let collapse = collapse_metrics(&test_emb);
    let gauss = gaussianity(&test_emb, 0xE7A1 ^ n_params as u64, 32);

    Result {
        n_params,
        final_loss,
        probe_acc,
        collapse,
        gaussianity: gauss,
    }
}
