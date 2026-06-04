Drone navigation datasets (notes)

Purpose
- List datasets with temporal signals useful for navigation representation experiments.

Notes
- For each dataset include license, size, available signals (IMU, frames, pose), and parsing requirements.
- Use small subsets for initial runs; prepare ingestion scripts for large datasets.

Reproduce example
- Download one small ROS bag, extract IMU and pose to parquet/CSV, and run the nav-repr-bakeoff pipeline.
