"use client";

import { animate, onScroll } from "animejs";
import { useEffect, useRef } from "react";
import { JetSide } from "@/components/ui/JetSide";
import { prefersReducedMotion } from "./useInView";

/**
 * An airliner that crosses the screen while this strip scrolls through the
 * viewport, trailing a soft contrail. Purely decorative, sits between sections.
 */
export function FlyBy({
  direction = "ltr",
  climb = 40,
  size = "md",
  className = "",
}: {
  direction?: "ltr" | "rtl";
  climb?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const strip = useRef<HTMLDivElement>(null);
  const jet = useRef<HTMLDivElement>(null);
  const rtl = direction === "rtl";

  useEffect(() => {
    const el = strip.current;
    const plane = jet.current;
    if (!el || !plane || prefersReducedMotion()) return;
    const anim = animate(plane, {
      x: rtl ? ["110vw", "-40vw"] : ["-40vw", "110vw"],
      y: [climb, climb * 0.2, -climb],
      rotate: rtl ? [4, 1, -2] : [-4, -1, 2],
      ease: "linear",
      autoplay: onScroll({ target: el, enter: "end start", leave: "start end", sync: 0.35 }),
    });
    return () => {
      anim.revert();
    };
  }, [rtl, climb]);

  const width = size === "lg" ? "w-[clamp(220px,26vw,380px)]" : size === "sm" ? "w-[clamp(110px,12vw,170px)]" : "w-[clamp(160px,18vw,260px)]";

  return (
    <div ref={strip} aria-hidden="true" className={`pointer-events-none relative h-28 overflow-x-clip ${className}`}>
      <div ref={jet} className={`absolute left-0 top-1/2 flex -translate-y-1/2 items-center ${rtl ? "flex-row-reverse" : ""}`}>
        {/* contrail */}
        <span
          className={`h-[3px] w-[30vw] rounded-full ${
            rtl ? "bg-gradient-to-r from-white/50 to-transparent" : "bg-gradient-to-l from-white/50 to-transparent"
          } [.tone-light_&]:from-[#22284f]/25`}
          style={{ marginTop: "0.4%" }}
        />
        <JetSide className={`${width} h-auto drop-shadow-[0_12px_18px_rgb(0_0_0/0.25)] ${rtl ? "-scale-x-100" : ""}`} />
      </div>
    </div>
  );
}
