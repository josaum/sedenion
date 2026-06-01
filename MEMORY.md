# MEMORY.md

## repr-bakeoff / ZDA-Reg / SIGReg

- Treat SIGReg claims as evidence-sensitive. The faithful Rust SIGReg forward is checked against `repr-bakeoff/tools/ref_pure.py`, whose reference output is `2.07709580`; keep this independent check before trusting LeJEPA/SIGReg result claims.
- The old ZDA-Reg formulation was wrong because minimizing the zero-divisor score pulled embeddings toward the zero-divisor condition. The current useful version is a repulsive, scale-aware barrier using the normalized score `sqrt((||A||^2-||B||^2)^2 + (2 A.B)^2)/(||A||^2+||B||^2)`, plus a canonical norm floor from the N(0,I) target.
- Identical MNIST accuracy across low raw `λ_zda` values was a real smell: a raw coefficient is the wrong interface. Current ZDA is auto-balanced against the base SIGReg/invariance gradient and boosted when embedding RMS is below the N(0,I) target.
- Current `repr-bakeoff` conclusion: with faithful SIGReg and auto-balanced ZDA, sedenion + ZDA beats the dense baseline in this narrow harness without a λ sweep: synthetic `92.8%` vs dense `90.3%`; MNIST `41.0%` vs dense `30.7%`.
- Auto-ZDA fixes scale collapse: `min_std` moves from near zero to `0.4300` synthetic and `0.3213` MNIST. Held-out Gaussianity is better than dense on synthetic (`0.1672` vs `0.2288`) and close on MNIST (`0.1905` vs `0.1821`).
- Do not conclude "ZDA monotonically hurts", "dense wins under faithful SIGReg", or "ZDA needs a tuned raw λ" from the superseded low-λ sweeps.
- The auto-ZDA method is now extracted into the main `sedenion` crate: use `Sedenion::zda_score`, `Sedenion::zda_loss_and_grad`, `zda_batch_loss_and_grad`, and `auto_zda_gradient_scale`. `repr-bakeoff` should remain a consumer of this API, not the private owner of the method.
- Toolchain is pinned at repo root with `rust-toolchain.toml` to Rust `1.96.0` plus `rustfmt` and `clippy`. The host default was `nightly` (`1.95.0-nightly`), so keep using the repo override.

## nav-bakeoff / inertial navigation

- Current `nav-bakeoff` conclusion remains negative for using sedenions as a physical navigation state manifold: λ=0 is bit-identical to the baseline UKF, dead reckoning is identical across λ because accel bias is unobservable, and aided λ>0 degrades RMSE.
- Verified linear MEMS official run: aided terminal RMSE is `20.8 m` for baseline / SUKF λ=0 and `35.0 m` for λ>=0.25; dead-reckoning terminal is `1346.8 m` for all λ.
- Verified Duffing run: with 16 seeds the documented aided terminal pair is `19.4 m` baseline vs `23.1 m` for λ>=0.25; with 32 seeds it is `21.5 m` vs `25.4 m`. The conclusion is stable; the 19.4/23.1 pair is specifically the 16-seed command.
- `nav-bakeoff` has two binaries, so use explicit commands from the crate directory: `cargo run --release --bin nav-bakeoff` and `cargo run --release --bin bilinear-probe`. Old `-p nav-bakeoff` commands are wrong unless a Cargo workspace is introduced.
- The tracked `sedenion/target` directory was legacy build output and should stay deleted from version control. The top-level `target/` ignore already prevents regenerated Cargo targets from reappearing as untracked files.
