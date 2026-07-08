//! Deep encoder arms for the SOTA-in-harness sedenion representation bake-off.
//!
//! The shallow bake-off (`model.rs`) is a single linear layer, so it can only
//! answer "does sedenion structure help a *linear* projector?". This module adds
//! the untested frontier the READMEs flag: **depth**, a **stronger recipe**
//! (Adam + minibatches), and a **learnable hypercomplex algebra** baseline.
//!
//! Three matched-shape arms map `INPUT` (256) -> `EMB` (16) through the same
//! channel widths (256 -> 128 -> 64 -> 16), SiLU between hidden layers, and a
//! linear final projection (so SIGReg's N(0,1) target is not fought by a final
//! saturating nonlinearity):
//!
//! * **dense**    — full real matrices per layer.
//! * **sedenion** — hypercomplex layers using the *fixed* Cayley-Dickson product
//!   `y[o] = b[o] + Σ_i W[o][i]·x[i]`, 16x fewer weights per layer; consumes the
//!   `sedenion` crate's ZDA barrier on the final embedding.
//! * **phm**      — same shape, but the 16x16x16 multiplication tensor `T` is
//!   *learnable* (Parameterized Hypercomplex Multiplication). `T` is initialized
//!   to the sedenion structure constants, so the arm starts identical to the
//!   fixed arm and can only diverge by learning its own algebra.
//!
//! Every layer has an analytic backward, finite-difference checked in the
//! `tests` module below, matching this repo's gradient-check culture.
//
// Rust guideline compliant 2026-02-21

use crate::data::{Dataset, EMB, INPUT};
use crate::metrics::{collapse_metrics, linear_probe, support_class_metrics};
use crate::sigreg::{gaussianity, sample_dirs, sigreg};
use crate::train::Result as EvalResult;
use rand::rngs::StdRng;
use rand::{Rng, SeedableRng};
use sedenion::{auto_zda_gradient_scale, zda_batch_loss_and_grad, Sedenion};

const H: usize = 16; // hypercomplex block width (one sedenion)
const ADAM_B1: f32 = 0.9;
const ADAM_B2: f32 = 0.999;
const ADAM_EPS: f32 = 1e-8;

/// Cayley-Dickson structure constants `T[k][a][b]` = component `k` of
/// `e_a · e_b`, flattened as `t[(k*H + a)*H + b]`. This is the fixed sedenion
/// algebra; the PHM arm starts here and then learns.
pub fn structure_tensor() -> Vec<f32> {
    let mut t = vec![0.0f32; H * H * H];
    for a in 0..H {
        let mut ca = [0.0f32; H];
        ca[a] = 1.0;
        let ea = Sedenion::new(ca);
        for b in 0..H {
            let mut cb = [0.0f32; H];
            cb[b] = 1.0;
            let prod = ea * Sedenion::new(cb);
            let c = prod.components();
            for (k, &ck) in c.iter().enumerate() {
                t[(k * H + a) * H + b] = ck;
            }
        }
    }
    t
}

/// For each of the `m` input blocks, the factored matrix
/// `M_i[k][a] = Σ_b T[k][a][b] · x_i[b]` (flattened `k*H + a`). Precomputing this
/// turns the per-output-block product into a plain matrix-vector product, so the
/// `O(H³)` tensor contraction is paid once per input block instead of once per
/// (output, input) block pair.
fn m_matrices(t: &[f32], x: &[f32], m: usize) -> Vec<Vec<f32>> {
    let mut out = Vec::with_capacity(m);
    for i in 0..m {
        let xi = &x[i * H..(i + 1) * H];
        let mut mi = vec![0.0f32; H * H];
        for k in 0..H {
            let base = k * H * H;
            for a in 0..H {
                let row = base + a * H;
                let mut s = 0.0f32;
                for b in 0..H {
                    s += t[row + b] * xi[b];
                }
                mi[k * H + a] = s;
            }
        }
        out.push(mi);
    }
    out
}

