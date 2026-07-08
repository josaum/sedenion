import * as THREE from "three"
import { type FlightCommand } from "./input"

/**
 * Lightweight quadcopter flight physics for the UAV simulator.
 *
 * The drone model uses the same coordinate system as the rest of the viewer:
 * y is up, x is forward (the model nose points along +x), and z is right.
 * All position/velocity/quaternion state is expressed in scene/world coordinates.
 *
 * `angularVelocity` is stored in the body frame because rate-command control
 * is most natural there; the public `quaternion` maps body axes to world axes.
 */
export class DronePhysics {
  // World-frame linear state.
  position = new THREE.Vector3()
  velocity = new THREE.Vector3()

  // Orientation: maps body-frame vectors to world-frame vectors.
  quaternion = new THREE.Quaternion()

  // Body-frame angular velocity in rad/s.
  angularVelocity = new THREE.Vector3()

  // Average normalized rotor speed, mostly useful for visual spin.
  rotorSpeed = 0

  // --- tuning constants ---

  // Mass in kg.  Together with `maxThrust` this sets hover throttle near 50%.
  mass = 1.0

  // Total thrust at full throttle.  `mass * g / 0.5` gives hover at 50%.
  maxThrust = 19.62

  // Horizontal rotor arm length in meters (distance from CG to each rotor).
  armLength = 0.35

  // Yaw authority factor.  Larger values make yaw more responsive.
  yawFactor = 0.035

  // Maximum commanded body rates in rad/s.
  maxRollRate = 3.0
  maxPitchRate = 3.0
  maxYawRate = 2.2

  // Rate-loop PID gains.
  rateP = 8.0
  rateD = 1.2
  yawP = 5.0
  yawD = 0.8

  // Linear drag coefficient for arcade-style damping.
  linearDrag = 0.35

  // Angular damping (opposes current body rates).
  angularDrag = 0.45

  // Moment of inertia approximation (scalar, kg·m²).
  inertia = 0.12

  // Ground plane height in scene units.
  groundLevel = 0

  // Bounciness/friction on ground contact.
  groundRestitution = 0.25
  groundFriction = 0.35

  // Scratch objects used every step to avoid per-frame allocations.
  private readonly _worldUp = new THREE.Vector3(0, 1, 0)
  private readonly _force = new THREE.Vector3()
  private readonly _thrustWorld = new THREE.Vector3()
  private readonly _omegaBody = new THREE.Vector3()
  private readonly _torqueBody = new THREE.Vector3()
  private readonly _qInv = new THREE.Quaternion()
  private readonly _rotorSpin = new THREE.Vector3()
  private readonly _qDot = new THREE.Quaternion()
  private readonly _tmpQ = new THREE.Quaternion()
  private readonly _tmpV = new THREE.Vector3()

  constructor() {
    this.quaternion.identity()
  }

  /**
   * Reset the drone to a known state.
   *
   * @param position Optional starting position.  Defaults to the origin.
   */
  reset(position?: THREE.Vector3) {
    this.position.copy(position ?? new THREE.Vector3())
    this.velocity.set(0, 0, 0)
    this.quaternion.identity()
    this.angularVelocity.set(0, 0, 0)
    this.rotorSpeed = 0
  }

