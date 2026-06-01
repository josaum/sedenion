#!/usr/bin/env python3
"""Assemble procedural+real Arrow folders with a deterministic held-out split.

`real_data::load_dataset` currently sorts files lexicographically and holds out
the last `test_frac` by file count. This helper encodes the split into filename
prefixes so experiments are reproducible without changing the Rust CLI:

* `a_*` procedural train files
* `b_*` real train files
* `z_*` real held-out test files
"""

from __future__ import annotations

import argparse
import shutil
from pathlib import Path


def copy_files(files: list[Path], out_dir: Path, prefix: str) -> int:
    n = 0
    for src in files:
        dst = out_dir / f"{prefix}_{src.name}"
        shutil.copy2(src, dst)
        n += 1
    return n


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--procedural-dir", required=True)
    ap.add_argument("--real-dir", default="data/arrow/edged-uslam-bodymean")
    ap.add_argument("--out-dir", required=True)
    ap.add_argument("--procedural-count", type=int, default=16)
    ap.add_argument(
        "--real-train",
        action="append",
        default=["auto_circle_unfiltered.arrow", "circle_filtered.arrow"],
    )
    ap.add_argument(
        "--real-test",
        action="append",
        default=["dark_manual_filtered.arrow", "line.arrow"],
    )
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args(argv)

    proc_dir = Path(args.procedural_dir)
    real_dir = Path(args.real_dir)
    out_dir = Path(args.out_dir)
    if out_dir.exists() and args.force:
        shutil.rmtree(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    procedural = sorted(proc_dir.glob("*.arrow"))[: args.procedural_count]
    if len(procedural) < args.procedural_count:
        raise SystemExit(f"only found {len(procedural)} procedural files in {proc_dir}")

    real_train = [real_dir / name for name in args.real_train]
    real_test = [real_dir / name for name in args.real_test]
    missing = [p for p in [*real_train, *real_test] if not p.exists()]
    if missing:
        raise SystemExit("missing real files: " + ", ".join(str(p) for p in missing))

    n_proc = copy_files(procedural, out_dir, "a")
    n_train = copy_files(real_train, out_dir, "b")
    n_test = copy_files(real_test, out_dir, "z")
    total = n_proc + n_train + n_test
    test_frac = n_test / total
    print(
        f"wrote {total} files to {out_dir} "
        f"(procedural_train={n_proc}, real_train={n_train}, real_test={n_test}, "
        f"use --test-frac {test_frac:.6f})"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
