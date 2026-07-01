sedenion crate — API and usage

Purpose
- Provides types and utilities for a 16-component Cayley-Dickson value (Sedenion).
- Exposes multiplication, square, norm, sketches, and zero-divisor diagnostics.

Key types and functions
- Sedenion: construction, components(), square(), powu(), norm_sq().
- zda_score(), zda_loss_and_grad(), zda_batch_loss_and_grad(), auto_zda_gradient_scale().
- left_mul_matrix(), right_mul_matrix(), sketch_octonion(), sketch_quaternion().

Quick usage
```rust
use sedenion::Sedenion;
let z = Sedenion::new([0.0f32; 16]);
let z2 = z.square();
let score = z.zda_score();
```

Build and test
- cargo test --release
- cargo bench

See src/lib.rs for implementation and tests.
