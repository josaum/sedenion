import * as THREE from "three"

/**
 * Normalized manual flight command.
 *
 * Values are expected in the range [-1, 1] for roll, pitch and yaw, and
 * [0, 1] for throttle.  The physics module clamps internally, but callers
 * should still keep inputs inside these bounds for predictable behavior.
 *
 * Action flags are one-shot or held depending on the source; callers consume
 * them each frame after handling.
 */
export type FlightCommand = {
  throttle: number
  roll: number
  pitch: number
  yaw: number
  boost: boolean
  brake: boolean
  reset: boolean
  toggleJam: boolean
  toggleMode: boolean
  cycleCamera: boolean
  pause: boolean
  toggleHelp: boolean
}

type HeldActions = "boost" | "brake"
type OneShotActions =
  | "reset"
  | "toggleJam"
  | "toggleMode"
  | "cycleCamera"
  | "pause"
  | "toggleHelp"

const HELD_ACTIONS: HeldActions[] = ["boost", "brake"]

const KEY_HELD_ACTIONS: Record<HeldActions, string[]> = {
  boost: ["ShiftLeft", "ShiftRight"],
  brake: ["Space"],
}

const KEY_ONE_SHOT_ACTIONS: Record<OneShotActions, string[]> = {
  reset: ["KeyR"],
  toggleJam: ["KeyJ"],
  toggleMode: ["KeyM"],
  cycleCamera: ["KeyC"],
  pause: ["Escape"],
  toggleHelp: ["KeyH"],
}

const AXIS_DEADZONE = 0.12

/**
 * Keyboard + gamepad input manager for the manual flight simulator.
 *
 * Uses `event.code` for keyboard keys so layouts stay predictable, polls
 * `navigator.getGamepads()` each frame, applies radial deadzones to analog
 * sticks, and exposes a normalized `FlightCommand` via `sample()`.
 */
export class InputManager {
  private readonly keys = new Set<string>()
  private readonly actions: FlightCommand
  private lastButtonStates: boolean[] = []

  constructor() {
    this.actions = InputManager.defaultCommand()
    window.addEventListener("keydown", this.onKeyDown)
    window.addEventListener("keyup", this.onKeyUp)
  }

  /** Release global event listeners. */
  dispose(): void {
    window.removeEventListener("keydown", this.onKeyDown)
    window.removeEventListener("keyup", this.onKeyUp)
  }

  /** Human-readable name of the first connected gamepad, or `null`. */
  get connectedGamepad(): string | null {
    const gamepads = navigator.getGamepads()
    for (const gp of gamepads) {
      if (gp?.connected) return gp.id || "Controle"
    }
    return null
  }

  /**
   * Sample the current input state.
   *
   * Held action flags (`boost`, `brake`) reflect the current key/button state.
   * One-shot flags are set on press transitions and stay set until the caller
   * clears them after handling.
   */
  sample(): FlightCommand {
    const gamepads = navigator.getGamepads()
    let gp: Gamepad | null = null
    for (const g of gamepads) {
      if (g?.connected) {
        gp = g
        break
      }
    }

    // Keyboard base axes.
    let roll = 0
    let pitch = 0
    let yaw = 0
    let throttle = 0

    if (this.keys.has("KeyA")) roll -= 1
    if (this.keys.has("KeyD")) roll += 1
    if (this.keys.has("KeyW")) pitch += 1
    if (this.keys.has("KeyS")) pitch -= 1
    if (this.keys.has("KeyQ") || this.keys.has("ArrowLeft")) yaw -= 1
    if (this.keys.has("KeyE") || this.keys.has("ArrowRight")) yaw += 1
    if (this.keys.has("ArrowUp")) {
      throttle += 1
    }
    if (this.keys.has("ArrowDown")) {
      throttle -= 1
    }

    // Held keyboard actions.
    for (const name of HELD_ACTIONS) {
      const codes = KEY_HELD_ACTIONS[name]
      this.actions[name] = codes.some((code) => this.keys.has(code))
    }

    // Gamepad input (standard mapping, works for Xbox and PlayStation).
    if (gp) {
      const left = this.applyRadialDeadzone(
        gp.axes[0] ?? 0,
        gp.axes[1] ?? 0,
        AXIS_DEADZONE,
      )
      const right = this.applyRadialDeadzone(
        gp.axes[2] ?? 0,
        gp.axes[3] ?? 0,
        AXIS_DEADZONE,
      )

      // Left stick: roll / pitch (push forward pitches nose down).
      if (Math.abs(left.x) > 0) roll = left.x
      if (Math.abs(left.y) > 0) pitch = left.y

      // Right stick: yaw / throttle (throttle inverted and mapped to [0,1]).
      if (Math.abs(right.x) > 0) yaw = right.x
      if (Math.abs(right.y) > 0) {
        throttle = (-right.y + 1) / 2
      }

      // Triggers: held actions.
      const rt = gp.buttons[7]?.value ?? 0
      const lt = gp.buttons[6]?.value ?? 0
      if (rt > 0.5) this.actions.boost = true
      if (lt > 0.5) this.actions.brake = true

      // Face / menu buttons: one-shot actions on press transitions.
      const pressed = gp.buttons.map((b) => b.pressed)
      const justPressed = pressed.map((p, i) => p && !this.lastButtonStates[i])

      if (justPressed[0]) this.actions.reset = true // A / Cross
      if (justPressed[1]) this.actions.toggleMode = true // B / Circle
      if (justPressed[2]) this.actions.toggleJam = true // X / Square
      if (justPressed[3]) this.actions.cycleCamera = true // Y / Triangle
      if (justPressed[8] || justPressed[9]) this.actions.pause = true // Back / Start

      this.lastButtonStates = pressed
    }

    this.actions.throttle = THREE.MathUtils.clamp(throttle, 0, 1)
    this.actions.roll = THREE.MathUtils.clamp(roll, -1, 1)
    this.actions.pitch = THREE.MathUtils.clamp(pitch, -1, 1)
    this.actions.yaw = THREE.MathUtils.clamp(yaw, -1, 1)

    return this.actions
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    const initial = !this.keys.has(event.code)
    this.keys.add(event.code)

    if (initial) {
      for (const name of Object.keys(KEY_ONE_SHOT_ACTIONS) as OneShotActions[]) {
        if (KEY_ONE_SHOT_ACTIONS[name].includes(event.code)) {
          this.actions[name] = true
          break
        }
      }
    }

    // Prevent browser actions for keys we own.
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) {
      event.preventDefault()
    }
  }

  private onKeyUp = (event: KeyboardEvent): void => {
    this.keys.delete(event.code)
  }

  private applyRadialDeadzone(
    x: number,
    y: number,
    deadzone: number,
  ): { x: number; y: number } {
    const length = Math.hypot(x, y)
    if (length < deadzone) {
      return { x: 0, y: 0 }
    }
    const scaled = (length - deadzone) / (1 - deadzone)
    const factor = scaled / length
    return { x: x * factor, y: y * factor }
  }

  private static defaultCommand(): FlightCommand {
    return {
      throttle: 0,
      roll: 0,
      pitch: 0,
      yaw: 0,
      boost: false,
      brake: false,
      reset: false,
      toggleJam: false,
      toggleMode: false,
      cycleCamera: false,
      pause: false,
      toggleHelp: false,
    }
  }
}
