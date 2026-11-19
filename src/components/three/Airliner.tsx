"use client";

import { useTexture } from "@react-three/drei";
import { forwardRef, useMemo } from "react";
import {
  DoubleSide,
  ExtrudeGeometry,
  type Group,
  LatheGeometry,
  MeshStandardMaterial,
  Shape,
  Vector2,
} from "three";

/**
 * A procedurally modelled twin-engine airliner in AirviaTech livery
 * (white body, navy belly and tail, wing-mark on the fin).
 * Built from three.js primitives so there is no third-party model licence.
 * Nose points to +X, wings span Z, up is +Y. Length ≈ 6 units.
 */

function fuselageProfile(): Vector2[] {
  const pts: Vector2[] = [];
  const tail = -3.0;
  const nose = 3.0;
  const steps = 64;
  for (let i = 0; i <= steps; i++) {
    const y = tail + ((nose - tail) * i) / steps;
    let r = 0.44;
    if (y < -1.3) {
      const t = (y - tail) / (-1.3 - tail); // 0 tail tip → 1 body
      r = 0.05 + 0.39 * Math.sin((t * Math.PI) / 2);
    } else if (y > 2.05) {
      const t = (nose - y) / (nose - 2.05); // 0 nose tip → 1 body
      r = 0.44 * Math.sqrt(Math.max(0, 1 - (1 - t) * (1 - t)));
    }
    pts.push(new Vector2(Math.max(r, 0.0001), y));
  }
  return pts;
}

/** Lathe around Y, then turn so the length runs along X and sweep the tail cone up. */
function makeFuselage(radiusScale = 1, phiStart = 0, phiLength = Math.PI * 2, range: [number, number] = [-3, 3]) {
  const profile = fuselageProfile()
    .filter((p) => p.y >= range[0] && p.y <= range[1])
    .map((p) => new Vector2(p.x * radiusScale, p.y));
  const g = new LatheGeometry(profile, 64, phiStart, phiLength);
  g.rotateZ(-Math.PI / 2);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const t = Math.min(1, Math.max(0, (-1.25 - x) / 1.75));
    if (t > 0) pos.setY(i, pos.getY(i) * (1 - 0.3 * t) + 0.3 * t * t);
  }
  g.computeVertexNormals();
  return g;
}

function planform(points: [number, number][], depth: number) {
  const s = new Shape();
  s.moveTo(points[0][0], points[0][1]);
  points.slice(1).forEach(([x, y]) => s.lineTo(x, y));
  s.closePath();
  const g = new ExtrudeGeometry(s, {
    depth,
    bevelEnabled: true,
    bevelThickness: depth * 0.45,
    bevelSize: 0.025,
    bevelSegments: 3,
    steps: 1,
  });
  g.translate(0, 0, -depth / 2);
  return g;
}

