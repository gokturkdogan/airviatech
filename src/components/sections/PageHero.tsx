import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { SkyBackdrop } from "@/components/three/scenes";
import { Caps } from "@/components/ui/Caps";
import { Eyebrow } from "./SectionHeading";

export type Crumb = { label: string; href?: string };

/**
 * Inner-page hero. Background is either a real photograph (slow Ken Burns
 * drift under a navy wash) or the sky scene with drifting clouds and a
 * distant airliner crossing.
 */
export function PageHero({
  eyebrow,
  title,
  text,
  crumbs,
  image,
  children,
  aside,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  crumbs?: Crumb[];
  image?: string;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden pb-20 pt-[calc(var(--header-h)+5rem)] sm:pb-28 lg:pt-[calc(var(--header-h)+7rem)]">
      <div className="absolute inset-0 -z-10">
        {image ? (
          <>
            <Image src={image} alt="" fill priority sizes="100vw" className="animate-kenburns object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(20_24_52/0.94)_0%,rgb(20_24_52/0.78)_45%,rgb(20_24_52/0.35)_100%)]" />
          </>
        ) : (
          <>
            <div className="sky-gradient absolute inset-0" />
            <SkyBackdrop className="absolute inset-0" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(20_24_52/0.55)_0%,transparent_65%)]" />
          </>
        )}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-950" />
      </div>

      <div className={`container-x ${aside ? "grid items-center gap-12 lg:grid-cols-[1.4fr_1fr]" : ""}`}>
        <div className="max-w-4xl">
          {crumbs && (
            <Reveal onMount as="aside" className="mb-10">
              <nav aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center gap-2 text-[0.8rem] text-fog/70">
                  {crumbs.map((c, i) => (
                    <li key={i} className="flex items-center gap-2">
                      {i > 0 && <span className="text-white/30">/</span>}
                      {c.href ? (
                        <Link href={c.href} className="transition-colors hover:text-white">
                          <Caps text={c.label} />
                        </Link>
                      ) : (
                        <span className="text-white" aria-current="page">
                          <Caps text={c.label} />
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            </Reveal>
          )}
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <SplitHeading as="h1" onMount className="display-lg mt-5">
            {title}
          </SplitHeading>
          {text && (
            <Reveal onMount delay={350}>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-fog/85 sm:text-xl">{text}</p>
            </Reveal>
          )}
          {children}
        </div>
        {aside && (
          <Reveal onMount delay={500} className="hidden lg:block">
            {aside}
          </Reveal>
        )}
      </div>
    </section>
  );
}
