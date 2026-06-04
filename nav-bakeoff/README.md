nav-bakeoff — navigation experiments

Purpose
- Test a sedenion-based representation and operator diagnostics for inertial navigation pipelines.

Components
- ukf.rs, filters.rs: filter implementations and strapdown model.
- bilinear-probe: projection residual diagnostic for operator reachability.
- nav-repr-bakeoff: learned latent representation probes and filter-in-loop checks.

Reproduce
cd nav-bakeoff
cargo test --release
cargo run --release --bin nav-bakeoff
cargo run --release --bin bilinear-probe
cargo run --release --bin nav-repr-bakeoff

Outputs
- Results and CSVs written by the binaries in the crate directory.

See PAPER.md and OPERATOR_ALGEBRA.md for experiment details and reproducibility commands.
