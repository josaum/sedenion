import "./style.css";
import { tableFromIPC, type Table, type Vector } from "apache-arrow";
import * as THREE from "three";
import { InputManager, type FlightCommand } from "./input";
import { DronePhysics } from "./physics";
import { Jamming } from "./jamming";
import {
  bindModeButtons,
  updateModeBanner,
  updateControllerStatus,
  updateGpsReadout,
  showHelp,
  hideHelp,
  type AppMode,
  type GpsState,
} from "./ui";

type FlightColumns = {
  label: string;
  bytes: number;
  t: Float64Array;
  ax: Float32Array;
  ay: Float32Array;
  az: Float32Array;
  px: Float32Array;
  py: Float32Array;
  pz: Float32Array;
  vx: Float32Array;
  vy: Float32Array;
  vz: Float32Array;
  gx?: Float32Array;
  gy?: Float32Array;
  gz?: Float32Array;
  length: number;
  duration: number;
  bounds: {
    cx: number;
    cz: number;
    minH: number;
    scale: number;
    radius: number;
  };
};

type CameraPreset = "chase" | "orbit" | "top" | "command" | "fpv";
type LayerName = "trajectory" | "vectors" | "airspace" | "range";
type MissionPhase = "acquisition" | "tracking" | "assessment" | "recovery";

// Auto-fit transform: maps a flight's physical extent (meters) into a fixed
// scene size so a 4 m indoor hop and a 400 m dead-reckon both frame well.
const SCENE_SPAN = 150; // target scene units for the larger horizontal extent
const GROUND_CLEAR = 0.6; // scene units the lowest point sits above the grid
const TRAIL_TARGET_POINTS = 1400;
let viewScale = 1;
let viewCx = 0;
let viewCz = 0;
let viewMinH = 0;

// Physical (px, py, pz) [m] -> scene coords, with pz as up and z = -py.
function toScene(px: number, py: number, pz: number): THREE.Vector3 {
  return new THREE.Vector3(
    (px - viewCx) * viewScale,
    (pz - viewMinH) * viewScale + GROUND_CLEAR,
    (-py - viewCz) * viewScale,
  );
}

const canvas = document.querySelector<HTMLCanvasElement>("#scene")!;
const app = document.querySelector<HTMLDivElement>("#app")!;
const stats = document.querySelector<HTMLDivElement>("#stats")!;
const readout = document.querySelector<HTMLDivElement>("#readout")!;
const drop = document.querySelector<HTMLDivElement>("#drop")!;
const instrument = document.querySelector<HTMLDivElement>("#instrument")!;
const missionPhase =
  document.querySelector<HTMLParagraphElement>("#missionPhase")!;
const hudPhase = document.querySelector<HTMLElement>("#hudPhase")!;
const hudSpeed = document.querySelector<HTMLElement>("#hudSpeed")!;
const hudAlt = document.querySelector<HTMLElement>("#hudAlt")!;
const hudDrift = document.querySelector<HTMLElement>("#hudDrift")!;
const hudLink = document.querySelector<HTMLElement>("#hudLink")!;
const playPause = document.querySelector<HTMLButtonElement>("#playPause")!;
const presentationMode =
  document.querySelector<HTMLButtonElement>("#presentationMode")!;
const speedInput = document.querySelector<HTMLInputElement>("#speed")!;
const playbackRate =
  document.querySelector<HTMLOutputElement>("#playbackRate")!;
const scrubInput = document.querySelector<HTMLInputElement>("#scrub")!;
const cameraButtons = Array.from(
  document.querySelectorAll<HTMLButtonElement>("[data-camera]"),
);
const layerButtons = Array.from(
  document.querySelectorAll<HTMLButtonElement>("[data-layer]"),
);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: "high-performance",
  preserveDrawingBuffer: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0xc7e7f1, 1);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xc7e7f1);
scene.fog = new THREE.FogExp2(0xc5dfdc, 0.00115);

const camera = new THREE.PerspectiveCamera(54, 1, 0.1, 2000);
camera.position.set(-42, 32, -58);

const ambient = new THREE.HemisphereLight(0xfffff4, 0x748063, 2.55);
scene.add(ambient);
const sun = new THREE.DirectionalLight(0xfff1cf, 3.75);
sun.position.set(-110, 160, 90);
scene.add(sun);
const rim = new THREE.DirectionalLight(0xc7f3ff, 1.0);
rim.position.set(95, 80, -140);
scene.add(rim);

const world = new THREE.Group();
scene.add(world);

const sky = makeSky();
scene.add(sky);

const animatedScenery: THREE.Object3D[] = [];
const beaconMaterials: THREE.MeshBasicMaterial[] = [];

const grid = new THREE.GridHelper(560, 56, 0xb5bda7, 0x81907c);
grid.position.y = -0.035;
world.add(grid);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(580, 580),
  new THREE.MeshStandardMaterial({
    color: 0x818c63,
    roughness: 0.94,
    metalness: 0.02,
  }),
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.08;
world.add(ground);
const terrain = makeTerrain();
world.add(terrain);
const scenery = makeScenery();
world.add(scenery);
const airspace = makeAirspace();
world.add(airspace);

const rotorBlades: THREE.Mesh[] = [];
const drone = makeDrone();
scene.add(drone);

const ghost = new THREE.Mesh(
  new THREE.SphereGeometry(1.1, 16, 8),
  new THREE.MeshBasicMaterial({
    color: 0x67d3ba,
    transparent: true,
    opacity: 0.32,
  }),
);
scene.add(ghost);
const altitudeLine = makeVectorLine(0x9af7df, 0.38);
scene.add(altitudeLine);
const velocityVector = makeVectorLine(0x77ead1, 0.85);
const accelVector = makeVectorLine(0xd7ad55, 0.55);
scene.add(velocityVector, accelVector);

let trail: THREE.Line | null = null;
let trailGlow: THREE.Line | null = null;
let truthTrail: THREE.Line | null = null;
let startMarker: THREE.Object3D | null = null;
let endMarker: THREE.Object3D | null = null;
let current: FlightColumns | null = null;
let cursor = 0;
let playing = true;
let cameraPreset: CameraPreset = "orbit";
let lastFrame = performance.now();
let orbitYaw = -0.95;
let orbitPitch = 0.32;
let orbitDistance = 112;
let pointerDrag: { id: number; x: number; y: number } | null = null;
let raf = 0;
let presentation = false;
const layerState: Record<LayerName, boolean> = {
  trajectory: true,
  vectors: true,
  airspace: true,
  range: true,
};

let appMode: AppMode = "demo";
const input = new InputManager();
const physics = new DronePhysics();
const jamming = new Jamming(document.body);
const manualStartPosition = new THREE.Vector3();
let manualStartCursor = 0;
const helpOverlay = document.getElementById("helpOverlay");

function makeSky(): THREE.Group {
  const g = new THREE.Group();
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#d3f0ff");
  gradient.addColorStop(0.24, "#a7d8f1");
  gradient.addColorStop(0.6, "#b8d7c4");
  gradient.addColorStop(1, "#efdca3");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(900, 32, 16),
    new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide,
      fog: false,
    }),
  );
  mesh.position.y = -80;
  g.add(mesh);

  const sun = new THREE.Mesh(
    new THREE.CircleGeometry(38, 48),
    new THREE.MeshBasicMaterial({
      color: 0xfff4cc,
      transparent: true,
      opacity: 1,
      fog: false,
      depthWrite: false,
    }),
  );
  sun.position.set(-250, 210, -520);
  sun.rotation.y = 0.48;
  g.add(sun);

  const sunHalo = new THREE.Mesh(
    new THREE.CircleGeometry(134, 48),
    new THREE.MeshBasicMaterial({
      color: 0xffe7ad,
      transparent: true,
      opacity: 0.2,
      fog: false,
      depthWrite: false,
    }),
  );
  sunHalo.position.copy(sun.position);
  sunHalo.rotation.copy(sun.rotation);
  g.add(sunHalo);

  g.add(makeHorizonGlow());
  g.add(makeDistantHorizon());
  g.add(makeCloudBank());
  g.add(makeContrails());
  g.add(makeAtmosphereBands());
  return g;
}

