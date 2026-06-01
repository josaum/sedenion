#!/usr/bin/env python3
"""Materialize Edged-USLAM Hugging Face data into nav-bakeoff Arrow IPC.

This uses the `datasets` stack for Hub access and cached downloads. The
important wrinkle: `sebnem-byte/drone-navigation-event-camera` has a native
HF Datasets parquet view, but that view is the README/manifest text, not decoded
ROS sensor rows. The real IMU/pose data lives in raw `.bag` files, so after the
datasets download cache step we still decode ROS bags with `rosbag_to_arrow.py`.
"""

from __future__ import annotations

import argparse
import fnmatch
import sys
from pathlib import Path
from types import SimpleNamespace

from datasets import DownloadConfig, load_dataset
from datasets.download.download_manager import DownloadManager
from huggingface_hub import HfApi, hf_hub_url

import rosbag_to_arrow


REPO_ID = "sebnem-byte/drone-navigation-event-camera"


def stream_readme_manifest(repo_id: str, limit: int) -> list[str]:
    """Exercise native HF Datasets streaming and return the README rows.

    For this repository those rows are documentation/manifest text. Keeping this
    check here prevents us from accidentally assuming the dataset server is
    streaming decoded bag contents.
    """
    rows: list[str] = []
    ds = load_dataset(repo_id, split="train", streaming=True)
    for row in ds:
        text = row.get("text", "")
        rows.append(text)
        if len(rows) >= limit:
            break
    return rows


def list_bags(repo_id: str, patterns: list[str]) -> list[tuple[str, int]]:
    api = HfApi()
    out: list[tuple[str, int]] = []
    for entry in api.list_repo_tree(
        repo_id=repo_id,
        repo_type="dataset",
        recursive=True,
        expand=True,
    ):
        path = getattr(entry, "path", "")
        size = int(getattr(entry, "size", 0) or 0)
        if not path.endswith(".bag"):
            continue
        if patterns and not any(fnmatch.fnmatch(path, pat) for pat in patterns):
            continue
        out.append((path, size))
    # Prefer motion bags over illumination bags, then smaller files first.
    out.sort(key=lambda x: (0 if x[0].startswith("motion/") else 1, x[1], x[0]))
    return out


def choose_bags(
    bags: list[tuple[str, int]],
    max_files: int,
    max_bytes: int,
) -> list[tuple[str, int]]:
    chosen: list[tuple[str, int]] = []
    total = 0
    for path, size in bags:
        if max_files and len(chosen) >= max_files:
            break
        if max_bytes and chosen and total + size > max_bytes:
            continue
        chosen.append((path, size))
        total += size
    return chosen


def converter_args(args: argparse.Namespace) -> SimpleNamespace:
    return SimpleNamespace(
        rate=args.rate,
        imu_topic=None,
        pose_topic=None,
        gravity_mode=args.gravity_mode,
        still_quantile=args.still_quantile,
        calib_min_rate=args.calib_min_rate,
        calib_max_lag=args.calib_max_lag,
        smooth_pos_window=args.smooth_pos_window,
        gravity=9.80665,
        g_sign=-1.0,
        orientation_source="pose",
        no_transform=False,
        no_gravity_removal=False,
        batch_rows=args.batch_rows,
        report=args.report,
    )


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--repo", default=REPO_ID)
    ap.add_argument("--pattern", action="append", default=["motion/*.bag", "motion/**/*.bag"])
    ap.add_argument("--cache-dir", default="data/hf-cache")
    ap.add_argument("--out-dir", default="data/arrow/edged-uslam")
    ap.add_argument("--max-files", type=int, default=3)
    ap.add_argument("--max-bytes", type=int, default=2_000_000_000)
    ap.add_argument("--rate", type=float, default=50.0)
    ap.add_argument("--gravity-mode", default="world-calib",
                    choices=["world-calib", "world", "body-mean", "none"])
    ap.add_argument("--still-quantile", type=float, default=0.2)
    ap.add_argument("--calib-min-rate", type=float, default=0.15)
    ap.add_argument("--calib-max-lag", type=int, default=25)
    ap.add_argument("--smooth-pos-window", type=int, default=7)
    ap.add_argument("--batch-rows", type=int, default=4096)
    ap.add_argument("--manifest-rows", type=int, default=30)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--report", action="store_true")
    args = ap.parse_args(argv)

    manifest = stream_readme_manifest(args.repo, args.manifest_rows)
    print(f"HF Datasets streaming manifest rows={len(manifest)}")
    bag_lines = [line.strip() for line in manifest if line.strip().endswith(".bag")]
    if bag_lines:
        print("manifest mentions:", ", ".join(bag_lines[:8]))

    bags = list_bags(args.repo, args.pattern)
    chosen = choose_bags(bags, args.max_files, args.max_bytes)
    if not chosen:
        print("no matching .bag files selected", file=sys.stderr)
        return 1

    total = sum(size for _, size in chosen)
    print("selected bags:")
    for path, size in chosen:
        print(f"  {size / 1_048_576:8.1f} MiB  {path}")
    print(f"total={total / 1_048_576:.1f} MiB")
    if args.dry_run:
        return 0

    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    dm = DownloadManager(download_config=DownloadConfig(cache_dir=args.cache_dir))
    urls = {
        path: hf_hub_url(repo_id=args.repo, filename=path, repo_type="dataset")
        for path, _ in chosen
    }
    local_paths = dm.download(urls)

    cargs = converter_args(args)
    for remote_path, local_path in local_paths.items():
        bag = Path(local_path)
        stem = Path(remote_path).stem
        out = out_dir / f"{stem}.arrow"
        if out.exists() and not args.force:
            print(f"skip existing {out}")
            continue
        print(f"[{remote_path}]")
        rosbag_to_arrow.convert_one(bag, out, cargs)

    print(f"wrote Arrow files under {out_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
