Sedenion-LeJEPA: Isotropic Gaussian Embedding in 16D Hypercomplex Latent Space
=================================================================================

This document explores how sedenions (16-dimensional Cayley-Dickson algebra) can be mapped to LeJEPA's isotropic Gaussian framework and SIGReg regularization for representation learning. It outlines the theoretical foundation, the architecture, and the hypothesized advantages.

**Status:** treat this as a design note, not as an empirical result. The controlled
`repr-bakeoff` harness now tests the core claims; under the fixed LeJEPA SIGReg
objective, the current auto-balanced ZDA barrier lets the sedenion arm beat the
dense baseline in this narrow harness without a raw `λ_zda` sweep. See
[`repr-bakeoff/README.md`](repr-bakeoff/README.md) for the measured results.

## 1. Background: LeJEPA & SIGReg

LeJEPA (Latent-Euclidean Joint-Embedding Predictive Architecture) proves that **isotropic Gaussian latent distributions** are optimal for minimizing downstream prediction risk. It enforces this via **SIGReg** (Sketched Isotropic Gaussian Regularization), which matches random 1D projections of embeddings to `N(0, I)` using the Cramér-Wold theorem.

**Core LeJEPA Objective:**
`L = ||g(z_c) - z_t||² + λ * SIGReg(z)`
- `z_c, z_t`: Context and target embeddings in R^d
- `g`: Predictor in latent space
- `SIGReg`: Ensures `z ~ N(0, I_d)` via random projections

## 2. The Sedenion Map: 16D Structured Latent Space

Instead of mapping to R^d, map to `S^k` (k sedenions). Each sedenion is a 16-dimensional hypercomplex number with a unique algebraic structure.

| Property | Real Vector (R^16) | Sedenion (S) |
|---|---|---|
| Dimension | 16 | 16 |
| Commutativity | Yes | No |
| Associativity | Yes | No |
| Alternativity | Yes | No |
| Zero Divisors | No | **Yes** |
| Power-Associativity | Yes | **Yes** |
| Division Algebra | No | No |

### 2.1 Why Sedenions Instead of R^16?

The naive approach is to simply treat sedenions as R^16 with a norm. The power of sedenions comes from their **algebraic structure**:

1. **Non-Commutativity**: The predictor `g(z) = W * z` can encode directional/asymmetric dynamics. `W * z ≠ z * W` means the latent transition operator has a natural orientation.
2. **Power-Associativity**: Polynomial predictors, series expansions, and iterative dynamics (`z_{t+1} = z_t^2 + c`) are well-defined, unlike in higher Cayley-Dickson algebras (pathions, etc.).
3. **Zero Divisors**: The set of zero divisors is topologically equivalent to the exceptional Lie group **G₂**. This embeds exceptional symmetry into the latent space geometry.
4. **Parameter Efficiency**: As shown in sedenion CNNs, each weight component is reused 16 times via the multiplication table, yielding **16× parameter reduction** without losing representational capacity.

## 3. Sedenion-LeJEPA Architecture

### 3.1 Encoder
- `f_θ: X → Z ∈ S^k` (k sedenions, structured as k 16-dimensional hypercomplex numbers)
- The encoder outputs a vector of sedenions. For a single sedenion output, this is a 16-channel real tensor with a non-standard multiplication rule for downstream layers.
- **Implementation**: Use a sedenion-valued neural network layer (sedenion convolution or sedenion linear layer) as the final encoder block.

### 3.2 Predictor
- `g_φ: S^k → S^k`
- **Sedenion-Linear Layer**: `Y = W ⊗ X` where `W` is a sedenion weight matrix and `⊗` is sedenion matrix multiplication. This is more expressive than a standard real matrix because the non-commutativity creates cross-term interactions between the 16 components.
- **Sedenion-Polynomial Predictor**: Because sedenions are power-associative, we can define polynomial predictors:
  `g(z) = W_1 * z + W_2 * z^2 + W_3 * z^3 + ... + b`
  This is well-defined and differentiable, unlike in general non-associative algebras.

### 3.3 Prediction Loss
- Use the sedenion norm for the distance metric:
  `L_pred = ||g(z_c) - z_t||²_S = Σ_i ||g(z_c)_i - z_t_i||²`
  where `||q||²_S = q * q̄` (conjugate product) is the standard sedenion norm.

## 4. Sedenion-SIGReg: Isotropic Gaussian in S

### 4.1 The Sedenion Isotropic Gaussian

For a sedenion `Z = z_0 + z_1 e_1 + ... + z_15 e_15`, the isotropic Gaussian prior is defined component-wise:
`p(Z) = N(0, σ²I_16)`

All 16 real components are i.i.d. Gaussian. The sedenion norm `||Z||²` then follows a scaled chi-squared distribution with 16 degrees of freedom. This is **algebraically isotropic** because the norm treats all 16 basis directions equally.

