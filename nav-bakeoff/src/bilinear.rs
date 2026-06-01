//! The decisive diagnostic: does the strapdown coupling actually live in the
//! subspace the sedenion product can reach?
//!
//! For a *frozen* input `u = (ω̄)`, the part of the (nondimensionalized)
//! navigation vector field that is **linear in the state** is an ordinary
//! 16×16 matrix `A(ω̄)` — attitude kinematics, Coriolis, centripetal, and
//! transport. The constrained-bilinear sedenion template, also for frozen `u`,
//! can only produce operators in the linear subspace
//!
//! ```text
//! O = span{ L_{e_k}, R_{e_k} : k = 0..15 }   subset of  R^{16x16}
//! ```
//!
//! (because `L_Omega + R_Gamma + (L_Lambda - R_Lambda)` is linear in its
//! multipliers, and `x -> L_x`, `x -> R_x` are linear). So the honest question
//! is purely geometric:
//!
//! ```text
//! rho_full = ||A - Proj_O(A)||_F / ||A||_F
//! ```
//!
//! how far is the true strapdown coupling from everything the sedenion product
//! can express? `ρ_full ≈ 0` ⇒ the sedenion operators are a compact (≤31-param)
//! natural basis for strapdown coupling — a real structural win. `ρ_full` large
//! ⇒ the physics does not live in the algebra and `F_nonlinear` must carry it,
//! i.e. the algebra is overhead.
//!
//! The quaternion-generator ablation (`ρ_quat`, multipliers restricted to
//! `e_0..e_3`) and `Δρ = ρ_quat − ρ_full` isolate how much the *off-quaternion*
//! generators `e_4..e_15` actually contribute — the `𝕊` vs. `ℍ ⊕ ℝ¹²` question.
//!
//! ## Nondimensionalization
//!
//! Natural scaling with `L₀ = V₀ / Ω₀` makes every block O(1)·(ω̄ or ω̄²) and
//! dimensionless, so the Frobenius residual weights attitude, Coriolis,
//! centripetal and transport comparably. `ω̄ = ω / Ω₀`. Defaults: `Ω₀ = 1 rad/s`,
//! `V₀ = 30 m/s`, `L₀ = 30 m` (override by passing a different ω̄ magnitude).

use crate::linalg::{jacobi_eigen_symmetric, singular_values, Mat};
use sedenion::Sedenion;

// State slot map (paper's convention): attitude e0..e3, velocity e4..e6,
// position e7..e9, biases e10..e15 (biases excluded from the linear-in-state
// coupling A by construction — they belong to F_nonlinear).
const Q: usize = 0;
const V: usize = 4;
const R: usize = 7;

fn skew(w: [f64; 3]) -> [[f64; 3]; 3] {
    [[0.0, -w[2], w[1]], [w[2], 0.0, -w[0]], [-w[1], w[0], 0.0]]
}

/// Nondimensionalized strapdown coupling `A(ω̄)`: the part of the navigation
/// vector field that is linear in the state.
pub fn strapdown_coupling(wb: [f64; 3]) -> Mat {
    let mut a = Mat::zeros(16, 16);
    let (wx, wy, wz) = (wb[0], wb[1], wb[2]);

    // Attitude kinematics  q̇ = ½ q ⊗ (0, ω̄)  — skew 4×4 on the q-block.
    // Rows/cols ordered (w,x,y,z).
    let m_att = [
        [0.0, -wx, -wy, -wz],
        [wx, 0.0, wz, -wy],
        [wy, -wz, 0.0, wx],
        [wz, wy, -wx, 0.0],
    ];
    for i in 0..4 {
        for j in 0..4 {
            a.set(Q + i, Q + j, 0.5 * m_att[i][j]);
        }
    }

    let sk = skew(wb);
    // Velocity:  v̇ = −2 ω̄ × v  (Coriolis)  −  ω̄ × (ω̄ × r)  (centripetal).
    // centripetal operator  −[ω̄]×[ω̄]×  acts r → v.
    let mut sk2 = [[0.0; 3]; 3];
    for i in 0..3 {
        for j in 0..3 {
            let mut s = 0.0;
            for k in 0..3 {
                s += sk[i][k] * sk[k][j];
            }
            sk2[i][j] = s;
        }
    }
    for i in 0..3 {
        for j in 0..3 {
            a.set(V + i, V + j, -2.0 * sk[i][j]); // Coriolis
            a.set(V + i, R + j, -sk2[i][j]); // centripetal
        }
    }

    // Position:  ṙ = v − ω̄ × r  (transport).  Identity v → ṙ, −[ω̄]× on r.
    for i in 0..3 {
        a.set(R + i, V + i, 1.0);
        for j in 0..3 {
            a.set(R + i, R + j, -sk[i][j]);
        }
    }
    a
}

