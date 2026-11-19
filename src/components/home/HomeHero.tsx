"use client";

import { createTimeline, splitText, stagger } from "animejs";
import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { afterIntro, prefersReducedMotion } from "@/components/motion/useInView";
import { SkyHero } from "@/components/three/scenes";
import { Icon } from "@/components/ui/Icon";

type HeroCopy = {
  lead: string;
  titleTop: string;
  titleBottom: string;
  subtitle: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
};

/**
 * Editorial hero: the sky and the aircraft lead, the type sits low and quiet
 * like a magazine cover, and a paper boarding pass closes the fold.
 */
export function HomeHero({
  copy,
  links,
  pass,
}: {
  copy: HeroCopy;
  links: { primary: string; secondary: string };
  pass: ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    let tl: ReturnType<typeof createTimeline> | undefined;
    let split: ReturnType<typeof splitText> | undefined;

    const cancel = afterIntro(() => {
      split = splitText(el.querySelector<HTMLElement>("[data-hero-title]")!, {
        words: { wrap: "clip", class: "split-word" },
      });
      el.classList.add("is-ready");
      tl = createTimeline({ defaults: { ease: "out(4)" } })
        .add(el.querySelectorAll("[data-hero-fade]"), { opacity: [0, 1], duration: 1200 }, 0)
        .add(split.words, { y: ["110%", "0%"], duration: 1500, delay: stagger(110) }, 200)
        .add(el.querySelectorAll("[data-hero-rise]"), { opacity: [0, 1], y: [24, 0], duration: 1100, delay: stagger(120) }, 800)
        .add(el.querySelector("[data-hero-pass]")!, { opacity: [0, 1], y: [60, 0], rotate: [-2.5, 0], duration: 1400 }, 1100);
    });

    return () => {
      cancel();
      tl?.revert();
      split?.revert();
      el.classList.remove("is-ready");
    };
  }, []);

  return (
    <section ref={root} className="hero-root relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="sky-gradient absolute inset-0" />
        <SkyHero className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_15%_85%,rgb(17_23_55/0.75),transparent_70%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-b from-transparent via-ink-950/60 to-ink-950" />
      </div>

      <div className="container-x flex flex-1 flex-col pb-10 pt-[calc(var(--header-h)+2.5rem)]">
        <p data-hero-fade className="flex items-center gap-3 text-sm text-fog/80">
          <span className="h-px w-8 bg-coral" />
          {copy.lead}
        </p>

        <div className="mt-auto max-w-4xl pt-24">
          <h1 data-hero-title className="font-display text-[clamp(3.1rem,8.2vw,7.6rem)] font-medium leading-[0.95] tracking-[-0.035em] text-white">
            {copy.titleTop}{" "}
            <span className="whitespace-nowrap font-serif text-[1.12em] font-normal italic tracking-[-0.01em] text-sky-soft">
              {copy.titleBottom}
            </span>
          </h1>

          <div className="mt-9 flex flex-col gap-7 sm:flex-row sm:items-end sm:gap-10">
            <p data-hero-rise className="max-w-md text-lg leading-relaxed text-fog/90">
              {copy.subtitle}
            </p>
            <div data-hero-rise className="flex shrink-0 flex-wrap items-center gap-6">
              <Link
                href={links.primary}
                className="magnetic inline-flex h-12 items-center rounded-full bg-white px-7 font-display font-semibold text-ink-950 transition-colors hover:bg-snow"
              >
                {copy.primary.label}
              </Link>
              <Link
                href={links.secondary}
                className="group inline-flex items-center gap-2 font-display font-semibold text-white"
              >
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:100%_1px] bg-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:0%_1px]">
                  {copy.secondary.label}
                </span>
                <Icon name="arrowRight" className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        <div data-hero-pass className="mt-14">
          {pass}
        </div>
      </div>
    </section>
  );
}
