"use client";

import { animate, stagger, utils } from "animejs";
import { useRef, type ElementType, type ReactNode } from "react";
import { prefersReducedMotion, useOnceInView } from "./useInView";

/**
 * Fades + lifts content into view. With `stagger`, animates the direct
 * children one after another instead of the wrapper itself.
 */
export function Reveal({
  children,
  as = "div",
  className,
  delay = 0,
  y = 36,
  stagger: staggerMs,
  onMount = false,
  ...rest
}: {
  children: ReactNode;
  as?: "div" | "section" | "ul" | "ol" | "article" | "header" | "aside" | "figure";
  className?: string;
  delay?: number;
  y?: number;
  stagger?: number;
  onMount?: boolean;
} & Record<`data-${string}`, string>) {
  const ref = useRef<HTMLElement>(null);

  useOnceInView(
    ref,
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) {
        el.style.opacity = "1";
        return;
      }
      const targets = staggerMs ? Array.from(el.children) : [el];
      if (staggerMs) {
        utils.set(targets, { opacity: 0, y });
        el.style.opacity = "1";
      }
      const anim = animate(targets, {
        opacity: [0, 1],
        y: [y, 0],
        filter: ["blur(8px)", "blur(0px)"],
        duration: 1200,
        delay: staggerMs ? stagger(staggerMs, { start: delay }) : delay,
        ease: "out(4)",
      });
      return () => {
        anim.revert();
        if (staggerMs) utils.remove(targets);
        el.style.opacity = "";
      };
    },
    { immediate: onMount },
  );

  const Tag = as as ElementType;
  return (
    <Tag ref={ref} className={className} data-reveal="" {...rest}>
      {children}
    </Tag>
  );
}
