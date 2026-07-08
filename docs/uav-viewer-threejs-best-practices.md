# Three.js Web Game Best Practices for `uav-viewer`

Research focus: practical recommendations for evolving the existing Vite + TypeScript + Three.js UAV replay viewer into an interactive "ultimate UAV simulator" with manual flight, gamepad input, and GPS-jamming effects.

---

## 1. Adopt a Fixed-Timestep Game Loop

**Why:** `uav-viewer/src/main.ts` currently advances the replay with the variable render delta (`dt = now - lastFrame`). For manual flight physics and deterministic GPS-jamming simulation, variable dt produces unstable integration and non-replayable behavior.

**Pattern (Glenn Fiedler / Jake Gordon accumulator):**

```ts
const SIM_STEP = 1 / 60;          // fixed physics/telemetry step
const MAX_DT = 1;                 // avoid spiral-of-death after tab switch
let accumulator = 0;
let lastTime = performance.now();

function loop(now: number) {
  let frameDt = (now - lastTime) / 1000;
  lastTime = now;
  if (frameDt > MAX_DT) frameDt = MAX_DT;
  accumulator += frameDt;

  while (accumulator >= SIM_STEP) {
    updateSimulation(SIM_STEP);   // physics, flight model, jamming logic
    accumulator -= SIM_STEP;
  }

  const alpha = accumulator / SIM_STEP;
  render(alpha);                  // optional interpolation for sub-frame smoothness
  raf = requestAnimationFrame(loop);
}
```

**Integration:**
- Keep the existing replay interpolator inside `updateSimulation` but make it step the simulation state at 60 Hz.
- Add an `InputSystem` call inside `updateSimulation` so keyboard/gamepad inputs are sampled once per sim tick, not once per render frame.
- Render interpolation (`alpha`) lets the camera and drone visually follow 60 Hz state on 120 Hz or 30 Hz displays without jitter.

**Trade-off:** Slightly more code than a single `dt`; simulation may run multiple steps per frame on slow devices. Cap iterations per frame to prevent freezing.

---

## 2. Build a Normalized Input Layer (Keyboard + Gamepad)

**Why:** The existing app only has pointer/wheel orbit controls. Manual flight needs unified input from keyboard, mouse, and gamepads (including PlayStation controllers) mapped to the same flight-intent struct.

**Pattern:**

```ts
type FlightIntent = {
  throttle: number;   // -1..1
  pitch: number;      // -1..1
  roll: number;       // -1..1
  yaw: number;        // -1..1
  toggleJam: boolean;
};

const intent: FlightIntent = { throttle: 0, pitch: 0, roll: 0, yaw: 0, toggleJam: false };

function readKeyboard(keys: Set<string>, out: FlightIntent) {
  out.throttle = axis(keys, 'ShiftLeft', 'ControlLeft');
  out.pitch    = axis(keys, 'ArrowDown', 'ArrowUp');     // or W/S
  out.roll     = axis(keys, 'KeyA', 'KeyD');
  out.yaw      = axis(keys, 'KeyQ', 'KeyE');
}

function axis(keys: Set<string>, neg: string, pos: string): number {
  return (keys.has(pos) ? 1 : 0) - (keys.has(neg) ? 1 : 0);
}
```

**Gamepad specifics:**
- The Gamepad API requires a **user gesture** (button press) before `navigator.getGamepads()` returns data. Start polling only after `gamepadconnected`.
- Poll inside `requestAnimationFrame`; the returned gamepad snapshot is not live.
- Apply a **deadzone** (0.10–0.12) and, ideally, a circular deadzone for analog sticks.
- Track previous button states for edge detection (`justPressed = pressed && !wasPressed`).

```ts
window.addEventListener('gamepadconnected', (e) => {
  activeGamepadIndex = e.gamepad.index;
  prevButtons = new Array(e.gamepad.buttons.length).fill(false);
});

function readGamepad(out: FlightIntent) {
  const gp = navigator.getGamepads()[activeGamepadIndex];
  if (!gp) return;
  out.roll     = applyDeadzone(gp.axes[0], 0.12);
  out.pitch    = applyDeadzone(gp.axes[1], 0.12);
  out.yaw      = applyDeadzone(gp.axes[2], 0.12);
  out.throttle = applyDeadzone(gp.axes[3], 0.12);
  // PS controllers: check button indices 0 (×/A) / 1 (○/B) / etc.
}
```

**Integration:** Add a small `InputManager` module and import it into `main.ts`. Replace the existing orbit-only pointer code with an `updateCameraFromInput` that respects the active camera preset and current input mode.

---

