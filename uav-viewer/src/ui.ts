/**
 * Simulator UX layer for uav-viewer.
 *
 * This module owns the DOM-facing controls and HUD readouts added during the
 * simulator refactor: mode selector, mode banner, controller status, GPS
 * status rows and the help overlay. It does not depend on Three.js or the
 * flight physics code, so it can be imported and tested independently.
 */

/** One of the three simulator UX modes. */
export type AppMode = "demo" | "manual" | "manual-jammed"

/** GPS state exposed to the HUD. */
export type GpsState = {
  /** GNSS fix quality. */
  fix: "none" | "2d" | "3d" | "dgps"
  /** Number of satellites in view / used. */
  satellites: number
  /** True when GPS interference is being simulated. */
  jammed: boolean
  /** Horizontal dilution of precision (lower is better). */
  hdop?: number
}

const MODE_LABELS: Record<AppMode, string> = {
  demo: "Demo",
  manual: "Fly",
  "manual-jammed": "Fly + Jam",
}

const MODE_DESCRIPTIONS: Record<AppMode, string> = {
  demo: "reproduzindo telemetria gravada",
  manual: "voo manual ativo",
  "manual-jammed": "voo manual com interferência GPS",
}

const FIX_LABELS: Record<GpsState["fix"], string> = {
  none: "NONE",
  "2d": "2D",
  "3d": "3D",
  dgps: "DGPS",
}

/** Cached element lookups so repeated updates are cheap. */
const elements = {
  modeBanner: queryById("modeBanner", HTMLElement),
  controllerStatus: queryById("controllerStatus", HTMLElement),
  gpsFix: queryById("gpsFix", HTMLElement),
  gpsSats: queryById("gpsSats", HTMLElement),
  gpsHdop: queryById("gpsHdop", HTMLElement),
  gpsJamming: queryById("gpsJamming", HTMLElement),
  gpsJammingRow: queryById("gpsJammingRow", HTMLElement),
  helpOverlay: queryById("helpOverlay", HTMLElement),
  helpToggle: queryById("helpToggle", HTMLButtonElement),
  helpClose: queryById("helpClose", HTMLButtonElement),
}

/**
 * Typed helper for querying required DOM elements. Returns `null` when the
 * element is missing so the module stays usable in partial HTML environments
 * (e.g. during staged refactors or tests).
 */
function queryById<T extends HTMLElement>(id: string, ctor: new () => T): T | null {
  const el = document.getElementById(id)
  if (el == null) return null
  if (!(el instanceof ctor)) return null
  return el as T
}

/** Format an HDOP number or return a placeholder. */
function formatHdop(hdop: number | undefined): string {
  if (hdop == null) return "--"
  return hdop.toFixed(1)
}

/**
 * Update the visible mode banner and mode selector button states.
 *
 * @param mode - The newly active simulator mode.
 */
export function updateModeBanner(mode: AppMode): void {
  const banner = elements.modeBanner
  if (banner != null) {
    banner.setAttribute("data-mode", mode)
    banner.innerHTML = `<span>${MODE_LABELS[mode]}</span> — ${MODE_DESCRIPTIONS[mode]}`
  }

  for (const m of ["demo", "manual", "manual-jammed"] as AppMode[]) {
    const btn = document.getElementById(`mode-${m}`)
    if (btn instanceof HTMLButtonElement) {
      btn.setAttribute("aria-pressed", String(m === mode))
    }
  }
}

/**
 * Update the controller status readout.
 *
 * @param name - Controller display name, or `null` when disconnected.
 */
export function updateControllerStatus(name: string | null): void {
  const status = elements.controllerStatus
  if (status == null) return

  if (name == null || name === "") {
    status.textContent = "Nenhum"
    status.classList.remove("connected")
    status.classList.add("disconnected")
  } else {
    status.textContent = name
    status.classList.remove("disconnected")
    status.classList.add("connected")
  }
}

/**
 * Update the GPS HUD rows: fix type, satellite count, HDOP and jamming state.
 *
 * @param state - Current GPS state reported by the simulation.
 */
export function updateGpsReadout(state: GpsState): void {
  if (elements.gpsFix != null) {
    elements.gpsFix.textContent = FIX_LABELS[state.fix] ?? "--"
  }
  if (elements.gpsSats != null) {
    elements.gpsSats.textContent = String(state.satellites)
  }
  if (elements.gpsHdop != null) {
    elements.gpsHdop.textContent = formatHdop(state.hdop)
  }

  const jamRow = elements.gpsJammingRow
  const jamValue = elements.gpsJamming
  if (jamRow != null && jamValue != null) {
    if (state.jammed) {
      jamValue.textContent = "JAM"
      jamRow.classList.remove("severity-ok", "severity-warn")
      jamRow.classList.add("severity-danger")
    } else {
      jamValue.textContent = "OK"
      jamRow.classList.remove("severity-danger", "severity-warn")
      jamRow.classList.add("severity-ok")
    }
  }
}

/** Show the help / controls overlay. */
export function showHelp(): void {
  const overlay = elements.helpOverlay
  const toggle = elements.helpToggle
  if (overlay != null) {
    overlay.setAttribute("aria-hidden", "false")
  }
  if (toggle != null) {
    toggle.setAttribute("aria-expanded", "true")
  }
}

/** Hide the help / controls overlay. */
export function hideHelp(): void {
  const overlay = elements.helpOverlay
  const toggle = elements.helpToggle
  if (overlay != null) {
    overlay.setAttribute("aria-hidden", "true")
  }
  if (toggle != null) {
    toggle.setAttribute("aria-expanded", "false")
  }
}

/** Wire the help toggle and close buttons to show/hide the overlay. */
function wireHelpButtons(): void {
  elements.helpToggle?.addEventListener("click", () => {
    const hidden = elements.helpOverlay?.getAttribute("aria-hidden") !== "false"
    if (hidden) showHelp()
    else hideHelp()
  })
  elements.helpClose?.addEventListener("click", hideHelp)
}

/**
 * Bind the mode selector buttons by ID and invoke `onChange` when the user
 * selects a different mode. Also wires the help overlay controls.
 *
 * @param onChange - Callback receiving the newly selected mode.
 */
export function bindModeButtons(onChange: (mode: AppMode) => void): void {
  for (const mode of ["demo", "manual", "manual-jammed"] as AppMode[]) {
    const btn = document.getElementById(`mode-${mode}`)
    if (!(btn instanceof HTMLButtonElement)) continue
    btn.addEventListener("click", () => {
      updateModeBanner(mode)
      onChange(mode)
    })
  }

  // Bind help controls once when the UX layer is initialized.
  wireHelpButtons()
}
