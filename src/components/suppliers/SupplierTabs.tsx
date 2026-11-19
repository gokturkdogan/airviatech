"use client";

import { animate, stagger } from "animejs";
import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/components/motion/useInView";

type Category = { id: string; label: string; full: string; text: string; items: string[]; color: string };

export function SupplierTabs({ categories }: { categories: Category[] }) {
  const [active, setActive] = useState(0);
  const panel = useRef<HTMLUListElement>(null);
  const cat = categories[active];

  useEffect(() => {
    const el = panel.current;
    if (!el || prefersReducedMotion()) return;
    const anim = animate(el.children, {
      opacity: [0, 1],
      y: [14, 0],
      scale: [0.96, 1],
      delay: stagger(22),
      duration: 600,
      ease: "out(3)",
    });
    return () => {
      anim.revert();
    };
  }, [active]);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.6fr]">
      <div role="tablist" aria-label="Supplier categories" className="flex gap-2 overflow-x-auto lg:flex-col">
        {categories.map((c, i) => (
          <button
            key={c.id}
            role="tab"
            id={`tab-${c.id}`}
            aria-selected={i === active}
            aria-controls={`panel-${c.id}`}
            onClick={() => setActive(i)}
            className={`group flex min-w-[12rem] items-center gap-4 rounded-2xl border p-4 text-left transition-colors lg:min-w-0 ${
              i === active ? "border-white/20 bg-white/[0.06]" : "border-white/8 bg-transparent hover:bg-white/[0.03]"
            }`}
          >
            <span className="size-3 shrink-0 rounded-full" style={{ background: c.color, boxShadow: i === active ? `0 0 18px ${c.color}` : undefined }} />
            <span className="flex-1">
              <span className="block font-display text-lg font-semibold text-white">{c.label}</span>
              <span className="block text-xs text-mist">{c.full}</span>
            </span>
            <span className="font-mono text-sm text-white/40">{String(c.items.length).padStart(2, "0")}</span>
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`panel-${cat.id}`}
        aria-labelledby={`tab-${cat.id}`}
        className="surface relative overflow-hidden rounded-3xl p-7 sm:p-10"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full blur-[100px]" style={{ background: `${cat.color}33` }} />
        <p className="eyebrow">{cat.full}</p>
        <p className="mt-3 max-w-lg text-lg text-fog/75">{cat.text}</p>
        <ul ref={panel} className="relative mt-8 flex flex-wrap gap-2.5">
          {cat.items.map((name) => (
            <li
              key={`${cat.id}-${name}`}
              className="rounded-full border border-white/10 bg-ink-950/60 px-4 py-2 text-[0.95rem] text-white transition-colors hover:border-white/30"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
