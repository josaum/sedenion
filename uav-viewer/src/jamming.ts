import * as THREE from "three"
import "./jamming.css"

/**
 * GPS/GNSS jamming and spoofing simulator.
 *
 * The `Jamming` class maintains a *reported* position and velocity that deviate
 * from the supplied truth state according to the current intensity.  Low
 * intensities produce jamming-like denial of service (dropouts, loss of fix,
 * high noise), while higher intensities shift toward spoofing-like smooth
 * drift with a false fix.
 *
 * The module also creates and animates a full-screen RF noise overlay and
 * warning banners via the companion `jamming.css` stylesheet.
 */

export type GpsSeverity = "ok" | "jammed" | "spoofed"

/** Read-only snapshot of the current GNSS/jamming state. */
export interface JammingState {
  active: boolean
  intensity: number
  severity: GpsSeverity
  sats: number
  snr: number
  epu: number
  hasFix: boolean
  reportedPosition: THREE.Vector3
  reportedVelocity: THREE.Vector3
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value))
}

function smoothstep(value: number, min: number, max: number): number {
  const x = clamp01((value - min) / (max - min))
  return x * x * (3 - 2 * x)
}

/** Deterministic PRNG so repeated runs are comparable. */
function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export class Jamming {
  private readonly rng: () => number
  private readonly overlay: HTMLElement
  private readonly canvas: HTMLCanvasElement
  private readonly ctx: CanvasRenderingContext2D
  private readonly jamBanner: HTMLElement
  private readonly spoofBanner: HTMLElement

  private _active = false
  private _intensity = 0
  private _severity: GpsSeverity = "ok"

  private readonly _reportedPosition = new THREE.Vector3()
  private readonly _reportedVelocity = new THREE.Vector3()
  private _sats = 12
  private _snr = 45
  private _epu = 1.5
  private _hasFix = true

  private _dropoutTimer = 0
  private _inDropout = false
  private readonly _drift = new THREE.Vector3()
  private readonly _walk = new THREE.Vector3()
  private readonly _velocityBias = new THREE.Vector3()
  private _time = 0

  /**
   * @param parent - Element to attach the RF overlay to. Defaults to `document.body`.
   * @param seed   - Seed for the internal random generator.
   */
  constructor(parent: HTMLElement = document.body, seed = 12345) {
    this.rng = mulberry32(seed)
    this.overlay = this.getOrCreateOverlay(parent)
    this.canvas = this.getOrCreateCanvas(this.overlay)
    const ctx = this.canvas.getContext("2d")
    if (!ctx) throw new Error("Jamming: could not create 2d context")
    this.ctx = ctx
    this.jamBanner = this.getOrCreateBanner(
      this.overlay,
      "jamming-banner",
      "JAMMING GNSS DETECTADO",
    )
    this.spoofBanner = this.getOrCreateBanner(
      this.overlay,
      "spoofing-banner",
      "SPOOFING GNSS DETECTADO",
    )
    this.resizeCanvas()
    window.addEventListener("resize", this.resizeCanvas)
  }

  /** Whether the jamming/spoofing effect is currently active. */
  get active(): boolean {
    return this._active
  }

  /** Current corruption intensity in the range [0, 1]. */
  get intensity(): number {
    return this._intensity
  }

  /** Current severity classification. */
  get severity(): GpsSeverity {
    return this._severity
  }

  /** Reported number of tracked satellites. */
  get sats(): number {
    return Math.round(this._sats)
  }

  /** Reported carrier-to-noise density in dB-Hz. */
  get snr(): number {
    return Math.round(this._snr * 10) / 10
  }

  /** Estimated position uncertainty in meters. */
  get epu(): number {
    return Math.round(this._epu * 10) / 10
  }

  /** Whether the reported state claims a position fix. */
  get hasFix(): boolean {
    return this._hasFix
  }

  /** Corrupted reported position in scene units. */
  get reportedPosition(): THREE.Vector3 {
    return this._reportedPosition.clone()
  }

  /** Corrupted reported velocity in scene units per second. */
  get reportedVelocity(): THREE.Vector3 {
    return this._reportedVelocity.clone()
  }

  /** Full state snapshot for HUD/telemetry consumers. */
  getState(): JammingState {
    return {
      active: this._active,
      intensity: this._intensity,
      severity: this._severity,
      sats: this.sats,
      snr: this.snr,
      epu: this.epu,
      hasFix: this._hasFix,
      reportedPosition: this.reportedPosition,
      reportedVelocity: this.reportedVelocity,
    }
  }

  /** Enable or disable the jamming/spoofing effect. */
  setActive(active: boolean): void {
    if (this._active === active) return
    this._active = active
    this.overlay.classList.toggle("active", active)
    if (!active) {
      this._severity = "ok"
      this._inDropout = false
      this._dropoutTimer = 0
      this.overlay.classList.remove("jamming", "spoofing")
      this.clearCanvas()
    } else {
      // Trigger an early state evaluation on the next update.
      this._dropoutTimer = 0.05
    }
  }

  /** Set corruption intensity; values are clamped to [0, 1]. */
  setIntensity(intensity: number): void {
    this._intensity = clamp01(intensity)
  }

  /** Reset all internal corruption state to a clean GNSS fix. */
  reset(): void {
    this._active = false
    this._intensity = 0
    this._severity = "ok"
    this._sats = 12
    this._snr = 45
    this._epu = 1.5
    this._hasFix = true
    this._dropoutTimer = 0
    this._inDropout = false
    this._drift.set(0, 0, 0)
    this._walk.set(0, 0, 0)
    this._velocityBias.set(0, 0, 0)
    this._time = 0
    this._reportedPosition.set(0, 0, 0)
    this._reportedVelocity.set(0, 0, 0)
    this.overlay.classList.remove("active", "jamming", "spoofing")
    this.clearCanvas()
  }

  /**
   * Advance the simulator by `dt` seconds and corrupt the reported state.
   *
   * @param truthPosition - Ground-truth position in scene units.
   * @param truthVelocity - Ground-truth velocity in scene units per second.
   * @param dt            - Elapsed time since the last update, in seconds.
   */
  update(truthPosition: THREE.Vector3, truthVelocity: THREE.Vector3, dt: number): void {
    // Initialise reported state from truth on first call.
    if (this._time === 0) {
      this._reportedPosition.copy(truthPosition)
      this._reportedVelocity.copy(truthVelocity)
    }
    this._time += dt

    // Inactive or zero intensity: converge back to truth and clear effects.
    if (!this._active || this._intensity <= 0) {
      this._reportedPosition.copy(truthPosition)
      this._reportedVelocity.copy(truthVelocity)
      this._severity = "ok"
      this._sats = THREE.MathUtils.lerp(this._sats, 12, 0.1)
      this._snr = THREE.MathUtils.lerp(this._snr, 45, 0.1)
      this._epu = THREE.MathUtils.lerp(this._epu, 1.5, 0.1)
      this._hasFix = true
      this._drift.multiplyScalar(0.92)
      this._walk.multiplyScalar(0.92)
      this._velocityBias.multiplyScalar(0.92)
      this.overlay.classList.remove("jamming", "spoofing")
      if (this._active && this._intensity > 0) this.drawNoise()
      else this.clearCanvas()
      return
    }

    // Classify corruption mode: low intensity -> jamming, high -> spoofing.
    const spoofChance = smoothstep(this._intensity, 0.25, 0.7)
    const isSpoofing = this.rng() < spoofChance
    this._severity = isSpoofing ? "spoofed" : "jammed"
    this.overlay.classList.toggle("jamming", !isSpoofing)
    this.overlay.classList.toggle("spoofing", isSpoofing)

    // Dropout state machine: brief total loss of GNSS, more frequent with intensity.
    if (this._inDropout) {
      this._dropoutTimer -= dt
      if (this._dropoutTimer <= 0) {
        this._inDropout = false
        this._dropoutTimer = 0.2 + this.rng() * (1.2 - this._intensity * 0.8)
      }
    } else {
      this._dropoutTimer -= dt
      const dropoutChance = this._intensity * 0.35 * dt
      if (this._dropoutTimer <= 0 || this.rng() < dropoutChance) {
        this._inDropout = true
        this._dropoutTimer = 0.05 + this.rng() * (0.4 + this._intensity * 0.8)
      }
    }

    // Targets for reported telemetry quality.
    let targetSats: number
    let targetSnr: number
    let targetEpu: number
    let targetHasFix: boolean

    if (this._inDropout) {
      targetSats = Math.floor(this.rng() * 2)
      targetSnr = 8 + this.rng() * 12
      targetEpu = 25 + this._intensity * 120
      targetHasFix = false
    } else if (isSpoofing) {
      targetSats = 8 + Math.floor(this.rng() * 5)
      targetSnr = 32 + this.rng() * 14
      targetEpu = 2 + this._intensity * 40
      targetHasFix = true
    } else {
      targetSats = Math.max(0, Math.floor(4 + this.rng() * 4 - this._intensity * 6))
      targetSnr = 14 + this.rng() * 16
      targetEpu = 10 + this._intensity * 90
      targetHasFix = this.rng() > this._intensity * 0.7
    }

    const lerpRate = Math.min(1, dt * 5)
    this._sats = THREE.MathUtils.lerp(this._sats, targetSats, lerpRate)
    this._snr = THREE.MathUtils.lerp(this._snr, targetSnr, lerpRate)
    this._epu = THREE.MathUtils.lerp(this._epu, targetEpu, lerpRate)
    this._hasFix = targetHasFix

    // Slowly-evolving position drift (dominant under spoofing).
    const driftRate = isSpoofing ? 1.0 : 0.25
    this._drift.x += (this.rng() - 0.5) * this._intensity * driftRate * dt * 4
    this._drift.y += (this.rng() - 0.5) * this._intensity * driftRate * dt * 4
    this._drift.z += (this.rng() - 0.5) * this._intensity * driftRate * dt * 4
    this._drift.clampLength(0, 2 + this._intensity * 40)

    // High-frequency random walk position noise (dominant under jamming).
    const walkScale = (isSpoofing ? 0.3 : 1.2) * this._intensity
    this._walk.x += (this.rng() - 0.5) * walkScale * Math.sqrt(dt)
    this._walk.y += (this.rng() - 0.5) * walkScale * Math.sqrt(dt)
    this._walk.z += (this.rng() - 0.5) * walkScale * Math.sqrt(dt)
    this._walk.multiplyScalar(0.95)

    // Corrupt reported velocity with a smooth bias plus noise.
    this._velocityBias.x += (this.rng() - 0.5) * this._intensity * dt * 2
    this._velocityBias.y += (this.rng() - 0.5) * this._intensity * dt * 2
    this._velocityBias.z += (this.rng() - 0.5) * this._intensity * dt * 2
    this._velocityBias.clampLength(0, 1 + this._intensity * 6)

    if (this._inDropout) {
      // During dropouts the solution freezes and velocity collapses.
      this._reportedPosition.addScaledVector(this._walk, 0.05)
      this._reportedVelocity.set(0, 0, 0).addScaledVector(this._velocityBias, 0.3)
    } else {
      this._reportedPosition.copy(truthPosition).add(this._drift).add(this._walk)
      this._reportedVelocity.copy(truthVelocity).add(this._velocityBias)
    }

    this.drawNoise()
  }

  /** Remove the overlay and clean up event listeners. */
  dispose(): void {
    window.removeEventListener("resize", this.resizeCanvas)
    this.overlay.remove()
  }

  private resizeCanvas = (): void => {
    const width = 128
    const height = Math.max(32, Math.floor(width * (window.innerHeight / window.innerWidth)))
    this.canvas.width = width
    this.canvas.height = height
  }

  private getOrCreateOverlay(parent: HTMLElement): HTMLElement {
    const existing = document.getElementById("rf-overlay")
    if (existing) return existing
    const overlay = document.createElement("div")
    overlay.id = "rf-overlay"
    parent.appendChild(overlay)
    return overlay
  }

  private getOrCreateCanvas(overlay: HTMLElement): HTMLCanvasElement {
    const existing = overlay.querySelector("canvas")
    if (existing) return existing as HTMLCanvasElement
    const canvas = document.createElement("canvas")
    overlay.appendChild(canvas)
    return canvas
  }

  private getOrCreateBanner(
    overlay: HTMLElement,
    className: string,
    text: string,
  ): HTMLElement {
    const existing = overlay.querySelector(`.${className}`)
    if (existing) return existing as HTMLElement
    const banner = document.createElement("div")
    banner.className = className
    banner.textContent = text
    overlay.appendChild(banner)
    return banner
  }

  private drawNoise(): void {
    const opacity = this._active ? 0.08 + this._intensity * 0.42 : 0
    if (opacity <= 0.005) {
      this.clearCanvas()
      return
    }

    const w = this.canvas.width
    const h = this.canvas.height
    const img = this.ctx.createImageData(w, h)
    const data = img.data
    const isSpoofing = this._severity === "spoofed"
    const tintR = isSpoofing ? 220 : 240
    const tintG = isSpoofing ? 70 : 235
    const tintB = isSpoofing ? 70 : 230

    for (let i = 0; i < data.length; i += 4) {
      const v = Math.floor(this.rng() * 255)
      data[i] = Math.floor((v * tintR) / 255)
      data[i + 1] = Math.floor((v * tintG) / 255)
      data[i + 2] = Math.floor((v * tintB) / 255)
      data[i + 3] = Math.floor(opacity * 255)
    }
    this.ctx.putImageData(img, 0, 0)
  }

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
}