### 4.2 Sketched Projections for Sedenions

Standard SIGReg projects embeddings onto random 1D vectors `v ∈ R^d` and checks if `v·z ~ N(0, 1)`.

**Sedenion-SIGReg** extends this:
1. **Component-wise sketch**: Project onto a random 16D real vector `v ∈ R^16`. This is the standard sketch applied to the sedenion's real components.
2. **Subalgebra sketch**: Project onto a random subalgebra of S. For example, project onto a random octonion subalgebra (8D) or quaternion subalgebra (4D). Check if the projection is Gaussian within that subspace. This tests isotropy at multiple scales.
3. **Pure-imaginary sketch**: Project onto the 15D pure-imaginary subspace. The pure-imaginary part of a sedenion is `Im(Z) = Z - Re(Z)`. Check if `Im(Z)` is isotropic Gaussian in R^15.
4. **Sedenion-unit sketch**: For a random unit sedenion `u` (where `||u|| = 1`), compute the projection `Z * u` or `u * Z`. Because multiplication by a unit sedenion preserves the norm (if we were in a division algebra), but in sedenions it does not always preserve the norm due to zero divisors. However, for most `u`, it provides a rotation-like transformation. The distribution of `u * Z` should still be isotropic if `Z` is.

### 4.3 Zero-Divisor-Aware Regularization (ZDA-Reg)

This is a **novel** regularization term specific to sedenion latent spaces.

**Zero Divisor Condition**: For `Z = (A, B)` where `A, B ∈ O` (octonions), `Z` is a zero divisor iff:
- `||A|| = ||B||` (equal norm)
- `A · B = 0` (orthogonal)

**ZDA-Reg Loss**: the current implementation uses the `repr-bakeoff`-validated
barrier, not the superseded raw distance. For each embedding `Z_i=(A_i,B_i)`:

```
score_i = sqrt((||A_i||² - ||B_i||²)² + (2 A_i · B_i)²) / (||A_i||² + ||B_i||²)
L_ZDA   = Σ_i -log(score_i) + norm_floor_i
```

Training applies the ZDA gradient with automatic RMS balancing against the base
SIGReg/invariance gradient, so there is no raw `λ_zda` sweep to tune.

**Why this matters for representation learning:**
- **Collapse Prevention**: If the encoder collapses to a zero divisor `Z ≠ 0` where `Z * W = 0`, the predictor loses information. ZDA-Reg pushes representations away from the zero-divisor set, ensuring the latent space remains a valid signal space.
- **Information Bottleneck**: Zero divisors act as an algebraic "null space." By controlling the distance to the zero divisor manifold, we explicitly control the capacity of the latent channel.
- **G₂ Geometry**: The zero divisor set of unit sedenions is homeomorphic to G₂. By regularizing against it, we are implicitly shaping the latent space to avoid the exceptional symmetry singularities, which could stabilize training.

### 4.4 Triangular-Root Support Diagnostics

The triangular-root DOI package adds a discrete layer above the continuous ZDA
score. Threshold each embedding into a 16-bit support mask, ignore the scalar bit,
and classify the active imaginary support:

- **Strong**: projectively closed and zero-divisor-free at the support level.
- **Ghost**: projectively closed, but its coordinate span contains some zero divisor.
- **Bad**: not projectively closed under the Cayley-Dickson XOR support law.

The verified split is:

```
32767 nonzero imaginary masks = 30 strong + 36 ghost + 32701 bad
```

This gives the representation approach a cheap topology probe:

1. Use `Sedenion::support_mask(threshold)` to get the active basis support.
2. Use `classify_triangular_support(mask)` to detect strong/ghost/bad cells.
3. Treat ghost masks as candidate null-geometry events, not as proof that the
   current coefficients annihilate anything.
4. Confirm any actual annihilation with `zero_divisor_status`, multiplication,
   or a left/right-kernel check.

That separation is important. The mask classifier can tell us that a latent has
entered a finite projective cell whose span includes a zero divisor; the continuous
ZDA score tells us whether this particular vector is near the zero-divisor cone.
Together they are a better diagnostic than either one alone.

## 5. Benefits Over Standard LeJEPA

| Feature | Standard LeJEPA (R^d) | Sedenion-LeJEPA (S^k) |
|---|---|---|
| **Parameter Efficiency** | d² parameters | (16k)² / 16 = 16k² effective parameters |
| **Latent Dynamics** | Linear/Polynomial | Polynomial with non-commutative interactions |
| **Collapse Prevention** | Global isotropic Gaussian | Gaussian + Zero-Divisor-Aware regularization |
| **Geometric Structure** | Flat Euclidean | G₂-exceptional symmetry embedded |
| **Multi-Scale Projections** | 1D random lines | 1D, 4D, 8D, 15D subalgebra projections |
| **Intrinsic Dimension** | Enforced globally | Enforced globally + subalgebra locally |