export const Airliner = forwardRef<Group, { livery?: boolean }>(function Airliner({ livery = true }, ref) {
  const logo = useTexture("/images/brand/icon.png");

  const geo = useMemo(() => {
    const body = makeFuselage();
    const belly = makeFuselage(1.005, Math.PI / 2 - 0.85, 1.7, [-1.9, 1.75]);

    // Main wing, horizontal: shape drawn in X/Y (Y = span) then laid flat
    const wing = planform(
      [
        [0.95, 0.35],
        [-0.55, 0.35],
        [-1.35, 3.35],
        [-0.95, 3.35],
      ],
      0.05,
    );
    wing.rotateX(Math.PI / 2);

    const stab = planform(
      [
        [-2.0, 0.2],
        [-2.62, 0.2],
        [-2.92, 1.3],
        [-2.62, 1.3],
      ],
      0.035,
    );
    stab.rotateX(Math.PI / 2);

    // Vertical fin, drawn in X/Y directly
    const fin = planform(
      [
        [-1.75, 0.3],
        [-2.85, 0.3],
        [-3.0, 1.62],
        [-2.58, 1.62],
      ],
      0.05,
    );

    const winglet = planform(
      [
        [0, 0],
        [-0.42, 0],
        [-0.48, 0.42],
        [-0.3, 0.42],
      ],
      0.025,
    );
    return { body, belly, wing, stab, fin, winglet };
  }, []);

  const mats = useMemo(
    () => ({
      body: new MeshStandardMaterial({ color: "#f4f6fb", roughness: 0.32, metalness: 0.12 }),
      navy: new MeshStandardMaterial({ color: "#22284f", roughness: 0.38, metalness: 0.2 }),
      wing: new MeshStandardMaterial({ color: "#d9dfea", roughness: 0.42, metalness: 0.28 }),
      engine: new MeshStandardMaterial({ color: "#e7ebf3", roughness: 0.25, metalness: 0.45 }),
      metal: new MeshStandardMaterial({ color: "#9aa3b8", roughness: 0.3, metalness: 0.8 }),
      dark: new MeshStandardMaterial({ color: "#0d1026", roughness: 0.15, metalness: 0.6 }),
      coral: new MeshStandardMaterial({ color: "#ff5a5f", roughness: 0.35, metalness: 0.1 }),
    }),
    [],
  );

  // Cabin window positions along both sides
  const windows = useMemo(() => {
    const out: { x: number; side: 1 | -1 }[] = [];
    for (let x = -1.55; x <= 1.85; x += 0.15) {
      if (Math.abs(x - 0.95) < 0.12 || Math.abs(x + 0.9) < 0.12) continue; // door gaps
      out.push({ x, side: 1 }, { x, side: -1 });
    }
    return out;
  }, []);

  const engines: [number, number][] = [
    [0.55, 1.18],
    [0.55, -1.18],
  ];

  return (
    <group ref={ref} dispose={null}>
      {/* fuselage */}
      <mesh geometry={geo.body} material={mats.body} castShadow />
      {livery && <mesh geometry={geo.belly} material={mats.navy} />}

      {/* cheat line */}
      {livery &&
        ([1, -1] as const).map((side) => (
          <mesh key={side} position={[0.1, -0.04, side * 0.442]} rotation={[0, side === 1 ? 0 : Math.PI, 0]}>
            <planeGeometry args={[3.9, 0.035]} />
            <primitive object={mats.coral} attach="material" />
          </mesh>
        ))}

      {/* cabin windows */}
      {windows.map((w, i) => (
        <mesh key={i} position={[w.x, 0.1, w.side * 0.437]} rotation={[0, w.side === 1 ? 0 : Math.PI, 0]} material={mats.dark}>
          <planeGeometry args={[0.055, 0.075]} />
        </mesh>
      ))}

      {/* cockpit windscreen */}
      {([1, -1] as const).map((side) => (
        <mesh
          key={side}
          position={[2.62, 0.17, side * 0.2]}
          rotation={[side * 0.2, side * 0.95, -0.55]}
          material={mats.dark}
        >
          <planeGeometry args={[0.2, 0.09]} />
        </mesh>
      ))}

      {/* wings with a touch of dihedral */}
      <group position={[0.2, -0.2, 0]}>
        <mesh geometry={geo.wing} material={mats.wing} rotation={[0.07, 0, 0]} />
        <mesh geometry={geo.wing} material={mats.wing} rotation={[-0.07, 0, 0]} scale={[1, 1, -1]} />
        {([1, -1] as const).map((side) => (
          <mesh
            key={side}
            geometry={geo.winglet}
            material={livery ? mats.coral : mats.wing}
            position={[-0.92, 0.02, side * 3.33]}
          />
        ))}
      </group>

      {/* engines */}
      {engines.map(([x, z]) => (
        <group key={z} position={[x, -0.5, z]}>
          <mesh rotation={[0, 0, Math.PI / 2]} material={livery ? mats.navy : mats.engine}>
            <cylinderGeometry args={[0.2, 0.17, 0.85, 32]} />
          </mesh>
          <mesh position={[0.43, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={mats.dark}>
            <circleGeometry args={[0.17, 32]} />
          </mesh>
          <mesh position={[0.43, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={mats.metal}>
            <ringGeometry args={[0.17, 0.2, 32]} />
          </mesh>
          <mesh position={[-0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.metal}>
            <coneGeometry args={[0.12, 0.25, 24]} />
          </mesh>
          {/* pylon */}
          <mesh position={[-0.05, 0.2, 0]} material={mats.wing}>
            <boxGeometry args={[0.6, 0.18, 0.05]} />
          </mesh>
        </group>
      ))}

      {/* tail */}
      <mesh geometry={geo.stab} material={mats.wing} position={[0, 0.32, 0]} />
      <mesh geometry={geo.stab} material={mats.wing} position={[0, 0.32, 0]} scale={[1, 1, -1]} />
      <mesh geometry={geo.fin} material={mats.body} />
      {livery &&
        ([1, -1] as const).map((side) => (
          <mesh key={side} position={[-2.52, 0.98, side * 0.053]} rotation={[0, side === 1 ? 0 : Math.PI, 0]}>
            <planeGeometry args={[0.7, 0.7]} />
            <meshStandardMaterial map={logo} transparent side={DoubleSide} roughness={0.4} />
          </mesh>
        ))}
    </group>
  );
});
