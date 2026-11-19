"use client";

import { animate, stagger } from "animejs";
import { useRef } from "react";
import { prefersReducedMotion, useOnceInView } from "@/components/motion/useInView";

/** Terminal-style request preview; lines type in when scrolled into view. */
export function CodeWindow({ title, lines }: { title: string; lines: string[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useOnceInView(ref, () => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const anim = animate(el.querySelectorAll("[data-line]"), {
      opacity: [0, 1],
      x: [-12, 0],
      clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
      delay: stagger(140, { start: 200 }),
      duration: 700,
      ease: "out(3)",
    });
    return () => anim.revert();
  });

  const colorize = (line: string) =>
    line
      .replace(/("[^"]+")(\s*:)/g, '<span class="text-sky-soft">$1</span>$2')
      .replace(/:\s*("[^"]+")/g, ': <span class="text-coral-soft">$1</span>')
      .replace(/^(POST)(\s)/, '<span class="text-emerald-300">$1</span>$2')
      .replace(/(\d+)(?=[,\s}])/g, '<span class="text-amber-200">$1</span>');

  return (
    <div ref={ref} className="tone-dark overflow-hidden rounded-3xl border border-white/10 bg-ink-950 shadow-[0_40px_120px_-40px_rgb(103_186_213/0.35)]">
      <div className="flex items-center gap-2 border-b border-white/8 px-5 py-3.5">
        <span className="size-3 rounded-full bg-coral/80" />
        <span className="size-3 rounded-full bg-amber-300/70" />
        <span className="size-3 rounded-full bg-emerald-400/70" />
        <span className="ml-3 font-code text-xs text-mist">{title}</span>
      </div>
      <pre className="overflow-x-auto p-6 font-code text-[0.85rem] leading-7 text-fog/90">
        {lines.map((l, i) => (
          <div key={i} data-line className="flex gap-5">
            <span className="w-4 select-none text-right text-white/20">{i + 1}</span>
            <code dangerouslySetInnerHTML={{ __html: colorize(l.replace(/</g, "&lt;")) }} />
          </div>
        ))}
        <div className="mt-2 flex gap-5">
          <span className="w-4" />
          <span className="h-5 w-2 animate-pulse bg-sky" />
        </div>
      </pre>
    </div>
  );
}