/// SiLU / swish activation and its derivative (smooth, exact-grad-friendly).
fn silu(x: f32) -> f32 {
    x / (1.0 + (-x).exp())
}
fn silu_grad(x: f32) -> f32 {
    let s = 1.0 / (1.0 + (-x).exp());
    s * (1.0 + x * (1.0 - s))
}

/// A parameter block with its gradient accumulator and Adam moments.
struct Param {
    val: Vec<f32>,
    g: Vec<f32>,
    m: Vec<f32>,
    v: Vec<f32>,
}

impl Param {
    fn new(val: Vec<f32>) -> Self {
        let n = val.len();
        Self {
            val,
            g: vec![0.0; n],
            m: vec![0.0; n],
            v: vec![0.0; n],
        }
    }
    fn zeros(n: usize) -> Self {
        Self::new(vec![0.0; n])
    }
    fn zero_grad(&mut self) {
        self.g.iter_mut().for_each(|x| *x = 0.0);
    }
    /// Adam update with bias correction. `t` is the 1-based step index.
    fn adam(&mut self, lr: f32, t: u64) {
        let bc1 = 1.0 - ADAM_B1.powi(t as i32);
        let bc2 = 1.0 - ADAM_B2.powi(t as i32);
        for i in 0..self.val.len() {
            self.m[i] = ADAM_B1 * self.m[i] + (1.0 - ADAM_B1) * self.g[i];
            self.v[i] = ADAM_B2 * self.v[i] + (1.0 - ADAM_B2) * self.g[i] * self.g[i];
            let mhat = self.m[i] / bc1;
            let vhat = self.v[i] / bc2;
            self.val[i] -= lr * mhat / (vhat.sqrt() + ADAM_EPS);
        }
    }
}

enum Layer {
    /// Full real matrix `w` (row-major `out*in`) plus bias.
    Dense {
        w: Param,
        b: Param,
        in_dim: usize,
        out_dim: usize,
    },
    /// Hypercomplex layer: `p` output blocks, `m` input blocks. `w` holds `p*m`
    /// sedenion weights (row-major `o*m + i`, each `H` scalars). `learn` selects
    /// the fixed Cayley-Dickson product vs. the learnable shared tensor `T`.
    Hyper {
        w: Param,
        b: Param,
        m: usize,
        p: usize,
        learn: bool,
    },
    Silu {
        dim: usize,
    },
}

pub struct DeepEncoder {
    layers: Vec<Layer>,
    /// Shared learnable algebra for PHM arms (`None` for dense/fixed arms).
    algebra: Option<Param>,
    t_fixed: Vec<f32>,
    step: u64,
}

/// Which arm to build.
#[derive(Clone, Copy, PartialEq, Eq)]
pub enum Arm {
    Dense,
    Sedenion,
    Phm,
}

/// Channel widths (real dims) at each layer boundary; hidden layers get SiLU.
const WIDTHS: [usize; 4] = [INPUT, 128, 64, EMB];

impl DeepEncoder {
    pub fn new(arm: Arm, seed: u64) -> Self {
        let mut s = seed.wrapping_mul(0x9E3779B97F4A7C15).wrapping_add(0x51);
        let mut rnd = |scale: f32| {
            s = s
                .wrapping_mul(6364136223846793005)
                .wrapping_add(1442695040888963407);
            ((s >> 33) as f32 / (1u64 << 31) as f32 - 1.0) * scale
        };

        let mut layers = Vec::new();
        let n_layers = WIDTHS.len() - 1;
        for l in 0..n_layers {
            let (din, dout) = (WIDTHS[l], WIDTHS[l + 1]);
            match arm {
                Arm::Dense => {
                    // He-style scale for SiLU/linear.
                    let scale = (2.0 / din as f32).sqrt();
                    let w: Vec<f32> = (0..dout * din).map(|_| rnd(scale)).collect();
                    layers.push(Layer::Dense {
                        w: Param::new(w),
                        b: Param::zeros(dout),
                        in_dim: din,
                        out_dim: dout,
                    });
                }
                Arm::Sedenion | Arm::Phm => {
                    let (m, p) = (din / H, dout / H);
                    // Scale so the summed product variance is ~O(1/m).
                    let scale = (1.0 / m as f32).sqrt() * 0.5;
                    let w: Vec<f32> = (0..p * m * H).map(|_| rnd(scale)).collect();
                    layers.push(Layer::Hyper {
                        w: Param::new(w),
                        b: Param::zeros(p * H),
                        m,
                        p,
                        learn: arm == Arm::Phm,
                    });
                }
            }
            if l + 1 < n_layers {
                layers.push(Layer::Silu { dim: WIDTHS[l + 1] });
            }
        }

        let algebra = if arm == Arm::Phm {
            Some(Param::new(structure_tensor()))
        } else {
            None
        };

        Self {
            layers,
            algebra,
            t_fixed: structure_tensor(),
            step: 0,
        }
    }

