#!/usr/bin/env python3
"""Convert ROS bags (ROS1 or ROS2) of synchronized IMU + ground-truth pose into
Arrow IPC files for the nav-repr-bakeoff real-data path (`--data`).

This is the offline extraction step referenced in `drone-datasets.md` for the
Edged-USLAM DAVIS346 UAV sequences. It is intentionally a separate Python tool
(the Rust crate stays pure-Rust + Arrow); it reads bags with `rosbags`
(no ROS install required) and writes the exact schema `crate::real_data` expects.

Output schema (one Arrow IPC file per bag):

    t            Float64   timestamp, seconds (monotonic, starts at 0)
    ax,ay,az     Float32   linear acceleration, NAV frame, gravity removed, m/s^2
    px,py,pz     Float32   ground-truth position, m
    vx,vy,vz     Float32   ground-truth velocity, m/s (finite-difference of pos)
    gx,gy,gz     Float32   angular rate, body frame, rad/s (optional, ignored by
                           the Rust loader but kept for future use)

Pipeline:
  1. Read IMU (`sensor_msgs/Imu`) and pose (`geometry_msgs/PoseStamped` or
     `.../PoseWithCovarianceStamped`) messages; topics auto-detected by type.
  2. Resample onto a uniform grid at `--rate` Hz over the IMU/pose time overlap.
     Position is linearly interpolated; orientation is SLERP'd; accel/gyro are
     linearly interpolated.
  3. Transform the body-frame accelerometer specific force into the nav frame
     using the (interpolated) orientation and remove gravity:
         a_nav = R(q) @ a_body + g_world,     g_world = [0, 0, -|g|]
     A stationary sensor reads f_body = R^T @ [0,0,+|g|], so a_nav -> 0 at rest.
     Flags allow flipping the gravity sign or skipping the transform/removal for
     data that is already nav-frame / gravity-free.
  4. Write an Arrow IPC file (multiple record batches) readable zero-copy by the
     Rust loader.

IMPORTANT — frame & gravity conventions are dataset-specific and CANNOT be
verified here. Sanity-check a stationary segment: with correct settings the
nav-frame accel should hover near 0 (not ~9.8). Use `--report` to print the
mean/std of a_nav for a quick check, and adjust `--gravity` / `--g-sign` /
`--orientation-source` accordingly.

The Rust loader assumes a fixed timestep `dt` (default 0.02 s = 50 Hz). Pass a
matching `--rate` here (default 50) or set the Rust `--dt` to `1/rate`.

Usage:
    python rosbag_to_arrow.py INPUT OUTPUT [options]

    INPUT   a single bag (ROS1 .bag file, or a ROS2 bag directory), OR a
            directory containing several bags (each converted in turn).
    OUTPUT  target .arrow file (single-bag input) or a directory (multi-bag).

Examples:
    # one ROS1 bag
    python rosbag_to_arrow.py motion/line.bag out/line.arrow --rate 50 --report

    # a folder of bags -> a folder of .arrow files, then point Rust at it:
    python rosbag_to_arrow.py edged_uslam/ out/flights/ --rate 50
    cargo run --release --bin nav-repr-bakeoff -- --data out/flights

    # self-test (no bag needed): writes a synthetic .arrow and re-reads it
    python rosbag_to_arrow.py --self-test out/selftest.arrow
"""

from __future__ import annotations

import argparse
import sys
from dataclasses import dataclass
from pathlib import Path

import numpy as np

GRAVITY_DEFAULT = 9.80665

# ---------------------------------------------------------------------------
# Quaternion utilities (xyzw convention, matching ROS geometry_msgs)
# ---------------------------------------------------------------------------


def quat_normalize(q: np.ndarray) -> np.ndarray:
    n = np.linalg.norm(q, axis=-1, keepdims=True)
    n = np.where(n < 1e-12, 1.0, n)
    return q / n


