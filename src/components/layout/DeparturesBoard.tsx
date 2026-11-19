"use client";

import { animate, scrambleText, stagger } from "animejs";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion, useOnceInView } from "@/components/motion/useInView";

export type BoardRow = { flight: string; destination: string; href: string; gate: string; time: string; status: string };

type Labels = { title: string; subtitle: string; flight: string; destination: string; gate: string; time: string; status: string; local: string };

const STATUS_TONE = ["text-emerald-300", "text-amber-300", "text-sky-soft", "text-emerald-300", "text-amber-300", "text-coral-soft"];

function useIstanbulClock() {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Istanbul" });
    const tick = () => setTime(fmt.format(new Date()));
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 15_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);
  return time;
}

/**
 * Footer sitemap styled as an airport departures board. Destinations flip
 * like split-flap letters when the board comes into view and on hover.
 */
export function DeparturesBoard({ rows, labels, lang, notice }: { rows: BoardRow[]; labels: Labels; lang: string; notice: string }) {
  const board = useRef<HTMLDivElement>(null);
  const clock = useIstanbulClock();

  const flip = (el: Element, delay = 0) =>
    animate(el, { innerHTML: scrambleText({ chars: "A-Z", delay, settleDuration: 260, revealRate: 40 }) });

  useOnceInView(board, () => {
    const el = board.current;
    if (!el || prefersReducedMotion()) return;
    const anims = Array.from(el.querySelectorAll("[data-flap]")).map((d, i) => flip(d, i * 140));
    const rowsIn = animate(el.querySelectorAll("[data-row]"), { opacity: [0, 1], x: [-12, 0], delay: stagger(90), duration: 700, ease: "out(3)" });
    return () => {
      anims.forEach((a) => a.revert());
      rowsIn.revert();
    };
  });

  return (
    <div ref={board} className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0e24] shadow-[inset_0_1px_0_rgb(255_255_255/0.05)]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-7">
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 24 24" className="size-6 -rotate-45 text-amber-300" aria-hidden="true">
            <path
              fill="currentColor"
              d="M21.5 12c0-.8-.7-1.4-1.5-1.4h-5.2L10 3H7.6l2.6 7.6H5.5L3.6 8H2l1.3 4L2 16h1.6l1.9-2.6h4.7L7.6 21H10l4.8-7.6H20c.8 0 1.5-.6 1.5-1.4Z"
            />
          </svg>
          <div>
            <div className="font-code text-lg font-bold uppercase tracking-[0.2em] text-amber-300" lang={lang}>
              {labels.title}
            </div>
            <div className="text-xs text-fog/60">{labels.subtitle}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-code text-2xl font-bold tabular-nums text-white" suppressHydrationWarning>
            {clock}
          </div>
          <div className="text-[0.65rem] uppercase tracking-[0.14em] text-fog/50">{labels.local}</div>
        </div>
      </div>

      <div className="hidden grid-cols-[4.5rem_5rem_1fr_3.5rem_7rem] gap-4 px-7 pt-4 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-fog/45 md:grid">
        <span>{labels.time}</span>
        <span>{labels.flight}</span>
        <span>{labels.destination}</span>
        <span>{labels.gate}</span>
        <span className="text-right">{labels.status}</span>
      </div>

      <ul className="px-2 pb-3 pt-2 sm:px-3">
        {rows.map((r, i) => (
          <li key={r.href} data-row>
            <Link
              href={r.href}
              onPointerEnter={(e) => {
                if (prefersReducedMotion()) return;
                const d = e.currentTarget.querySelector("[data-flap]");
                if (d) flip(d);
              }}
              className="group grid grid-cols-[4rem_1fr_auto] items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-white/[0.05] md:grid-cols-[4.5rem_5rem_1fr_3.5rem_7rem] md:gap-4 md:px-4"
            >
              <span className="font-code text-sm tabular-nums text-fog/70">{r.time}</span>
              <span className="hidden font-code text-sm text-fog/70 md:block">{r.flight}</span>
              <span className="flex min-w-0 items-center gap-2">
                <span
                  data-flap
                  lang={/AirviaTech/.test(r.destination) ? "en" : lang}
                  className="truncate font-code text-base font-bold uppercase tracking-[0.12em] text-white group-hover:text-amber-200 sm:text-lg"
                >
                  {r.destination}
                </span>
              </span>
              <span className="hidden font-code text-sm text-fog/70 md:block">{r.gate}</span>
              <span className={`text-right font-code text-xs font-bold uppercase tracking-[0.1em] ${STATUS_TONE[i % STATUS_TONE.length]}`}>
                <span className="mr-2 inline-block size-1.5 animate-pulse rounded-full bg-current align-middle" />
                {r.status}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* scrolling information line, like the strip under a real board */}
      <div className="mt-auto flex overflow-hidden border-t border-white/10 bg-amber-300/[0.06] py-3 font-code text-xs uppercase tracking-[0.18em] text-amber-200/80">
        <div className="flex w-max shrink-0 animate-marquee gap-16 pr-16" style={{ "--marquee-duration": "38s" } as React.CSSProperties}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} aria-hidden={i > 0 ? "true" : undefined} className="whitespace-nowrap">
              {notice}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
