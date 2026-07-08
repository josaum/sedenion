# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A Rust implementation of the 16-dimensional Cayley–Dickson (sedenion) algebra plus
two **falsifiable bake-offs** that test whether sedenion structure is actually
useful — one for representation learning, one for GPS-denied navigation. The
project's stance is empirical and deliberately asymmetric: it ships a reusable
algebra crate, then measures concrete claims and reports where they fail.

The two headline results, which you should preserve when editing docs or code:

- `repr-bakeoff/` — **positive** in a narrow harness: auto-balanced ZDA-Reg beats a
  matched dense baseline under the faithful LeJEPA/SIGReg objective.
- `nav-bakeoff/` — **negative** for the navigation state-manifold claim: the
  Sedenion-UKF never beats a standard UKF; sedenion structure only "helps" in the
  4-D attitude corner, where it reduces to quaternions.

Do not soften a negative result or strengthen a positive one beyond what the
committed code reproduces. Every headline number is supposed to come from a test or
a `cargo run`; keep it that way.

## Toolchain — pinned, do not drift

`rust-toolchain.toml` pins **Rust 1.96.0**. The host defaults to nightly, so keep
the pin when reproducing results. `rustc --version` must say `1.96.0`.

**This is NOT a Cargo workspace.** There is no top-level `Cargo.toml`. Each crate is
independent with its own `Cargo.lock`. Run all cargo commands **from inside the
crate directory**, not the repo root.

## Layout and dependency spine

```
sedenion/        reusable 16-D Cayley–Dickson algebra crate (the deliverable)
repr-bakeoff/    SSL bake-off: sedenion projector + ZDA-Reg vs. dense, under LeJEPA
nav-bakeoff/     UKF vs. Sedenion-UKF navigation bake-off + probes + Arrow exporter
uav-viewer/      Vite + Three.js viewer for exported flight trajectories (TS)
```

Data/dependency flow:

- `repr-bakeoff` and `nav-bakeoff` both depend on `sedenion` via `path = "../sedenion"`.
- Operators and APIs the bake-offs need were **added into the `sedenion` crate**
  (`left_mul_matrix`/`right_mul_matrix`, the auto-ZDA API). Shared functionality
  belongs in `sedenion`, not copied into a bake-off.
- `nav-bakeoff`'s `export-uav-arrow` binary writes `uav-viewer/public/flights/*.arrow`;
  `uav-viewer` fetches `/flights/nav-default.arrow` at runtime. That Arrow file is
  the contract between the two — regenerate it if you change the export schema.

## Build / test / run

### sedenion (algebra crate)
```bash
cd sedenion
cargo test --release          # includes L_a/R_a correctness, non-assoc, adjoint, skew
cargo bench                    # criterion, [[bench]] sedenion_bench
```

### repr-bakeoff (representation learning)
```bash
cd repr-bakeoff
cargo test --release           # finite-diff gradient checks + SIGReg-faithfulness
python3 tools/ref_pure.py      # dependency-free reference; must print 2.07709580
cargo run --release            # synthetic two-view task
./fetch_mnist.sh && cargo run --release -- mnist   # real MNIST (data/ is gitignored)
```

### nav-bakeoff (navigation) — multiple binaries
```bash
cd nav-bakeoff
cargo test --release                                        # guardrails (see below)
cargo run --release --bin nav-bakeoff                       # UKF vs SUKF, linear MEMS
cargo run --release --bin nav-bakeoff -- 16 300 --duffing   # nonlinear (Duffing) MEMS
cargo run --release --bin bilinear-probe                    # does physics live in the algebra?
cargo run --release --bin nav-repr-bakeoff                  # learned 16-D MEMS latents
cargo run --release --bin export-uav-arrow -- ../uav-viewer/public/flights/nav-default.arrow
```

### uav-viewer (TypeScript / Vite)
```bash
cd uav-viewer
pnpm install       # note: repo currently carries package-lock.json (npm); prefer pnpm
pnpm dev           # vite --host 127.0.0.1
pnpm build         # tsc && vite build
```