def quat_to_matrix(q: np.ndarray) -> np.ndarray:
    """(...,4) xyzw -> (...,3,3) rotation matrices (body->world)."""
    q = quat_normalize(q)
    x, y, z, w = q[..., 0], q[..., 1], q[..., 2], q[..., 3]
    xx, yy, zz = x * x, y * y, z * z
    xy, xz, yz = x * y, x * z, y * z
    wx, wy, wz = w * x, w * y, w * z
    m = np.empty(q.shape[:-1] + (3, 3), dtype=np.float64)
    m[..., 0, 0] = 1 - 2 * (yy + zz)
    m[..., 0, 1] = 2 * (xy - wz)
    m[..., 0, 2] = 2 * (xz + wy)
    m[..., 1, 0] = 2 * (xy + wz)
    m[..., 1, 1] = 1 - 2 * (xx + zz)
    m[..., 1, 2] = 2 * (yz - wx)
    m[..., 2, 0] = 2 * (xz - wy)
    m[..., 2, 1] = 2 * (yz + wx)
    m[..., 2, 2] = 1 - 2 * (xx + yy)
    return m


def slerp(times_src: np.ndarray, quats_src: np.ndarray, times_dst: np.ndarray) -> np.ndarray:
    """Piecewise SLERP of xyzw quaternions from src timestamps to dst timestamps."""
    quats_src = quat_normalize(quats_src.astype(np.float64))
    # Enforce sign continuity so neighbouring quats take the short path.
    for i in range(1, len(quats_src)):
        if np.dot(quats_src[i], quats_src[i - 1]) < 0.0:
            quats_src[i] = -quats_src[i]
    idx = np.clip(np.searchsorted(times_src, times_dst) - 1, 0, len(times_src) - 2)
    t0 = times_src[idx]
    t1 = times_src[idx + 1]
    denom = np.where((t1 - t0) > 1e-12, (t1 - t0), 1.0)
    u = np.clip((times_dst - t0) / denom, 0.0, 1.0)
    q0 = quats_src[idx]
    q1 = quats_src[idx + 1]
    dot = np.clip(np.sum(q0 * q1, axis=-1), -1.0, 1.0)
    out = np.empty((len(times_dst), 4), dtype=np.float64)
    theta = np.arccos(dot)
    sin_theta = np.sin(theta)
    lin = sin_theta < 1e-6  # nearly colinear -> linear interpolation
    # SLERP branch
    s = ~lin
    if np.any(s):
        th = theta[s][:, None]
        st = sin_theta[s][:, None]
        a = np.sin((1 - u[s])[:, None] * th) / st
        b = np.sin(u[s][:, None] * th) / st
        out[s] = a * q0[s] + b * q1[s]
    # Linear branch
    if np.any(lin):
        uu = u[lin][:, None]
        out[lin] = (1 - uu) * q0[lin] + uu * q1[lin]
    return quat_normalize(out)


def interp_vec(times_src: np.ndarray, vals: np.ndarray, times_dst: np.ndarray) -> np.ndarray:
    """Per-component linear interpolation of (N,k) values onto times_dst."""
    out = np.empty((len(times_dst), vals.shape[1]), dtype=np.float64)
    for c in range(vals.shape[1]):
        out[:, c] = np.interp(times_dst, times_src, vals[:, c])
    return out


def quat_conj(q: np.ndarray) -> np.ndarray:
    out = q.copy()
    out[..., :3] *= -1.0
    return out


def quat_mul(a: np.ndarray, b: np.ndarray) -> np.ndarray:
    """Hamilton product of xyzw quaternions, broadcast over leading dims."""
    ax, ay, az, aw = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    bx, by, bz, bw = b[..., 0], b[..., 1], b[..., 2], b[..., 3]
    out = np.empty(np.broadcast(a, b).shape, dtype=np.float64)
    out[..., 0] = aw * bx + ax * bw + ay * bz - az * by
    out[..., 1] = aw * by - ax * bz + ay * bw + az * bx
    out[..., 2] = aw * bz + ax * by - ay * bx + az * bw
    out[..., 3] = aw * bw - ax * bx - ay * by - az * bz
    return out


def body_angular_velocity(quat_grid: np.ndarray, dt: float) -> np.ndarray:
    """Body-frame angular velocity (rad/s) from a uniform sequence of world<-body
    xyzw quaternions, via the finite-difference log map. Returns (n,3) aligned to
    the input timestamps (last sample duplicated)."""
    dq = quat_mul(quat_conj(quat_grid[:-1]), quat_grid[1:])
    dq = quat_normalize(dq)
    w = np.clip(dq[:, 3], -1.0, 1.0)
    vnorm = np.linalg.norm(dq[:, :3], axis=1)
    angle = 2.0 * np.arctan2(vnorm, w)
    axis = np.zeros((len(dq), 3))
    nz = vnorm > 1e-9
    axis[nz] = dq[nz, :3] / vnorm[nz, None]
    omega = axis * (angle / dt)[:, None]
    return np.vstack([omega, omega[-1]])  # pad to n