function makeHorizonGlow(): THREE.Group {
  const g = new THREE.Group();
  const warm = makeVerticalFadePlane(1040, 92, [
    [0, "rgba(255, 224, 155, 0)"],
    [0.42, "rgba(255, 216, 128, 0.2)"],
    [1, "rgba(255, 216, 128, 0)"],
  ]);
  warm.position.set(-60, 34, -520);
  warm.rotation.x = -0.08;
  g.add(warm);

  const cool = makeVerticalFadePlane(1040, 120, [
    [0, "rgba(192, 242, 246, 0)"],
    [0.5, "rgba(192, 242, 246, 0.16)"],
    [1, "rgba(192, 242, 246, 0)"],
  ]);
  cool.position.set(80, 62, -540);
  cool.rotation.x = -0.08;
  g.add(cool);

  const line = new THREE.Mesh(
    new THREE.PlaneGeometry(1080, 2.2),
    new THREE.MeshBasicMaterial({
      color: 0xfff1ba,
      transparent: true,
      opacity: 0.2,
      fog: false,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  );
  line.position.set(0, 25, -515);
  line.rotation.x = -0.08;
  g.add(line);
  return g;
}

function makeVerticalFadePlane(
  width: number,
  height: number,
  stops: Array<[number, string]>,
): THREE.Mesh {
  const canvas = document.createElement("canvas");
  canvas.width = 8;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  for (const [offset, color] of stops) gradient.addColorStop(offset, color);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      fog: false,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  );
  mesh.renderOrder = -10;
  return mesh;
}

function makeDistantHorizon(): THREE.Group {
  const g = new THREE.Group();
  const rng = mulberry32(6104);
  const mats = [
    new THREE.MeshBasicMaterial({
      color: 0x55725d,
      transparent: true,
      opacity: 0.48,
      fog: false,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
    new THREE.MeshBasicMaterial({
      color: 0x7f9578,
      transparent: true,
      opacity: 0.34,
      fog: false,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  ];
  for (let layer = 0; layer < 2; layer++) {
    const points: THREE.Vector2[] = [new THREE.Vector2(-520, -12)];
    for (let i = 0; i <= 28; i++) {
      const x = -520 + (i / 28) * 1040;
      const y = 2 + layer * 5 + Math.sin(i * 0.7 + layer) * 4 + rng() * 8;
      points.push(new THREE.Vector2(x, y));
    }
    points.push(new THREE.Vector2(520, -12));
    const ridge = new THREE.Mesh(
      new THREE.ShapeGeometry(new THREE.Shape(points)),
      mats[layer],
    );
    ridge.position.set(0, 10 + layer * 6, -560 - layer * 42);
    g.add(ridge);
  }
  return g;
}

function makeCloudBank(): THREE.Group {
  const g = new THREE.Group();
  const rng = mulberry32(4229);
  const mats = [
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.28,
      fog: false,
      depthWrite: false,
    }),
    new THREE.MeshBasicMaterial({
      color: 0xe2f3f6,
      transparent: true,
      opacity: 0.16,
      fog: false,
      depthWrite: false,
    }),
  ];
  for (let i = 0; i < 30; i++) {
    const high = i % 3 === 0;
    const cloud = new THREE.Mesh(
      new THREE.SphereGeometry(1, 12, 6),
      high ? mats[1] : mats[0],
    );
    cloud.position.set(
      -430 + rng() * 860,
      98 + rng() * (high ? 150 : 70),
      -460 + rng() * 180,
    );
    cloud.scale.set(22 + rng() * 74, 2.6 + rng() * 7, 7 + rng() * 24);
    cloud.rotation.y = rng() * Math.PI;
    g.add(cloud);
  }
  return g;
}

function makeContrails(): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.36,
    fog: false,
  });
  const rng = mulberry32(8181);
  for (let i = 0; i < 7; i++) {
    const y = 125 + rng() * 185;
    const z = -380 - rng() * 210;
    const x = -390 + rng() * 780;
    const length = 120 + rng() * 210;
    const rise = -12 + rng() * 24;
    const points = [
      new THREE.Vector3(x, y, z),
      new THREE.Vector3(x + length * 0.5, y + rise * 0.45, z - 18 - rng() * 28),
      new THREE.Vector3(x + length, y + rise, z - 34 - rng() * 36),
    ];
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      mat,
    );
    line.rotation.y = -0.18 + rng() * 0.36;
    g.add(line);
  }
  return g;
}

function makeAtmosphereBands(): THREE.Group {
  const g = new THREE.Group();
  const colors = [0xc7f3ff, 0xffd37a, 0xffffff];
  for (let i = 0; i < 3; i++) {
    const band = new THREE.Mesh(
      new THREE.RingGeometry(
        520 + i * 38,
        522 + i * 38,
        96,
        1,
        Math.PI * 0.08,
        Math.PI * 0.84,
      ),
      new THREE.MeshBasicMaterial({
        color: colors[i],
        transparent: true,
        opacity: 0.045 - i * 0.007,
        fog: false,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    band.position.set(-80 + i * 70, 64 + i * 24, -560);
    band.rotation.x = Math.PI * 0.5;
    band.rotation.z = -0.06 + i * 0.08;
    g.add(band);
  }
  return g;
}

function makeStarField(): THREE.Points {
  const rng = mulberry32(9182);
  const count = 260;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = rng() * Math.PI * 2;
    const radius = 620 + rng() * 210;
    positions[i * 3] = Math.cos(theta) * radius;
    positions[i * 3 + 1] = 135 + rng() * 340;
    positions[i * 3 + 2] = Math.sin(theta) * radius;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      color: 0xdafff4,
      size: 1.2,
      transparent: true,
      opacity: 0.24,
      fog: false,
      depthWrite: false,
    }),
  );
}

function makeAirspace(): THREE.Group {
  const g = new THREE.Group();
  const padMat = new THREE.MeshStandardMaterial({
    color: 0x2f3b32,
    roughness: 0.8,
    metalness: 0.02,
  });
  const pad = new THREE.Mesh(new THREE.RingGeometry(8, 10.5, 64), padMat);
  pad.rotation.x = -Math.PI / 2;
  pad.position.y = 0.03;
  g.add(pad);

  const lineMat = new THREE.LineBasicMaterial({
    color: 0xd7ad55,
    transparent: true,
    opacity: 0.42,
  });
  for (const radius of [35, 70, 105, 140]) {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2);
    const points = curve
      .getPoints(128)
      .map((p) => new THREE.Vector3(p.x, 0.04, p.y));
    g.add(
      new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(points),
        lineMat,
      ),
    );
  }

  const mastMat = new THREE.LineBasicMaterial({
    color: 0x6fd8c5,
    transparent: true,
    opacity: 0.28,
  });
  const mastGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 90, 0),
  ]);
  g.add(new THREE.Line(mastGeo, mastMat));

  const runwayMat = new THREE.MeshBasicMaterial({
    color: 0xd7ad55,
    transparent: true,
    opacity: 0.12,
    depthWrite: false,
  });
  const runway = new THREE.Mesh(new THREE.PlaneGeometry(8, 180), runwayMat);
  runway.rotation.x = -Math.PI / 2;
  runway.rotation.z = Math.PI / 5;
  runway.position.y = 0.02;
  g.add(runway);
  return g;
}

function makeScenery(): THREE.Group {
  const g = new THREE.Group();
  g.add(makeFieldBands());
  g.add(makeRunwayDeck());
  g.add(makeHangars());
  g.add(makeOperationsCluster());
  g.add(makeSensorArray());
  g.add(makePerimeter());
  g.add(makeSearchlightFan());
  g.add(makeBeaconMasts());
  g.add(makeTreeLine());
  return g;
}

function makeFieldBands(): THREE.Group {
  const g = new THREE.Group();
  const strips = [
    { x: -185, z: 70, w: 74, d: 330, color: 0x34402c, opacity: 0.42 },
    { x: -112, z: 85, w: 44, d: 300, color: 0x263c3b, opacity: 0.36 },
    { x: 150, z: 88, w: 62, d: 320, color: 0x3b3127, opacity: 0.34 },
    { x: 218, z: 62, w: 34, d: 260, color: 0x263241, opacity: 0.28 },
  ];
  for (const strip of strips) {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(strip.w, strip.d),
      new THREE.MeshBasicMaterial({
        color: strip.color,
        transparent: true,
        opacity: strip.opacity,
        depthWrite: false,
      }),
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(strip.x, -0.055, strip.z);
    g.add(mesh);
  }

  const rowMat = new THREE.LineBasicMaterial({
    color: 0xa4b59f,
    transparent: true,
    opacity: 0.12,
  });
  for (let x = -220; x <= 235; x += 22) {
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, 0.015, -110),
        new THREE.Vector3(x + 28, 0.015, 230),
      ]),
      rowMat,
    );
    g.add(line);
  }
  return g;
}