## 6. Why This Is Underexplored and Powerful

1. **Novel Algebraic Prior**: Current JEPAs use Euclidean or Riemannian priors. Sedenions provide an **algebraic prior** — the latent space is not just a metric space but a non-associative algebra. This is a fundamentally different inductive bias.

2. **16D is the "Goldilocks" Dimension**: 16 dimensions is large enough for rich representations but small enough to be computationally tractable. It is also the dimension where the first non-alternative zero-divisor algebra appears. This makes it the simplest algebra with both rich structure and non-trivial annihilation.

3. **Natural Multi-Field Encoding**: A single sedenion can naturally encode two octonion-valued fields (e.g., appearance and dynamics in video, or two sensor modalities). The non-commutativity couples them, while the zero-divisor structure allows them to annihilate when orthogonal.

4. **Power-Associativity Enables Deep Predictors**: Unlike pathions (32D) or higher algebras, sedenions allow unambiguous polynomial and power-series predictors. You can stack sedenion layers or use recurrent sedenion dynamics without associativity ambiguity.

5. **Discrete + Continuous Null Geometry**: The triangular-root support split gives
   a finite diagnostic over active basis masks, while ZDA gives the continuous
   distance to the coefficient-level zero-divisor cone. This makes the null-space
   story testable instead of purely metaphorical.

## 7. Implementation Sketch (Pseudocode)

```python
import torch

class SedenionLinear(torch.nn.Module):
    """Linear layer using sedenion multiplication."""
    def __init__(self, in_features, out_features):
        # Each feature is a sedenion (16 real components)
        self.weight = torch.nn.Parameter(torch.randn(out_features, in_features, 16))
        self.bias = torch.nn.Parameter(torch.randn(out_features, 16))

    def forward(self, x):
        # x shape: (batch, in_features, 16)
        # sedenion_matmul: implements sedenion multiplication W * x
        return sedenion_matmul(self.weight, x) + self.bias

class SedenionEncoder(torch.nn.Module):
    def __init__(self):
        self.backbone = ViTBackbone()  # or CNN
        self.sedenion_head = SedenionLinear(768, 1)  # output 1 sedenion

    def forward(self, x):
        features = self.backbone(x)  # (batch, 768)
        z = self.sedenion_head(features)  # (batch, 1, 16)
        return z

class SedenionPredictor(torch.nn.Module):
    def __init__(self):
        self.fc1 = SedenionLinear(1, 4)
        self.fc2 = SedenionLinear(4, 1)

    def forward(self, z_c):
        h = sedenion_relu(self.fc1(z_c))
        z_pred = self.fc2(h)
        return z_pred

def sedenion_norm(z):
    # z shape: (batch, k, 16)
    # ||z||^2 = sum of squares of components
    return torch.sum(z ** 2, dim=-1)

def sedenion_sigreg(z):
    # z: (batch, k, 16)
    # 1. Standard random projections on 16D components
    v = torch.randn(16, device=z.device)
    v = v / torch.norm(v)
    projections = torch.einsum('bki,i->bk', z, v)
    # Match to N(0, 1) using Epps-Pulley or MMD
    loss = epps_pulley_test(projections)

    # 2. Zero-Divisor-Aware Regularization
    # For k=1 sedenion: Z = (A, B) where A, B are octonions (first 8 and last 8 components)
    A = z[..., :8]
    B = z[..., 8:]
    norm_A = torch.sum(A**2, dim=-1)
    norm_B = torch.sum(B**2, dim=-1)
    dot_AB = torch.sum(A * B, dim=-1)
    zda_loss = torch.mean((norm_A - norm_B)**2 + dot_AB**2)

    return loss + 0.1 * zda_loss

def total_loss(z_c, z_t, z_pred):
    l_pred = torch.mean(sedenion_norm(z_pred - z_t))
    l_reg = sedenion_sigreg(z_c)
    return l_pred + 0.5 * l_reg
```

## 8. Open Questions

- **Sedenion Batch Normalization**: How to generalize batch norm to sedenions? Normalize all 16 components together or separately? What about the non-commutativity with learnable affine parameters?
- **Sedenion Attention**: Can we define a sedenion-valued attention mechanism where queries, keys, and values are sedenions, and the attention score is a sedenion norm?
- **Dynamics on the Zero-Divisor Manifold**: Instead of avoiding zero divisors, could we *use* them as attractors for semantic "null" states or as a mechanism for controlled forgetting?
- **Higher Cayley-Dickson Algebras**: Pathions (32D) lose power-associativity, making them unsuitable for polynomial predictors. But split-sedenions (with signature (8,8)) might have interesting pseudo-Riemannian structures for latent spaces.
