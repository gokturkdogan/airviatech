"use client";

import { Html, OrbitControls } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { Group } from "three";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  type InstancedMesh,
  Object3D,
  type Points,
  Vector3,
} from "three";
import SceneCanvas from "./SceneCanvas";
import { fibonacciSphere } from "./geo";

export type NetworkCategory = { id: string; label: string; full: string; items: string[] };

export const CATEGORY_COLORS: Record<string, string> = {
  gds: "#67bad5",
  ndc: "#ff5a5f",
  xml: "#c9a6d9",
  ota: "#f2b880",
  charter: "#7fd1b9",
};

const dummy = new Object3D();

function Network({ center, categories }: { center: string; categories: NetworkCategory[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const items = useRef<InstancedMesh>(null);
  const pulses = useRef<Points>(null);

  const layout = useMemo(() => {
    const hubs = categories.map((c, i) => {
      const a = (i / categories.length) * Math.PI * 2;
      const pos = new Vector3(Math.cos(a) * 2.6, i % 2 ? 0.3 : -0.25, Math.sin(a) * 2.6);
      return { ...c, pos, color: new Color(CATEGORY_COLORS[c.id] ?? "#ffffff") };
    });
    const nodes: { name: string; hub: number; pos: Vector3 }[] = [];
    hubs.forEach((h, hi) => {
      const radius = 0.5 + Math.sqrt(h.items.length) * 0.07;
      const dir = h.pos.clone().normalize();
      const shell = fibonacciSphere(h.items.length, radius)
        // bias nodes away from the centre so clusters read clearly
        .map((v) => v.add(dir.clone().multiplyScalar(radius * 0.45)));
      h.items.forEach((name, k) => nodes.push({ name, hub: hi, pos: shell[k].add(h.pos) }));
    });
    return { hubs, nodes };
  }, [categories]);

  const lines = useMemo(() => {
    const pos: number[] = [];
    const col: number[] = [];
    const push = (a: Vector3, b: Vector3, c: Color, ia: number, ib: number) => {
      pos.push(a.x, a.y, a.z, b.x, b.y, b.z);
      col.push(c.r * ia, c.g * ia, c.b * ia, c.r * ib, c.g * ib, c.b * ib);
    };
    const o = new Vector3();
    layout.hubs.forEach((h) => push(o, h.pos, h.color, 0.9, 0.9));
    layout.nodes.forEach((n) => push(layout.hubs[n.hub].pos, n.pos, layout.hubs[n.hub].color, 0.45, 0.12));
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(new Float32Array(pos), 3));
    g.setAttribute("color", new BufferAttribute(new Float32Array(col), 3));
    return g;
  }, [layout]);

  // Item instances
  useLayoutEffect(() => {
    const mesh = items.current;
    if (!mesh) return;
    layout.nodes.forEach((n, i) => {
      dummy.position.copy(n.pos);
      dummy.scale.setScalar(i === hovered ? 2.2 : 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, layout.hubs[n.hub].color);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [layout, hovered]);

  // Data pulses travelling centre → hub → node
  const pulseRoutes = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => {
        const node = layout.nodes[(i * 7) % layout.nodes.length];
        return { hub: layout.hubs[node.hub].pos, node: node.pos, color: layout.hubs[node.hub].color, offset: i / 28 };
      }),
    [layout],
  );
  const pulseGeo = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(new Float32Array(pulseRoutes.length * 3), 3));
    const c = new Float32Array(pulseRoutes.length * 3);
    pulseRoutes.forEach((r, i) => c.set([r.color.r, r.color.g, r.color.b], i * 3));
    g.setAttribute("color", new BufferAttribute(c, 3));
    return g;
  }, [pulseRoutes]);

  const tmp = useMemo(() => new Vector3(), []);
  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.35;
    const attr = pulseGeo.getAttribute("position") as BufferAttribute;
    pulseRoutes.forEach((r, i) => {
      const p = (t + r.offset) % 1;
      if (p < 0.6) tmp.set(0, 0, 0).lerp(r.hub, p / 0.6);
      else tmp.copy(r.hub).lerp(r.node, (p - 0.6) / 0.4);
      attr.setXYZ(i, tmp.x, tmp.y, tmp.z);
    });
    attr.needsUpdate = true;
  });

  const onMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (e.instanceId !== undefined) setHovered(e.instanceId);
  };

  const hoveredNode = hovered !== null ? layout.nodes[hovered] : null;

  return (
    <group>
      {/* core */}
      <mesh>
        <icosahedronGeometry args={[0.34, 3]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh scale={1.9}>
        <icosahedronGeometry args={[0.34, 3]} />
        <meshBasicMaterial color="#ff5a5f" transparent opacity={0.12} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh scale={3.2}>
        <icosahedronGeometry args={[0.34, 2]} />
        <meshBasicMaterial color="#67bad5" wireframe transparent opacity={0.08} />
      </mesh>
      <Html center position={[0, -0.62, 0]} zIndexRange={[40, 30]}>
        <div className="pointer-events-none select-none whitespace-nowrap rounded-full border border-white/20 bg-ink-950/85 px-3.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-white shadow-lg backdrop-blur">
          {center}
        </div>
      </Html>

      <lineSegments geometry={lines}>
        <lineBasicMaterial vertexColors transparent opacity={0.85} blending={AdditiveBlending} depthWrite={false} />
      </lineSegments>

      {layout.hubs.map((h) => (
        <group key={h.id} position={h.pos}>
          <mesh>
            <sphereGeometry args={[0.13, 32, 32]} />
            <meshBasicMaterial color={h.color} />
          </mesh>
          <mesh scale={2.2}>
            <sphereGeometry args={[0.13, 24, 24]} />
            <meshBasicMaterial color={h.color} transparent opacity={0.15} blending={AdditiveBlending} depthWrite={false} />
          </mesh>
          <Html center position={[0, 0.32, 0]} zIndexRange={[20, 10]}>
            <div className="pointer-events-none flex select-none items-baseline gap-1.5 whitespace-nowrap rounded-full bg-ink-950/70 px-2.5 py-1 backdrop-blur">
              <span className="font-display text-[14px] font-bold text-white">{h.label}</span>
              <span className="font-mono text-[10px] text-mist">{h.items.length}</span>
            </div>
          </Html>
        </group>
      ))}

      <instancedMesh
        ref={items}
        args={[undefined, undefined, layout.nodes.length]}
        onPointerMove={onMove}
        onPointerOut={() => setHovered(null)}
      >
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial />
      </instancedMesh>

      <points ref={pulses} geometry={pulseGeo}>
        <pointsMaterial size={0.09} vertexColors transparent opacity={1} blending={AdditiveBlending} depthWrite={false} sizeAttenuation />
      </points>

      {hoveredNode && (
        <Html position={hoveredNode.pos} center zIndexRange={[50, 40]}>
          <div className="pointer-events-none -translate-y-6 select-none whitespace-nowrap rounded-lg border border-white/15 bg-ink-900/90 px-3 py-1.5 text-[13px] font-semibold text-white shadow-xl backdrop-blur">
            {hoveredNode.name}
          </div>
        </Html>
      )}
    </group>
  );
}

/** Touch devices: rotate automatically so the canvas never traps page scrolling. */
function AutoSpin({ children }: { children: React.ReactNode }) {
  const ref = useRef<Group>(null);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.12;
  });
  return <group ref={ref}>{children}</group>;
}

export default function SupplierNetwork({
  center,
  categories,
  className,
}: {
  center: string;
  categories: NetworkCategory[];
  className?: string;
}) {
  const finePointer = useMediaQuery("(pointer: fine)");
  return (
    <SceneCanvas className={className} camera={{ position: [0, 3.8, 6.4], fov: 45 }}>
      {finePointer ? (
        <>
          <Network center={center} categories={categories} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.55} enableDamping rotateSpeed={0.6} />
        </>
      ) : (
        <AutoSpin>
          <Network center={center} categories={categories} />
        </AutoSpin>
      )}
    </SceneCanvas>
  );
}
