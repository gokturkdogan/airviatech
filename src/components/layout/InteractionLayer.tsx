"use client";

import { animate } from "animejs";
import { useEffect } from "react";

/**
 * One delegated pointer listener for the whole site:
 *  - `.spotlight` elements get --mx/--my so their border/glow follows the cursor
 *  - `.magnetic` elements lean toward the cursor (anime.js spring-ish ease)
 * Keeps cards and buttons as server components.
 */
export function InteractionLayer() {
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine) return;

    let magnet: HTMLElement | null = null;
    let raf = 0;
    let last: PointerEvent | null = null;

    const release = (el: HTMLElement) => {
      animate(el, { x: 0, y: 0, duration: 900, ease: "outElastic(1, .45)" });
    };

    const frame = () => {
      raf = 0;
      const e = last;
      if (!e) return;
      const target = e.target as Element | null;

      const card = target?.closest<HTMLElement>(".spotlight");
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      }

      if (reduced) return;
      const m = target?.closest<HTMLElement>(".magnetic") ?? null;
      if (magnet && magnet !== m) {
        release(magnet);
        magnet = null;
      }
      if (m) {
        magnet = m;
        const r = m.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        animate(m, { x: dx * 0.22, y: dy * 0.32, duration: 500, ease: "out(3)" });
      }
    };

    const onMove = (e: PointerEvent) => {
      last = e;
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onLeaveDoc = () => {
      if (magnet) release(magnet);
      magnet = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveDoc);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeaveDoc);
    };
  }, []);

  return null;
}
