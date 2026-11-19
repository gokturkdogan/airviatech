"use client";

import { animate } from "animejs";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Figure } from "@/components/ui/Figure";
import { Icon } from "@/components/ui/Icon";

type Item = { slug: string; name: string; tagline: string; category: string; image: string; figure: string; href: string };

/**
 * Editorial product list. On desktop a preview card follows the cursor and
 * swaps image as you move between rows.
 */
export function ProductIndex({ items }: { items: Item[] }) {
  const [active, setActive] = useState<number | null>(null);
  const preview = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = preview.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      animate(el, { x: e.clientX + 32, y: e.clientY - 140, duration: 700, ease: "out(3)" });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    const el = preview.current;
    if (!el) return;
    animate(el, {
      opacity: active === null ? 0 : 1,
      scale: active === null ? 0.85 : 1,
      rotate: active === null ? -4 : 0,
      duration: 500,
      ease: "out(3)",
    });
  }, [active]);

  return (
    <div className="relative" onPointerLeave={() => setActive(null)}>
      <ul className="border-t border-white/10">
        {items.map((p, i) => (
          <li key={p.slug} onPointerEnter={() => setActive(i)}>
            <Link
              href={p.href}
              className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-white/10 py-7 sm:gap-8 sm:py-9"
            >
              <span className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-gradient-to-r from-white/[0.04] to-transparent transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-100" />
              <span className="font-mono text-sm text-white/30 transition-colors group-hover:text-coral">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex min-w-0 items-center gap-5">
                <div className="w-20 shrink-0 overflow-hidden rounded-xl bg-ink-850 lg:hidden">
                  <Figure name={p.figure} intensity={0.6} />
                </div>
                <div className="min-w-0">
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-white transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-2 sm:text-4xl lg:text-5xl">
                    {p.name}
                  </h2>
                  <p className="mt-2 text-fog/60 transition-transform delay-75 duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-2">
                    {p.tagline}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <span className="hidden rounded-full border border-white/10 px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-mist md:inline-block">
                  {p.category}
                </span>
                <span className="grid size-12 place-items-center rounded-full border border-white/15 text-white transition-all duration-500 group-hover:rotate-45 group-hover:border-coral group-hover:bg-coral">
                  <Icon name="arrowUpRight" className="size-5" />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div
        ref={preview}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-30 hidden h-72 w-[22rem] overflow-hidden rounded-3xl border border-white/15 opacity-0 shadow-[0_40px_120px_-20px_rgb(0_0_0/0.9)] lg:block"
      >
        {items.map((p, i) => (
          <div key={p.slug} className={`absolute inset-0 transition-opacity duration-500 ${active === i ? "opacity-100" : "opacity-0"}`}>
            <Image src={p.image} alt="" fill sizes="352px" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
              <span className="font-display text-lg font-semibold text-white">{p.name}</span>
              <div className="w-20 rounded-lg bg-ink-850/90 p-1">
                <Figure name={p.figure} play intensity={0.5} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
