import Image from "next/image";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Figure } from "@/components/ui/Figure";
import { getContent, getSite, type StatKey } from "@/lib/content";
import { hasLocale, localeMeta } from "@/lib/i18n";
import { crumbs, navLabel, resolveLocale } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/airviatech/infrastructure">) {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  return pageMetadata(locale, "/airviatech/infrastructure", getContent(locale, "infrastructure").meta);
}

export default async function InfrastructurePage({ params }: PageProps<"/[locale]/airviatech/infrastructure">) {
  const locale = await resolveLocale(params);
  const t = getContent(locale, "infrastructure");
  const site = getSite();
  const labels = getContent(locale, "common").stats;

  return (
    <>
      <PageHero
        eyebrow={t.hero.eyebrow}
        title={t.hero.title}
        text={t.hero.text}
        crumbs={crumbs(
          locale,
          { label: navLabel(locale, "/airviatech"), href: "/airviatech" },
          { label: navLabel(locale, "/airviatech/infrastructure") },
        )}
      />

      {/* Pillars with live counters */}
      <section className="tone-light panel-light section-y">
        <div className="container-x">
        <SplitHeading className="display-md max-w-3xl">{t.pillars.title}</SplitHeading>
        <Reveal stagger={110} className="mt-14 grid gap-4 lg:grid-cols-3">
          {t.pillars.items.map((p, i) => {
            const stat = p.stat ? (site.stats[p.stat as StatKey] as { value: number; suffix: string }) : null;
            return (
              <div key={p.title} className="spotlight surface flex flex-col justify-between gap-10 rounded-3xl p-8">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-coral">0{i + 1}</span>
                  <span className="relative flex size-2.5">
                    <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60" />
                    <span className="relative size-2.5 rounded-full bg-emerald-400" />
                  </span>
                </div>
                <div>
                  {stat ? (
                    <>
                      <Counter
                        value={stat.value}
                        suffix={stat.suffix}
                        locale={localeMeta[locale].tag}
                        className="font-display text-6xl font-bold tracking-[-0.05em] text-white"
                      />
                      <p className="mt-1 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-mist">
                        {labels[p.stat as keyof typeof labels] as string}
                      </p>
                    </>
                  ) : (
                    <p className="font-display text-5xl font-bold leading-[1.1] tracking-[-0.05em] text-white">
                      IATA
                      <span className="text-white/30"> / </span>
                      Non-IATA
                    </p>
                  )}
                  <h3 className="mt-6 font-display text-2xl font-semibold text-white">{p.title}</h3>
                  <p className="mt-3 leading-relaxed text-fog/70">{p.text}</p>
                </div>
              </div>
            );
          })}
        </Reveal>
        <Reveal>
          <p className="mt-12 text-center font-display text-2xl text-sky-soft">{t.pillars.tagline}</p>
        </Reveal>
        </div>
      </section>

      {/* Technology: sticky intro + stacked capability rows */}
      <section className="relative mt-20 border-y border-white/8 bg-ink-900/60 py-24 sm:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-[0.9fr_1.5fr]">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)] lg:self-start">
            <SectionHeading eyebrow={t.technology.eyebrow} title={t.technology.title} text={t.technology.text} />
            <Reveal className="mt-10 flex items-center gap-3">
              {site.badges.map((b) => (
                <span key={b.name} className="grid size-16 place-items-center rounded-2xl bg-white p-2" title={b.name}>
                  <Image src={b.image} alt={b.name} width={96} height={96} className="h-full w-auto object-contain" />
                </span>
              ))}
            </Reveal>
          </div>
          <div className="space-y-4">
            {t.technology.items.map((it, i) => (
              <Reveal key={it.title} className="spotlight surface grid overflow-hidden rounded-3xl sm:grid-cols-[220px_1fr]">
                <div className="grid place-items-center bg-ink-850 p-4">
                  <div className="w-full max-w-[200px]">
                    <Figure name={it.figure} intensity={0.75} />
                  </div>
                </div>
                <div className="border-t border-white/8 p-7 sm:border-l sm:border-t-0">
                  <span className="font-mono text-xs text-coral">0{i + 1}</span>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-white">{it.title}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {it.points.map((pt) => (
                      <li key={pt} className="flex gap-3 text-fog/75">
                        <span className="mt-2.5 h-px w-4 shrink-0 bg-sky" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ContactCTA locale={locale} title={t.closing.title} />
    </>
  );
}
