"use client";

import { createTimeline, stagger } from "animejs";
import { useEffect, useRef } from "react";
import { LogoMark } from "@/components/ui/LogoMark";

const KEY = "airviatech:intro";

/**
 * First-visit intro: the wing mark assembles, the tagline decodes, then the
 * curtain lifts. Skipped for the rest of the session (see the inline script
 * in the root layout which adds `intro-seen` before paint).
 */
export function Preloader({ tagline }: { tagline: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const html = document.documentElement;
    if (html.classList.contains("intro-seen")) return;
    const done = () => {
      sessionStorage.setItem(KEY, "1");
      html.classList.add("intro-seen");
      html.classList.remove("intro-playing");
      window.dispatchEvent(new Event("airviatech:intro-done"));
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      done();
      return;
    }
    html.classList.add("intro-playing");
    window.__lenis?.stop();

    const tl = createTimeline({
      defaults: { ease: "out(4)" },
      onComplete: () => {
        window.__lenis?.start();
        done();
      },
    });
    tl.add(root.querySelector('[data-wing="left"]')!, { x: [-160, 0], y: [120, 0], opacity: [0, 1], duration: 900 }, 0)
      .add(root.querySelector('[data-wing="right"]')!, { x: [160, 0], y: [120, 0], opacity: [0, 1], duration: 900 }, 80)
      .add(root.querySelector('[data-wing="keel"]')!, { y: [-140, 0], opacity: [0, 1], duration: 900 }, 180)
      .add(root.querySelectorAll("[data-intro-char]"), { opacity: [0, 1], y: ["0.6em", "0em"], delay: stagger(28), duration: 600 }, 420)
      .add(root.querySelector("[data-intro-bar]")!, { scaleX: [0, 1], duration: 900, ease: "inOut(3)" }, 300)
      .add(root.querySelector("[data-intro-mark]")!, { scale: [1, 0.86], opacity: [1, 0], duration: 500, ease: "in(3)" }, 1500)
      .add(root, { clipPath: ["inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"], duration: 900, ease: "inOut(4)" }, 1650);

    return () => {
      tl.revert();
      window.__lenis?.start();
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="intro-overlay fixed inset-0 z-[90] grid place-items-center bg-ink-950"
    >
      <div data-intro-mark className="flex flex-col items-center gap-7">
        <LogoMark className="h-24 w-auto overflow-visible" />
        <div lang="en" className="font-mono text-[0.7rem] uppercase tracking-[0.4em] text-mist">
          {tagline.split("").map((c, i) => (
            <span key={i} data-intro-char className="inline-block">
              {c === " " ? " " : c}
            </span>
          ))}
        </div>
        <div className="h-px w-40 overflow-hidden bg-white/10">
          <div data-intro-bar className="h-full origin-left bg-gradient-to-r from-sky to-coral" />
        </div>
      </div>
    </div>
  );
}
