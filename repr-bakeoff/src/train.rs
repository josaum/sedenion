//! Training driver shared by both arms.

use crate::data::{Dataset, EMB};
use crate::metrics::{collapse_metrics, linear_probe, Collapse};
use crate::model::{loss_and_grad, Encoder, LossWeights};

pub struct Result {
    pub n_params: usize,
    pub final_loss: f32,
    pub final_cov: f32,
    pub final_zda: f32,
    pub probe_acc: f64,
    pub collapse: Collapse,
}

/// Full-batch gradient descent, then evaluate. Both arms use identical
/// hyperparameters; only the encoder and `w.zda` differ.
pub fn train_and_eval(
    mut enc: Encoder,
    data: &Dataset,
    w: &LossWeights,
    epochs: usize,
    lr: f32,
) -> Result {
    let n_params = enc.n_params();
    let mut final_loss = 0.0;
    let mut final_cov = 0.0;
    let mut final_zda = 0.0;

    for _ in 0..epochs {
        // Forward both views of every training sample → 2N embedding rows.
        let mut z = Vec::with_capacity(data.train.len() * 2);
        let mut xs = Vec::with_capacity(data.train.len() * 2);
        for s in &data.train {
            z.push(enc.forward(&s.view_a));
            xs.push(&s.view_a);
            z.push(enc.forward(&s.view_b));
            xs.push(&s.view_b);
        }
        let (lo, g) = loss_and_grad(&z, w);
        final_loss = lo.total;
        final_cov = lo.cov;
        final_zda = lo.zda;

        enc.zero_grad();
        for (xi, gi) in xs.iter().zip(g.iter()) {
            enc.backward(xi, gi);
        }
        // average gradient over rows
        enc.step(lr, 1.0 / (data.train.len() as f32 * 2.0));
    }

    // Evaluate on held-out data using view_a as the representation.
    let train_emb: Vec<[f32; EMB]> = data.train.iter().map(|s| enc.forward(&s.view_a)).collect();
    let train_lab: Vec<usize> = data.train.iter().map(|s| s.label).collect();
    let test_emb: Vec<[f32; EMB]> = data.test.iter().map(|s| enc.forward(&s.view_a)).collect();
    let test_lab: Vec<usize> = data.test.iter().map(|s| s.label).collect();

    let probe_acc =
        linear_probe(&train_emb, &train_lab, &test_emb, &test_lab, data.n_classes);
    let collapse = collapse_metrics(&test_emb);

    Result { n_params, final_loss, final_cov, final_zda, probe_acc, collapse }
}