    pub fn n_params(&self) -> usize {
        let mut n = 0;
        for l in &self.layers {
            n += match l {
                Layer::Dense { w, b, .. } => w.val.len() + b.val.len(),
                Layer::Hyper { w, b, .. } => w.val.len() + b.val.len(),
                Layer::Silu { .. } => 0,
            };
        }
        if let Some(a) = &self.algebra {
            n += a.val.len();
        }
        n
    }

    /// Forward one sample, returning the 16-D embedding and each layer's input
    /// (needed for the analytic backward).
    fn forward_cache(&self, x: &[f32; INPUT]) -> ([f32; EMB], Vec<Vec<f32>>) {
        let mut cur = x.to_vec();
        let mut inputs = Vec::with_capacity(self.layers.len());
        for l in &self.layers {
            inputs.push(cur.clone());
            cur = self.layer_forward(l, &cur);
        }
        let mut emb = [0.0f32; EMB];
        emb.copy_from_slice(&cur);
        (emb, inputs)
    }

    /// Forward one sample for evaluation (no caching).
    pub fn forward(&self, x: &[f32; INPUT]) -> [f32; EMB] {
        self.forward_cache(x).0
    }

    fn layer_forward(&self, l: &Layer, x: &[f32]) -> Vec<f32> {
        match l {
            Layer::Dense {
                w,
                b,
                in_dim,
                out_dim,
            } => {
                let mut y = vec![0.0f32; *out_dim];
                for o in 0..*out_dim {
                    let mut acc = b.val[o];
                    let row = o * in_dim;
                    for i in 0..*in_dim {
                        acc += w.val[row + i] * x[i];
                    }
                    y[o] = acc;
                }
                y
            }
            Layer::Hyper { w, b, m, p, learn } => {
                let (m, p) = (*m, *p);
                let t = if *learn {
                    &self.algebra.as_ref().unwrap().val
                } else {
                    &self.t_fixed
                };
                // Factor the bilinear product: y_o[k] = b + Σ_i Σ_a M_i[k][a] w_{o,i}[a],
                // with M_i[k][a] = Σ_b T[k][a][b] x_i[b] precomputed once per input
                // block (amortized across all `p` output blocks).
                let mmat = m_matrices(t, x, m);
                let mut y = vec![0.0f32; p * H];
                for o in 0..p {
                    let yo = &mut y[o * H..(o + 1) * H];
                    yo.copy_from_slice(&b.val[o * H..(o + 1) * H]);
                    for i in 0..m {
                        let wi = &w.val[(o * m + i) * H..(o * m + i + 1) * H];
                        let mi = &mmat[i];
                        for (k, yk) in yo.iter_mut().enumerate() {
                            let mrow = &mi[k * H..(k + 1) * H];
                            let mut s = 0.0f32;
                            for a in 0..H {
                                s += mrow[a] * wi[a];
                            }
                            *yk += s;
                        }
                    }
                }
                y
            }
            Layer::Silu { dim } => {
                let mut y = vec![0.0f32; *dim];
                for i in 0..*dim {
                    y[i] = silu(x[i]);
                }
                y
            }
        }
    }

