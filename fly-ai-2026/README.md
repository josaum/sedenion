# FLY AI 2026 — Resilient CNS for U-Space

This directory contains the FLY AI 2026 proposal package for the Mycelia + Sedenion anti-jamming CNS stack, plus a runnable UAV simulator that demonstrates the operational effects of GNSS jamming and spoofing.

## Contents

| File | Description |
|------|-------------|
| `flyai2026_antijamming_proposal.html` | Base proposal document (HTML) |
| `flyai2026_antijamming_proposal_integrated.html` | Proposal with the sedenion triangular-root integration (HTML) |
| `flyai2026_antijamming_proposal.pdf` | Base proposal (PDF) |
| `flyai2026_antijamming_proposal_integrated.pdf` | Integrated proposal (PDF) |
| `constellation_comparison.png` | Signal constellation comparison figure |
| `mycelia_sedenion_architecture.png` | Four-tier architecture figure |
| `triangular_root_classification.png` | Triangular-root classification figure |
| `proposal_assets/` | Copy of proposal figures for self-contained packaging |
| `simulator/` | Built, offline-capable UAV simulator |

## Running the simulator

The simulator is a static Vite + TypeScript + Three.js build. No server, build step, or internet connection is required.

1. Open `simulator/index.html` in any modern browser.
2. Select a mode:
   - **Demo** — passive replay of recorded Arrow IPC telemetry
   - **Fly** — manual quadcopter flight (keyboard or gamepad)
   - **Fly + Jam** — manual flight with simulated GPS interference
3. Press `H` for the controls help overlay.

### Keyboard controls

- `W/S` — pitch
- `A/D` — roll
- `Q/E` or arrow left/right — yaw
- Arrow up/down — throttle
- `Space` — brake
- `Shift` — boost
- `R` — reset position
- `J` — toggle jamming
- `M` — toggle mode
- `C` — cycle camera
- `H` — help overlay
- `Esc` — pause demo playback

### Gamepad controls (Xbox / PlayStation standard mapping)

- Left stick — roll / pitch
- Right stick — yaw / throttle
- `RT` / `R2` — boost
- `A` / `Cross` — reset
- `B` / `Circle` — toggle mode
- `X` / `Square` — toggle jamming
- `Y` / `Triangle` — cycle camera

## Source code

The simulator source lives in `../uav-viewer/`. To rebuild it:

```bash
cd ../uav-viewer
pnpm install
pnpm build
```

Then copy `dist/` into this directory as `simulator/`.

## Offline deliverable

To create a self-contained zip of this package:

```bash
cd ..
zip -r fly-ai-2026.zip fly-ai-2026/
```
