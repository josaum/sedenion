//! Export a nav-bakeoff UAV trajectory as Arrow IPC for the Three.js viewer.
//!
//! Usage:
//!   cargo run --release --bin export-uav-arrow -- ../uav-viewer/public/flights/nav-default.arrow

use nav_bakeoff::real_data::{write_samples_arrow, ArrowFlight};
use nav_bakeoff::sim::{generate, ImuParams};
use std::path::PathBuf;

fn main() -> arrow::error::Result<()> {
    let args: Vec<String> = std::env::args().collect();
    let out = args
        .get(1)
        .map(PathBuf::from)
        .unwrap_or_else(|| PathBuf::from("../uav-viewer/public/flights/nav-default.arrow"));
    let seed: u64 = args.get(2).and_then(|s| s.parse().ok()).unwrap_or(7);
    let duration_s: f64 = args.get(3).and_then(|s| s.parse().ok()).unwrap_or(180.0);
    let dt = 0.02;
    let steps = (duration_s / dt) as usize;

    if let Some(parent) = out.parent() {
        std::fs::create_dir_all(parent)?;
    }

    let params = ImuParams::default();
    let samples = generate(seed, steps, dt, &params);
    write_samples_arrow(&out, &samples)?;

    let flight = ArrowFlight::open(&out)?;
    println!(
        "wrote {} rows to {}",
        flight.to_samples()?.len(),
        out.display()
    );
    Ok(())
}
