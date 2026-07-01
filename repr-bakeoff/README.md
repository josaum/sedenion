repr-bakeoff — controlled representation experiment

Purpose
- Compare a single-layer sedenion-structured encoder against a matched dense encoder under SIGReg and optional ZDA.

Experiment
- One learnable layer maps 256→16 with two arms: dense and sedenion-structured.
- Metrics: linear-probe accuracy, collapse metrics, Gaussianity statistic.

Reproduce
cd repr-bakeoff
cargo test --release
python3 tools/ref_pure.py    # reference SIGReg forward
cargo run --release          # synthetic
./fetch_mnist.sh && cargo run --release -- mnist

Outputs
- Results logged to repr-bakeoff output files and test artifacts; inspect CSVs and crate outputs.