## 3. Eliminate Per-Frame Allocations (Object / Vector Pooling)

**Why:** `updateFlight` currently allocates several `new THREE.Vector3()` every frame (lines 1646, 1657, 1671–1689). In manual-flight mode these allocations happen continuously and cause GC stutter.

**Pattern:** Pre-allocate scratch objects and reuse them:

```ts
const _v0 = new THREE.Vector3();
const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();

function updateFlight(dt: number) {
  const p = _v0.set(current.px[i], current.py[i], current.pz[i]);
  // ... apply view transform in place if needed, or keep a separate pool
  const vel = _v1.set(current.vx[i], current.vz[i], -current.vy[i]);
  // use vel, but never assign a fresh new Vector3 to any persistent reference
}
```

**Integration:**
- Refactor `toScene()` to accept an out parameter: `toScene(px, py, pz, target: THREE.Vector3)`.
- Audit `updateVectorLine`, camera math, and shadow code for `clone()` calls; replace with pooled scratch vectors.
- Pool transient objects for jamming effects (decals, signal-loss particles) instead of creating/destroying meshes.

---

## 4. Add a Post-Processing Pipeline for GPS-Jamming FX

**Why:** GPS jamming needs both visual feedback and degraded telemetry. A post-processing stack can communicate "signal degradation" instantly without changing core 3D assets.

**Recommended effects:**
- **Chromatic aberration** — channel separation that grows with jamming strength.
- **Film grain / noise** — static overlay that intensifies as C/N0 drops.
- **Scanlines / horizontal displacement** — brief tearing when lock is lost.
- **Vignette + desaturation** — narrowing field of view and muted colors at high jamming.

**Pattern with `pmndrs/postprocessing` (preferred over core `EffectComposer` because it merges effects into fewer passes):**

```ts
import { EffectComposer, EffectPass, RenderPass } from 'postprocessing';
import { ChromaticAberrationEffect, NoiseEffect, VignetteEffect } from 'postprocessing';

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const chromatic = new ChromaticAberrationEffect();
const noise = new NoiseEffect({ premultiply: true });
const vignette = new VignetteEffect();

const fxPass = new EffectPass(camera, chromatic, noise, vignette);
composer.addPass(fxPass);

function render() {
  const jam = jammingIntensity; // 0..1
  chromatic.offset.set(jam * 0.01, jam * 0.01);
  noise.blendMode.opacity.value = jam * 0.35;
  vignette.darkness = jam * 0.8;
  composer.render();
}
```

**Telemetry degradation:**
- Add Gaussian or Perlin noise to reported position/velocity in the HUD and readout based on jam level.
- Freeze or lag the telemetry cursor; show a "GPS DEGRADED" / "NO FIX" overlay.
- Optionally show an estimated-position ellipse or uncertainty cone around the drone.

**Trade-off:** Post-processing adds GPU cost. Use a half-resolution internal buffer on mobile and disable SMAA/FXAA if native MSAA is sufficient.

---

## 5. Reduce Draw Calls with Instancing / Batching

**Why:** The scenery functions (`makeCloudBank`, `makeTreeLine`, `makeContrails`, `makeStarField`) create many individual meshes or lines. As the world grows, draw-call count will dominate frame time more than triangle count.

**Pattern:**
- `THREE.InstancedMesh` for repeated identical objects (trees, clouds, fence posts, runway lights).
- `THREE.BatchedMesh` (r156+) for objects that share a material but have different geometries.
- Share materials across meshes; avoid `new Material()` per instance.

```ts
const treeGeo = new THREE.ConeGeometry(1, 4, 8);
const treeMat = new THREE.MeshStandardMaterial({ color: 0x2d4c33 });
const trees = new THREE.InstancedMesh(treeGeo, treeMat, 200);
const dummy = new THREE.Object3D();

for (let i = 0; i < 200; i++) {
  dummy.position.set(x[i], y[i], z[i]);
  dummy.scale.setScalar(scale[i]);
  dummy.updateMatrix();
  trees.setMatrixAt(i, dummy.matrix);
}
world.add(trees);
```

**Integration:**
- Convert `makeCloudBank`, `makeTreeLine`, and beacon masts to instanced meshes.
- Keep the ground plane, terrain, and runway as merged static geometry where possible.
- Monitor `renderer.info.render.calls` and aim for under 100 draw calls on desktop, under 60 on mobile.

---

## 6. Evaluate WebGPU Renderer (Future-Ready, Not Urgent)

**Why:** The project is on `three@0.181.2`. Since r171, Three.js ships `WebGPURenderer` with zero bundler config and automatic WebGL 2 fallback.

