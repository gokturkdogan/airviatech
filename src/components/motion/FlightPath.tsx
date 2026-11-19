"use client";

import { animate, onScroll, svg } from "animejs";
import { useEffect, useId, useRef } from "react";
import { prefersReducedMotion } from "./useInView";

type Stop = { code: string; city: string };

const PATHS = {
  up: "M 70 172 C 330 18, 870 18, 1130 150",
  down: "M 70 60 C 330 210, 870 210, 1130 80",
  wave: "M 70 150 C 280 30, 480 30, 620 110 S 960 210, 1130 70",
};

/**
 * A flight route that draws itself as you scroll, with a small airliner
 * gliding along it (anime.js createDrawable + createMotionPath, scroll-synced).
 */
export function FlightPath({
  from,
  to,
  shape = "up",
  className = "",
}: {
  from: Stop;
  to: Stop;
  shape?: keyof typeof PATHS;
  className?: string;
}) {
  const root = useRef<SVGSVGElement>(null);
  const route = useRef<SVGPathElement>(null);
  const plane = useRef<SVGGElement>(null);
  const id = useId().replace(/:/g, "");
  const d = PATHS[shape];
  const start = d.match(/M (\d+) (\d+)/)!;
  const endPts = d.trim().split(/[ ,]+/).slice(-2).map(Number);

  useEffect(() => {
    const el = root.current;
    if (!el || !route.current || !plane.current) return;
    if (prefersReducedMotion()) {
      plane.current.style.opacity = "0";
      return;
    }
    const scroll = () => onScroll({ target: el, enter: "end start", leave: "start end", sync: 0.2 });
    const draw = animate(svg.createDrawable(route.current), { draw: ["0 0", "0 1"], ease: "linear", autoplay: scroll() });
    const fly = animate(plane.current, { ...svg.createMotionPath(route.current), ease: "linear", autoplay: scroll() });
    return () => {
      draw.revert();
      fly.revert();
    };
  }, []);

  return (
    <svg ref={root} viewBox="0 0 1200 220" className={`h-auto w-full overflow-visible ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={`fp-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="var(--color-sky)" />
          <stop offset="1" stopColor="var(--color-coral)" />
        </linearGradient>
      </defs>
      {/* faint full track */}
      <path d={d} fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1.5" strokeDasharray="2 9" strokeLinecap="round" />
      {/* drawn route */}
      <path ref={route} d={d} fill="none" stroke={`url(#fp-${id})`} strokeWidth="2" strokeLinecap="round" />

      {[
        { x: Number(start[1]), y: Number(start[2]), stop: from, anchor: "start" as const },
        { x: endPts[0], y: endPts[1], stop: to, anchor: "end" as const },
      ].map(({ x, y, stop, anchor }) => (
        <g key={stop.code} transform={`translate(${x} ${y})`}>
          <circle r="11" fill="currentColor" fillOpacity="0.08" />
          <circle r="4.5" fill="var(--color-coral)" />
          <text
            x={anchor === "start" ? -4 : 4}
            y={y > 110 ? 38 : -24}
            textAnchor={anchor}
            className="fill-current font-display text-[22px] font-bold"
          >
            {stop.code}
          </text>
          <text
            x={anchor === "start" ? -4 : 4}
            y={y > 110 ? 58 : -6}
            textAnchor={anchor}
            className="fill-current text-[13px] opacity-60"
          >
            {stop.city}
          </text>
        </g>
      ))}

      {/* airliner silhouette, nose to +x */}
      <g ref={plane} className="fill-current" transform={`translate(${start[1]} ${start[2]})`}>
        <g transform="scale(1.15)">
          <path d="M-16 -1.7 Q-18.5 0 -16 1.7 L12 1.7 Q17.5 1.4 18.5 0 Q17.5 -1.4 12 -1.7 Z" />
          <path d="M3 -1.5 L-6 -16 L-9.5 -16 L-4 -1.5 Z" />
          <path d="M3 1.5 L-6 16 L-9.5 16 L-4 1.5 Z" />
          <path d="M-11.5 -1.4 L-16.5 -7 L-18.5 -7 L-15.5 -1.2 Z" />
          <path d="M-11.5 1.4 L-16.5 7 L-18.5 7 L-15.5 1.2 Z" />
          <rect x="-2" y="-9.6" width="4.5" height="2.4" rx="1.2" />
          <rect x="-2" y="7.2" width="4.5" height="2.4" rx="1.2" />
        </g>
      </g>
    </svg>
  );
}