### Running a single test
```bash
cargo test --release <substring>                     # by name, e.g. sigreg_matches_lejepa_reference
cargo test --release --test sanity                   # a specific integration test file
cargo test --release --test bilinear reachable       # one test in one file
```

## The invariants the tests defend (know these before touching the code)

These are load-bearing correctness properties. If a change breaks one, the change is
wrong, not the test.

- **`λ = 0` ≡ baseline, bit-identical.** In `nav-bakeoff`, the Sedenion-UKF with the
  zero-divisor step disabled must be numerically identical to the plain UKF, so any
  measured difference is attributable to the algebra alone. `tests/sanity.rs` asserts
  this and a noise-free `<1 mm / 100 s` drift bound.
- **SIGReg matches the LeJEPA reference to f32.** `repr-bakeoff` ports the
  Epps–Pulley statistic from `galilai-group/lejepa` with `t = linspace(0,3,17)`,
  symmetry-doubled trapezoid weights, and **no standardization** (targets raw N(0,1),
  so scale collapse is penalized). The Rust forward must agree with `tools/ref_pure.py`
  at `2.07709580`. Do not "clean up" this to a standardized shape test — that was the
  earlier broken version and reversing it silently invalidates every table.
- **Gradients are finite-difference checked.** The sedenion layer backward uses
  `∂(W·x)/∂W = R_x` (the right-multiplication operator). SIGReg and ZDA gradients are
  checked against numerical differences in `tests/sanity.rs`.
- **Bilinear-probe facts:** attitude block `ρ = 0` (quaternions capture it exactly),
  full 16-D coupling `ρ ≈ 0.90–0.96`, reachable-subspace dimension `= 31`, and zero
  divisors give a singular `L_a`. `tests/bilinear.rs` guards these.

## Sedenion crate — key API surface

`sedenion/src/lib.rs` is a single ~1400-line file. Types: `Quaternion`, `Octonion`,
`Sedenion` (all Cayley–Dickson, `f32`). `Sedenion` is `#[repr(C, align(64))]` —
exactly 16 `f32` / 64 bytes; keep it that way (SIMD/cache-line assumption).

Notable APIs the bake-offs rely on:
- `square()` — O(N) squaring for polynomial predictors (not general `mul`).
- `left_mul_matrix()` / `right_mul_matrix()` — the `L_a` / `R_a` routing tensors,
  built from the crate's own `Mul` so they are convention-correct.
- Auto-ZDA (Zero-Divisor-Aware regularization): `zda_score`, `zda_loss_and_grad`,
  `zda_batch_loss_and_grad`, `auto_zda_gradient_scale`. The current ZDA loss is a
  **scale-invariant score** with a repulsive `-log(score)` barrier, applied as a
  parameter-free, auto-balanced barrier — **not** the old raw `λ_zda` coefficient.
  If you reintroduce a manual `λ` knob you are undoing a deliberate design fix.
- Triangular-root support: `support_mask`, `classify_triangular_support`,
  `TriangularSupport` (Strong/Ghost/Bad), `geometric_triangular_root`.

## Conventions

- **Numbers in READMEs/PAPER.md are reproducible artifacts.** `nav-bakeoff/PAPER.md`
  Appendix A is a claim→command map. When you change a bake-off, re-run it and paste
  fresh output into the tables rather than editing numbers by hand.
- CSV outputs are committed and consumed for plotting: `nav-bakeoff` writes
  `bakeoff_results.csv`, `nav_repr_results.csv`, `nav_repr_filter_results.csv`.
- `repr-bakeoff/data/` (MNIST) is gitignored — fetch with `./fetch_mnist.sh`.
- Rust dev deps: `criterion` (benches). `nav-bakeoff` also uses `arrow`, `memmap2`,
  `bytes` for the Arrow IPC export path (`src/real_data.rs`).

## Repo-persona files (not code guidance)

`AGENTS.md`, `SOUL.md`, `USER.md`, `IDENTITY.md`, `MEMORY.md`, `HEARTBEAT.md`,
`TOOLS.md`, and `memory/` describe an autonomous-agent "home" persona and session
bootstrap ritual. They are **not** engineering instructions for this codebase; ignore
them when doing development work here unless the user explicitly asks about them.