**When it helps:**
- High draw-call counts (instanced scenery, many vectors/HUD elements).
- Compute-heavy effects: GPU particle systems, procedural terrain, or real-time GPS-jamming noise fields.
- Lower CPU overhead and better multi-view / XR potential.

**Pattern:**

```ts
import { WebGPURenderer } from 'three/webgpu';

const renderer = new WebGPURenderer({ antialias: true, powerPreference: 'high-performance' });
await renderer.init();
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
```

**Trade-off / pitfall:**
- WebGPU requires async initialization; every first render must happen after `await renderer.init()`.
- Early 2025 benchmarks showed Three.js WebGPU could be *slower* than WebGL for thousands of unique, non-instanced objects because of UBO binding overhead. The fix is instancing/batching, not raw WebGPU.
- If current WebGL performance is acceptable, treat WebGPU as a later migration. Don't switch just for the label.

---

## 7. Implement Adaptive Quality Tiers

**Why:** A simulator must run on desktop, mid-range laptops, and tablets. The current code caps pixel ratio at 2 and always renders the full scene.

**Pattern:**

```ts
const perf = {
  tier: 'high',           // high | medium | low
  pixelRatio: Math.min(window.devicePixelRatio, 2),
  shadowMapSize: 2048,
  effects: true,
};

function detectTier() {
  const gl = renderer.getContext();
  const debug = gl.getExtension('WEBGL_debug_renderer_info');
  // or use frame-time heuristics after a few seconds
  if (window.innerWidth < 900 || navigator.hardwareConcurrency <= 4) {
    perf.tier = 'low';
    perf.pixelRatio = 1;
    perf.shadowMapSize = 512;
    perf.effects = false;
  }
  renderer.setPixelRatio(perf.pixelRatio);
}
```

**Integration:**
- Toggle post-processing, fog density, scenery instance count, and shadow quality based on `perf.tier`.
- Add an on-screen FPS/MS graph (`stats-gl`) in dev mode and expose a manual quality selector in the UI.
- Cap `devicePixelRatio` aggressively on high-DPI mobile screens.

---

## 8. Modularize the Single-File `main.ts`

**Why:** At ~1,955 lines, `main.ts` is becoming a monolith. Manual flight, jamming, post-processing, and gamepad input will make it unmanageable.

**Suggested module split under `uav-viewer/src/`:**

```
src/
  main.ts                 // bootstrap, loop orchestration, top-level state
  renderer.ts             // WebGL/WebGPU renderer + composer setup
  scene/
    world.ts              // sky, ground, scenery, instanced objects
    drone.ts              // drone group + rotor animation
    camera.ts             // chase / orbit / top / command presets
  flight/
    replay.ts             // Arrow IPC loading + replay sampling
    physics.ts            // manual flight model + state
    jamming.ts            // GPS-jamming logic + telemetry degradation
  input/
    keyboard.ts
    gamepad.ts
    input-manager.ts      // unified intent
  hud/
    readout.ts
    effects-overlay.ts
  utils/
    pool.ts               // Vector3 / object pools
    math.ts               // toScene, deadzone, clamp helpers
```

**Integration:**
- Keep the public API of each module small.
- Pass shared state explicitly rather than relying on top-level module variables.
- Add unit tests for `physics.ts` and `jamming.ts` using the existing `playwright-core` setup if possible.

---

## Quick Implementation Priority

1. **Fixed-timestep loop** — foundation for deterministic manual flight.
2. **Input layer** — keyboard + gamepad, with deadzone and edge detection.
3. **Vector pooling** — remove per-frame `new THREE.Vector3()` allocations.
4. **Post-processing FX** — chromatic aberration, noise, vignette for jamming.
5. **Instancing** — scenery draw-call reduction.
6. **Modular split** — keep the file maintainable as features grow.
7. **WebGPU / adaptive quality** — measure first, then decide.

---

## Key Pitfalls to Avoid

- **Don't switch to WebGPU without profiling.** It is not universally faster and adds async complexity.
- **Don't poll gamepads before `gamepadconnected`.** `getGamepads()` returns an empty array until the user presses a button.
- **Don't create objects in the render/simulation loop.** GC pauses are the most common cause of "micro-stutter" in browser 3D apps.
- **Don't use native `antialias: true` when using `EffectComposer`.** MSAA is bypassed; use SMAA/FXAA or `postprocessing` antialiasing instead.
- **Don't forget disposal.** Geometries, materials, textures, render targets, and composer passes all need explicit `.dispose()` when replaced (e.g., on new Arrow file drop).
- **Don't make diagonal keyboard input faster.** Normalize `intent.move` before applying it to velocity.
