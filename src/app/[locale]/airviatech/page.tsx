import { FlyBy } from "@/components/motion/FlyBy";
import Image from "next/image";
import { FlightPath } from "@/components/motion/FlightPath";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal } from "@/components/motion/Reveal";
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

const FEATURED = ["Turkish Airlines", "AJet", "Pegasus", "SunExpress", "Air France", "Aegean", "Emirates", "Singapore Airlines"];

export async function generateMetadata({ params }: PageProps<"/[locale]/airviatech">) {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  return pageMetadata(locale, "/airviatech", getContent(locale, "platform").meta);
}

export default async function PlatformPage({ params }: PageProps<"/[locale]/airviatech">) {
  const locale = await resolveLocale(params);
  const t = getContent(locale, "platform");
  const site = getSite();
  const featured = FEATURED.map((n) => site.airlines.find((a) => a.name === n)).filter((a) => !!a);

  return (
    <>
      <PageHero
        eyebrow={t.hero.eyebrow}
        title={t.hero.title}
        text={t.hero.text}
        crumbs={crumbs(locale, { label: navLabel(locale, "/airviatech") })}
      />

      {/* Advantages */}
      <section className="tone-light panel-light section-y">
        <div className="container-x pb-16">
        <SectionHeading eyebrow={t.advantages.eyebrow} title={t.advantages.title} />
        <Reveal stagger={100} className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.advantages.items.map((it) => (
            <div key={it.title} className="spotlight surface overflow-hidden rounded-3xl">
              <div className="bg-ink-850 px-8 pt-4">
                <Figure name={it.figure} intensity={0.7} />
              </div>
              <div className="border-t border-white/8 p-6">
                <h3 className="font-display text-xl font-semibold text-white">{it.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fog/65">{it.text}</p>
              </div>
            </div>
          ))}
        </Reveal>
        </div>

        <div className="container-x">
        <StatsBand locale={locale} keys={t.stats} />
          <FlightPath shape="wave" className="mt-14 text-white" from={{ code: site.globe.hub.code, city: cityName(site.globe.hub.name, locale) }} to={{ code: "JFK", city: cityName("New York", locale) }} />
        </div>
      </section>

      {/* One platform */}
      <section className="container-x section-y">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <Eyebrow>{t.onePlatform.eyebrow}</Eyebrow>
            <SplitHeading className="display-md mt-6">{t.onePlatform.title}</SplitHeading>
            <Reveal>
              <p className="mt-6 text-lg leading-relaxed text-fog/70">{t.onePlatform.text}</p>
            </Reveal>
          </div>
          <Reveal stagger={60} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {featured.map((a) => (
              <div
                key={a.name}
                className="spotlight surface group grid aspect-[4/3] place-items-center rounded-2xl p-5 transition-colors hover:border-white/20"
                title={a.name}
              >
                <Image
                  src={a.logo}
                  alt={a.name}
                  width={200}
                  height={100}
                  className="logo-mono max-h-12 w-auto object-contain opacity-70 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100"
                />
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <FlyBy size="lg" climb={50} className="-mt-8 mb-8 h-40" />

      {/* Ecosystem */}
      <section className="relative overflow-hidden border-y border-white/8 bg-ink-900/60 py-24 sm:py-32">
        <div className="container-x relative">
          <SectionHeading eyebrow={t.ecosystem.eyebrow} title={t.ecosystem.title} text={t.ecosystem.text} align="center" />
          <div className="mt-16 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-center">
            <ParallaxImage src={t.ecosystem.image} alt={t.ecosystem.title} className="aspect-[16/10] w-full bg-white" strength={4} />
            <div>
              <h3 className="font-display text-2xl font-semibold text-white">{t.ecosystem.subtitle}</h3>
              <Reveal stagger={90} as="ul" className="mt-8 space-y-4">
                {t.ecosystem.items.map((it, i) => (
                  <li key={it} className="flex gap-4 border-b border-white/8 pb-4 text-fog/80">
                    <span className="font-mono text-xs text-coral">0{i + 1}</span>
                    {it}
                  </li>
                ))}
              </Reveal>
              <Reveal>
                <p className="mt-8 flex items-center gap-3 font-display text-lg text-sky-soft">
                  <Icon name="spark" className="size-5" />
                  {t.ecosystem.outro}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <ContactCTA locale={locale} />
    </>
  );
}