function makeRunwayDeck(): THREE.Group {
  const g = new THREE.Group();
  g.rotation.y = -Math.PI / 5;

  const runway = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 190),
    new THREE.MeshStandardMaterial({
      color: 0x1d2321,
      roughness: 0.86,
      metalness: 0.03,
    }),
  );
  runway.rotation.x = -Math.PI / 2;
  runway.position.y = -0.03;
  g.add(runway);

  const shoulderMat = new THREE.MeshBasicMaterial({
    color: 0xb8c5b7,
    transparent: true,
    opacity: 0.08,
    depthWrite: false,
  });
  for (const x of [-11.4, 11.4]) {
    const shoulder = new THREE.Mesh(
      new THREE.PlaneGeometry(0.6, 176),
      shoulderMat,
    );
    shoulder.rotation.x = -Math.PI / 2;
    shoulder.position.set(x, 0.015, 0);
    g.add(shoulder);
  }

  const markingMat = new THREE.MeshBasicMaterial({
    color: 0xf1e6ca,
    transparent: true,
    opacity: 0.72,
    depthWrite: false,
  });
  for (let z = -70; z <= 70; z += 28) {
    const dash = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 10), markingMat);
    dash.rotation.x = -Math.PI / 2;
    dash.position.set(0, 0.02, z);
    g.add(dash);
  }
  for (const z of [-84, 84]) {
    for (const x of [-5.2, -2.6, 2.6, 5.2]) {
      const bar = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 10), markingMat);
      bar.rotation.x = -Math.PI / 2;
      bar.position.set(x, 0.022, z);
      g.add(bar);
    }
  }

  const lightMat = new THREE.MeshBasicMaterial({
    color: 0x77ead1,
    transparent: true,
    opacity: 0.78,
  });
  for (let z = -88; z <= 88; z += 16) {
    for (const x of [-10.2, 10.2]) {
      const light = new THREE.Mesh(
        new THREE.BoxGeometry(0.42, 0.18, 0.42),
        lightMat,
      );
      light.position.set(x, 0.12, z);
      g.add(light);
    }
  }

  const apron = new THREE.Mesh(
    new THREE.PlaneGeometry(46, 32),
    new THREE.MeshStandardMaterial({
      color: 0x242a28,
      roughness: 0.88,
      metalness: 0.02,
    }),
  );
  apron.rotation.x = -Math.PI / 2;
  apron.position.set(-42, -0.025, -62);
  g.add(apron);
  return g;
}

function makeHangars(): THREE.Group {
  const g = new THREE.Group();
  g.rotation.y = -Math.PI / 5;
  g.add(makeHangar(-56, -72, 18, 20, 6, 0x303a3d, 0x596064));
  g.add(makeHangar(-35, -77, 14, 16, 4.8, 0x352f29, 0x685f4f));
  g.add(makeHangar(-63, -46, 12, 12, 4.4, 0x26383a, 0x4d6562));

  const vehicleMat = new THREE.MeshStandardMaterial({
    color: 0xd7ad55,
    roughness: 0.48,
    metalness: 0.08,
  });
  for (const [x, z] of [
    [-35, -54],
    [-49, -55],
    [-58, -33],
  ] as const) {
    const vehicle = new THREE.Mesh(
      new THREE.BoxGeometry(3.8, 1.3, 2.1),
      vehicleMat,
    );
    vehicle.position.set(x, 0.72, z);
    g.add(vehicle);
  }
  return g;
}

function makeHangar(
  x: number,
  z: number,
  width: number,
  depth: number,
  height: number,
  wallColor: number,
  roofColor: number,
): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshStandardMaterial({
      color: wallColor,
      roughness: 0.72,
      metalness: 0.08,
    }),
  );
  body.position.y = height * 0.5;
  const roof = new THREE.Mesh(
    new THREE.CylinderGeometry(
      width * 0.58,
      width * 0.58,
      depth + 1.2,
      3,
      1,
      false,
    ),
    new THREE.MeshStandardMaterial({
      color: roofColor,
      roughness: 0.64,
      metalness: 0.12,
    }),
  );
  roof.rotation.x = Math.PI / 2;
  roof.rotation.z = Math.PI / 2;
  roof.position.y = height + 1.15;
  const door = new THREE.Mesh(
    new THREE.PlaneGeometry(width * 0.58, height * 0.58),
    new THREE.MeshBasicMaterial({
      color: 0x151a19,
      transparent: true,
      opacity: 0.72,
    }),
  );
  door.position.set(0, height * 0.42, depth * 0.505);
  g.add(body, roof, door);
  g.position.set(x, 0, z);
  return g;
}

function makeOperationsCluster(): THREE.Group {
  const g = new THREE.Group();
  g.rotation.y = -Math.PI / 5;

  const towerMat = new THREE.MeshStandardMaterial({
    color: 0x283638,
    roughness: 0.68,
    metalness: 0.12,
  });
  const glassMat = new THREE.MeshBasicMaterial({
    color: 0x8ff4dc,
    transparent: true,
    opacity: 0.26,
  });
  const consoleMat = new THREE.MeshBasicMaterial({
    color: 0xd7ad55,
    transparent: true,
    opacity: 0.46,
  });

  const shaft = new THREE.Mesh(new THREE.BoxGeometry(5.4, 16, 5.4), towerMat);
  shaft.position.set(-86, 8, -34);
  const cab = new THREE.Mesh(new THREE.BoxGeometry(12.5, 5.2, 9.5), towerMat);
  cab.position.set(-86, 18.9, -34);
  const glass = new THREE.Mesh(new THREE.BoxGeometry(12.8, 2.2, 9.8), glassMat);
  glass.position.set(-86, 19.8, -34);
  const antenna = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-86, 21.8, -34),
      new THREE.Vector3(-86, 34, -34),
    ]),
    new THREE.LineBasicMaterial({
      color: 0xb9d6ca,
      transparent: true,
      opacity: 0.52,
    }),
  );
  g.add(shaft, cab, glass, antenna);

  for (let i = 0; i < 4; i++) {
    const console = new THREE.Mesh(
      new THREE.PlaneGeometry(5.8, 1.6),
      consoleMat,
    );
    console.rotation.x = -Math.PI / 2;
    console.position.set(-104 + i * 7.5, 0.08, -23);
    g.add(console);
  }

  const briefingMat = new THREE.MeshBasicMaterial({
    color: 0x111716,
    transparent: true,
    opacity: 0.72,
  });
  const screenMat = new THREE.MeshBasicMaterial({
    color: 0x75efd4,
    transparent: true,
    opacity: 0.2,
  });
  for (let i = 0; i < 3; i++) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 7, 9), briefingMat);
    wall.position.set(-112 + i * 10, 3.5, -14);
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(6, 3.2), screenMat);
    screen.position.set(-112 + i * 10, 4.5, -13.82);
    g.add(wall, screen);
  }

  return g;
}

function makeSensorArray(): THREE.Group {
  const g = new THREE.Group();
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x252f2f,
    roughness: 0.72,
    metalness: 0.14,
  });
  const panelMat = new THREE.MeshStandardMaterial({
    color: 0x47585b,
    roughness: 0.55,
    metalness: 0.18,
  });
  const dishMat = new THREE.MeshStandardMaterial({
    color: 0x61706e,
    roughness: 0.5,
    metalness: 0.16,
    side: THREE.DoubleSide,
  });
  const sweepMat = new THREE.MeshBasicMaterial({
    color: 0x73efd3,
    transparent: true,
    opacity: 0.16,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const radarBase = new THREE.Mesh(
    new THREE.CylinderGeometry(5.8, 7.6, 3.2, 28),
    baseMat,
  );
  radarBase.position.set(88, 1.6, -72);
  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(1.6, 2.2, 9.5, 18),
    baseMat,
  );
  pedestal.position.set(88, 7.7, -72);
  const dishPivot = new THREE.Group();
  dishPivot.position.set(88, 14.2, -72);
  const dish = new THREE.Mesh(
    new THREE.SphereGeometry(7.2, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.44),
    dishMat,
  );
  dish.rotation.x = Math.PI * 0.5;
  dish.rotation.z = -0.28;
  dish.scale.z = 0.42;
  dishPivot.add(dish);
  animatedScenery.push(dishPivot);
  g.add(radarBase, pedestal, dishPivot);

  const sweep = new THREE.Mesh(
    new THREE.CircleGeometry(96, 64, 0, Math.PI * 0.38),
    sweepMat,
  );
  sweep.rotation.x = -Math.PI / 2;
  sweep.position.set(88, 0.07, -72);
  animatedScenery.push(sweep);
  g.add(sweep);

  const radome = new THREE.Mesh(
    new THREE.SphereGeometry(11, 28, 12, 0, Math.PI * 2, 0, Math.PI * 0.5),
    new THREE.MeshBasicMaterial({
      color: 0x9ff6e4,
      transparent: true,
      opacity: 0.08,
      depthWrite: false,
    }),
  );
  radome.position.set(127, 0, -45);
  g.add(radome);

  for (let i = 0; i < 5; i++) {
    const panel = new THREE.Mesh(new THREE.BoxGeometry(9, 0.32, 5), panelMat);
    panel.position.set(110 + i * 9.5, 1.1, -24 + Math.sin(i) * 4);
    panel.rotation.z = -0.42;
    panel.rotation.y = -0.18;
    g.add(panel);
  }

  return g;
}

