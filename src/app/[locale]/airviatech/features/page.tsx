import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { PageHero } from "@/components/sections/PageHero";
import { Eyebrow, SectionHeading } from "@/components/sections/SectionHeading";
import { Figure } from "@/components/ui/Figure";
import { Icon } from "@/components/ui/Icon";
import { getContent } from "@/lib/content";
import { hasLocale } from "@/lib/i18n";
import { crumbs, navLabel, resolveLocale } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/airviatech/features">) {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  return pageMetadata(locale, "/airviatech/features", getContent(locale, "features").meta);
}

export default async function FeaturesPage({ params }: PageProps<"/[locale]/airviatech/features">) {
  const locale = await resolveLocale(params);
  const t = getContent(locale, "features");

  return (
    <>
      <PageHero
        image="/images/photos/cabin.jpg"
        eyebrow={t.hero.eyebrow}
        title={t.hero.title}
        text={t.hero.text}
        crumbs={crumbs(
          locale,
          { label: navLabel(locale, "/airviatech"), href: "/airviatech" },
          { label: navLabel(locale, "/airviatech/features") },
        )}
      />

      {/* Advanced features — big numbered rows */}
      <section className="tone-light panel-light section-y">
        <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.6fr]">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)] lg:self-start">
            <SectionHeading eyebrow={t.advanced.eyebrow} title={t.advanced.title} />
          </div>
          <Reveal stagger={70} as="ol" className="border-t border-white/8">
            {t.advanced.items.map((it, i) => (
              <li
                key={it}
                data-scramble-trigger
                className="group flex items-center gap-6 border-b border-white/8 py-6 transition-colors hover:bg-white/[0.02] sm:px-4"
              >
                <span className="font-mono text-sm text-white/30 transition-colors group-hover:text-coral">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-display text-xl font-semibold text-white sm:text-2xl">{it}</span>
                <Icon
                  name="arrowRight"
                  className="size-5 -translate-x-3 text-sky opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100"
                />
              </li>
            ))}
          </Reveal>
        </div>
        </div>
      </section>

      {/* Fare types */}
      <section className="relative mt-20 overflow-hidden border-y border-white/8 bg-ink-900/60 py-24 sm:py-32">
        <div className="container-x relative">
          <SectionHeading title={t.fareTypes.title} text={t.fareTypes.intro} />
          <Reveal stagger={110} className="mt-14 grid gap-4 lg:grid-cols-3">
            {t.fareTypes.groups.map((g) => (
              <div key={g.label} className="spotlight surface rounded-3xl p-7">
                <p className="eyebrow">{g.label}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {g.items.map((code) => {
                    const [abbr, label] = code.split(" · ");
                    return (
                      <li
                        key={code}
                        data-scramble-trigger
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-ink-950/60 py-1.5 pl-1.5 pr-3.5 text-sm text-white"
                      >
                        {label ? (
                          <>
                            <span className="rounded-full bg-gradient-to-r from-sky/25 to-coral/25 px-2.5 py-0.5 font-mono text-xs text-white">
                              {abbr}
                            </span>
                            {label}
                          </>
                        ) : (
                          <span className="pl-2">{abbr}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Ancillaries */}
      <section className="container-x section-y">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <ParallaxImage src={t.ancillaries.image} alt="" className="aspect-[4/5] w-full lg:order-2" />
          <div>
            <SplitHeading className="display-md">{t.ancillaries.title}</SplitHeading>
            <Reveal>
              <p className="mt-5 text-lg text-fog/70">{t.ancillaries.intro}</p>
            </Reveal>
            <Reveal stagger={60} as="ul" className="mt-10 grid gap-3 sm:grid-cols-2">
              {t.ancillaries.items.map((it) => (
                <li key={it} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.02] p-4 text-[0.95rem] text-white">
                  <Icon name="plus" className="mt-0.5 size-4 shrink-0 text-coral" />
                  {it}
                </li>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Agency tools */}
      <section className="tone-light panel-light section-y">
        <div className="container-x">
        <SplitHeading className="display-md max-w-3xl">{t.agencyTools.title}</SplitHeading>
        <Reveal stagger={100} className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.agencyTools.items.map((it, i) => (
            <div key={it.text} className="spotlight surface flex flex-col overflow-hidden rounded-3xl">
              <div className="bg-ink-850 px-8 pt-4">
                <Figure name={it.figure} intensity={0.75} />
              </div>
              <div className="flex-1 border-t border-white/8 p-6">
                <span className="font-mono text-xs text-coral">0{i + 1}</span>
                <p className="mt-2 leading-relaxed text-white/90">{it.text}</p>
              </div>
            </div>
          ))}
        </Reveal>
        </div>
      </section>

      {/* Revenue statement */}
      <section className="container-x pb-12 pt-24">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/8 p-8 sm:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgb(103_186_213/0.18),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgb(255_90_95/0.18),transparent_55%)]" />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <Eyebrow>{t.revenue.eyebrow}</Eyebrow>
              <SplitHeading className="display-md mt-6">{t.revenue.title}</SplitHeading>
            </div>
            <Reveal>
              <p className="font-display text-xl leading-relaxed text-white/85 sm:text-2xl">{t.revenue.text}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <ContactCTA locale={locale} title={t.closing.title} text={t.closing.text} />
    </>
  );
}
