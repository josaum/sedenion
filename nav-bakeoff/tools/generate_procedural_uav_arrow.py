#!/usr/bin/env python3
"""Generate clean procedural UAV Arrow flights.

Unlike augmentation of noisy real conversions, these trajectories are internally
consistent by construction:

* `p(t)` is a smooth multi-sine 3-D flight path;
* `v(t)` and true `a(t)` are analytic derivatives of that path;
* `gx,gy,gz` are dominated by the yaw-rate implied by horizontal velocity;
* measured accel is true acceleration plus controlled bias/noise.

The output schema is exactly the `real_data.rs` Arrow IPC schema:

    t, ax, ay, az, px, py, pz, vx, vy, vz, gx, gy, gz
"""

from __future__ import annotations

import argparse
import math
from pathlib import Path

import numpy as np
import pyarrow as pa


FIELDS = [
    ("t", pa.float64()),
    ("ax", pa.float32()), ("ay", pa.float32()), ("az", pa.float32()),
    ("px", pa.float32()), ("py", pa.float32()), ("pz", pa.float32()),
    ("vx", pa.float32()), ("vy", pa.float32()), ("vz", pa.float32()),
    ("gx", pa.float32()), ("gy", pa.float32()), ("gz", pa.float32()),
]
SCHEMA = pa.schema(FIELDS)


def write_arrow(cols: dict[str, np.ndarray], path: Path, batch_rows: int) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    n = len(cols["t"])
    with pa.ipc.new_file(str(path), SCHEMA) as writer:
        for start in range(0, n, batch_rows):
            end = min(start + batch_rows, n)
            arrays = [pa.array(cols[name][start:end], type=ty) for name, ty in FIELDS]
            writer.write_batch(pa.record_batch(arrays, schema=SCHEMA))


def component(t: np.ndarray, amp: np.ndarray, freq: np.ndarray, phase: np.ndarray):
    arg = freq[:, None] * t[None, :] + phase[:, None]
    p = (amp[:, None] * np.sin(arg)).sum(axis=0)
    v = (amp[:, None] * freq[:, None] * np.cos(arg)).sum(axis=0)
    a = (-amp[:, None] * freq[:, None] ** 2 * np.sin(arg)).sum(axis=0)
    return p, v, a


def smooth_bias(t: np.ndarray, rng: np.random.Generator, init_std: float, drift_std: float):
    init = rng.normal(0.0, init_std, size=3)
    amps = rng.normal(0.0, drift_std, size=(3, 2))
    freqs = rng.uniform(0.006, 0.035, size=(3, 2))
    phases = rng.uniform(-math.pi, math.pi, size=(3, 2))
    bias = np.repeat(init[None, :], len(t), axis=0)
    for axis in range(3):
        for k in range(2):
            bias[:, axis] += amps[axis, k] * np.sin(freqs[axis, k] * t + phases[axis, k])
    return bias


def generate_one(seed: int, duration: float, rate: float, noise_std: float, bias_init: float, bias_drift: float):
    rng = np.random.default_rng(seed)
    dt = 1.0 / rate
    t = np.arange(0.0, duration, dt, dtype=np.float64)

    base_freqs = np.array([0.035, 0.073, 0.128], dtype=np.float64)
    scale = rng.uniform(0.75, 1.45)
    freqs = base_freqs * scale * rng.uniform(0.85, 1.15, size=3)
    phase_x = rng.uniform(-math.pi, math.pi, size=3)
    phase_y = rng.uniform(-math.pi, math.pi, size=3)
    phase_z = rng.uniform(-math.pi, math.pi, size=3)
    amp_x = rng.uniform(8.0, 28.0, size=3)
    amp_y = rng.uniform(8.0, 28.0, size=3)
    amp_z = rng.uniform(0.8, 5.0, size=3)

    px, vx, ax_true = component(t, amp_x, freqs, phase_x)
    py, vy, ay_true = component(t, amp_y, freqs * rng.uniform(0.85, 1.12), phase_y)
    pz_wave, vz, az_true = component(t, amp_z, freqs * rng.uniform(0.55, 0.9), phase_z)
    pz = 6.0 + pz_wave

    # Rebase to the same initial-state convention as the real-data loader.
    px -= px[0]
    py -= py[0]
    pz -= pz[0]
    vx -= vx[0]
    vy -= vy[0]
    vz -= vz[0]

    true_accel = np.stack([ax_true, ay_true, az_true], axis=1)
    bias = smooth_bias(t, rng, bias_init, bias_drift)
    noise = rng.normal(0.0, noise_std, size=true_accel.shape)
    accel_meas = true_accel + bias + noise

    yaw = np.unwrap(np.arctan2(vy + 1e-6, vx + 1e-6))
    gz = np.gradient(yaw, dt)
    horizontal_speed = np.hypot(vx, vy)
    gx = 0.015 * np.gradient(vz, dt) / np.maximum(horizontal_speed, 1.0)
    gy = -0.015 * np.linalg.norm(true_accel[:, :2], axis=1) / np.maximum(horizontal_speed, 1.0)
    gyro = np.stack([gx, gy, gz], axis=1)
    gyro += rng.normal(0.0, 0.002, size=gyro.shape)

    return {
        "t": t.astype(np.float64),
        "ax": accel_meas[:, 0].astype(np.float32),
        "ay": accel_meas[:, 1].astype(np.float32),
        "az": accel_meas[:, 2].astype(np.float32),
        "px": px.astype(np.float32),
        "py": py.astype(np.float32),
        "pz": pz.astype(np.float32),
        "vx": vx.astype(np.float32),
        "vy": vy.astype(np.float32),
        "vz": vz.astype(np.float32),
        "gx": gyro[:, 0].astype(np.float32),
        "gy": gyro[:, 1].astype(np.float32),
        "gz": gyro[:, 2].astype(np.float32),
    }


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("output", help="output directory")
    ap.add_argument("--count", type=int, default=48)
    ap.add_argument("--duration", type=float, default=90.0)
    ap.add_argument("--rate", type=float, default=50.0)
    ap.add_argument("--seed", type=int, default=20260602)
    ap.add_argument("--noise-std", type=float, default=0.035)
    ap.add_argument("--bias-init", type=float, default=0.08)
    ap.add_argument("--bias-drift", type=float, default=0.025)
    ap.add_argument("--batch-rows", type=int, default=4096)
    ap.add_argument("--prefix", default="proc")
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args(argv)

    out_dir = Path(args.output)
    out_dir.mkdir(parents=True, exist_ok=True)
    written = 0
    for i in range(args.count):
        path = out_dir / f"{args.prefix}_{i:04}.arrow"
        if path.exists() and not args.force:
            continue
        cols = generate_one(
            args.seed + i,
            args.duration,
            args.rate,
            args.noise_std,
            args.bias_init,
            args.bias_drift,
        )
        write_arrow(cols, path, args.batch_rows)
        written += 1
    print(f"wrote {written} procedural flights to {out_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
