# Drone Navigation Datasets for Pretraining

Checked: 2026-06-01

This note records Hugging Face datasets found for real drone/navigation pretraining. The goal is not to collect every UAV-adjacent dataset, but to identify datasets that can support the current navigation representation work: real flight signals, temporal structure, pose/trajectory supervision, IMU or telemetry when possible, and enough data to make pretraining meaningful.

## Recommended starting set

### 1. Edged-USLAM DAVIS346 UAV sequences

- Hugging Face: <https://huggingface.co/datasets/sebnem-byte/drone-navigation-event-camera>
- License: CC BY 4.0
- Size: 12.5 GB listed on Hugging Face
- Data: ROS bags with DAVIS346 event stream, grayscale frames, IMU, and Vicon/motion-capture 6-DoF pose ground truth
- Useful signals:
  - `/dvs/events`: asynchronous event stream
  - `/dvs/image_raw`: grayscale image frames
  - `/dvs/imu`: accelerometer and gyroscope, listed at 200 Hz
  - `/mavros/vision_pose/pose` or `/local_pose_vicon/pose`: ground-truth pose depending on sequence folder
- Why it matters: this is the best match for a real navigation pretraining objective. It has synchronized inertial, visual/event, and pose supervision from a UAV platform.
- Suggested first objective: context window of IMU/events/frames -> future pose delta or future latent, then freeze/probe against bias/drift prediction in the existing nav representation harness.
- Caveats: ROS bag parsing is required. Sequence count is modest, so it should be treated as high-quality real validation/pretraining data, not a massive foundation corpus by itself.

### 2. DroneMotion-99k

- Hugging Face: <https://huggingface.co/datasets/yunzhong-hou/DroneMotion-99k>
- Project/GitHub linked from card: <https://github.com/hou-yz/dvgformer>
- License: MIT
- Size: 163 GB listed on Hugging Face
- Data: COLMAP reconstruction results and filtered camera movement sequences from real-world drone videos
- Scale: dataset card reports 13,653 videos and 99,003 camera trajectories for the full set; a mini set has 10 videos and 129 sequences
- Why it matters: strong substrate for visual/camera-motion pretraining. It directly trains the kind of temporal prediction objective we care about, but from reconstructed camera paths rather than onboard inertial sensors.
- Suggested first objective: pretrain a visual trajectory encoder on the mini set first, then test whether the latent transfers to navigation drift/bias probes.
- Caveats: no raw IMU or flight-control telemetry. The card says MP4s/frames are not directly shared due to YouTube policy; their script downloads frames separately.

### 3. DJI drone telemetry samples

- Hugging Face: <https://huggingface.co/datasets/nominal-io/dji-drone-telemetry>
- Related smaller original: <https://huggingface.co/datasets/npeng/drone-telemetry>
- License: MIT for `nominal-io/dji-drone-telemetry`
- Size: 3.22 GB listed for `nominal-io/dji-drone-telemetry`
- Data: real DJI flight videos plus CSV flight logs
- Observed CSV fields: GPS latitude/longitude, altitude, horizontal speed, x/y/z speed, pitch, roll, yaw, GPS count/level, gimbal pose, RC inputs, battery state, home point, weather/wind fields, warnings
- Why it matters: good real-world parser and sanity-check data. It is useful for establishing a DJI telemetry ingestion path and for low-volume qualitative tests.
- Caveats: very small corpus. Hugging Face viewer showed only three rows/classes for `nominal-io/dji-drone-telemetry`; not enough for main pretraining.

## Secondary or task-specific

### The DRIFT Open Dataset

- Hugging Face: <https://huggingface.co/datasets/Hj-Lee/The-DRIFT>
- License: CC BY 4.0
- Size category: 10M-100M on Hugging Face
- Data: drone-captured urban vehicle trajectories from 4K footage at 30 fps, altitude about 250 m
- Scale: dataset card reports 81,699 annotated vehicle trajectories across 9 connected intersections in Daejeon, South Korea
- Why it may help: useful for generic trajectory modeling, motion forecasting, and time-series representation pretraining.
- Why it is not a primary drone-nav dataset: the moving agents are ground vehicles observed by a drone, not the drone itself. It does not teach UAV dynamics or onboard sensing.
- Caveat: card notes `load_dataset()` schema issues from site-specific columns; use streaming or single-site CSV loading.

### Pamir Visual/Inertial Dataset

- Hugging Face: <https://huggingface.co/datasets/afrl-uw/Pamir_Visual-Inertial_Data>
- Size: 61.4 GB listed on Hugging Face
- Data: visual/inertial ROS2 bags and video from underwater shipwreck mapping sessions
- Why it may help: real visual-inertial temporal data with long sessions.
- Why it is secondary: not a drone/UAV flight dataset in the aerial-navigation sense; underwater rig/domain shift is large.

### UAV VisLoc dataset

- Hugging Face: <https://huggingface.co/datasets/haiduonghuynhle/UAV_VisLoc_dataset>
- License: AGPL-3.0
- Data: single zip on Hugging Face; README has only license metadata
- Why it may help: possible visual-localization data.
- Caveats: insufficient dataset card details and AGPL licensing make it a poor first choice unless we inspect the zip and accept the license constraints.

## Skip for this pretrain pass

### Synthetic / simulator-first

- `astralhf/yonder`: <https://huggingface.co/datasets/astralhf/yonder>
  - Large drone-navigation benchmark, but tags and files indicate simulator/Habitat/Isaac-style data. Useful later for sim-to-real or visual-language navigation, not for real-flight pretraining.
- `AutelRobotics/CosFly`: <https://huggingface.co/datasets/AutelRobotics/CosFly>
  - Tagged as CARLA/synthetic-data. Interesting autonomous-navigation benchmark, but not real drone data.
- `webxos/drone_fsd_dataset`: <https://huggingface.co/datasets/webxos/drone_fsd_dataset>
  - Generated Three.js/PPO navigation run in a 60x60 room. Useful only as a toy RL fixture.
- `11NIU11/uav_navigation_tree_right_lerobot`: <https://huggingface.co/datasets/11NIU11/uav_navigation_tree_right_lerobot>
  - LeRobot-style UAV dataset with 1,275 episodes and 71,152 frames listed in metadata, but the repository listing exposed only metadata files in the Hugging Face API during inspection. Revisit only if the actual data/video files become available.

### Not enough usable data on Hugging Face

- `richt/Euroc`: <https://huggingface.co/datasets/richt/Euroc>
  - The Hugging Face page reports the dataset as empty, with only a tiny README/repo shell. Use the official EuRoC MAV source instead if we need EuRoC.

### Detection-only or off-task

- Most `drone detection`, `UAV detection`, aerial imagery, agriculture, wildlife, and path-loss datasets found in search are not appropriate for the current objective. They may contain real drone imagery, but they lack the temporal navigation supervision we need.

## Practical next step

Start with Edged-USLAM:

1. Download one small motion ROS bag first, such as `motion/line.bag`.
2. Extract synchronized IMU and Vicon pose into a compact local parquet/CSV.
3. Build JEPA-style samples: past IMU/event/image context and held-out future pose/latent target.
4. Run the same dense vs sedenion representation comparison used in `nav-repr-bakeoff`.
5. Add DroneMotion-99k mini only after the inertial/pose extraction path is working, because its data volume and frame-download workflow are heavier.
