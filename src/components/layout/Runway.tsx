"use client";

import { createTimeline } from "animejs";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/components/motion/useInView";
import { JetSide } from "@/components/ui/JetSide";

/**
 * Footer finale: Istanbul skyline at dusk, a runway with sequenced edge
 * lights, and an AirviaTech jet that rolls, rotates and climbs out whenever
 * the footer is on screen.
 */
export function Runway({ caption }: { caption: string }) {
  const root = useRef<HTMLDivElement>(null);
  const jet = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const plane = jet.current;
    if (!el || !plane || prefersReducedMotion()) return;

    const tl = createTimeline({ autoplay: false, loop: true, loopDelay: 2200 })
      .add(plane, { x: ["-30vw", "38vw"], duration: 3600, ease: "in(2.4)" })
      .add(plane, { x: ["38vw", "120vw"], y: [0, -150], rotate: [0, -11], duration: 3000, ease: "inOut(1.6)" }, "-=120")
      .add(plane.querySelector("[data-gear]")!, { opacity: [1, 0], duration: 300 }, "-=2400");

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? tl.play() : tl.pause()), { threshold: 0.2 });
    io.observe(el);
    return () => {
      io.disconnect();
      tl.revert();
    };
  }, []);

  const lights = Array.from({ length: 34 }, (_, i) => i);

  return (
    <div ref={root} className="relative h-56 overflow-hidden sm:h-64" aria-hidden="true">
      {/* dusk glow + skyline */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_70%_100%,rgb(255_160_120/0.16),transparent_70%)]" />
      <svg viewBox="0 0 1200 140" preserveAspectRatio="xMidYMax slice" className="absolute inset-x-0 bottom-16 h-28 w-full text-[#20264c] sm:bottom-20 sm:h-32">
        <path
          fill="currentColor"
          d="M0 140 V112 h40 v-14 h26 v14 h18 v-22 h30 v22 h22 V104 h34 v36 Z
             M150 140 V96 h14 v-10 h20 v54 Z
             M230 140 V100 a62 62 0 0 1 124 0 V140 Z
             M262 100 a30 30 0 0 1 60 0 Z
             M206 140 V48 l3 -12 l3 12 V140 Z M372 140 V48 l3 -12 l3 12 V140 Z
             M224 140 V62 l2.5 -9 l2.5 9 V140 Z M354 140 V62 l2.5 -9 l2.5 9 V140 Z
             M288 40 v-10 h4 v10 Z
             M400 140 V108 h46 v-16 h22 v48 Z M480 140 V98 h28 v42 Z
             M540 140 V114 h60 V140 Z M612 140 V102 h24 v-8 h18 v46 Z
             M700 140 V64 h28 V140 Z M698 66 l16 -38 l16 38 Z M712 30 v-8 h4 v8 Z
             M748 140 V106 h40 v34 Z M800 140 V96 h22 v44 Z M834 140 V112 h48 v28 Z
             M900 140 V104 a44 44 0 0 1 88 0 V140 Z M884 140 V66 l2.5 -9 l2.5 9 V140 Z M996 140 V66 l2.5 -9 l2.5 9 V140 Z
             M1010 140 V110 h36 v-12 h24 v42 Z M1080 140 V100 h30 v40 Z M1120 140 V116 h80 V140 Z"
        />
        {/* a few lit windows */}
        {[52, 96, 158, 418, 494, 560, 622, 716, 760, 812, 852, 1024, 1092, 1150].map((x, i) => (
          <rect key={x} x={x} y={118 - (i % 3) * 6} width="3" height="3" fill="#ffd9a0" opacity={0.5 + (i % 2) * 0.3} />
        ))}
      </svg>

      {/* runway */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(180deg,#151935,#0d1028)] sm:h-20">
        <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
        <div className="runway-centerline absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2" />
        <div className="absolute inset-x-0 top-1.5 flex justify-between px-4">
          {lights.map((i) => (
            <span key={i} className="runway-light size-1.5 rounded-full" style={{ animationDelay: `${i * 70}ms` }} />
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-1.5 flex justify-between px-4">
          {lights.map((i) => (
            <span key={i} className="runway-light size-1.5 rounded-full" style={{ animationDelay: `${i * 70}ms` }} />
          ))}
        </div>
      </div>

      {/* the jet */}
      <div ref={jet} className="absolute bottom-11 left-0 sm:bottom-14" style={{ transform: "translateX(-30vw)" }}>
        <div className="relative w-[clamp(150px,16vw,230px)]">
          <JetSide className="h-auto w-full drop-shadow-[0_10px_14px_rgb(0_0_0/0.45)]" />
          <span data-gear className="absolute inset-0">
            <JetSide className="h-auto w-full" gear />
          </span>
        </div>
      </div>

      <p className="absolute right-[clamp(1.25rem,4vw,3rem)] top-6 font-code text-[0.68rem] uppercase tracking-[0.24em] text-fog/45">
        RWY 35R · {caption}
      </p>
    </div>
  );
}
