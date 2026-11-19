"use client";

import { useEffect, type RefObject } from "react";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Resolves immediately, or after the first-visit intro overlay has lifted. */
export function afterIntro(cb: () => void): () => void {
  if (!document.documentElement.classList.contains("intro-playing")) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener("airviatech:intro-done", handler, { once: true });
  return () => window.removeEventListener("airviatech:intro-done", handler);
}

/**
 * Calls `onEnter` once when the element scrolls into view (or right away with
 * `immediate`). Cleanup also runs when Next's <Activity> hides the route, so
 * animations replay when the user navigates back.
 */
export function useOnceInView(
  ref: RefObject<Element | null>,
  onEnter: () => void | (() => void),
  { rootMargin = "0px 0px -12% 0px", immediate = false }: { rootMargin?: string; immediate?: boolean } = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cleanup: void | (() => void);
    let cancelIntro = () => {};
    const start = () => {
      cancelIntro = afterIntro(() => {
        cleanup = onEnter();
      });
    };

    if (immediate) {
      start();
      return () => {
        cancelIntro();
        cleanup?.();
      };
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          start();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelIntro();
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
