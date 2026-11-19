"use client";

import { animate } from "animejs";
import { useRef } from "react";
import { prefersReducedMotion, useOnceInView } from "./useInView";

export function Counter({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  locale = "en-US",
  duration = 2400,
  className,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  locale?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (n: number) =>
    prefix +
    new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n) +
    suffix;

  useOnceInView(ref, () => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.textContent = fmt(value);
      return;
    }
    const state = { n: 0 };
    const anim = animate(state, {
      n: value,
      duration,
      ease: "out(5)",
      onUpdate: () => {
        el.textContent = fmt(state.n);
      },
    });
    return () => anim.revert();
  });

  // Final value is server-rendered so crawlers and no-JS users see real numbers.
  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      {fmt(value)}
    </span>
  );
}