  /**
   * Advance the physics by `dt` seconds using the supplied flight command.
   *
   * @param command Normalized manual input (throttle 0..1, roll/pitch/yaw -1..1).
   * @param dt Delta time in seconds.  Internally clamped to avoid instability.
   */
  step(command: FlightCommand, dt: number) {
    const time = Math.max(0, Math.min(dt, 0.05))
    if (time === 0) return

    const throttle = THREE.MathUtils.clamp(command.throttle, 0, 1)
    const rollCmd = THREE.MathUtils.clamp(command.roll, -1, 1)
    const pitchCmd = THREE.MathUtils.clamp(command.pitch, -1, 1)
    const yawCmd = THREE.MathUtils.clamp(command.yaw, -1, 1)

    // --- rate-command attitude hold ---

    // Current angular velocity expressed in the body frame.
    this._qInv.copy(this.quaternion).invert()
    this._omegaBody.copy(this.angularVelocity).applyQuaternion(this._qInv)

    // Desired body rates from the sticks.
    const targetRoll = rollCmd * this.maxRollRate
    const targetPitch = pitchCmd * this.maxPitchRate
    const targetYaw = yawCmd * this.maxYawRate

    // PID-style torque in body frame (P on rate error + D on current rate).
    this._torqueBody.set(
      this.rateP * (targetRoll - this._omegaBody.x) -
        this.rateD * this._omegaBody.x,
      this.yawP * (targetYaw - this._omegaBody.y) -
        this.yawD * this._omegaBody.y,
      this.rateP * (targetPitch - this._omegaBody.z) -
        this.rateD * this._omegaBody.z,
    )

    // --- explicit rotor mixing ---

    // Base thrust per rotor required to satisfy the throttle command.
    const basePerRotor = (throttle * this.maxThrust) / 4
    const perRotorMax = this.maxThrust / 2

    // Convert body-frame torques into per-rotor thrust differentials.
    const rollThrust = -this._torqueBody.x / (4 * this.armLength)
    const pitchThrust = this._torqueBody.z / (4 * this.armLength)
    const yawThrust = this._torqueBody.y / (4 * this.yawFactor)

    // Front-left, front-right, back-left, back-right rotors.
    // Forward is +x, right is +z.  CW/CCW assignment alternates so yaw couples
    // through rotor reaction torque rather than tilting.
    const fl = THREE.MathUtils.clamp(
      basePerRotor + rollThrust + pitchThrust - yawThrust,
      0,
      perRotorMax,
    )
    const fr = THREE.MathUtils.clamp(
      basePerRotor - rollThrust + pitchThrust + yawThrust,
      0,
      perRotorMax,
    )
    const bl = THREE.MathUtils.clamp(
      basePerRotor + rollThrust - pitchThrust + yawThrust,
      0,
      perRotorMax,
    )
    const br = THREE.MathUtils.clamp(
      basePerRotor - rollThrust - pitchThrust - yawThrust,
      0,
      perRotorMax,
    )

    const totalThrust = fl + fr + bl + br
    this.rotorSpeed = Math.sqrt(totalThrust / this.maxThrust)

    // --- linear dynamics ---

    // Thrust points along the drone's local up axis (+y in body space).
    this._thrustWorld.set(0, totalThrust, 0).applyQuaternion(this.quaternion)

    // Gravity + thrust + linear drag.
    this._force.copy(this._thrustWorld)
    this._force.y -= this.mass * 9.81
    this._force.addScaledVector(this.velocity, -this.linearDrag)

    const accel = this._tmpV.copy(this._force).divideScalar(this.mass)
    this.velocity.addScaledVector(accel, time)
    this.position.addScaledVector(this.velocity, time)

    // --- angular dynamics ---

    // Recompute per-rotor torques from the clamped thrusts for consistency.
    const actualTorqueX =
      this.armLength * (fl + bl - fr - br) // roll around body x
    const actualTorqueY =
      this.yawFactor * (fr + bl - fl - br) // yaw around body y
    const actualTorqueZ =
      this.armLength * (fl + fr - bl - br) // pitch around body z

    // Convert body torques to world torques and add angular drag in body frame.
    this._tmpQ.copy(this.quaternion)
    this._rotorSpin.set(actualTorqueX, actualTorqueY, actualTorqueZ)
    this._rotorSpin.applyQuaternion(this._tmpQ)

    const dragTorque = this._tmpV
      .copy(this.angularVelocity)
      .multiplyScalar(-this.angularDrag)

    const alpha = this._tmpV
      .copy(this._rotorSpin)
      .add(dragTorque)
      .divideScalar(this.inertia)

    this.angularVelocity.addScaledVector(alpha, time)

    // --- quaternion integration ---

    // dq/dt = 0.5 * omega_q * q, where omega is in world frame.
    this._qDot.set(
      this.angularVelocity.x,
      this.angularVelocity.y,
      this.angularVelocity.z,
      0,
    )
    this._qDot.multiply(this.quaternion)
    this._qDot.x *= 0.5
    this._qDot.y *= 0.5
    this._qDot.z *= 0.5
    this._qDot.w *= 0.5
    this.quaternion.x += this._qDot.x * time
    this.quaternion.y += this._qDot.y * time
    this.quaternion.z += this._qDot.z * time
    this.quaternion.w += this._qDot.w * time
    this.quaternion.normalize()

    // --- ground collision ---

    if (this.position.y < this.groundLevel) {
      this.position.y = this.groundLevel
      if (this.velocity.y < 0) {
        this.velocity.y *= -this.groundRestitution
      }
      const friction = Math.max(0, 1 - this.groundFriction * time)
      this.velocity.x *= friction
      this.velocity.z *= friction
      this.angularVelocity.multiplyScalar(Math.max(0, 1 - 2 * time))
    }
  }
}
