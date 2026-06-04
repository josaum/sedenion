Repository overview

This repository contains:
- sedenion/: Rust crate implementing a 16-component Cayley-Dickson type and utilities.
- repr-bakeoff/: controlled representation experiments and SIGReg reference checks.
- nav-bakeoff/: navigation experiments, operator diagnostics, and probes.
- uav-viewer/: visualization tools for recorded trajectories.

Toolchain
- Rust pinned in rust-toolchain.toml (use the repo pin).

Reproduce
- Algebra crate:
  cd sedenion && cargo test --release && cargo bench
- Representation experiments:
  cd repr-bakeoff && cargo test --release && python3 tools/ref_pure.py && cargo run --release
- Navigation experiments:
  cd nav-bakeoff && cargo test --release && cargo run --release --bin nav-bakeoff

Data and outputs
- Experiment outputs and CSVs are in repr-bakeoff/ and nav-bakeoff/ (see bakeoff_results.csv and nav_repr_results.csv).

API and code
- See sedenion/README.md for the crate API and usage examples.
