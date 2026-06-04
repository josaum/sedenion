Operator algebra notes

Left/right multiplication
- left_mul_matrix() and right_mul_matrix() return 16×16 real matrices implementing left and right multiplication by a Sedenion.
- Use these matrices to apply matrix methods (exponentials, conditioning, projections) on the 16-component vectorized state.

Projection residual
- For a target matrix A and operator subspace O = span{L_{e_k}, R_{e_k}}, compute
  ρ = ||A - Proj_O(A)||_F / ||A||_F
- bilinear-probe computes ρ and writes numeric outputs.

Reproduce
cargo run --release --bin bilinear-probe

See code for tests that validate left/right operator properties.