function makePerimeter(): THREE.Group {
  const g = new THREE.Group();
  const postMat = new THREE.MeshStandardMaterial({
    color: 0x46514e,
    roughness: 0.76,
    metalness: 0.12,
  });
  const wireMat = new THREE.LineBasicMaterial({
    color: 0x9eb5ad,
    transparent: true,
    opacity: 0.2,
  });
  const lightMat = new THREE.MeshBasicMaterial({
    color: 0x73efd3,
    transparent: true,
    opacity: 0.78,
  });
  const points = [
    new THREE.Vector3(-150, 0.1, -125),
    new THREE.Vector3(155, 0.1, -125),
    new THREE.Vector3(185, 0.1, 130),
    new THREE.Vector3(-180, 0.1, 145),
  ];
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    const span = a.distanceTo(b);
    const posts = Math.floor(span / 18);
    for (let j = 0; j <= posts; j++) {
      const t = j / posts;
      const p = a.clone().lerp(b, t);
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.22, 2.2, 6),
        postMat,
      );
      post.position.set(p.x, 1.1, p.z);
      g.add(post);
      if (j % 4 === 0) {
        const beacon = new THREE.Mesh(
          new THREE.BoxGeometry(0.5, 0.18, 0.5),
          lightMat,
        );
        beacon.position.set(p.x, 2.36, p.z);
        g.add(beacon);
      }
    }
    for (const y of [1.0, 1.7]) {
      g.add(
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(a.x, y, a.z),
            new THREE.Vector3(b.x, y, b.z),
          ]),
          wireMat,
        ),
      );
    }
  }
  return g;
}

function makeSearchlightFan(): THREE.Group {
  const g = new THREE.Group();
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xfff1c4,
    transparent: true,
    opacity: 0.018,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  for (const [x, z, rot] of [
    [-132, 118, -0.65],
    [152, 110, 0.82],
  ] as const) {
    const tower = new THREE.Mesh(
      new THREE.CylinderGeometry(0.7, 1.1, 5.5, 8),
      new THREE.MeshStandardMaterial({
        color: 0x2b3533,
        roughness: 0.76,
        metalness: 0.14,
      }),
    );
    tower.position.set(x, 2.75, z);
    const beam = new THREE.Mesh(
      new THREE.ConeGeometry(10, 110, 4, 1, true),
      beamMat,
    );
    beam.position.set(x, 28, z);
    beam.rotation.x = Math.PI * 0.5;
    beam.rotation.z = rot;
    beam.scale.x = 0.28;
    animatedScenery.push(beam);
    g.add(tower, beam);
  }
  return g;
}

function makeBeaconMasts(): THREE.Group {
  const g = new THREE.Group();
  const mastMat = new THREE.LineBasicMaterial({
    color: 0xb9d6ca,
    transparent: true,
    opacity: 0.46,
  });
  const lightMat = new THREE.MeshBasicMaterial({
    color: 0xd7ad55,
    transparent: true,
    opacity: 0.86,
  });
  for (const [x, z, h] of [
    [-120, 88, 34],
    [112, -96, 28],
    [142, 132, 42],
  ] as const) {
    const mast = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, 0, z),
        new THREE.Vector3(x, h, z),
      ]),
      mastMat,
    );
    const cross = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x - 4, h - 3, z),
        new THREE.Vector3(x + 4, h - 3, z),
      ]),
      mastMat,
    );
    const lamp = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.8, 1.1), lightMat);
    lamp.position.set(x, h, z);
    beaconMaterials.push(lightMat);
    g.add(mast, cross, lamp);
  }
  return g;
}

function makeTreeLine(): THREE.Group {
  const g = new THREE.Group();
  const rng = mulberry32(7721);
  const trunk = new THREE.InstancedMesh(
    new THREE.CylinderGeometry(0.18, 0.26, 1.4, 5),
    new THREE.MeshStandardMaterial({ color: 0x453627, roughness: 0.9 }),
    90,
  );
  const crown = new THREE.InstancedMesh(
    new THREE.ConeGeometry(1.25, 3.8, 7),
    new THREE.MeshStandardMaterial({ color: 0x17291f, roughness: 0.96 }),
    90,
  );
  const dummy = new THREE.Object3D();
  for (let i = 0; i < 90; i++) {
    const side = i % 3;
    const x =
      side === 0
        ? -260 + rng() * 520
        : (rng() < 0.5 ? -250 : 250) + (rng() - 0.5) * 16;
    const z = side === 0 ? 210 + (rng() - 0.5) * 34 : -180 + rng() * 370;
    const scale = 0.65 + rng() * 0.72;
    dummy.position.set(x, 0.7 * scale, z);
    dummy.rotation.y = rng() * Math.PI * 2;
    dummy.scale.setScalar(scale);
    dummy.updateMatrix();
    trunk.setMatrixAt(i, dummy.matrix);
    dummy.position.set(x, 2.35 * scale, z);
    dummy.rotation.y = rng() * Math.PI * 2;
    dummy.scale.setScalar(scale);
    dummy.updateMatrix();
    crown.setMatrixAt(i, dummy.matrix);
  }
  trunk.instanceMatrix.needsUpdate = true;
  crown.instanceMatrix.needsUpdate = true;
  g.add(trunk, crown);
  return g;
}

function makeTerrain(): THREE.Group {
  const g = new THREE.Group();
  const ridgeMat = new THREE.MeshStandardMaterial({
    color: 0x69775b,
    roughness: 0.98,
    metalness: 0.01,
  });
  const ridgeLineMat = new THREE.LineBasicMaterial({
    color: 0x9aa894,
    transparent: true,
    opacity: 0.34,
  });
  const rng = mulberry32(1247);
  for (let band = 0; band < 4; band++) {
    const z = -230 + band * 58;
    const points: THREE.Vector3[] = [];
    points.push(new THREE.Vector3(-290, -0.02, z + 55));
    for (let i = 0; i <= 18; i++) {
      const x = -290 + (i / 18) * 580;
      const y = 3 + band * 1.8 + rng() * 8;
      points.push(new THREE.Vector3(x, y, z + Math.sin(i * 0.85 + band) * 18));
    }
    points.push(new THREE.Vector3(290, -0.02, z + 55));
    const shape = new THREE.Shape(
      points.map((p) => new THREE.Vector2(p.x, p.z)),
    );
    const geo = new THREE.ShapeGeometry(shape);
    const mesh = new THREE.Mesh(geo, ridgeMat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -0.12 - band * 0.01;
    mesh.renderOrder = -4;
    g.add(mesh);
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points.slice(1, -1)),
      ridgeLineMat,
    );
    g.add(line);
  }
  return g;
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeVectorLine(color: number, opacity: number): THREE.Line {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(6), 3),
  );
  return new THREE.Line(
    geometry,
    new THREE.LineBasicMaterial({ color, transparent: true, opacity }),
  );
}

function makeDrone(): THREE.Group {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xf2eadc,
    roughness: 0.42,
    metalness: 0.32,
  });
  const accentMat = new THREE.MeshStandardMaterial({
    color: 0xd99b38,
    roughness: 0.46,
    metalness: 0.16,
  });
  const rotorMat = new THREE.MeshStandardMaterial({
    color: 0x121716,
    roughness: 0.5,
    metalness: 0.28,
  });
  const bladeMat = new THREE.MeshBasicMaterial({
    color: 0xb8fff0,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
  });
  const lightMat = new THREE.MeshBasicMaterial({ color: 0x6fd8c5 });
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
  });

  const body = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.75, 2.2), bodyMat);
  g.add(body);

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.7, 1.4, 4), accentMat);
  nose.rotation.z = -Math.PI / 2;
  nose.position.x = 2.6;
  g.add(nose);

  const armGeo = new THREE.BoxGeometry(7.8, 0.18, 0.18);
  const armA = new THREE.Mesh(armGeo, bodyMat);
  armA.rotation.y = Math.PI / 4;
  const armB = new THREE.Mesh(armGeo, bodyMat);
  armB.rotation.y = -Math.PI / 4;
  g.add(armA, armB);

  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const rotor = new THREE.Mesh(
        new THREE.CylinderGeometry(1.25, 1.25, 0.05, 32),
        rotorMat,
      );
      rotor.position.set(sx * 3.3, 0.18, sz * 3.3);
      rotor.scale.z = 0.32;
      const blade = new THREE.Mesh(
        new THREE.CircleGeometry(1.45, 36),
        bladeMat,
      );
      blade.rotation.x = -Math.PI / 2;
      blade.position.copy(rotor.position);
      blade.position.y += 0.05;
      rotorBlades.push(blade);
      g.add(rotor, blade);
    }
  }

  const beacon = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 12, 8),
    lightMat,
  );
  beacon.position.set(-1.75, 0.54, 0);
  const softShadow = new THREE.Mesh(
    new THREE.CircleGeometry(3.6, 40),
    shadowMat,
  );
  softShadow.rotation.x = -Math.PI / 2;
  softShadow.position.y = -0.46;
  g.add(beacon, softShadow);

  return g;
}