def smooth_columns(x: np.ndarray, window: int) -> np.ndarray:
    """Centered moving-average smoothing per column with edge reflection."""
    w = int(window) | 1  # force odd
    if w < 3:
        return x
    pad = w // 2
    kernel = np.ones(w) / w
    out = np.empty_like(x)
    for c in range(x.shape[1]):
        padded = np.pad(x[:, c], pad, mode="reflect")
        out[:, c] = np.convolve(padded, kernel, mode="valid")
    return out


def procrustes_rotation(src: np.ndarray, dst: np.ndarray) -> np.ndarray:
    """Best rotation X (3x3) minimizing ||X·src^T - dst^T|| for (N,3) vector sets
    (Wahba/Kabsch, no translation)."""
    m = dst.T @ src  # 3x3
    u, _, vt = np.linalg.svd(m)
    d = np.sign(np.linalg.det(u @ vt))
    return u @ np.diag([1.0, 1.0, d]) @ vt


# ---------------------------------------------------------------------------
# Bag reading
# ---------------------------------------------------------------------------


@dataclass
class ImuStream:
    t: np.ndarray  # (N,)
    accel: np.ndarray  # (N,3)
    gyro: np.ndarray  # (N,3)
    quat: np.ndarray | None  # (N,4) xyzw or None


@dataclass
class PoseStream:
    t: np.ndarray  # (M,)
    pos: np.ndarray  # (M,3)
    quat: np.ndarray  # (M,4) xyzw


def _stamp_to_sec(msg) -> float | None:
    hdr = getattr(msg, "header", None)
    if hdr is None:
        return None
    stamp = getattr(hdr, "stamp", None)
    if stamp is None:
        return None
    sec = getattr(stamp, "sec", getattr(stamp, "secs", None))
    nsec = getattr(stamp, "nanosec", getattr(stamp, "nsecs", None))
    if sec is None or nsec is None:
        return None
    return float(sec) + float(nsec) * 1e-9


def autodetect_topics(reader, imu_topic: str | None, pose_topic: str | None):
    imu_candidates, pose_candidates = [], []
    for conn in reader.connections:
        mt = conn.msgtype
        if mt.endswith("sensor_msgs/msg/Imu") or mt.endswith("sensor_msgs/Imu"):
            imu_candidates.append(conn.topic)
        if "Pose" in mt and ("Stamped" in mt):
            pose_candidates.append(conn.topic)

    def pick(explicit, candidates, prefer_substrings):
        if explicit:
            return explicit
        if not candidates:
            return None
        for sub in prefer_substrings:
            for c in candidates:
                if sub in c:
                    return c
        return candidates[0]

    imu = pick(imu_topic, sorted(set(imu_candidates)), ["/dvs/imu", "imu"])
    pose = pick(
        pose_topic,
        sorted(set(pose_candidates)),
        ["vicon", "vision_pose", "local_pose", "ground_truth", "pose"],
    )
    return imu, pose


