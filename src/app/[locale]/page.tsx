import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BoardingPass } from "@/components/home/BoardingPass";
import { HomeHero } from "@/components/home/HomeHero";
import { FlyBy } from "@/components/motion/FlyBy";
import { Reveal } from "@/components/motion/Reveal";
import { FlightPath } from "@/components/motion/FlightPath";
import { ScrollText } from "@/components/motion/ScrollText";
import { CodeWindow } from "@/components/products/CodeWindow";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { NewsCard } from "@/components/news/NewsCard";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { LogoMarquee } from "@/components/sections/LogoMarquee";
import { Eyebrow, SectionHeading } from "@/components/sections/SectionHeading";
import { StatsBand } from "@/components/sections/StatsBand";
import { ButtonLink } from "@/components/ui/Button";
import { Caps } from "@/components/ui/Caps";
import { Icon, type IconName } from "@/components/ui/Icon";
import { getContent, getProduct, getPosts, getSite } from "@/lib/content";
import { hasLocale, localePath, cityName } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const { meta } = getContent(locale, "home");
  return pageMetadata(locale, "/", meta);
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  const t = getContent(locale, "home");
  const common = getContent(locale, "common");
  const news = getContent(locale, "news");
  const site = getSite();
  const posts = getPosts(locale).slice(0, 3);
  const api = getProduct(locale, "airviatech-api");
  const L = (p: string) => localePath(locale, p);

  return (
    <>
      <HomeHero
        copy={t.hero}
        links={{ primary: L(t.hero.primary.href), secondary: L(t.hero.secondary.href) }}
        pass={
          <BoardingPass
            copy={t.hero.pass}
            from={{ code: site.globe.hub.code, city: cityName(site.globe.hub.name, locale) }}
            airlines={site.tokens.airlines}
            channels={t.hero.channels.slice(0, 4).join(" · ")}
            badges={site.badges}
          />
        }
      />

      {/* ── Value props ─────────────────────────────────────── */}
      <section className="container-x relative z-10 pt-10">
        <Reveal stagger={90} className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {t.values.map((v) => (
            <div key={v.title} className="flex items-start gap-4 bg-ink-900 p-6">
              <span className="grid size-11 shrink-0 place-items-center rounded-full border border-white/15 text-sky-soft">
                <Icon name={v.icon as IconName} className="size-5" />
              </span>
              <div>
                <h2 className="font-display text-[1.05rem] font-semibold leading-tight text-white">{v.title}</h2>
                <p className="mt-1 text-sm text-fog/65">{v.text}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      <FlyBy className="mt-6" />

      {/* ── Intro statement ────────────────────────────────── */}
      <section className="tone-light panel-light section-y mt-6">
        <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_2fr]">
          <div className="lg:pt-3">
            <Eyebrow>{t.intro.eyebrow}</Eyebrow>
            <Reveal delay={100}>
              <p className="mt-6 max-w-xs font-display text-lg text-white/90">{t.intro.subtitle}</p>
            </Reveal>
          </div>
          <div>
            <SplitHeading className="display-md">{t.intro.title}</SplitHeading>
            <ScrollText
              text={t.intro.text}
              className="mt-10 font-display text-2xl font-medium leading-[1.45] tracking-[-0.015em] text-white sm:text-[2rem]"
            />
          </div>
        </div>
        <FlightPath
          className="mt-20 text-white"
          from={{ code: site.globe.hub.code, city: cityName(site.globe.hub.name, locale) }}
          to={{ code: "LHR", city: cityName("London", locale) }}
        />
        </div>
      </section>

      {/* ── Pillars: stacking sticky cards ─────────────────── */}
      <section className="container-x pb-12 pt-24">
        <div className="space-y-6">
          {t.pillars.map((p, i) => (
            <article
              key={p.title}
              className="sticky overflow-hidden rounded-[2rem] border border-white/8 bg-ink-900 shadow-[0_-30px_80px_-40px_rgb(0_0_0/0.9)]"
              style={{ top: `calc(var(--header-h) + 1.5rem + ${i * 1.25}rem)` }}
            >
              <div className="grid lg:grid-cols-[1.1fr_1fr]">
                <div className="flex flex-col justify-between gap-10 p-8 sm:p-12 lg:p-14">
                  <div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-coral">0{i + 1}</span>
                      <span className="h-px w-8 bg-white/20" />
                      <span className="eyebrow">
                        <Caps text={p.kicker} />
                      </span>
                    </div>
                    <h2 className="display-md mt-6">{p.title}</h2>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-fog/70">{p.text}</p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-6">
                    <p className="font-display text-lg italic text-sky-soft">“{p.tagline}”</p>
                    <ButtonLink href={L(p.href)} variant="ghost">
                      {common.ui.viewDetails}
                    </ButtonLink>
                  </div>
                </div>
                <div className="relative min-h-72 lg:min-h-full">
                  <Image src={p.image} alt="" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-ink-900/60 via-transparent to-transparent max-lg:bg-gradient-to-b" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <FlyBy direction="rtl" size="lg" climb={60} className="my-4 h-40" />

      {/* ── Distribution: logos + stats ────────────────────── */}
      <section className="tone-light panel-light section-y relative">
        <div className="container-x relative">
          <SectionHeading eyebrow={t.distribution.eyebrow} title={t.distribution.title} text={t.distribution.text} align="center" />
        </div>
        <div className="relative mt-16">
          <LogoMarquee logos={[...site.gds, ...site.airlines]} />
        </div>
        <div className="container-x relative mt-20">
          <StatsBand locale={locale} keys={t.stats} />
          <FlightPath
            shape="wave"
            className="mt-16 text-white"
            from={{ code: site.globe.hub.code, city: cityName(site.globe.hub.name, locale) }}
            to={{ code: "SIN", city: cityName("Singapore", locale) }}
          />
        </div>
      </section>

      {/* ── IATA certification ─────────────────────────────── */}
      <section className="container-x pb-12 pt-24">
        <div className="spotlight relative overflow-hidden rounded-[2rem] border border-white/8 bg-[linear-gradient(135deg,var(--color-ink-800),var(--color-ink-900)_60%)]">
          <div className="grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-[1fr_1.3fr] lg:p-16">
            <Reveal className="relative mx-auto w-full max-w-sm">
              <div className="relative rounded-full bg-white p-6 shadow-[0_40px_90px_-40px_rgb(0_0_0/0.7)]">
                <Image
                  src="/images/badges/iata-arm-system-provider.png"
                  alt="IATA Airline Retailing Maturity — System Provider"
                  width={600}
                  height={600}
                  className="h-auto w-full"
                />
              </div>
            </Reveal>
            <div>
              <Eyebrow>{t.certification.eyebrow}</Eyebrow>
              <SplitHeading className="display-md mt-6">{t.certification.title}</SplitHeading>
              <Reveal delay={150}>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-fog/70">{t.certification.text}</p>
              </Reveal>
              <Reveal stagger={70} as="ul" className="mt-8 grid gap-3 sm:grid-cols-2">
                {t.certification.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3 text-sm text-white">
                    <span className="grid size-6 place-items-center rounded-full bg-sky/15 text-sky">
                      <Icon name="check" className="size-3.5" />
                    </span>
                    {pt}
                  </li>
                ))}
              </Reveal>
              <div className="mt-10">
                <ButtonLink href={L(t.certification.cta.href)} variant="ghost">
                  {t.certification.cta.label}
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Solutions bento ────────────────────────────────── */}
      <section className="container-x section-y">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading eyebrow={t.solutions.eyebrow} title={t.solutions.title} text={t.solutions.text} />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mist">{t.solutions.motto}</p>
        </div>
        <Reveal stagger={90} className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {t.solutions.items.map((s) => (
            <Link
              key={s.href}
              href={L(s.href)}
              className={`spotlight surface group flex flex-col overflow-hidden rounded-3xl transition-colors hover:border-white/15 ${
                s.wide ? "md:col-span-2 lg:col-span-4 lg:flex-row" : ""
              }`}
            >
              {"image" in s && s.image ? (
                <div className="relative aspect-[4/3] overflow-hidden bg-ink-850">
                  <Image
                    src={s.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-105"
                  />
                </div>
              ) : (
                api?.code && (
                  <div className="bg-ink-850 p-4 sm:p-6 lg:w-[46%]">
                    <CodeWindow title={api.code.title} lines={api.code.lines} />
                  </div>
                )
              )}
              <div className={`flex flex-1 flex-col border-t border-white/8 p-6 ${s.wide ? "justify-center lg:border-l lg:border-t-0 lg:p-12" : ""}`}>
                <h3 className={`mt-2 font-display font-semibold leading-snug tracking-tight text-white ${s.wide ? "text-2xl lg:text-4xl" : "text-lg"}`}>
                  {s.title}
                </h3>
                <p className={`mt-3 text-fog/65 ${s.wide ? "max-w-xl lg:text-lg" : "text-sm"}`}>{s.text}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-white">
                  {common.ui.learnMore}
                  <Icon name="arrowUpRight" className="size-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </Reveal>
      </section>

      <FlyBy size="sm" climb={30} className="-mt-10 mb-6" />

      {/* ── News ───────────────────────────────────────────── */}
      <section className="tone-light panel-light section-y">
        <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={t.news.eyebrow} title={t.news.title} />
          <ButtonLink href={L("/news")} variant="ghost">
            {t.news.cta}
          </ButtonLink>
        </div>
        <Reveal stagger={110} className="mt-14 grid gap-5 md:grid-cols-3">
          {posts.map((post) => (
            <NewsCard
              key={post.slug}
              post={post}
              locale={locale}
              category={news.categories[post.category as keyof typeof news.categories]}
              readMore={common.ui.readMore}
            />
          ))}
        </Reveal>
        </div>
      </section>

      <ContactCTA locale={locale} />
    </>
  );
}
