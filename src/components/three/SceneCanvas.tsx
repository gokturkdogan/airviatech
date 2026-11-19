"use client";

import { Canvas, type CanvasProps } from "@react-three/fiber";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * Shared <Canvas> wrapper:
 *  - only renders frames while on screen (IntersectionObserver)
 *  - clamps DPR for performance
 *  - renders a single static frame for prefers-reduced-motion
 *  - fades in once the first frame is ready
 */
export default function SceneCanvas({
  children,
  className,
  camera,
  eventSource,
}: {
  children: ReactNode;
  className?: string;
  camera?: CanvasProps["camera"];
  eventSource?: CanvasProps["eventSource"];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className ?? ""} transition-opacity duration-[1600ms] ease-out ${ready ? "opacity-100" : "opacity-0"}`}
      aria-hidden="true"
    >
      <Canvas
        frameloop={reduced ? "demand" : visible ? "always" : "never"}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={camera ?? { position: [0, 0, 5], fov: 40 }}
        eventSource={eventSource}
        onCreated={() => requestAnimationFrame(() => setReady(true))}
      >
        {children}
      </Canvas>
    </div>
  );
}