fn sed_basis(k: usize) -> Sedenion {
    let mut c = [0.0f32; 16];
    c[k] = 1.0;
    Sedenion::new(c)
}

fn to_mat(m: [[f32; 16]; 16]) -> Mat {
    let mut out = Mat::zeros(16, 16);
    for i in 0..16 {
        for j in 0..16 {
            out.set(i, j, m[i][j] as f64);
        }
    }
    out
}

/// The sedenion-reachable generator matrices {L_{e_k}, R_{e_k}}. `kmax`=4 gives
/// the quaternion-generator ablation; `kmax`=16 gives the full algebra.
pub fn generators(kmax: usize) -> Vec<Mat> {
    let mut g = Vec::new();
    for k in 0..kmax {
        g.push(to_mat(sed_basis(k).left_mul_matrix()));
        g.push(to_mat(sed_basis(k).right_mul_matrix()));
    }
    g
}

fn frob_inner(a: &Mat, b: &Mat) -> f64 {
    a.data.iter().zip(b.data.iter()).map(|(x, y)| x * y).sum()
}

fn frob_norm(a: &Mat) -> f64 {
    frob_inner(a, a).sqrt()
}

/// Numerical rank of a generator set (dimension of the reachable subspace).
pub fn reachable_dim(gens: &[Mat]) -> usize {
    let m = gens.len();
    let mut gram = Mat::zeros(m, m);
    for i in 0..m {
        for j in 0..m {
            gram.set(i, j, frob_inner(&gens[i], &gens[j]));
        }
    }
    let (eig, _) = jacobi_eigen_symmetric(&gram);
    let max = eig.iter().cloned().fold(0.0f64, f64::max);
    let tol = 1e-9 * max.max(1e-30);
    eig.iter().filter(|&&e| e > tol).count()
}

/// Orthogonal projection of `A` onto span{gens} (Frobenius), returned as the
/// projected matrix. Uses a PSD pseudo-inverse of the Gram matrix so a
/// rank-deficient generator set is handled exactly.
fn project(a: &Mat, gens: &[Mat]) -> Mat {
    let m = gens.len();
    let mut gram = Mat::zeros(m, m);
    let mut b = vec![0.0; m];
    for i in 0..m {
        b[i] = frob_inner(&gens[i], a);
        for j in 0..m {
            gram.set(i, j, frob_inner(&gens[i], &gens[j]));
        }
    }
    // c = pinv(Gram) b   via eigendecomposition.
    let (eig, vmat) = jacobi_eigen_symmetric(&gram);
    let max = eig.iter().cloned().fold(0.0f64, f64::max);
    let tol = 1e-9 * max.max(1e-30);
    // y = Vᵀ b
    let mut y = vec![0.0; m];
    for k in 0..m {
        let mut s = 0.0;
        for i in 0..m {
            s += vmat.get(i, k) * b[i];
        }
        y[k] = s;
    }
    for k in 0..m {
        y[k] = if eig[k] > tol { y[k] / eig[k] } else { 0.0 };
    }
    // c = V y
    let mut c = vec![0.0; m];
    for i in 0..m {
        let mut s = 0.0;
        for k in 0..m {
            s += vmat.get(i, k) * y[k];
        }
        c[i] = s;
    }
    let mut proj = Mat::zeros(a.rows, a.cols);
    for (ci, g) in c.iter().zip(gens.iter()) {
        for idx in 0..proj.data.len() {
            proj.data[idx] += ci * g.data[idx];
        }
    }
    proj
}