    pub fn zero_grad(&mut self) {
        for l in &mut self.layers {
            match l {
                Layer::Dense { w, b, .. } => {
                    w.zero_grad();
                    b.zero_grad();
                }
                Layer::Hyper { w, b, .. } => {
                    w.zero_grad();
                    b.zero_grad();
                }
                Layer::Silu { .. } => {}
            }
        }
        if let Some(a) = &mut self.algebra {
            a.zero_grad();
        }
    }

    /// Accumulate gradients for one sample given `gy = ∂L/∂emb`.
    fn backward(&mut self, inputs: &[Vec<f32>], gy: &[f32; EMB]) {
        // Read-only snapshot of the active algebra so the reverse pass can hold
        // `&mut self.layers` without aliasing the tensor (16 KB, cheap to clone).
        let t: Vec<f32> = match &self.algebra {
            Some(a) => a.val.clone(),
            None => self.t_fixed.clone(),
        };
        let mut grad = gy.to_vec();
        let mut gt = vec![0.0f32; t.len()];
        let mut algebra_touched = false;
        for li in (0..self.layers.len()).rev() {
            let x = &inputs[li];
            grad = self.layer_backward(li, x, &grad, &t, &mut gt, &mut algebra_touched);
        }
        if algebra_touched {
            if let Some(a) = &mut self.algebra {
                for (dst, src) in a.g.iter_mut().zip(gt.iter()) {
                    *dst += *src;
                }
            }
        }
    }

    fn layer_backward(
        &mut self,
        li: usize,
        x: &[f32],
        gy: &[f32],
        t: &[f32],
        gt: &mut [f32],
        algebra_touched: &mut bool,
    ) -> Vec<f32> {
        let l = &mut self.layers[li];
        match l {
            Layer::Dense {
                w,
                b,
                in_dim,
                out_dim,
            } => {
                let (in_dim, out_dim) = (*in_dim, *out_dim);
                let mut gx = vec![0.0f32; in_dim];
                for o in 0..out_dim {
                    let go = gy[o];
                    b.g[o] += go;
                    let row = o * in_dim;
                    for i in 0..in_dim {
                        w.g[row + i] += go * x[i];
                        gx[i] += w.val[row + i] * go;
                    }
                }
                gx
            }
            Layer::Hyper { w, b, m, p, learn } => {
                let (m, p, learn) = (*m, *p, *learn);
                // Same factorization as the forward: M_i[k][a] = Σ_b T[k][a][b] x_i[b].
                let mmat = m_matrices(t, x, m);
                let mut gx = vec![0.0f32; m * H];
                for o in 0..p {
                    let go = &gy[o * H..(o + 1) * H];
                    for k in 0..H {
                        b.g[o * H + k] += go[k];
                    }
                    // N_o[a][b] = Σ_k go[k] T[k][a][b]  (input-gradient operator).
                    let mut n = [0.0f32; H * H];
                    for k in 0..H {
                        let gk = go[k];
                        if gk == 0.0 {
                            continue;
                        }
                        let base = k * H * H;
                        for ab in 0..H * H {
                            n[ab] += gk * t[base + ab];
                        }
                    }
                    for i in 0..m {
                        let wi_off = (o * m + i) * H;
                        let wi = &w.val[wi_off..wi_off + H];
                        let mi = &mmat[i];
                        // gw_{o,i}[a] = Σ_k go[k] M_i[k][a].
                        for a in 0..H {
                            let mut s = 0.0f32;
                            for k in 0..H {
                                s += go[k] * mi[k * H + a];
                            }
                            w.g[wi_off + a] += s;
                        }
                        // gx_i[b] += Σ_a N_o[a][b] w_{o,i}[a].
                        for a in 0..H {
                            let wa = wi[a];
                            if wa == 0.0 {
                                continue;
                            }
                            let nrow = &n[a * H..(a + 1) * H];
                            for b in 0..H {
                                gx[i * H + b] += nrow[b] * wa;
                            }
                        }
                    }
                    // gT[k][a][b] += go[k] · Q_o[a][b], with Q_o[a][b] = Σ_i w_{o,i}[a] x_i[b].
                    if learn {
                        let mut q = [0.0f32; H * H];
                        for i in 0..m {
                            let wi_off = (o * m + i) * H;
                            let wi = &w.val[wi_off..wi_off + H];
                            let xi = &x[i * H..(i + 1) * H];
                            for a in 0..H {
                                let wa = wi[a];
                                if wa == 0.0 {
                                    continue;
                                }
                                let qrow = a * H;
                                for b in 0..H {
                                    q[qrow + b] += wa * xi[b];
                                }
                            }
                        }
                        for k in 0..H {
                            let gk = go[k];
                            if gk == 0.0 {
                                continue;
                            }
                            let base = k * H * H;
                            for ab in 0..H * H {
                                gt[base + ab] += gk * q[ab];
                            }
                        }
                    }
                }
                if learn {
                    *algebra_touched = true;
                }
                gx
            }
            Layer::Silu { dim } => {
                let mut gx = vec![0.0f32; *dim];
                for i in 0..*dim {
                    gx[i] = gy[i] * silu_grad(x[i]);
                }
                gx
            }
        }
    }