async function loadDefault() {
  // ?src=<url> deep-links an external Arrow IPC flight (e.g. the SISFRON
  // track export `/v2/sisfron/tracks/{id}/flight.arrow`); otherwise fall
  // back to the bundled default flight.
  const src = new URLSearchParams(window.location.search).get("src");
  const url = src ?? "/flights/nav-default.arrow";
  const label = src ?? "public/flights/nav-default.arrow";
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok)
      throw new Error(`${response.status} ${response.statusText}`);
    await loadResponse(response, label);
  } catch (error) {
    showError(
      src
        ? `Não foi possível carregar ${label}. Verifique o endpoint e o CORS.`
        : "Ainda não há arquivo Arrow padrão. Solte um .arrow ou execute o exportador.",
      error,
    );
  }
}

async function loadResponse(response: Response, label: string) {
  const bytes = await readResponseBytes(response, (loaded, total) => {
    const pct = total ? ` · ${Math.round((loaded / total) * 100)}%` : "";
    stats.textContent = `${label}\ncarregando ${(loaded / 1_048_576).toFixed(1)} MB${pct}`;
  });
  loadBuffer(
    bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
    label,
  );
}

function loadBuffer(buffer: ArrayBuffer, label: string) {
  const bytes = new Uint8Array(buffer);
  const table = tableFromIPC(bytes);
  current = columnsFromTable(table, label, bytes.byteLength);
  cursor = 0;
  buildTrail(current);
  fitWorld(current);
  updateStats(current);
}

async function readResponseBytes(
  response: Response,
  onProgress: (loaded: number, total: number | null) => void,
) {
  const total = Number(response.headers.get("content-length")) || null;
  const reader = response.body?.getReader();
  if (!reader) {
    const bytes = new Uint8Array(await response.arrayBuffer());
    onProgress(bytes.byteLength, bytes.byteLength);
    return bytes;
  }

  const chunks: Uint8Array[] = [];
  let loaded = 0;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    if (!value) continue;
    chunks.push(value);
    loaded += value.byteLength;
    onProgress(loaded, total);
  }

  const out = new Uint8Array(loaded);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return out;
}

function columnsFromTable(
  table: Table,
  label: string,
  bytes: number,
): FlightColumns {
  const f32 = (name: string) => {
    const col = table.getChild(name);
    if (!col) throw new Error(`missing Arrow column ${name}`);
    return vectorValues(col, Float32Array, name);
  };
  const f64 = (name: string) => {
    const col = table.getChild(name);
    if (!col) throw new Error(`missing Arrow column ${name}`);
    return vectorValues(col, Float64Array, name);
  };
  const t = f64("t");
  if (t.length < 2)
    throw new Error("O voo Arrow precisa de pelo menos duas linhas");
  const px = f32("px");
  const py = f32("py");
  const pz = f32("pz");
  const bounds = computeBounds(px, py, pz);
  const columns = {
    label,
    bytes,
    t,
    ax: f32("ax"),
    ay: f32("ay"),
    az: f32("az"),
    px,
    py,
    pz,
    vx: f32("vx"),
    vy: f32("vy"),
    vz: f32("vz"),
    gx: table.getChild("gx") ? f32("gx") : undefined,
    gy: table.getChild("gy") ? f32("gy") : undefined,
    gz: table.getChild("gz") ? f32("gz") : undefined,
    length: t.length,
    duration: t[t.length - 1] - t[0],
    bounds,
  };
  return columns;
}

function vectorValues<T extends Float32Array | Float64Array>(
  vector: Vector,
  ctor: {
    new (buffer: ArrayBufferLike, byteOffset: number, length: number): T;
  },
  name: string,
): T {
  if (vector.data.length === 1) {
    const values = vector.data[0].values;
    if (values instanceof ctor) return values as T;
  }
  const values = vector.toArray();
  if (values instanceof ctor) return values as T;
  throw new Error(`Arrow column ${name} is not ${ctor.name}`);
}

function computeBounds(px: Float32Array, py: Float32Array, pz: Float32Array) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  let minH = Infinity;
  let maxH = -Infinity;
  const step = Math.max(1, Math.floor(px.length / 4000));
  for (let i = 0; i < px.length; i += step) {
    minX = Math.min(minX, px[i]);
    maxX = Math.max(maxX, px[i]);
    minZ = Math.min(minZ, -py[i]);
    maxZ = Math.max(maxZ, -py[i]);
    minH = Math.min(minH, pz[i]);
    maxH = Math.max(maxH, pz[i]);
  }
  const cx = (minX + maxX) * 0.5;
  const cz = (minZ + maxZ) * 0.5;
  // Fit the larger horizontal extent (or vertical, if a near-vertical flight)
  // into SCENE_SPAN units.
  const extent = Math.max(maxX - minX, maxZ - minZ, maxH - minH, 0.5);
  const scale = THREE.MathUtils.clamp(SCENE_SPAN / extent, 0.04, 80);
  return {
    cx,
    cz,
    minH,
    scale,
    radius: Math.max(maxX - minX, maxZ - minZ, 0.5) * 0.5 * scale,
  };
}

function updateStats(flight: FlightColumns) {
  stats.innerHTML = `${flight.label}<br>${flight.length.toLocaleString("pt-BR")} linhas · ${flight.duration.toFixed(1)} s · ${(flight.bytes / 1_048_576).toFixed(1)} MB · Arrow IPC`;
}

function showError(message: string, error?: unknown) {
  console.error(error ?? message);
  stats.textContent = message;
}

function buildTrail(flight: FlightColumns) {
  if (trail) {
    world.remove(trail);
    trail.geometry.dispose();
    const mat = trail.material;
    if (!Array.isArray(mat)) mat.dispose();
  }
  if (trailGlow) {
    world.remove(trailGlow);
    trailGlow.geometry.dispose();
    const mat = trailGlow.material;
    if (!Array.isArray(mat)) mat.dispose();
  }
  if (truthTrail) {
    world.remove(truthTrail);
    truthTrail.geometry.dispose();
    const mat = truthTrail.material;
    if (!Array.isArray(mat)) mat.dispose();
  }
  for (const marker of [startMarker, endMarker]) {
    if (marker) world.remove(marker);
  }
  const step = Math.max(1, Math.floor(flight.length / TRAIL_TARGET_POINTS));
  const smoothRadius = Math.max(1, Math.floor(step * 3));
  const points = Math.ceil(flight.length / step);
  const positions = new Float32Array(points * 3);
  const colors = new Float32Array(points * 3);
  const cStart = new THREE.Color(0x77ead1);
  const cEnd = new THREE.Color(0xd7ad55);
  const tmp = new THREE.Color();
  let j = 0;
  let cj = 0;
  for (let i = 0; i < flight.length; i += step) {
    const v = smoothedScenePoint(
      flight.px,
      flight.py,
      flight.pz,
      i,
      smoothRadius,
    );
    positions[j++] = v.x;
    positions[j++] = v.y;
    positions[j++] = v.z;
    tmp
      .copy(cStart)
      .lerp(cEnd, flight.length > 1 ? i / (flight.length - 1) : 0);
    colors[cj++] = tmp.r;
    colors[cj++] = tmp.g;
    colors[cj++] = tmp.b;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions.subarray(0, j), 3),
  );
  geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(colors.subarray(0, cj), 3),
  );
  const glowGeometry = geometry.clone();
  trailGlow = new THREE.Line(
    glowGeometry,
    new THREE.LineBasicMaterial({
      color: 0xd7ad55,
      transparent: true,
      opacity: 0.08,
    }),
  );
  trail = new THREE.Line(
    geometry,
    new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.68,
    }),
  );
  world.add(trailGlow);
  world.add(trail);

  truthTrail = buildTruthTrail(flight, step, smoothRadius);
  if (truthTrail) world.add(truthTrail);

  startMarker = makeMarker(0x77ead1);
  endMarker = makeMarker(0xd7ad55);
  startMarker.position.copy(toScene(flight.px[0], flight.py[0], flight.pz[0]));
  const last = flight.length - 1;
  endMarker.position.copy(
    toScene(flight.px[last], flight.py[last], flight.pz[last]),
  );
  world.add(startMarker, endMarker);
  applyLayerVisibility();
}

