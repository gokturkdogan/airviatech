"use client";

import { animate, stagger } from "animejs";
import { Children, isValidElement, useEffect, useRef, useState, type ReactNode } from "react";
import { prefersReducedMotion } from "@/components/motion/useInView";

/**
 * Category pills that filter server-rendered cards. Each child must carry a
 * `data-category` prop; cards re-enter with a staggered anime.js animation.
 */
export function NewsFilter({
  tabs,
  children,
}: {
  tabs: { id: string; label: string }[];
  children: ReactNode;
}) {
  const [active, setActive] = useState("all");
  const grid = useRef<HTMLDivElement>(null);
  const items = Children.toArray(children).filter(isValidElement) as React.ReactElement<{ "data-category": string }>[];
  const visible = items.filter((c) => active === "all" || c.props["data-category"] === active);

  useEffect(() => {
    const el = grid.current;
    if (!el || prefersReducedMotion()) return;
    const anim = animate(el.children, {
      opacity: [0, 1],
      y: [30, 0],
      delay: stagger(70),
      duration: 800,
      ease: "out(4)",
    });
    return () => {
      anim.revert();
    };
  }, [active]);

  return (
    <>
      <div className="flex flex-wrap gap-2" role="tablist">
        {tabs.map((t) => {
          const count = t.id === "all" ? items.length : items.filter((c) => c.props["data-category"] === t.id).length;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active === t.id}
              onClick={() => setActive(t.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                active === t.id ? "border-white bg-white text-ink-950" : "border-white/12 text-white hover:border-white/30"
              }`}
            >
              {t.label}
              <span className={`font-mono text-xs ${active === t.id ? "text-ink-950/60" : "text-mist"}`}>{count}</span>
            </button>
          );
        })}
      </div>
      <div ref={grid} className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {visible}
      </div>
    </>
  );
}