    fn adam_step(&mut self, lr: f32) {
        self.step += 1;
        let t = self.step;
        for l in &mut self.layers {
            match l {
                Layer::Dense { w, b, .. } => {
                    w.adam(lr, t);
                    b.adam(lr, t);
                }
                Layer::Hyper { w, b, .. } => {
                    w.adam(lr, t);
                    b.adam(lr, t);
                }
                Layer::Silu { .. } => {}
            }
        }
        if let Some(a) = &mut self.algebra {
            a.adam(lr, t);
        }
    }
}

/// Training config for the deep arms.
pub struct DeepConfig {
    pub epochs: usize,
    pub batch: usize,
    pub lr: f32,
    pub inv_w: f32,
    pub sig_w: f32,
    pub zda: bool,
}

impl Default for DeepConfig {
    fn default() -> Self {
        Self {
            epochs: 80,
            batch: 256,
            lr: 3e-3,
            inv_w: 25.0,
            sig_w: 1.0,
            zda: false,
        }
    }
}

fn grad_rms(g: &[[f32; EMB]]) -> f32 {
    let mut ss = 0.0f32;
    for row in g {
        for &v in row {
            ss += v * v;
        }
    }
    (ss / (g.len() * EMB).max(1) as f32).sqrt()
}

/// Minibatch Adam training of a deep arm, then evaluate with the shared metrics.
pub fn train_deep_and_eval(mut enc: DeepEncoder, data: &Dataset, cfg: &DeepConfig) -> EvalResult {
    let n_params = enc.n_params();
    let mut rng = StdRng::seed_from_u64(0x5EED_0000 ^ n_params as u64);
    let n = data.train.len();
    let mut order: Vec<usize> = (0..n).collect();
    let mut final_loss = 0.0f32;
    let mut step_seed = 0u64;

    for _epoch in 0..cfg.epochs {
        // Shuffle sample order each epoch (Fisher-Yates).
        for i in (1..n).rev() {
            let j = rng.gen_range(0..=i);
            order.swap(i, j);
        }
        for chunk in order.chunks(cfg.batch) {
            // Forward both views of each sample; rows 2p, 2p+1 are a view pair.
            let mut z: Vec<[f32; EMB]> = Vec::with_capacity(chunk.len() * 2);
            let mut cache: Vec<Vec<Vec<f32>>> = Vec::with_capacity(chunk.len() * 2);
            for &si in chunk {
                let (ea, ca) = enc.forward_cache(&data.train[si].view_a);
                z.push(ea);
                cache.push(ca);
                let (eb, cb) = enc.forward_cache(&data.train[si].view_b);
                z.push(eb);
                cache.push(cb);
            }
            let m = z.len();
            let mut g = vec![[0.0f32; EMB]; m];

            // Invariance over view pairs.
            let n_pairs = (m / 2) as f32;
            let mut l_inv = 0.0f32;
            for p in 0..m / 2 {
                let (a, b) = (2 * p, 2 * p + 1);
                for d in 0..EMB {
                    let diff = z[a][d] - z[b][d];
                    l_inv += diff * diff;
                    let gd = cfg.inv_w * 2.0 * diff / n_pairs;
                    g[a][d] += gd;
                    g[b][d] -= gd;
                }
            }
            final_loss = cfg.inv_w * l_inv / n_pairs;

            // SIGReg (faithful Epps-Pulley) over the whole minibatch.
            if cfg.sig_w > 0.0 {
                let dirs = sample_dirs(step_seed ^ 0xD125, 16);
                let rows: Vec<usize> = (0..m).collect();
                let (sl, sg) = sigreg(&z, &rows, &dirs);
                final_loss += cfg.sig_w * sl;
                for i in 0..m {
                    for d in 0..EMB {
                        g[i][d] += cfg.sig_w * sg[i][d];
                    }
                }
            }

            // Auto-balanced ZDA barrier on the embedding (sedenion/PHM arms).
            if cfg.zda {
                let batch: Vec<Sedenion> = z.iter().map(|r| Sedenion::new(*r)).collect();
                let (_zl, zg) = zda_batch_loss_and_grad(&batch);
                let zg: Vec<[f32; EMB]> = zg.iter().map(|s| *s.components()).collect();
                let emb_rms = grad_rms(&z); // RMS of embeddings (reuse helper shape)
                let scale = auto_zda_gradient_scale(1.0, grad_rms(&g), grad_rms(&zg), emb_rms);
                for i in 0..m {
                    for d in 0..EMB {
                        g[i][d] += scale * zg[i][d];
                    }
                }
            }

            // Backprop the whole minibatch, then one Adam step.
            enc.zero_grad();
            for (ci, gi) in cache.iter().zip(g.iter()) {
                enc.backward(ci, gi);
            }
            enc.adam_step(cfg.lr);
            step_seed += 1;
        }
    }

    let train_emb: Vec<[f32; EMB]> = data.train.iter().map(|s| enc.forward(&s.view_a)).collect();
    let train_lab: Vec<usize> = data.train.iter().map(|s| s.label).collect();
    let test_emb: Vec<[f32; EMB]> = data.test.iter().map(|s| enc.forward(&s.view_a)).collect();
    let test_lab: Vec<usize> = data.test.iter().map(|s| s.label).collect();

    let probe_acc = linear_probe(&train_emb, &train_lab, &test_emb, &test_lab, data.n_classes);
    let collapse = collapse_metrics(&test_emb);
    let gauss = gaussianity(&test_emb, 0xE7A1 ^ n_params as u64, 32);
    let support = support_class_metrics(&test_emb, 0.25);

    EvalResult {
        n_params,
        final_loss,
        probe_acc,
        collapse,
        gaussianity: gauss,
        support,
    }
}

