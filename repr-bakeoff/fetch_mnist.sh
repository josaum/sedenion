#!/usr/bin/env bash
# Download MNIST into data/ for `cargo run -p repr-bakeoff -- mnist`.
set -e
mkdir -p data && cd data
base=https://ossci-datasets.s3.amazonaws.com/mnist
for f in train-images-idx3-ubyte train-labels-idx1-ubyte t10k-images-idx3-ubyte t10k-labels-idx1-ubyte; do
  [ -f "$f" ] || { curl -sf -o "$f.gz" "$base/$f.gz" && gunzip -f "$f.gz"; }
  echo "ok: $f"
done
