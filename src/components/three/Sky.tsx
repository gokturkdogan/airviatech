"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { CanvasTexture, Color, type Group, type Mesh, type MeshBasicMaterial, SRGBColorSpace } from "three";
import { Airliner } from "./Airliner";
import SceneCanvas from "./SceneCanvas";

/* ── Procedural textures ─────────────────────────────────── */

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Soft cumulus puff painted from overlapping radial gradients. */
function makeCloudTexture(seed: number) {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const rnd = seeded(seed);
  for (let i = 0; i < 42; i++) {
    const a = rnd() * Math.PI * 2;
    const d = Math.pow(rnd(), 0.7) * size * 0.26;
    const x = size / 2 + Math.cos(a) * d * 1.35;
    const y = size / 2 + Math.sin(a) * d * 0.62;
    const r = size * (0.09 + rnd() * 0.15);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, "rgba(255,255,255,0.42)");
    g.addColorStop(0.55, "rgba(255,255,255,0.16)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

/** Long fading streak used for contrails. */
function makeTrailTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 16;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 256, 0);
  g.addColorStop(0, "rgba(255,255,255,0)");
  g.addColorStop(0.75, "rgba(255,255,255,0.35)");
  g.addColorStop(1, "rgba(255,255,255,0.7)");
  ctx.fillStyle = g;
  const v = ctx.createLinearGradient(0, 0, 0, 16);
  ctx.fillRect(0, 0, 256, 16);
  ctx.globalCompositeOperation = "destination-in";
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(0.5, "rgba(0,0,0,1)");
  v.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, 256, 16);
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

/* ── Clouds ──────────────────────────────────────────────── */

type Puff = { x: number; y: number; z: number; s: number; speed: number; opacity: number; tex: number; rot: number };

function Clouds({ count = 26, speed = 1, tint = "#e8eefc", band = [-5, 1] as [number, number] }) {
  const textures = useMemo(() => [11, 23, 37, 51].map(makeCloudTexture), []);
  const puffs = useMemo<Puff[]>(() => {
    const rnd = seeded(7);
    return Array.from({ length: count }, () => {
      const z = -14 + rnd() * 16; // far → near
      const near = (z + 14) / 16;
      return {
        x: -18 + rnd() * 36,
        y: band[0] + Math.pow(rnd(), 1.6) * (band[1] - band[0]), // most of the deck sits low
        z,
        s: 1.8 + rnd() * 2.6 + near * 2.2,
        speed: 0.25 + near * 0.9,
        opacity: 0.18 + near * 0.5,
        tex: Math.floor(rnd() * 4),
        rot: (rnd() - 0.5) * 0.3,
      };
    }).sort((a, b) => a.z - b.z);
  }, [count, band]);

  const refs = useRef<(Mesh | null)[]>([]);
  const far = useMemo(() => new Color("#8ea6d4"), []);
  const near = useMemo(() => new Color(tint), [tint]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    puffs.forEach((p, i) => {
      p.x -= p.speed * speed * dt;
      if (p.x < -20) p.x = 20;
      const m = refs.current[i];
      if (m) m.position.x = p.x;
    });
  });

  return (
    <group>
      {puffs.map((p, i) => (
        <mesh
          key={i}
          ref={(m) => {
            refs.current[i] = m;
          }}
          position={[p.x, p.y, p.z]}
          rotation={[0, 0, p.rot]}
          scale={[p.s * 1.6, p.s, 1]}
          renderOrder={i}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={textures[p.tex]}
            transparent
            depthWrite={false}
            opacity={p.opacity}
            color={far.clone().lerp(near, (p.z + 14) / 16)}
          />
        </mesh>
      ))}
    </group>
  );
}

function Lights() {
  return (
    <>
      <hemisphereLight args={["#cfe0ff", "#2b3159", 1.1]} />
      <directionalLight position={[6, 8, 5]} intensity={2.4} color="#fff1e0" />
      <directionalLight position={[-6, 2, -4]} intensity={0.8} color="#9fc4ff" />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[20, 6, 1]} color="#dbe6ff" />
        <Lightformer form="rect" intensity={1.2} position={[6, 1, 4]} scale={[8, 3, 1]} color="#ffd9c2" />
        <Lightformer form="rect" intensity={0.6} position={[-6, -2, 2]} scale={[8, 3, 1]} color="#6f86c7" />
      </Environment>
    </>
  );
}

/* ── Hero: airliner cruising through the clouds ─────────── */

function Contrails() {
  const tex = useMemo(() => makeTrailTexture(), []);
  const mats = useRef<(MeshBasicMaterial | null)[]>([]);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    mats.current.forEach((m, i) => {
      if (m) m.opacity = 0.55 + Math.sin(t * 3 + i) * 0.08;
    });
  });
  return (
    <>
      {[1.18, -1.18].map((z, i) => (
        <mesh key={z} position={[-4.6, -0.5, z]}>
          <planeGeometry args={[8, 0.16]} />
          <meshBasicMaterial
            ref={(m) => {
              mats.current[i] = m;
            }}
            map={tex}
            transparent
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  );
}

function CruisingAirliner() {
  const group = useRef<Group>(null);
  const { size } = useThree();
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX / window.innerWidth - 0.5;
      pointer.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const desktop = size.width >= 1024;
  const base = desktop ? { x: 3.6, y: 1.25, s: 0.7 } : { x: 0.9, y: 1.6, s: 0.42 };

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    // fly away as the hero scrolls out
    const p = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
    const targetX = base.x + p * 4 + pointer.current.x * 0.4;
    const targetY = base.y + Math.sin(t * 0.7) * 0.12 + p * 2.6 - pointer.current.y * 0.3;
    g.position.x += (targetX - g.position.x) * 0.06;
    g.position.y += (targetY - g.position.y) * 0.06;
    g.rotation.set(
      0.32 + Math.sin(t * 0.5) * 0.04 + pointer.current.x * 0.1, // roll: show the top of the wing
      -0.38 + pointer.current.x * 0.08, // heading slightly toward the viewer
      0.04 + Math.sin(t * 0.7 + 1) * 0.02 + p * 0.25, // pitch up on climb
    );
  });

  return (
    <group ref={group} position={[base.x, base.y, 0]} scale={base.s}>
      <Airliner />
      <Contrails />
    </group>
  );
}

export function SkyHero({ className }: { className?: string }) {
  return (
    <SceneCanvas className={className} camera={{ position: [0, 0, 14], fov: 32 }}>
      <Lights />
      <Clouds count={34} speed={1.4} band={[-5.2, 0.5]} />
      <Suspense fallback={null}>
        <CruisingAirliner />
      </Suspense>
    </SceneCanvas>
  );
}

/* ── Backdrop for inner pages: drifting clouds, a distant jet ── */

function DistantJet() {
  const group = useRef<Group>(null);
  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = (state.clock.elapsedTime * 0.035 + 0.15) % 1; // ~28s per crossing
    g.position.set(-16 + t * 32, 2.2 + t * 1.4, -10);
    g.rotation.set(0.05, -0.08, 0.06);
  });
  return (
    <group ref={group} scale={0.32}>
      <Airliner livery />
    </group>
  );
}

export function SkyBackdrop({ className }: { className?: string }) {
  return (
    <SceneCanvas className={className} camera={{ position: [0, 0, 14], fov: 32 }}>
      <Lights />
      <Clouds count={20} speed={0.7} band={[-5, 1.5]} />
      <Suspense fallback={null}>
        <DistantJet />
      </Suspense>
    </SceneCanvas>
  );
}

export default SkyHero;
