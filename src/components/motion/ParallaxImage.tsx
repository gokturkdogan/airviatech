"use client";

import { animate, onScroll } from "animejs";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./useInView";

/**
 * Image that drifts inside its frame while the frame crosses the viewport
 * and un-clips when it enters (anime.js onScroll, scroll-synced).
 */
export function ParallaxImage({
  src,
  alt,
  className = "",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  strength = 10,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  strength?: number;
  priority?: boolean;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!frame.current || !inner.current || prefersReducedMotion()) return;
    const drift = animate(inner.current, {
      y: [`-${strength}%`, `${strength}%`],
      ease: "linear",
      autoplay: onScroll({ target: frame.current, enter: "end start", leave: "start end", sync: true }),
    });
    const reveal = animate(frame.current, {
      clipPath: ["inset(12% 8% 12% 8% round 2rem)", "inset(0% 0% 0% 0% round 2rem)"],
      ease: "out(3)",
      autoplay: onScroll({ target: frame.current, enter: "end start", leave: "center center", sync: 0.4 }),
    });
    return () => {
      drift.revert();
      reveal.revert();
    };
  }, [strength]);

  return (
    <div ref={frame} className={`relative overflow-hidden rounded-[2rem] bg-ink-800 ${className}`}>
      <div ref={inner} className="absolute -inset-y-[12%] inset-x-0">
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />
    </div>
  );
}