function buildTruthTrail(
  flight: FlightColumns,
  step: number,
  smoothRadius: number,
): THREE.Line | null {
  if (!flight.gx || !flight.gy || !flight.gz) return null;
  const points = Math.ceil(flight.length / step);
  const positions = new Float32Array(points * 3);
  let j = 0;
  for (let i = 0; i < flight.length; i += step) {
    const v = smoothedScenePoint(
      flight.gx,
      flight.gy,
      flight.gz,
      i,
      smoothRadius,
    );
    positions[j++] = v.x;
    positions[j++] = v.y + 0.14;
    positions[j++] = v.z;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions.subarray(0, j), 3),
  );
  return new THREE.Line(
    geometry,
    new THREE.LineBasicMaterial({
      color: 0xdbe8d2,
      transparent: true,
      opacity: 0.24,
    }),
  );
}

function smoothedScenePoint(
  px: Float32Array,
  py: Float32Array,
  pz: Float32Array,
  index: number,
  radius: number,
): THREE.Vector3 {
  const start = Math.max(0, index - radius);
  const end = Math.min(px.length - 1, index + radius);
  let x = 0;
  let y = 0;
  let z = 0;
  let count = 0;
  for (let i = start; i <= end; i++) {
    x += px[i];
    y += py[i];
    z += pz[i];
    count++;
  }
  return toScene(x / count, y / count, z / count);
}

function sampleEvery(values: Float32Array, step: number) {
  const out: number[] = [];
  for (let i = 0; i < values.length; i += step) out.push(values[i]);
  return out;
}

function makeMarker(color: number): THREE.Object3D {
  const g = new THREE.Group();
  const mat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.82,
  });
  const ring = new THREE.Mesh(new THREE.RingGeometry(1.4, 1.75, 40), mat);
  ring.rotation.x = -Math.PI / 2;
  const post = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 4, 8),
    mat,
  );
  post.position.y = 2;
  g.add(ring, post);
  return g;
}

function applyLayerVisibility() {
  if (trail) trail.visible = layerState.trajectory;
  if (trailGlow) trailGlow.visible = layerState.trajectory;
  if (truthTrail) truthTrail.visible = layerState.trajectory;
  if (startMarker) startMarker.visible = layerState.trajectory;
  if (endMarker) endMarker.visible = layerState.trajectory;
  velocityVector.visible = layerState.vectors;
  accelVector.visible = layerState.vectors;
  altitudeLine.visible = layerState.vectors;
  instrument.style.opacity = layerState.vectors ? "" : "0";
  airspace.visible = layerState.airspace;
  ghost.visible = layerState.airspace;
  scenery.visible = layerState.range;
}

function updateCameraButtons() {
  for (const button of cameraButtons) {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.camera === cameraPreset),
    );
  }
}

function updateLayerButtons() {
  for (const button of layerButtons) {
    const layer = button.dataset.layer as LayerName | undefined;
    if (layer) button.setAttribute("aria-pressed", String(layerState[layer]));
  }
}

function updatePlaybackRate() {
  playbackRate.textContent = `${Number(speedInput.value).toFixed(2).replace(/\.00$/, "")}x`;
}

function updatePresentationMode() {
  app.classList.toggle("presentation", presentation);
  presentationMode.setAttribute("aria-pressed", String(presentation));
  presentationMode.textContent = presentation ? "Sair" : "Apresentação";
}

function findClosestSample(position: THREE.Vector3): number {
  if (!current) return 0;
  let bestIndex = 0;
  let bestDist = Infinity;
  const step = Math.max(1, Math.floor(current.length / 800));
  for (let i = 0; i < current.length; i += step) {
    const p = toScene(current.px[i], current.py[i], current.pz[i]);
    const d = p.distanceToSquared(position);
    if (d < bestDist) {
      bestDist = d;
      bestIndex = i;
    }
  }
  return current.t[bestIndex] - current.t[0];
}

function jammingToGpsState(): GpsState {
  return {
    fix: jamming.hasFix ? "3d" : "none",
    satellites: jamming.sats,
    jammed: jamming.active,
    hdop: jamming.epu,
  };
}

function setAppMode(mode: AppMode) {
  if (mode === appMode) return;

  const leavingManual = appMode === "manual" || appMode === "manual-jammed";
  const enteringManual = mode === "manual" || mode === "manual-jammed";

  if (!leavingManual && enteringManual) {
    // Start manual flight from the current replay position, or a hover position.
    if (current) {
      manualStartPosition.copy(drone.position);
      manualStartCursor = cursor;
    } else {
      manualStartPosition.set(0, 20 / Math.max(viewScale, 0.001), 0);
      manualStartCursor = 0;
    }
    physics.reset(manualStartPosition.clone());
  }

  if (mode === "manual-jammed") {
    jamming.setActive(true);
    jamming.setIntensity(0.65);
  } else {
    jamming.setActive(false);
  }

  if (leavingManual && !enteringManual) {
    // Resume replay from the sample closest to the manual position.
    if (current) {
      cursor = findClosestSample(drone.position);
      scrubInput.value = String(cursor / current.duration);
    }
  }

  appMode = mode;
  updateModeBanner(mode);
}

function cycleCameraPreset() {
  const presets: CameraPreset[] = ["chase", "orbit", "top", "command", "fpv"];
  const idx = presets.indexOf(cameraPreset);
  cameraPreset = presets[(idx + 1) % presets.length];
  updateCameraButtons();
}

function handleActions(cmd: FlightCommand) {
  if (cmd.reset) {
    cmd.reset = false;
    if (appMode !== "demo") {
      physics.reset(manualStartPosition.clone());
    }
  }
  if (cmd.cycleCamera) {
    cmd.cycleCamera = false;
    cycleCameraPreset();
  }
  if (cmd.toggleJam) {
    cmd.toggleJam = false;
    if (appMode === "manual") {
      setAppMode("manual-jammed");
    } else if (appMode === "manual-jammed") {
      setAppMode("manual");
    }
  }
  if (cmd.toggleMode) {
    cmd.toggleMode = false;
    const modes: AppMode[] = ["demo", "manual", "manual-jammed"];
    const idx = modes.indexOf(appMode);
    setAppMode(modes[(idx + 1) % modes.length]);
  }
  if (cmd.pause) {
    cmd.pause = false;
    if (appMode === "demo") {
      playing = !playing;
      playPause.textContent = playing ? "Pausar" : "Retomar";
    }
  }
  if (cmd.toggleHelp) {
    cmd.toggleHelp = false;
    if (helpOverlay) {
      const hidden = helpOverlay.getAttribute("aria-hidden") !== "false";
      if (hidden) showHelp();
      else hideHelp();
    }
  }
}

function fitWorld(flight: FlightColumns) {
  // The trajectory is pre-scaled into scene units by `toScene`, so the scenery
  // stays at origin/native size and the flight fills a consistent footprint.
  viewScale = flight.bounds.scale;
  // Anchor horizontally to the START sample so the flight begins at the origin
  // (the landing pad), and vertically to the lowest point so it never clips the
  // grid.
  viewCx = flight.px[0];
  viewCz = -flight.py[0];
  viewMinH = flight.bounds.minH;
  world.position.set(0, 0, 0);
  orbitDistance = THREE.MathUtils.clamp(flight.bounds.radius * 1.9, 80, 440);
}

