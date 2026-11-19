"use client";

import { animate, splitText, stagger } from "animejs";
import { useRef, type ElementType, type ReactNode } from "react";
import { prefersReducedMotion, useOnceInView } from "./useInView";

type Tag = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";

/**
 * Heading whose words rise out of a clipping mask (anime.js splitText).
 * Server-rendered text stays in the DOM for SEO / a11y; the split happens on the client.
 */
export function SplitHeading({
  as = "h2",
  children,
  className,
  delay = 0,
  onMount = false,
  by = "words",
}: {
  as?: Tag;
  children: ReactNode;
  className?: string;
  delay?: number;
  onMount?: boolean;
  by?: "words" | "chars";
}) {
  const ref = useRef<HTMLElement>(null);

  useOnceInView(
    ref,
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) {
        el.classList.add("is-split");
        return;
      }
      const split = splitText(el, {
        words: { wrap: "clip", class: "split-word" },
        chars: by === "chars" ? { class: "split-char" } : false,
      });
      const targets = by === "chars" ? split.chars : split.words;
      const anim = animate(targets, {
        y: ["110%", "0%"],
        rotate: by === "chars" ? [8, 0] : [3, 0],
        opacity: [0, 1],
        duration: 1300,
        delay: stagger(by === "chars" ? 22 : 55, { start: delay }),
        ease: "out(4)",
      });
      el.classList.add("is-split");
      return () => {
        anim.revert();
        split.revert();
        el.classList.remove("is-split");
      };
    },
    { immediate: onMount },
  );

  const Tag = as as ElementType;
  return (
    <Tag ref={ref} className={className} data-split="">
      {children}
    </Tag>
  );
}
