"use client";

import { Html, Trail } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  type Group,
  type Mesh,
  type MeshBasicMaterial,
  Path,
  Shape,
  ShapeGeometry,
  Vector3,
} from "three";
import { Airliner } from "./Airliner";
import SceneCanvas from "./SceneCanvas";

/* ── Data & projection ───────────────────────────────────── */

type MapData = { k: number; origin: [number, number]; land: { hole: boolean; pts: number[] }[]; borders: number[][] };
export type MapCity = { code: string; name: string; lat: number; lon: number };
export type MapFlight = { flight: string; to: string; inbound?: boolean };

const merc = (lat: number) => (180 / Math.PI) * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));

function makeProjector(k: number, [lon0, lat0]: [number, number]) {
  const y0 = merc(lat0);
  return (lat: number, lon: number): [number, number] => [(lon - lon0) * k, -(merc(lat) - y0) * k];
}

function useMapData() {
  const [data, setData] = useState<MapData | null>(null);
  useEffect(() => {
    let alive = true;
    fetch("/data/flightmap.json")
      .then((r) => r.json())
      .then((d: MapData) => alive && setData(d))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  return data;
}

const C = {
  ocean: "#0d1231",
  land: "#2a3570",
  coast: "#86b6e0",
  border: "#5562a8",
  grid: "#1f2858",
  sky: new Color("#67bad5"),
  coral: new Color("#ff5a5f"),
};

/* ── Ground: land, coastline, borders, graticule ─────────── */

function Ground({ data, project }: { data: MapData; project: (lat: number, lon: number) => [number, number] }) {
  const { land, coast, borders, grid } = useMemo(() => {
    const shapes: Shape[] = [];
    const coastPts: number[] = [];
    for (const ring of data.land) {
      const pts = ring.pts;
      if (ring.hole && shapes.length) {
        const path = new Path();
        path.moveTo(pts[0], -pts[1]);
        for (let i = 2; i < pts.length; i += 2) path.lineTo(pts[i], -pts[i + 1]);
        shapes[shapes.length - 1].holes.push(path);
      } else {
        const s = new Shape();
        s.moveTo(pts[0], -pts[1]);
        for (let i = 2; i < pts.length; i += 2) s.lineTo(pts[i], -pts[i + 1]);
        shapes.push(s);
      }
      for (let i = 0; i < pts.length - 2; i += 2) coastPts.push(pts[i], 0.004, pts[i + 1], pts[i + 2], 0.004, pts[i + 3]);
    }
    const land = new ShapeGeometry(shapes, 1);
    land.rotateX(-Math.PI / 2);

    const seg = (arr: number[]) => {
      const g = new BufferGeometry();
      g.setAttribute("position", new BufferAttribute(new Float32Array(arr), 3));
      return g;
    };
    const borderPts: number[] = [];
    for (const b of data.borders) for (let i = 0; i < b.length - 2; i += 2) borderPts.push(b[i], 0.003, b[i + 1], b[i + 2], 0.003, b[i + 3]);

    const gridPts: number[] = [];
    for (let lon = -15; lon <= 65; lon += 5) {
      for (let lat = 15; lat < 65; lat += 1) {
        const a = project(lat, lon);
        const b = project(lat + 1, lon);
        gridPts.push(a[0], 0.001, a[1], b[0], 0.001, b[1]);
      }
    }
    for (let lat = 15; lat <= 65; lat += 5) {
      const a = project(lat, -15);
      const b = project(lat, 65);
      gridPts.push(a[0], 0.001, a[1], b[0], 0.001, b[1]);
    }
    return { land, coast: seg(coastPts), borders: seg(borderPts), grid: seg(gridPts) };
  }, [data, project]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial color={C.ocean} />
      </mesh>
      <lineSegments geometry={grid}>
        <lineBasicMaterial color={C.grid} transparent opacity={0.9} />
      </lineSegments>
      <mesh geometry={land}>
        <meshBasicMaterial color={C.land} side={DoubleSide} />
      </mesh>
      <lineSegments geometry={borders}>
        <lineBasicMaterial color={C.border} transparent opacity={0.7} />
      </lineSegments>
      <lineSegments geometry={coast}>
        <lineBasicMaterial color={C.coast} transparent opacity={0.75} />
      </lineSegments>
    </group>
  );
}

/* ── Routes with light flowing outward from the hub ──────── */

const routeVertex = /* glsl */ `
  attribute float aT;
  attribute float aSeed;
  varying float vT;
  varying float vSeed;
  void main() {
    vT = aT;
    vSeed = aSeed;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const routeFragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uSky;
  uniform vec3 uCoral;
  varying float vT;
  varying float vSeed;
  void main() {
    float head = fract(uTime * 0.18 + vSeed);
    float glow = smoothstep(head - 0.22, head, vT) * step(vT, head);
    vec3 col = mix(uCoral, uSky, vT);
    gl_FragColor = vec4(col, 0.22 + glow * 0.8);
  }
`;

type Route = { to: MapCity; pts: Vector3[] };

function buildRoute(hub: MapCity, to: MapCity, project: (lat: number, lon: number) => [number, number]): Vector3[] {
  const n = 64;
  const [ax, az] = project(hub.lat, hub.lon);
  const [bx, bz] = project(to.lat, to.lon);
  const dist = Math.hypot(bx - ax, bz - az);
  const lift = 0.08 + dist * 0.09;
  const pts: Vector3[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    // gentle great-circle-ish bow toward the pole
    const lat = hub.lat + (to.lat - hub.lat) * t + Math.sin(Math.PI * t) * dist * 0.6;
    const lon = hub.lon + (to.lon - hub.lon) * t;
    const [x, z] = project(lat, lon);
    pts.push(new Vector3(x, Math.sin(Math.PI * t) * lift + 0.01, z));
  }
  return pts;
}

function Routes({ routes }: { routes: Route[] }) {
  const { geo, uniforms } = useMemo(() => {
    const pos: number[] = [];
    const ts: number[] = [];
    const seeds: number[] = [];
    routes.forEach((r, i) => {
      const seed = (i * 0.37) % 1;
      for (let k = 0; k < r.pts.length - 1; k++) {
        const a = r.pts[k];
        const b = r.pts[k + 1];
        pos.push(a.x, a.y, a.z, b.x, b.y, b.z);
        ts.push(k / (r.pts.length - 1), (k + 1) / (r.pts.length - 1));
        seeds.push(seed, seed);
      }
    });
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(new Float32Array(pos), 3));
    g.setAttribute("aT", new BufferAttribute(new Float32Array(ts), 1));
    g.setAttribute("aSeed", new BufferAttribute(new Float32Array(seeds), 1));
    return { geo: g, uniforms: { uTime: { value: 0 }, uSky: { value: C.sky }, uCoral: { value: C.coral } } };
  }, [routes]);
  useFrame((s) => {
    uniforms.uTime.value = s.clock.elapsedTime;
  });
  return (
    <lineSegments geometry={geo}>
      <shaderMaterial vertexShader={routeVertex} fragmentShader={routeFragment} uniforms={uniforms} transparent depthWrite={false} blending={AdditiveBlending} />
    </lineSegments>
  );
}

/* ── Hub: light beacon, radar and pulse rings ────────────── */

const beamFragment = /* glsl */ `
  varying vec2 vUv;
  void main() {
    float a = (1.0 - vUv.y) * 0.85;
    gl_FragColor = vec4(1.0, 0.42, 0.44, a * a);
  }
`;
const beamVertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const sweepFragment = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv - 0.5;
    float r = length(p) * 2.0;
    if (r > 1.0) discard;
    float ang = atan(p.y, p.x);
    float sweep = fract((ang / 6.28318) - uTime * 0.12);
    float wedge = smoothstep(0.82, 1.0, sweep);
    float rings = smoothstep(0.015, 0.0, abs(fract(r * 3.0) - 0.5) - 0.48);
    float edge = smoothstep(1.0, 0.94, r);
    vec3 col = vec3(0.4, 0.73, 0.84);
    gl_FragColor = vec4(col, (wedge * 0.22 + rings * 0.14) * edge);
  }
