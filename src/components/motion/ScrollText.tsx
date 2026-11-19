"use client";

import { animate, onScroll, splitText, stagger } from "animejs";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./useInView";

/**
 * Paragraph whose words light up one by one as it scrolls through the
 * viewport (scroll-synced with anime.js onScroll).
 */
export function ScrollText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const split = splitText(el, { words: { class: "split-word" } });
    const anim = animate(split.words, {
      opacity: [0.14, 1],
      ease: "linear",
      delay: stagger(40),
      autoplay: onScroll({ target: el, enter: "end start", leave: "center end", sync: 0.25 }),
    });
    return () => {
      anim.revert();
      split.revert();
    };
  }, [text]);

  return (
    <p ref={ref} className={className}>
      {text}
    </p>
  );
}
