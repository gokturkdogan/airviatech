import { FlyBy } from "@/components/motion/FlyBy";
import { FlightPath } from "@/components/motion/FlightPath";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollText } from "@/components/motion/ScrollText";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { PageHero } from "@/components/sections/PageHero";
import { Eyebrow, SectionHeading } from "@/components/sections/SectionHeading";
import { StatsBand } from "@/components/sections/StatsBand";
import { Figure } from "@/components/ui/Figure";
import { Icon } from "@/components/ui/Icon";
import { getContent, getSite } from "@/lib/content";
import { hasLocale, cityName } from "@/lib/i18n";
import { crumbs, navLabel, resolveLocale } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  return pageMetadata(locale, "/about", getContent(locale, "about").meta);
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const locale = await resolveLocale(params);
  const t = getContent(locale, "about");
  const hub = getSite().globe.hub;

  return (
    <>
      <PageHero
        image="/images/photos/news-bg.jpg"
        eyebrow={t.hero.eyebrow}
        title={t.hero.title}
        text={t.hero.text}
        crumbs={crumbs(locale, { label: navLabel(locale, "/about") })}
      />

      {/* Story */}
      <section className="tone-light panel-light section-y">
        <div className="container-x pb-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <ParallaxImage src={t.story.image} alt="" className="aspect-[4/5] w-full" />
          <div>
            <SplitHeading className="display-md">{t.story.title}</SplitHeading>
            <Reveal stagger={90} className="mt-8 space-y-5 text-lg leading-relaxed text-fog/75">
              {t.story.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </Reveal>
          </div>
        </div>
        </div>

        <div className="container-x">
        <StatsBand locale={locale} keys={t.stats} />
          <FlightPath shape="down" className="mt-14 text-white" from={{ code: hub.code, city: cityName(hub.name, locale) }} to={{ code: "DXB", city: cityName("Dubai", locale) }} />
        </div>
      </section>

      <FlyBy direction="rtl" className="mt-8" />

      {/* Connectivity statement */}
      <section className="container-x section-y">
        <Eyebrow>{t.connectivity.eyebrow}</Eyebrow>
        <SplitHeading className="display-lg mt-6 max-w-5xl">{t.connectivity.title}</SplitHeading>
        <ScrollText
          text={t.connectivity.text}
          className="ml-auto mt-12 max-w-3xl font-display text-2xl leading-[1.5] tracking-[-0.01em] text-white sm:text-3xl"
        />
      </section>

      {/* Distribution */}
      <section className="relative overflow-hidden border-y border-white/8 bg-ink-900/60 py-24 sm:py-32">
        <div className="container-x relative">
          <SectionHeading eyebrow={t.distribution.eyebrow} title={t.distribution.title} text={t.distribution.intro} />
          <Reveal stagger={100} className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.distribution.items.map((it, i) => (
              <div key={it.title} className="spotlight surface flex flex-col overflow-hidden rounded-3xl">
                <div className="bg-ink-850 px-8 pt-4">
                  <Figure name={it.figure} intensity={0.7} />
                </div>
                <div className="flex-1 border-t border-white/8 p-6">
                  <span className="font-mono text-xs text-coral">0{i + 1}</span>
                  <h3 className="mt-2 font-display text-lg font-semibold text-white">{it.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fog/65">{it.text}</p>
                </div>
              </div>
            ))}
          </Reveal>
          <Reveal>
            <p className="mt-14 max-w-3xl font-display text-xl text-white/90">{t.distribution.outro}</p>
          </Reveal>
        </div>
      </section>

      {/* Why */}
      <section className="tone-light panel-light section-y">
        <div className="container-x">
        <SplitHeading className="display-lg">{t.why.title}</SplitHeading>
        <Reveal stagger={120} className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-white/8 bg-white/8 lg:grid-cols-3">
          {t.why.items.map((it, i) => (
            <div key={it.title} className="group relative bg-ink-950 p-8 sm:p-10">
              <div className="font-display text-7xl font-bold tracking-tighter text-white/[0.06] transition-colors duration-500 group-hover:text-coral/30">
                0{i + 1}
              </div>
              <h3 className="mt-6 font-display text-2xl font-semibold text-white">{it.title}</h3>
              <p className="mt-4 leading-relaxed text-fog/70">{it.text}</p>
            </div>
          ))}
        </Reveal>
        </div>
      </section>

      {/* Technology */}
      <section className="container-x pb-24 pt-24">
        <div className="grid gap-12 rounded-[2rem] border border-white/8 bg-[linear-gradient(135deg,var(--color-ink-800),var(--color-ink-950))] p-8 sm:p-14 lg:grid-cols-2">
          <div>
            <Eyebrow>{t.technology.eyebrow}</Eyebrow>
            <SplitHeading className="display-md mt-6">{t.technology.title}</SplitHeading>
            <Reveal>
              <p className="mt-6 text-lg leading-relaxed text-fog/70">{t.technology.intro}</p>
            </Reveal>
          </div>
          <div className="flex flex-col justify-between gap-8">
            <Reveal stagger={100} as="ul" className="space-y-3">
              {t.technology.items.map((it) => (
                <li key={it} className="flex gap-4 rounded-2xl border border-white/8 bg-white/[0.02] p-5 text-white">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-sky to-coral text-ink-950">
                    <Icon name="check" className="size-4" />
                  </span>
                  {it}
                </li>
              ))}
            </Reveal>
            <Reveal>
              <p className="font-display text-xl italic text-sky-soft">{t.technology.outro}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Vision & mission */}
      <section className="container-x pb-12">
        <div className="grid gap-6 lg:grid-cols-2">
          {[t.vision, t.mission].map((block) => (
            <article key={block.title} className="spotlight surface overflow-hidden rounded-[2rem]">
              <ParallaxImage src={block.image} alt="" className="aspect-[16/9] w-full !rounded-none" strength={6} />
              <div className="p-8 sm:p-10">
                <Eyebrow>{block.eyebrow}</Eyebrow>
                <SplitHeading as="h3" className="display-md mt-5 !text-3xl sm:!text-4xl">
                  {block.title}
                </SplitHeading>
                <p className="mt-5 leading-relaxed text-fog/70">{block.intro}</p>
                <Reveal stagger={80} as="ul" className="mt-6 space-y-3">
                  {block.items.map((it) => (
                    <li key={it} className="flex gap-3 text-white/90">
                      <span className="mt-2 size-1.5 shrink-0 rotate-45 bg-coral" />
                      {it}
                    </li>
                  ))}
                </Reveal>
              </div>
            </article>
          ))}
        </div>
      </section>

      <ContactCTA locale={locale} title={t.join.title} text={t.join.text} />
    </>
  );
}