def read_bag(path: Path, imu_topic: str | None, pose_topic: str | None):
    from rosbags.highlevel import AnyReader

    with AnyReader([path]) as reader:
        imu_topic, pose_topic = autodetect_topics(reader, imu_topic, pose_topic)
        if imu_topic is None:
            raise RuntimeError(f"{path}: no sensor_msgs/Imu topic found")
        if pose_topic is None:
            raise RuntimeError(f"{path}: no PoseStamped-like topic found")

        it, ia, ig, iq = [], [], [], []
        pt, pp, pq = [], [], []
        has_imu_quat = True

        conns = [c for c in reader.connections if c.topic in (imu_topic, pose_topic)]
        for conn, timestamp, raw in reader.messages(connections=conns):
            msg = reader.deserialize(raw, conn.msgtype)
            tsec = _stamp_to_sec(msg)
            if tsec is None:
                tsec = float(timestamp) * 1e-9  # bag receive time fallback
            if conn.topic == imu_topic:
                la = msg.linear_acceleration
                av = msg.angular_velocity
                it.append(tsec)
                ia.append((la.x, la.y, la.z))
                ig.append((av.x, av.y, av.z))
                o = getattr(msg, "orientation", None)
                if o is None or (o.x == 0 and o.y == 0 and o.z == 0 and o.w == 0):
                    has_imu_quat = False
                    iq.append((0.0, 0.0, 0.0, 1.0))
                else:
                    iq.append((o.x, o.y, o.z, o.w))
            else:
                # PoseStamped or PoseWithCovarianceStamped
                pose = msg.pose
                if hasattr(pose, "pose"):
                    pose = pose.pose
                pos = pose.position
                ori = pose.orientation
                pt.append(tsec)
                pp.append((pos.x, pos.y, pos.z))
                pq.append((ori.x, ori.y, ori.z, ori.w))

    imu = ImuStream(
        t=np.asarray(it, dtype=np.float64),
        accel=np.asarray(ia, dtype=np.float64),
        gyro=np.asarray(ig, dtype=np.float64),
        quat=(np.asarray(iq, dtype=np.float64) if has_imu_quat else None),
    )
    pose = PoseStream(
        t=np.asarray(pt, dtype=np.float64),
        pos=np.asarray(pp, dtype=np.float64),
        quat=np.asarray(pq, dtype=np.float64),
    )
    return imu, pose, imu_topic, pose_topic


# ---------------------------------------------------------------------------
# Resample + transform
# ---------------------------------------------------------------------------