/// Relative Frobenius residual of `A` against span{gens}, plus per-block
/// residuals (attitude rows 0..3, vel+pos rows 4..9).
pub struct Residual {
    pub rho: f64,
    pub rho_attitude: f64,
    pub rho_velpos: f64,
}

fn block_rel_resid(diff: &Mat, a: &Mat, rows: std::ops::Range<usize>) -> f64 {
    let mut dn = 0.0;
    let mut an = 0.0;
    for i in rows {
        for j in 0..a.cols {
            dn += diff.get(i, j).powi(2);
            an += a.get(i, j).powi(2);
        }
    }
    if an < 1e-30 {
        f64::NAN
    } else {
        (dn / an).sqrt()
    }
}

pub fn residual(a: &Mat, gens: &[Mat]) -> Residual {
    let proj = project(a, gens);
    let diff = a.add(&proj.scale(-1.0));
    Residual {
        rho: frob_norm(&diff) / frob_norm(a).max(1e-30),
        rho_attitude: block_rel_resid(&diff, a, 0..4),
        rho_velpos: block_rel_resid(&diff, a, 4..10),
    }
}

/// Control / sanity check: the 4×4 attitude-kinematics block projected onto the
/// 4×4 quaternion multiplication operators (the genuine quaternion subalgebra
/// acting on itself). Should be ≈0 — quaternions ARE the right tool for the
/// attitude sub-problem, in sharp contrast to the full 16-D state. This both
/// validates the harness and isolates exactly where the sedenion product earns
/// its keep (the 4-D attitude corner) and where it does not (everything else).
pub fn attitude_block_residual(wb: [f64; 3]) -> f64 {
    let full = strapdown_coupling(wb);
    let mut a4 = Mat::zeros(4, 4);
    for i in 0..4 {
        for j in 0..4 {
            a4.set(i, j, full.get(i, j));
        }
    }
    let mut gens = Vec::new();
    for k in 0..4 {
        let l = to_mat(sed_basis(k).left_mul_matrix());
        let r = to_mat(sed_basis(k).right_mul_matrix());
        let mut l4 = Mat::zeros(4, 4);
        let mut r4 = Mat::zeros(4, 4);
        for i in 0..4 {
            for j in 0..4 {
                l4.set(i, j, l.get(i, j));
                r4.set(i, j, r.get(i, j));
            }
        }
        gens.push(l4);
        gens.push(r4);
    }
    let proj = project(&a4, &gens);
    let diff = a4.add(&proj.scale(-1.0));
    frob_norm(&diff) / frob_norm(&a4).max(1e-30)
}

/// Operator conditioning diagnostics for a sedenion state `s`.
pub struct OpDiag {
    pub sigma_min: f64,
    pub sigma_max: f64,
    pub kappa: f64,
    pub zd_dist: f32,
}

pub fn operator_diagnostics(s: &Sedenion) -> OpDiag {
    let l = to_mat(s.left_mul_matrix());
    let sv = singular_values(&l);
    let smax = sv.first().cloned().unwrap_or(0.0);
    let smin = sv.last().cloned().unwrap_or(0.0);
    let (_, zd) = s.zero_divisor_status();
    OpDiag {
        sigma_min: smin,
        sigma_max: smax,
        kappa: if smin > 1e-12 {
            smax / smin
        } else {
            f64::INFINITY
        },
        zd_dist: zd,
    }
}