#[cfg(test)]
impl DeepEncoder {
    /// Flattened parameter values, in a fixed order (per layer: `w` then `b`;
    /// then the shared algebra). Used only by the gradient checks.
    fn flat_vals(&self) -> Vec<f32> {
        let mut v = Vec::new();
        for l in &self.layers {
            if let Layer::Dense { w, b, .. } | Layer::Hyper { w, b, .. } = l {
                v.extend_from_slice(&w.val);
                v.extend_from_slice(&b.val);
            }
        }
        if let Some(a) = &self.algebra {
            v.extend_from_slice(&a.val);
        }
        v
    }
    /// Flattened gradient accumulators, same order as `flat_vals`.
    fn flat_grads(&self) -> Vec<f32> {
        let mut v = Vec::new();
        for l in &self.layers {
            if let Layer::Dense { w, b, .. } | Layer::Hyper { w, b, .. } = l {
                v.extend_from_slice(&w.g);
                v.extend_from_slice(&b.g);
            }
        }
        if let Some(a) = &self.algebra {
            v.extend_from_slice(&a.g);
        }
        v
    }
    fn set_flat(&mut self, mut idx: usize, val: f32) {
        for l in &mut self.layers {
            if let Layer::Dense { w, b, .. } | Layer::Hyper { w, b, .. } = l {
                if idx < w.val.len() {
                    w.val[idx] = val;
                    return;
                }
                idx -= w.val.len();
                if idx < b.val.len() {
                    b.val[idx] = val;
                    return;
                }
                idx -= b.val.len();
            }
        }
        if let Some(a) = &mut self.algebra {
            if idx < a.val.len() {
                a.val[idx] = val;
                return;
            }
        }
        panic!("set_flat index out of range");
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Compare the analytic parameter gradients (including, for PHM, the
    /// learnable algebra tensor) against central finite differences of a linear
    /// readout loss `L = Σ_d c_d · emb_d`.
    fn finite_diff_check(arm: Arm) {
        let mut enc = DeepEncoder::new(arm, 42);
        let mut s = 0x1234_5678u64;
        let mut rnd = || {
            s = s.wrapping_mul(6364136223846793005).wrapping_add(1);
            (s >> 33) as f32 / (1u64 << 31) as f32 - 1.0
        };
        let mut x = [0.0f32; INPUT];
        for xi in x.iter_mut() {
            *xi = rnd() * 0.5;
        }
        let mut c = [0.0f32; EMB];
        for ci in c.iter_mut() {
            *ci = rnd();
        }
        let loss = |e: &DeepEncoder| -> f32 {
            let emb = e.forward(&x);
            (0..EMB).map(|d| c[d] * emb[d]).sum()
        };

        let (_emb, inputs) = enc.forward_cache(&x);
        enc.zero_grad();
        enc.backward(&inputs, &c);
        let ana = enc.flat_grads();
        let vals = enc.flat_vals();

        let h = 1e-3f32;
        let n = vals.len();
        // Stride to bound test time while still sampling every layer (and, for
        // PHM, the algebra tensor, which is the second half of the param vector).
        let stride = (n / 500).max(1);
        let mut checked = 0usize;
        for i in (0..n).step_by(stride) {
            let v0 = vals[i];
            enc.set_flat(i, v0 + h);
            let lp = loss(&enc);
            enc.set_flat(i, v0 - h);
            let lm = loss(&enc);
            enc.set_flat(i, v0);
            let num = (lp - lm) / (2.0 * h);
            let a = ana[i];
            // Combined tolerance: an absolute floor absorbs f32 finite-difference
            // noise on small-magnitude gradients, plus a relative term for large
            // ones. (`atol` dominates for the tiny first-layer weights.)
            let atol = 3e-3f32;
            let rtol = 3e-2f32;
            let err = (a - num).abs();
            assert!(
                err < atol + rtol * num.abs(),
                "grad mismatch @ {i}: analytic={a} numeric={num} err={err}"
            );
            checked += 1;
        }
        assert!(checked > 50, "too few params checked: {checked}");
    }

    #[test]
    fn dense_grads_match_finite_difference() {
        finite_diff_check(Arm::Dense);
    }

    #[test]
    fn sedenion_grads_match_finite_difference() {
        finite_diff_check(Arm::Sedenion);
    }

    #[test]
    fn phm_grads_including_algebra_match_finite_difference() {
        finite_diff_check(Arm::Phm);
    }

    #[test]
    fn phm_starts_equal_to_fixed_sedenion() {
        // PHM's algebra is initialized to the Cayley-Dickson structure constants,
        // so before any training its forward must equal the fixed sedenion arm.
        let sed = DeepEncoder::new(Arm::Sedenion, 7);
        let phm = DeepEncoder::new(Arm::Phm, 7);
        let mut s = 99u64;
        let mut x = [0.0f32; INPUT];
        for xi in x.iter_mut() {
            s = s.wrapping_mul(6364136223846793005).wrapping_add(1);
            *xi = (s >> 40) as f32 / (1u64 << 23) as f32 - 1.0;
        }
        let (a, b) = (sed.forward(&x), phm.forward(&x));
        for d in 0..EMB {
            assert!(
                (a[d] - b[d]).abs() < 1e-5,
                "phm != fixed at {d}: {} vs {}",
                a[d],
                b[d]
            );
        }
    }
}