function sampleIndex(flight: FlightColumns, time: number) {
  const target = flight.t[0] + time;
  let lo = 0;
  let hi = flight.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (flight.t[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return Math.min(flight.length - 1, Math.max(0, lo));
}

function updateFlight(dt: number) {
  if (!current) return;
  if (playing) {
    cursor =
      (cursor + dt * Number(speedInput.value)) %
      Math.max(0.001, current.duration);
    scrubInput.value = String(cursor / current.duration);
  } else {
    cursor = Number(scrubInput.value) * current.duration;
  }
  const i = sampleIndex(current, cursor);
  const p = toScene(current.px[i], current.py[i], current.pz[i]);
  drone.position.copy(p);
  ghost.position.set(p.x, 0.02, p.z);
  updateGroundShadow(drone, current.pz[i]);

  const vel = new THREE.Vector3(current.vx[i], current.vz[i], -current.vy[i]);
  if (vel.lengthSq() > 0.0001) {
    const yaw = Math.atan2(vel.x, vel.z);
    drone.rotation.set(0, yaw, 0);
    drone.rotation.z = THREE.MathUtils.clamp(
      -current.ax[i] * 0.05,
      -0.45,
      0.45,
    );
    drone.rotation.x = THREE.MathUtils.clamp(current.ay[i] * 0.05, -0.35, 0.35);
  }
  const accel = new THREE.Vector3(current.ax[i], current.az[i], -current.ay[i]);
  // Vector display lengths scale with the view so they read at any flight size.
  updateVectorLine(velocityVector, p, vel, viewScale * 0.9);
  updateVectorLine(accelVector, p, accel, viewScale * 0.5);
  updateVectorLine(
    altitudeLine,
    new THREE.Vector3(p.x, 0.03, p.z),
    new THREE.Vector3(0, p.y, 0),
    1,
  );
  for (const blade of rotorBlades) blade.rotation.z += dt * 42;
  updateInstrument(vel, accel);

  if (cameraPreset === "chase") {
    const back =
      vel.lengthSq() > 0.001
        ? vel.clone().normalize().multiplyScalar(-58)
        : new THREE.Vector3(-46, 0, -46);
    const wanted = p
      .clone()
      .add(back)
      .add(new THREE.Vector3(0, 28, 0));
    camera.position.lerp(wanted, 0.045);
    camera.lookAt(p.x, p.y + 4.0, p.z);
  } else if (cameraPreset === "orbit") {
    const target = p.clone().add(new THREE.Vector3(0, 3.5, 0));
    const cp = Math.cos(orbitPitch);
    const offset = new THREE.Vector3(
      Math.sin(orbitYaw) * cp * orbitDistance,
      Math.sin(orbitPitch) * orbitDistance,
      Math.cos(orbitYaw) * cp * orbitDistance,
    );
    camera.position.lerp(target.clone().add(offset), 0.12);
    camera.lookAt(target);
  } else if (cameraPreset === "top") {
    const target = p.clone();
    const height = THREE.MathUtils.clamp(orbitDistance * 1.45, 95, 520);
    camera.position.lerp(new THREE.Vector3(p.x, height, p.z + 0.01), 0.09);
    camera.lookAt(target);
  } else if (cameraPreset === "fpv") {
    const offset = new THREE.Vector3(1.2, 0.7, 0).applyQuaternion(drone.quaternion);
    const wanted = p.clone().add(offset);
    camera.position.lerp(wanted, 0.2);
    camera.quaternion.slerp(drone.quaternion, 0.15);
  } else {
    const target = p.clone().add(new THREE.Vector3(0, 5, 0));
    camera.position.lerp(new THREE.Vector3(-118, 54, -96), 0.045);
    camera.lookAt(target);
  }

  updateBriefing(current, i, vel);

  readout.innerHTML = `<dl>
    <dt>tempo</dt><dd>${cursor.toFixed(2)} s</dd>
    <dt>posição</dt><dd>${current.px[i].toFixed(1)}, ${current.py[i].toFixed(1)}, ${current.pz[i].toFixed(1)} m</dd>
    <dt>velocidade</dt><dd>${Math.hypot(current.vx[i], current.vy[i], current.vz[i]).toFixed(2)} m/s</dd>
    <dt>acel.</dt><dd>${Math.hypot(current.ax[i], current.ay[i], current.az[i]).toFixed(2)} m/s²</dd>
  </dl>`;

  updateGpsReadout(jammingToGpsState());
}

function updateManualFlight(dt: number, cmd: FlightCommand) {
  const prevVel = physics.velocity.clone();
  const throttle = cmd.boost ? 1 : cmd.throttle;

  physics.step(
    {
      throttle,
      roll: cmd.roll,
      pitch: cmd.pitch,
      yaw: cmd.yaw,
      boost: cmd.boost,
      brake: cmd.brake,
      reset: false,
      toggleJam: false,
      toggleMode: false,
      cycleCamera: false,
      pause: false,
      toggleHelp: false,
    },
    dt,
  );

  if (cmd.brake) {
    const brakeFactor = Math.max(0, 1 - 5 * dt);
    physics.velocity.multiplyScalar(brakeFactor);
  }

  if (appMode === "manual-jammed") {
    jamming.update(physics.position, physics.velocity, dt);
  }

  const reportedPos =
    appMode === "manual-jammed" ? jamming.reportedPosition : physics.position;
  const reportedVel =
    appMode === "manual-jammed" ? jamming.reportedVelocity : physics.velocity;

  drone.position.copy(reportedPos);
  ghost.position.set(reportedPos.x, 0.02, reportedPos.z);
  updateGroundShadow(drone, reportedPos.y);
  drone.quaternion.copy(physics.quaternion);

  const accel = physics.velocity.clone().sub(prevVel).divideScalar(Math.max(dt, 0.0001));

  updateVectorLine(velocityVector, reportedPos, reportedVel, viewScale * 0.9);
  updateVectorLine(accelVector, reportedPos, accel, viewScale * 0.5);
  updateVectorLine(
    altitudeLine,
    new THREE.Vector3(reportedPos.x, 0.03, reportedPos.z),
    new THREE.Vector3(0, reportedPos.y, 0),
    1,
  );

  for (const blade of rotorBlades) {
    blade.rotation.z += dt * 42 * (0.5 + throttle * 0.8);
  }

  updateInstrument(reportedVel, accel);
  updateManualCamera(dt);
  updateManualBriefing(reportedVel);

  readout.innerHTML = `<dl>
    <dt>modo</dt><dd>${appMode === "manual" ? "manual" : "manual + jam"}</dd>
    <dt>posição</dt><dd>${reportedPos.x.toFixed(1)}, ${reportedPos.y.toFixed(1)}, ${reportedPos.z.toFixed(1)} m</dd>
    <dt>velocidade</dt><dd>${reportedVel.length().toFixed(2)} m/s</dd>
    <dt>acel.</dt><dd>${accel.length().toFixed(2)} m/s²</dd>
  </dl>`;

  updateGpsReadout(jammingToGpsState());
}

function updateManualCamera(_dt: number) {
  const p = drone.position;
  const reportedVel =
    appMode === "manual-jammed" ? jamming.reportedVelocity : physics.velocity;

  if (cameraPreset === "chase") {
    const back =
      reportedVel.lengthSq() > 0.001
        ? reportedVel.clone().normalize().multiplyScalar(-58)
        : new THREE.Vector3(-46, 0, -46);
    const wanted = p.clone().add(back).add(new THREE.Vector3(0, 28, 0));
    camera.position.lerp(wanted, 0.045);
    camera.lookAt(p.x, p.y + 4, p.z);
  } else if (cameraPreset === "orbit") {
    const target = p.clone().add(new THREE.Vector3(0, 3.5, 0));
    const cp = Math.cos(orbitPitch);
    const offset = new THREE.Vector3(
      Math.sin(orbitYaw) * cp * orbitDistance,
      Math.sin(orbitPitch) * orbitDistance,
      Math.cos(orbitYaw) * cp * orbitDistance,
    );
    camera.position.lerp(target.clone().add(offset), 0.12);
    camera.lookAt(target);
  } else if (cameraPreset === "top") {
    const target = p.clone();
    const height = THREE.MathUtils.clamp(orbitDistance * 1.45, 95, 520);
    camera.position.lerp(new THREE.Vector3(p.x, height, p.z + 0.01), 0.09);
    camera.lookAt(target);
  } else if (cameraPreset === "fpv") {
    const offset = new THREE.Vector3(1.2, 0.7, 0).applyQuaternion(drone.quaternion);
    const wanted = p.clone().add(offset);
    camera.position.lerp(wanted, 0.2);
    camera.quaternion.slerp(drone.quaternion, 0.15);
  } else {
    const target = p.clone().add(new THREE.Vector3(0, 5, 0));
    camera.position.lerp(new THREE.Vector3(-118, 54, -96), 0.045);
    camera.lookAt(target);
  }
}

function updateManualBriefing(vel: THREE.Vector3) {
  const speed = vel.length();
  const phase: MissionPhase = speed > 1 ? "tracking" : "acquisition";
  const drift =
    appMode === "manual-jammed"
      ? physics.position.distanceTo(jamming.reportedPosition)
      : null;
  const link =
    appMode === "manual-jammed"
      ? Math.round(THREE.MathUtils.clamp(99 - jamming.intensity * 35, 60, 99))
      : 98;
  hudPhase.textContent = phaseLabel(phase);
  hudSpeed.textContent = `${speed.toFixed(1)} m/s`;
  hudAlt.textContent = `${drone.position.y.toFixed(1)} m`;
  hudDrift.textContent = drift == null ? "--" : `${drift.toFixed(1)} m`;
  hudLink.textContent = `${link}%`;
  missionPhase.textContent = `${phaseLabel(phase)}: ${missionCopy(phase)} Câmera ${cameraPresetLabel(cameraPreset)}; camadas visíveis: ${layerSummary()}.`;
  document.documentElement.style.setProperty(
    "--track-energy",
    String(0.22 + Math.min(speed / 16, 0.55)),
  );
}

function updateBriefing(flight: FlightColumns, i: number, vel: THREE.Vector3) {
  const progress = cursor / Math.max(0.001, flight.duration);
  const phase =
    progress < 0.08
      ? "acquisition"
      : progress < 0.68
        ? "tracking"
        : progress < 0.9
          ? "assessment"
          : "recovery";
  const speed = Math.hypot(flight.vx[i], flight.vy[i], flight.vz[i]);
  const drift =
    flight.gx && flight.gy && flight.gz
      ? Math.hypot(
          flight.px[i] - flight.gx[i],
          flight.py[i] - flight.gy[i],
          flight.pz[i] - flight.gz[i],
        )
      : null;
  const link = THREE.MathUtils.clamp(
    99 - accelNoiseScore(flight, i) * 3.8 - progress * 4,
    86,
    99,
  );
  hudPhase.textContent = phaseLabel(phase);
  hudSpeed.textContent = `${speed.toFixed(1)} m/s`;
  hudAlt.textContent = `${flight.pz[i].toFixed(1)} m`;
  hudDrift.textContent =
    drift == null ? "sem verdade" : `${drift.toFixed(1)} m`;
  hudLink.textContent = `${Math.round(link)}%`;
  missionPhase.textContent = `${phaseLabel(phase)}: ${missionCopy(phase)} Câmera ${cameraPresetLabel(cameraPreset)}; camadas visíveis: ${layerSummary()}.`;
  document.documentElement.style.setProperty(
    "--track-energy",
    String(0.22 + Math.min(vel.length() / 16, 0.55)),
  );
}

function accelNoiseScore(flight: FlightColumns, i: number) {
  return Math.min(
    3,
    Math.hypot(flight.ax[i], flight.ay[i], flight.az[i]) / 9.81,
  );
}

function phaseLabel(phase: MissionPhase) {
  if (phase === "acquisition") return "Aquisição";
  if (phase === "tracking") return "Rastreamento";
  if (phase === "assessment") return "Avaliação";
  return "Recuperação";
}

function missionCopy(phase: MissionPhase) {
  if (phase === "acquisition")
    return "estabelecer enlace de telemetria e alinhar a solução inercial.";
  if (phase === "tracking")
    return "monitorar trajetória, vetores de aceleração e camadas de segurança do campo.";
  if (phase === "assessment")
    return "avaliar o comportamento do erro de navegação contra a verdade disponível.";
  return "encerrar o voo, preservar evidências e preparar o pacote da execução.";
}

function cameraPresetLabel(preset: CameraPreset) {
  if (preset === "chase") return "Cauda";
  if (preset === "orbit") return "Órbita";
  if (preset === "top") return "Topo";
  if (preset === "fpv") return "FPV";
  return "Comando";
}

function layerSummary() {
  const labels: Record<LayerName, string> = {
    trajectory: "trajetória",
    vectors: "vetores",
    airspace: "espaço aéreo",
    range: "campo",
  };
  return (Object.entries(layerState) as [LayerName, boolean][])
    .filter(([, enabled]) => enabled)
    .map(([name]) => labels[name])
    .join(", ");
}

function updateGroundShadow(group: THREE.Group, altitude: number) {
  const shadow = group.children[group.children.length - 1];
  const scale = THREE.MathUtils.clamp(1 + altitude * 0.035, 1, 3.8);
  shadow.scale.set(scale, scale, scale);
  const material = (shadow as THREE.Mesh).material as THREE.MeshBasicMaterial;
  material.opacity = THREE.MathUtils.clamp(0.28 - altitude * 0.006, 0.05, 0.24);
}

function updateVectorLine(
  line: THREE.Line,
  origin: THREE.Vector3,
  vector: THREE.Vector3,
  scale: number,
) {
  const positions = line.geometry.getAttribute(
    "position",
  ) as THREE.BufferAttribute;
  const tip = origin.clone().add(vector.clone().multiplyScalar(scale));
  positions.setXYZ(0, origin.x, origin.y, origin.z);
  positions.setXYZ(1, tip.x, tip.y, tip.z);
  positions.needsUpdate = true;
}

function updateInstrument(vel: THREE.Vector3, accel: THREE.Vector3) {
  const speed = vel.length();
  const bank = THREE.MathUtils.clamp(accel.x * 4.5, -24, 24);
  const climb = THREE.MathUtils.clamp(vel.y * 5, -18, 18);
  instrument.style.setProperty("--bank", `${bank}deg`);
  instrument.style.setProperty("--climb", `${climb}px`);
  instrument.style.setProperty(
    "--pulse",
    String(0.38 + Math.min(speed / 18, 0.42)),
  );
}

function updateScenery(time: number) {
  for (let i = 0; i < animatedScenery.length; i++) {
    const object = animatedScenery[i];
    object.rotation.y += 0.0025 + i * 0.0008;
    if (
      object instanceof THREE.Mesh &&
      object.geometry instanceof THREE.ConeGeometry
    ) {
      object.rotation.z += Math.sin(time * 0.45 + i) * 0.0008;
    }
  }
  const pulse = 0.62 + Math.sin(time * 3.2) * 0.22;
  for (const mat of beaconMaterials) mat.opacity = pulse;
}

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

function loop(now: number) {
  const dt = Math.min(0.05, (now - lastFrame) / 1000);
  lastFrame = now;

  const cmd = input.sample();
  handleActions(cmd);

  if (appMode === "demo") {
    updateFlight(dt);
  } else {
    updateManualFlight(dt, cmd);
  }

  updateControllerStatus(input.connectedGamepad);
  updateScenery(now / 1000);
  renderer.render(scene, camera);
  raf = requestAnimationFrame(loop);
}

window.addEventListener("resize", resize);
playPause.addEventListener("click", () => {
  playing = !playing;
  playPause.textContent = playing ? "Pausar" : "Retomar";
});
for (const button of cameraButtons) {
  button.addEventListener("click", () => {
    const preset = button.dataset.camera as CameraPreset | undefined;
    if (!preset) return;
    cameraPreset = preset;
    updateCameraButtons();
  });
}
for (const button of layerButtons) {
  button.addEventListener("click", () => {
    const layer = button.dataset.layer as LayerName | undefined;
    if (!layer) return;
    layerState[layer] = !layerState[layer];
    updateLayerButtons();
    applyLayerVisibility();
  });
}
presentationMode.addEventListener("click", () => {
  presentation = !presentation;
  updatePresentationMode();
});
speedInput.addEventListener("input", updatePlaybackRate);
scrubInput.addEventListener("input", () => {
  playing = false;
  playPause.textContent = "Retomar";
});

bindModeButtons((mode) => setAppMode(mode));

// Show the help overlay on first visit.
try {
  if (!localStorage.getItem("uav-help-seen")) {
    showHelp();
    localStorage.setItem("uav-help-seen", "1");
  }
} catch {
  /* ignore private-browsing localStorage failures */
}

for (const eventName of ["dragenter", "dragover"]) {
  window.addEventListener(eventName, (event) => {
    event.preventDefault();
    drop.classList.add("hot");
  });
}
for (const eventName of ["dragleave", "drop"]) {
  window.addEventListener(eventName, () => drop.classList.remove("hot"));
}
window.addEventListener("drop", async (event) => {
  event.preventDefault();
  const file = event.dataTransfer?.files[0];
  if (!file) return;
  try {
    loadBuffer(await file.arrayBuffer(), file.name);
  } catch (error) {
    showError(`Não foi possível carregar ${file.name}`, error);
  }
});

canvas.addEventListener("pointerdown", (event) => {
  if (cameraPreset !== "orbit") return;
  if (appMode !== "demo") return;
  pointerDrag = { id: event.pointerId, x: event.clientX, y: event.clientY };
  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener("pointermove", (event) => {
  if (!pointerDrag || pointerDrag.id !== event.pointerId) return;
  const dx = event.clientX - pointerDrag.x;
  const dy = event.clientY - pointerDrag.y;
  pointerDrag.x = event.clientX;
  pointerDrag.y = event.clientY;
  orbitYaw -= dx * 0.006;
  orbitPitch = THREE.MathUtils.clamp(orbitPitch + dy * 0.004, 0.12, 1.15);
});

canvas.addEventListener("pointerup", (event) => {
  if (pointerDrag?.id === event.pointerId) pointerDrag = null;
});

canvas.addEventListener(
  "wheel",
  (event) => {
    if (cameraPreset !== "orbit") return;
    if (appMode !== "demo") return;
    event.preventDefault();
    orbitDistance = THREE.MathUtils.clamp(
      orbitDistance * (1 + event.deltaY * 0.001),
      24,
      900,
    );
  },
  { passive: false },
);

window.addEventListener("beforeunload", () => cancelAnimationFrame(raf));

resize();
updateCameraButtons();
updateLayerButtons();
updatePlaybackRate();
updatePresentationMode();
applyLayerVisibility();
updateModeBanner(appMode);
loadDefault();
raf = requestAnimationFrame(loop);