`;

function Hub({ hub, label, project }: { hub: MapCity; label: string; project: (lat: number, lon: number) => [number, number] }) {
  const [x, z] = project(hub.lat, hub.lon);
  const rings = useRef<(Mesh | null)[]>([]);
  const sweep = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    sweep.uTime.value = t;
    rings.current.forEach((m, i) => {
      if (!m) return;
      const p = (t * 0.45 + i / 3) % 1;
      m.scale.setScalar(0.1 + p * 0.9);
      (m.material as MeshBasicMaterial).opacity = (1 - p) * 0.7;
    });
  });
  return (
    <group position={[x, 0, z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
        <planeGeometry args={[1.5, 1.5]} />
        <shaderMaterial vertexShader={beamVertex} fragmentShader={sweepFragment} uniforms={sweep} transparent depthWrite={false} blending={AdditiveBlending} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          ref={(m) => {
            rings.current[i] = m;
          }}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.008, 0]}
        >
          <ringGeometry args={[0.28, 0.3, 64]} />
          <meshBasicMaterial color={C.coral} transparent depthWrite={false} />
        </mesh>
      ))}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.012, 0.05, 1.4, 16, 1, true]} />
        <shaderMaterial vertexShader={beamVertex} fragmentShader={beamFragment} transparent depthWrite={false} blending={AdditiveBlending} side={DoubleSide} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <sphereGeometry args={[0.035, 24, 24]} />
        <meshBasicMaterial color={C.coral} />
      </mesh>
      <Html position={[0, 1.45, 0]} center zIndexRange={[6, 5]}>
        <div className="pointer-events-none flex select-none items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-[#141836]/90 py-1.5 pl-2 pr-3.5 text-[12px] font-semibold text-white shadow-lg backdrop-blur">
          <span className="grid size-5 place-items-center rounded-full bg-coral text-[9px] font-bold">HQ</span>
          {label}
        </div>
      </Html>
    </group>
  );
}

function Cities({ cities, project }: { cities: MapCity[]; project: (lat: number, lon: number) => [number, number] }) {
  return (
    <>
      {cities.map((c) => {
        const [x, z] = project(c.lat, c.lon);
        return (
          <group key={c.code} position={[x, 0.01, z]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.035, 20]} />
              <meshBasicMaterial color="#9fd6e8" />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.06, 0.07, 24]} />
              <meshBasicMaterial color="#9fd6e8" transparent opacity={0.5} />
            </mesh>
            <Html position={[0, 0.02, 0]} center zIndexRange={[4, 1]}>
              <div className="pointer-events-none translate-x-[calc(50%+10px)] select-none whitespace-nowrap font-code text-[10px] font-bold tracking-[0.12em] text-[#cfe6f2]/85">
                {c.code}
              </div>
            </Html>
          </group>
        );
      })}
    </>
  );
}

/* ── Aircraft: 3D airliners cruising the routes ──────────── */

type Plane = { route: Route; flight: string; inbound: boolean; speed: number; offset: number };

function samplePath(pts: Vector3[], t: number, out: Vector3) {
  const f = Math.min(0.9999, Math.max(0, t)) * (pts.length - 1);
  const i = Math.floor(f);
  return out.copy(pts[i]).lerp(pts[i + 1], f - i);
}

function Aircraft({ plane, hud, index }: { plane: Plane; hud?: RefObject<HTMLDivElement | null>; index: number }) {
  const body = useRef<Group>(null);
  const shadow = useRef<Mesh>(null);
  const p = useMemo(() => new Vector3(), []);
  const ahead = useMemo(() => new Vector3(), []);

  useFrame((s) => {
    const g = body.current;
    if (!g) return;
    const raw = (s.clock.elapsedTime * plane.speed + plane.offset) % 1;
    const t = plane.inbound ? 1 - raw : raw;
    const dt = plane.inbound ? -0.01 : 0.01;
    samplePath(plane.route.pts, t, p);
    samplePath(plane.route.pts, t + dt, ahead);
    g.position.copy(p);
    g.lookAt(ahead);
    // fade in/out at the airports
    const vis = Math.min(1, Math.sin(Math.PI * raw) * 4);
    g.scale.setScalar(0.046 * Math.max(0.001, vis));
    if (shadow.current) {
      shadow.current.position.set(p.x + p.y * 0.12, 0.005, p.z + p.y * 0.08);
      shadow.current.scale.setScalar(1 - Math.min(0.5, p.y));
      (shadow.current.material as MeshBasicMaterial).opacity = 0.22 * vis;
    }
    // HUD shows the first aircraft's live readout
    if (hud?.current && index === 0 && Math.floor(s.clock.elapsedTime * 4) % 2 === 0) {
      const fl = Math.round((p.y / 0.4) * 380);
      const kts = 440 + Math.round(Math.sin(s.clock.elapsedTime * 0.3) * 18);
      const fl3 = hud.current.querySelector("[data-fl]");
      const kt = hud.current.querySelector("[data-kts]");
      if (fl3) fl3.textContent = `FL${String(Math.max(0, fl)).padStart(3, "0")}`;
      if (kt) kt.textContent = `${kts} kt`;
    }
  });

  return (
    <>
      <Trail width={0.5} length={5} color="#cfe6f2" attenuation={(w) => w * w} decay={1}>
        <group ref={body}>
          <group rotation={[0, -Math.PI / 2, 0]}>
            <Airliner />
          </group>
        </group>
      </Trail>
      <mesh ref={shadow} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.06, 20]} />
        <meshBasicMaterial color="#05071a" transparent depthWrite={false} />
      </mesh>
    </>
  );
}

/* ── Camera rig ──────────────────────────────────────────── */

function Rig() {
  const { camera, size } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const target = useMemo(() => new Vector3(), []);
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX / window.innerWidth - 0.5;
      pointer.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    // desktop keeps Istanbul right of centre (the arrival card sits left); phones centre it
    const narrow = size.width < 768;
    const dist = narrow ? 1.15 : 1;
    target.set(narrow ? -0.15 : -1.05, 0, narrow ? 0.1 : -0.35);
    const x = ((narrow ? 0 : -0.5) + Math.sin(t * 0.06) * 0.5 + pointer.current.x * 0.8) * dist;
    const y = (3.6 - pointer.current.y * 0.4) * dist;
    const z = (4.6 + Math.cos(t * 0.05) * 0.3) * dist;
    camera.position.lerp(new Vector3(x, y, z), 0.04);
    camera.lookAt(target);
  });
  return null;
}

/* ── Scene ───────────────────────────────────────────────── */

function Scene({
  hub,
  cities,
  flights,
  hubLabel,
  hud,
}: {
  hub: MapCity;
  cities: MapCity[];
  flights: MapFlight[];
  hubLabel: string;
  hud: RefObject<HTMLDivElement | null>;
}) {
  const data = useMapData();
  const project = useMemo(() => (data ? makeProjector(data.k, data.origin) : null), [data]);

  const routes = useMemo<Route[]>(() => (project ? cities.map((c) => ({ to: c, pts: buildRoute(hub, c, project) })) : []), [cities, hub, project]);
  const planes = useMemo<Plane[]>(
    () =>
      flights
        .map((f, i) => {
          const route = routes.find((r) => r.to.code === f.to);
          return route ? { route, flight: f.flight, inbound: !!f.inbound, speed: 0.022 + (i % 3) * 0.006, offset: (i * 0.27) % 1 } : null;
        })
        .filter((p): p is Plane => !!p),
    [flights, routes],
  );

  if (!data || !project) return null;
  return (
    <>
      <fog attach="fog" args={[C.ocean, 6, 13]} />
      <hemisphereLight args={["#dbe7ff", "#1b2150", 1.6]} />
      <directionalLight position={[3, 6, 4]} intensity={2.2} color="#fff1e0" />
      <Rig />
      <Ground data={data} project={project} />
      <Routes routes={routes} />
      <Cities cities={cities} project={project} />
      <Hub hub={hub} label={hubLabel} project={project} />
      <Suspense fallback={null}>
        {planes.map((p, i) => (
          <Aircraft key={p.flight} plane={p} hud={hud} index={i} />
        ))}
      </Suspense>
    </>
  );
}

export default function FlightMap({
  className,
  hub,
  cities,
  flights,
  hubLabel,
  hud,
}: {
  className?: string;
  hub: MapCity;
  cities: MapCity[];
  flights: MapFlight[];
  hubLabel: string;
  hud: RefObject<HTMLDivElement | null>;
}) {
  return (
    <SceneCanvas className={className} camera={{ position: [0.3, 3.6, 4.6], fov: 38 }}>
      <Scene hub={hub} cities={cities} flights={flights} hubLabel={hubLabel} hud={hud} />
    </SceneCanvas>
  );
}