def build_columns(imu: ImuStream, pose: PoseStream, args):
    if len(imu.t) < 2 or len(pose.t) < 2:
        raise RuntimeError("insufficient IMU or pose samples")

    # Sort by time (bags are usually ordered, but be safe).
    for s in (imu, pose):
        order = np.argsort(s.t)
        s.t = s.t[order]
        if isinstance(s, ImuStream):
            s.accel = s.accel[order]
            s.gyro = s.gyro[order]
            if s.quat is not None:
                s.quat = s.quat[order]
        else:
            s.pos = s.pos[order]
            s.quat = s.quat[order]

    dt = 1.0 / args.rate
    t_start = max(imu.t[0], pose.t[0])
    t_end = min(imu.t[-1], pose.t[-1])
    if t_end - t_start < 2 * dt:
        raise RuntimeError("IMU/pose time ranges do not overlap")
    n = int(np.floor((t_end - t_start) / dt))
    grid = t_start + dt * np.arange(n)

    accel_b = interp_vec(imu.t, imu.accel, grid)
    gyro_b = interp_vec(imu.t, imu.gyro, grid)
    pos = interp_vec(pose.t, pose.pos, grid)

    # Orientation source for the body->nav rotation.
    if args.orientation_source == "imu" and imu.quat is not None:
        quat = slerp(imu.t, imu.quat, grid)
    else:
        quat = slerp(pose.t, pose.quat, grid)

    # Transform accel to nav frame and remove gravity.
    #
    # `world`: rotate body accel by the (Vicon/IMU) orientation, then add back
    #          world gravity. Correct ONLY if the orientation quaternion is the
    #          IMU body frame in a Z-up world. Many mocap rigs report a marker
    #          frame offset from the IMU by an unknown extrinsic, in which case
    #          this leaves a large residual — check `--report`.
    # `body-mean`: estimate the gravity (+constant offset) vector in the BODY
    #          frame from the lowest-angular-rate samples and subtract it, with
    #          NO rotation. Sidesteps the missing IMU<->mocap extrinsic; treats
    #          the (gravity-removed) body accel as the nav-frame linear accel
    #          (attitude approximately resolved). Best default for raw UAV bags.
    # `none`: leave the accel untouched.
    est_g = None
    if args.gravity_mode == "world-calib":
        # Estimate the constant IMU->pose-body extrinsic rotation X by aligning
        # the IMU gyro to the pose-derived body angular velocity (hand-eye, gyro
        # only; lever-arm/translation ignored). Aggressive 6-DoF flight provides
        # the rotational excitation needed to make X fully observable.
        #
        # First resolve any IMU<->mocap clock offset by searching the integer
        # sample lag that minimizes the gyro-alignment residual; a stale offset
        # otherwise destroys both the extrinsic and the drift target.
        omega_pose_full = body_angular_velocity(quat, dt)  # pose body frame
        n_all = len(gyro_b)
        lmax = min(args.calib_max_lag, n_all // 4)

        def fit_at_lag(lag: int):
            v0, v1 = lmax, n_all - lmax
            gi = slice(v0 + lag, v1 + lag)
            pi = slice(v0, v1)
            g = gyro_b[gi]
            o = omega_pose_full[pi]
            wm = (np.linalg.norm(g, axis=1) > args.calib_min_rate) & (
                np.linalg.norm(o, axis=1) > args.calib_min_rate
            )
            if wm.sum() < 50:
                return None, np.inf, 0
            Xc = procrustes_rotation(g[wm], o[wm])
            r = np.sqrt((np.linalg.norm((g[wm] @ Xc.T) - o[wm], axis=1) ** 2).mean())
            return Xc, r, int(wm.sum())

        best = (0, None, np.inf, 0)
        for lag in range(-lmax, lmax + 1):
            Xc, r, k = fit_at_lag(lag)
            if r < best[2]:
                best = (lag, Xc, r, k)
        lag_star, X, resid_rms, ncal = best
        if X is None:
            X = np.eye(3)

        # Apply the lag: align IMU streams to the pose stream and trim borders.
        v0, v1 = lmax, n_all - lmax
        accel_b = accel_b[v0 + lag_star : v1 + lag_star]
        gyro_b = gyro_b[v0 + lag_star : v1 + lag_star]
        pos = pos[v0:v1]
        quat = quat[v0:v1]
        grid = grid[v0:v1]
        omega_pose = omega_pose_full[v0:v1]
        wmag_pose = np.linalg.norm(omega_pose, axis=1)
        gyro_scale = wmag_pose[wmag_pose > args.calib_min_rate].mean() if (wmag_pose > args.calib_min_rate).any() else 1.0
        print(
            "  gyro hand-eye calib: n={} time_lag={:+d} samp ({:+.3f}s) "
            "fit_resid_rms={:.4f} rad/s ({:.1f}% of |w|)".format(
                ncal, lag_star, lag_star * dt, resid_rms,
                100.0 * resid_rms / max(gyro_scale, 1e-6),
            )
        )
        # Rotate accel into the pose-body frame, then into world; remove gravity
        # in the WORLD frame (estimated from low-rotation samples), eliminating
        # the tilt leakage that body-frame removal suffers.
        R = quat_to_matrix(quat)  # pose-body -> world
        accel_pose = accel_b @ X.T  # imu -> pose body
        f_world = np.einsum("nij,nj->ni", R, accel_pose)  # specific force in world
        still = wmag_pose <= np.quantile(wmag_pose, args.still_quantile)
        if still.sum() < 10:
            still = np.ones(len(wmag_pose), dtype=bool)
        est_g = f_world[still].mean(axis=0)  # gravity (up) direction in world
        accel_n = f_world - est_g
    elif args.gravity_mode == "world":
        if args.no_transform:
            accel_n = accel_b
        else:
            R = quat_to_matrix(quat)  # (n,3,3) body->world
            accel_n = np.einsum("nij,nj->ni", R, accel_b)
        if not args.no_gravity_removal:
            g = args.g_sign * abs(args.gravity)
            accel_n = accel_n + np.array([0.0, 0.0, g], dtype=np.float64)
    elif args.gravity_mode == "body-mean":
        wmag = np.linalg.norm(gyro_b, axis=1)
        thresh = np.quantile(wmag, args.still_quantile)
        still = wmag <= thresh
        if still.sum() < 10:
            still = np.ones(len(wmag), dtype=bool)
        est_g = accel_b[still].mean(axis=0)  # specific force at rest ~= gravity+offset
        accel_n = accel_b - est_g
    else:  # none
        accel_n = accel_b

    # Velocity by central finite difference of interpolated position.
    vel = np.gradient(pos, dt, axis=0)

    # Optional light smoothing of position before it reaches the Rust target,
    # which double-differences position for the INS-bias proxy (very noise-prone).
    if args.smooth_pos_window and args.smooth_pos_window >= 3:
        pos = smooth_columns(pos, args.smooth_pos_window)
        vel = np.gradient(pos, dt, axis=0)

    t_rel = grid - grid[0]
    if est_g is not None:
        frame = "world" if args.gravity_mode == "world-calib" else "body"
        print(f"  estimated {frame} gravity vector = {np.round(est_g, 3)} (|g|={np.linalg.norm(est_g):.3f})")
    return {
        "t": t_rel.astype(np.float64),
        "ax": accel_n[:, 0].astype(np.float32),
        "ay": accel_n[:, 1].astype(np.float32),
        "az": accel_n[:, 2].astype(np.float32),
        "px": pos[:, 0].astype(np.float32),
        "py": pos[:, 1].astype(np.float32),
        "pz": pos[:, 2].astype(np.float32),
        "vx": vel[:, 0].astype(np.float32),
        "vy": vel[:, 1].astype(np.float32),
        "vz": vel[:, 2].astype(np.float32),
        "gx": gyro_b[:, 0].astype(np.float32),
        "gy": gyro_b[:, 1].astype(np.float32),
        "gz": gyro_b[:, 2].astype(np.float32),
    }


# ---------------------------------------------------------------------------
# Arrow IPC writing
# ---------------------------------------------------------------------------


def write_arrow(cols: dict, out_path: Path, batch_rows: int = 4096):
    import pyarrow as pa

    fields = [
        ("t", pa.float64()),
        ("ax", pa.float32()), ("ay", pa.float32()), ("az", pa.float32()),
        ("px", pa.float32()), ("py", pa.float32()), ("pz", pa.float32()),
        ("vx", pa.float32()), ("vy", pa.float32()), ("vz", pa.float32()),
        ("gx", pa.float32()), ("gy", pa.float32()), ("gz", pa.float32()),
    ]
    schema = pa.schema(fields)
    n = len(cols["t"])
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with pa.ipc.new_file(str(out_path), schema) as writer:
        for r in range(0, n, batch_rows):
            end = min(r + batch_rows, n)
            arrays = [pa.array(cols[name][r:end], type=ty) for name, ty in fields]
            writer.write_batch(pa.record_batch(arrays, schema=schema))
    return n


def report(cols: dict, imu_topic: str, pose_topic: str, out_path: Path, n: int):
    a = np.stack([cols["ax"], cols["ay"], cols["az"]], axis=1).astype(np.float64)
    mag = np.linalg.norm(a, axis=1)
    print(f"  imu_topic={imu_topic}  pose_topic={pose_topic}")
    print(f"  rows={n}  duration={cols['t'][-1]:.1f}s")
    print(
        "  a_nav mean=[{:+.3f} {:+.3f} {:+.3f}]  |a| mean={:.3f} std={:.3f} m/s^2".format(
            a[:, 0].mean(), a[:, 1].mean(), a[:, 2].mean(), mag.mean(), mag.std()
        )
    )
    print(
        "  (sanity: with correct gravity/frame, stationary |a| should be ~0, "
        "not ~9.8)"
    )
    print(f"  wrote {out_path}")


# ---------------------------------------------------------------------------
# Self-test (no bag required)
# ---------------------------------------------------------------------------


def self_test(out_path: Path, rate: float):
    """Write a synthetic gravity-free nav-frame sequence and round-trip-read it."""
    dt = 1.0 / rate
    n = int(20.0 / dt)
    t = dt * np.arange(n)
    cols = {
        "t": t.astype(np.float64),
        "ax": (0.6 * np.sin(0.3 * t)).astype(np.float32),
        "ay": (0.4 * np.sin(0.17 * t + 1)).astype(np.float32),
        "az": (0.2 * np.sin(0.09 * t + 2)).astype(np.float32),
        "px": np.cumsum(np.zeros(n)).astype(np.float32),
        "py": np.zeros(n, np.float32),
        "pz": np.zeros(n, np.float32),
        "vx": np.zeros(n, np.float32),
        "vy": np.zeros(n, np.float32),
        "vz": np.zeros(n, np.float32),
        "gx": np.zeros(n, np.float32),
        "gy": np.zeros(n, np.float32),
        "gz": np.zeros(n, np.float32),
    }
    written = write_arrow(cols, out_path)
    import pyarrow as pa

    with pa.memory_map(str(out_path), "r") as src:
        table = pa.ipc.open_file(src).read_all()
    assert table.num_rows == written, "round-trip row mismatch"
    assert table.schema.names[:7] == ["t", "ax", "ay", "az", "px", "py", "pz"]
    print(f"self-test OK: wrote+reread {written} rows, schema {table.schema.names}")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def is_ros1_bag(p: Path) -> bool:
    return p.is_file() and p.suffix == ".bag"


def is_ros2_bag_dir(p: Path) -> bool:
    return p.is_dir() and (any(p.glob("*.db3")) or (p / "metadata.yaml").exists())


def discover_bags(inp: Path) -> list[Path]:
    if is_ros1_bag(inp) or is_ros2_bag_dir(inp):
        return [inp]
    if inp.is_dir():
        bags = sorted(q for q in inp.glob("*.bag"))
        bags += sorted(q for q in inp.iterdir() if is_ros2_bag_dir(q))
        return bags
    return []


def convert_one(bag: Path, out_path: Path, args) -> int:
    imu, pose, itopic, ptopic = read_bag(bag, args.imu_topic, args.pose_topic)
    cols = build_columns(imu, pose, args)
    n = write_arrow(cols, out_path, batch_rows=args.batch_rows)
    if args.report:
        report(cols, itopic, ptopic, out_path, n)
    else:
        print(f"  wrote {out_path} ({n} rows)")
    return n


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("input", nargs="?", help="bag file/dir, or directory of bags")
    ap.add_argument("output", help="output .arrow file or directory")
    ap.add_argument("--rate", type=float, default=50.0, help="resample rate Hz (match Rust 1/dt; default 50)")
    ap.add_argument("--imu-topic", default=None, help="override IMU topic (else autodetect)")
    ap.add_argument("--pose-topic", default=None, help="override pose topic (else autodetect)")
    ap.add_argument("--gravity-mode", choices=["world-calib", "world", "body-mean", "none"],
                    default="world-calib",
                    help="gravity handling: 'world-calib' (estimate IMU<->pose extrinsic from gyro, rotate "
                         "to world, remove gravity in world frame; default, best for raw bags w/o orientation), "
                         "'body-mean' (subtract body-frame gravity, no rotation), 'world' (rotate by given "
                         "orientation then add gravity), 'none'")
    ap.add_argument("--still-quantile", type=float, default=0.2,
                    help="gyro-magnitude quantile defining 'low motion' samples for gravity estimate (default 0.2)")
    ap.add_argument("--calib-min-rate", type=float, default=0.15,
                    help="min angular rate (rad/s) for samples used in the gyro hand-eye calibration")
    ap.add_argument("--calib-max-lag", type=int, default=25,
                    help="max IMU<->mocap time offset searched, in samples (default 25 = 0.5s @50Hz)")
    ap.add_argument("--smooth-pos-window", type=int, default=7,
                    help="centered moving-average window (samples) for position before the INS-bias "
                         "double-difference; 0 disables (default 7)")
    ap.add_argument("--gravity", type=float, default=GRAVITY_DEFAULT, help="gravity magnitude m/s^2 (world mode)")
    ap.add_argument("--g-sign", type=float, default=-1.0, help="sign of world-Z gravity added back (world mode)")
    ap.add_argument("--orientation-source", choices=["pose", "imu"], default="pose",
                    help="quaternion used for body->nav rotation in world mode (default pose/Vicon)")
    ap.add_argument("--no-transform", action="store_true", help="(world mode) accel already in nav frame")
    ap.add_argument("--no-gravity-removal", action="store_true", help="(world mode) accel already gravity-free")
    ap.add_argument("--batch-rows", type=int, default=4096, help="rows per Arrow record batch")
    ap.add_argument("--report", action="store_true", help="print a_nav sanity stats per bag")
    ap.add_argument("--self-test", action="store_true", help="write+reread a synthetic .arrow and exit")
    args = ap.parse_args(argv)

    if args.self_test:
        self_test(Path(args.output), args.rate)
        return 0

    if not args.input:
        ap.error("input is required (unless --self-test)")
    inp = Path(args.input)
    out = Path(args.output)
    bags = discover_bags(inp)
    if not bags:
        print(f"no bags found at {inp}", file=sys.stderr)
        return 1

    if len(bags) == 1 and out.suffix == ".arrow":
        convert_one(bags[0], out, args)
    else:
        out.mkdir(parents=True, exist_ok=True)
        for bag in bags:
            stem = bag.stem if bag.is_file() else bag.name
            print(f"[{stem}]")
            try:
                convert_one(bag, out / f"{stem}.arrow", args)
            except Exception as e:  # keep going on a bad bag
                print(f"  SKIP {stem}: {e}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
