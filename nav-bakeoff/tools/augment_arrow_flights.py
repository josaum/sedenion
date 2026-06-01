#!/usr/bin/env python3
"""Generate physically consistent Arrow-flight augmentations.

The generated flights preserve the `real_data.rs` schema:

    t, ax, ay, az, px, py, pz, vx, vy, vz, gx, gy, gz

Augmentations are deliberately conservative:

* crop a contiguous time span;
* rebase time, position, and velocity to the crop start;
* yaw-rotate position/velocity/accel/gyro together;
* optionally mirror one horizontal axis;
* add a small constant accel bias and white IMU noise.

This creates new *training paths* without inventing impossible labels. The Rust
real-data loader recomputes bias/drift targets from the augmented trajectories.
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


def read_arrow(path: Path) -> dict[str, np.ndarray]:
    with pa.memory_map(str(path), "r") as src:
        table = pa.ipc.open_file(src).read_all()
    missing = [name for name, _ in FIELDS if name not in table.column_names]
    if missing:
        raise ValueError(f"{path}: missing columns {missing}")
    return {name: table[name].combine_chunks().to_numpy(zero_copy_only=False) for name, _ in FIELDS}


def write_arrow(cols: dict[str, np.ndarray], path: Path, batch_rows: int) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    n = len(cols["t"])
    with pa.ipc.new_file(str(path), SCHEMA) as writer:
        for start in range(0, n, batch_rows):
            end = min(start + batch_rows, n)
            arrays = [pa.array(cols[name][start:end], type=ty) for name, ty in FIELDS]
            writer.write_batch(pa.record_batch(arrays, schema=SCHEMA))


def yaw_matrix(theta: float) -> np.ndarray:
    c = math.cos(theta)
    s = math.sin(theta)
    return np.array([[c, -s, 0.0], [s, c, 0.0], [0.0, 0.0, 1.0]], dtype=np.float64)


def rotate3(cols: dict[str, np.ndarray], prefix: str, rot: np.ndarray) -> None:
    x = np.stack([cols[f"{prefix}x"], cols[f"{prefix}y"], cols[f"{prefix}z"]], axis=1).astype(np.float64)
    y = x @ rot.T
    cols[f"{prefix}x"] = y[:, 0].astype(np.float32)
    cols[f"{prefix}y"] = y[:, 1].astype(np.float32)
    cols[f"{prefix}z"] = y[:, 2].astype(np.float32)


def crop_indices(t: np.ndarray, min_seconds: float, rng: np.random.Generator) -> tuple[int, int]:
    if len(t) < 4:
        return 0, len(t)
    dt = float(np.median(np.diff(t)))
    min_n = max(4, int(math.ceil(min_seconds / max(dt, 1e-6))))
    if len(t) <= min_n:
        return 0, len(t)
    length = int(rng.integers(min_n, len(t) + 1))
    start = int(rng.integers(0, len(t) - length + 1))
    return start, start + length


def augment_one(
    cols: dict[str, np.ndarray],
    rng: np.random.Generator,
    min_seconds: float,
    accel_bias_std: float,
    accel_noise_std: float,
    gyro_noise_std: float,
    allow_mirror: bool,
) -> dict[str, np.ndarray]:
    start, end = crop_indices(cols["t"], min_seconds, rng)
    out = {k: np.array(v[start:end], copy=True) for k, v in cols.items()}

    for name in ("t",):
        out[name] = (out[name] - out[name][0]).astype(np.float64)
    for prefix in ("p", "v"):
        for axis in ("x", "y", "z"):
            key = f"{prefix}{axis}"
            out[key] = (out[key] - out[key][0]).astype(np.float32)

    rot = yaw_matrix(float(rng.uniform(-math.pi, math.pi)))
    if allow_mirror and bool(rng.integers(0, 2)):
        rot = np.diag([-1.0, 1.0, 1.0]) @ rot

    for prefix in ("p", "v", "a", "g"):
        rotate3(out, prefix, rot)

    n = len(out["t"])
    accel_bias = rng.normal(0.0, accel_bias_std, size=(1, 3))
    accel_noise = rng.normal(0.0, accel_noise_std, size=(n, 3))
    gyro_noise = rng.normal(0.0, gyro_noise_std, size=(n, 3))
    a = np.stack([out["ax"], out["ay"], out["az"]], axis=1).astype(np.float64)
    g = np.stack([out["gx"], out["gy"], out["gz"]], axis=1).astype(np.float64)
    a = a + accel_bias + accel_noise
    g = g + gyro_noise
    for i, axis in enumerate(("x", "y", "z")):
        out[f"a{axis}"] = a[:, i].astype(np.float32)
        out[f"g{axis}"] = g[:, i].astype(np.float32)
    return out


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("input", help="input Arrow file or directory")
    ap.add_argument("output", help="output directory")
    ap.add_argument("--per-file", type=int, default=8)
    ap.add_argument("--seed", type=int, default=20260601)
    ap.add_argument("--min-seconds", type=float, default=18.0)
    ap.add_argument("--accel-bias-std", type=float, default=0.05)
    ap.add_argument("--accel-noise-std", type=float, default=0.02)
    ap.add_argument("--gyro-noise-std", type=float, default=0.005)
    ap.add_argument("--batch-rows", type=int, default=4096)
    ap.add_argument("--no-mirror", action="store_true")
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args(argv)

    inp = Path(args.input)
    files = [inp] if inp.is_file() else sorted(inp.glob("*.arrow"))
    if not files:
        raise SystemExit(f"no .arrow files found at {inp}")

    out_dir = Path(args.output)
    out_dir.mkdir(parents=True, exist_ok=True)
    rng = np.random.default_rng(args.seed)
    written = 0
    for src in files:
        cols = read_arrow(src)
        for i in range(args.per_file):
            out = out_dir / f"{src.stem}_aug_{i:03}.arrow"
            if out.exists() and not args.force:
                continue
            aug = augment_one(
                cols,
                rng,
                args.min_seconds,
                args.accel_bias_std,
                args.accel_noise_std,
                args.gyro_noise_std,
                not args.no_mirror,
            )
            write_arrow(aug, out, args.batch_rows)
            written += 1
    print(f"wrote {written} augmented flights to {out_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
