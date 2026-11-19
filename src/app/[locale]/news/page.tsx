import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { NewsCard } from "@/components/news/NewsCard";
import { NewsFilter } from "@/components/news/NewsFilter";
import { PageHero } from "@/components/sections/PageHero";
import { Eyebrow } from "@/components/sections/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { getContent, getPosts } from "@/lib/content";
import { hasLocale, localePath } from "@/lib/i18n";
import { crumbs, navLabel, resolveLocale } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/news">) {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  return pageMetadata(locale, "/news", getContent(locale, "news").meta);
}

export default async function NewsPage({ params }: PageProps<"/[locale]/news">) {
  const locale = await resolveLocale(params);
  const t = getContent(locale, "news");
  const ui = getContent(locale, "common").ui;
  const [featured, ...rest] = getPosts(locale);
  const category = (id: string) => t.categories[id as keyof typeof t.categories];

  return (
    <>
      <PageHero image="/images/photos/departures-board.jpg" eyebrow={t.hero.eyebrow} title={t.hero.title} text={t.hero.text} crumbs={crumbs(locale, { label: navLabel(locale, "/news") })} />

      <section className="container-x pb-20">
        <p className="eyebrow mb-5">{ui.featured}</p>
        <Reveal>
          <NewsCard post={featured} locale={locale} category={category(featured.category)} readMore={ui.readMore} featured />
        </Reveal>
      </section>

      <section className="tone-light panel-light section-y">
        <div className="container-x">
        <NewsFilter
          tabs={[
            { id: "all", label: t.all },
            ...Object.entries(t.categories).map(([id, label]) => ({ id, label })),
          ]}
        >
          {rest.map((post) => (
            <div key={post.slug} data-category={post.category}>
              <NewsCard post={post} locale={locale} category={category(post.category)} readMore={ui.readMore} />
            </div>
          ))}
        </NewsFilter>
        </div>
      </section>

      {/* Events */}
      <section className="container-x pb-12 pt-24">
        <div className="spotlight relative grid overflow-hidden rounded-[2rem] border border-white/8 bg-ink-900 lg:grid-cols-2">
          <div className="relative min-h-72">
            <Image src="/images/news/atm-dubai.jpg" alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ink-900/80 max-lg:bg-gradient-to-t" />
          </div>
          <div className="relative p-8 sm:p-14">
            <Eyebrow>{t.event.label}</Eyebrow>
            <h2 className="display-md mt-5">{t.event.title}</h2>
            <p className="mt-5 max-w-md text-lg text-fog/70">{t.event.text}</p>
            <div className="mt-8">
              <ButtonLink href={localePath(locale, "/contact")}>{t.event.cta}</ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
