import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/sections/PageSkeleton";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { NewsCard } from "@/components/news/NewsCard";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { SkyBackdrop } from "@/components/three/scenes";
import { Caps } from "@/components/ui/Caps";
import { Icon } from "@/components/ui/Icon";
import { getContent, getPost, getPosts, readingTime, type PostBlock } from "@/lib/content";
import { defaultLocale, formatDate, hasLocale, localePath } from "@/lib/i18n";
import { pageMetadata, SITE_URL } from "@/lib/seo";

export function generateStaticParams() {
  return getPosts(defaultLocale).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/news/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) return {};
  const post = getPost(locale, slug);
  if (!post) return {};
  return pageMetadata(locale, `/news/${slug}`, { title: post.title, description: post.excerpt, image: post.image });
}

function Block({ block }: { block: PostBlock }) {
  switch (block.type) {
    case "lead":
      return <p className="lead">{block.text}</p>;
    case "h2":
      return <h2>{block.text}</h2>;
    case "h3":
      return <h3>{block.text}</h3>;
    case "ul":
      return (
        <ul>
          {block.items?.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <figure className="relative my-10 overflow-hidden rounded-3xl border border-white/10 bg-ink-900 p-8 sm:p-10">
          <span className="absolute -left-2 -top-10 font-display text-[9rem] leading-none text-coral/20">“</span>
          <blockquote className="relative font-display text-xl leading-relaxed text-white sm:text-2xl">{block.text}</blockquote>
          {"cite" in block && block.cite && (
            <figcaption className="relative mt-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-mist">
              <span className="h-px w-8 bg-coral" />
              {block.cite}
            </figcaption>
          )}
        </figure>
      );
    default:
      return <p>{block.text}</p>;
  }
}

async function PostPageContent({ params }: PageProps<"/[locale]/news/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();
  const post = getPost(locale, slug);
  if (!post) notFound();

  const t = getContent(locale, "news");
  const ui = getContent(locale, "common").ui;
  const category = t.categories[post.category as keyof typeof t.categories];
  const related = getPosts(locale)
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);
  // Announcement graphics (white artwork) are shown whole; photos fill the frame
  const isGraphic = post.image.startsWith("/images/news/");
  const url = `${SITE_URL}${localePath(locale, `/news/${post.slug}`)}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.excerpt,
    image: [`${SITE_URL}${post.image}`],
    datePublished: post.date,
    inLanguage: locale,
    publisher: { "@type": "Organization", name: "AirviaTech", logo: { "@type": "ImageObject", url: `${SITE_URL}/images/brand/logo-dark.png` } },
    mainEntityOfPage: url,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      <header className="relative isolate overflow-hidden pb-14 pt-[calc(var(--header-h)+4.5rem)]">
        <div className="absolute inset-0 -z-10">
          <div className="sky-gradient absolute inset-0" />
          <SkyBackdrop className="absolute inset-0" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-950" />
        </div>
        <div className="container-x max-w-4xl">
          <Reveal onMount>
            <Link href={localePath(locale, "/news")} className="inline-flex items-center gap-2 text-sm text-mist transition-colors hover:text-white">
              <Icon name="arrowLeft" className="size-4" />
              {ui.backToNews}
            </Link>
          </Reveal>
          <Reveal onMount delay={100} className="mt-8 flex flex-wrap items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-mist">
            <span className="rounded-full border border-coral/40 bg-coral/10 px-3 py-1 text-coral-soft">
              <Caps text={category} />
            </span>
            <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
            <span className="text-white/20">·</span>
            <span>
              {readingTime(post)} {ui.minRead}
            </span>
          </Reveal>
          <SplitHeading as="h1" onMount className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-[-0.035em] sm:text-6xl">
            {post.title}
          </SplitHeading>
        </div>
      </header>

      <div className="container-x max-w-5xl">
        <Reveal
          onMount
          delay={300}
          as="figure"
          className={`relative aspect-[16/9] overflow-hidden rounded-[2rem] border border-white/10 ${isGraphic ? "bg-white" : "bg-ink-800"}`}
        >
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="(min-width: 1024px) 1024px, 100vw"
            className={isGraphic ? "object-contain" : "object-cover"}
          />
        </Reveal>
      </div>

      <div className="tone-light panel-light mt-12">
      <article className="container-x max-w-3xl py-16 sm:py-24">
        <div className="prose-air">
          {post.body.map((b, i) => (
            <Block key={i} block={b} />
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8">
          <Link href={localePath(locale, "/news")} className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-sky-soft">
            <Icon name="arrowLeft" className="size-4" />
            {ui.backToNews}
          </Link>
          <div className="flex gap-2">
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Share on LinkedIn"
              className="grid size-10 place-items-center rounded-full border border-white/10 text-fog/80 transition-colors hover:border-white/30 hover:text-white"
            >
              <Icon name="linkedin" className="size-[18px]" />
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(url)}`}
              aria-label="Share by email"
              className="grid size-10 place-items-center rounded-full border border-white/10 text-fog/80 transition-colors hover:border-white/30 hover:text-white"
            >
              <Icon name="mail" className="size-[18px]" />
            </a>
          </div>
        </div>
      </article>
      </div>

      <section className="container-x pb-8 pt-24">
        <h2 className="display-md">{ui.relatedPosts}</h2>
        <Reveal stagger={100} className="mt-10 grid gap-5 md:grid-cols-3">
          {related.map((p) => (
            <NewsCard
              key={p.slug}
              post={p}
              locale={locale}
              category={t.categories[p.category as keyof typeof t.categories]}
              readMore={ui.readMore}
            />
          ))}
        </Reveal>
      </section>

      <ContactCTA locale={locale} />
    </>
  );
}

// The slug is URL data: keep it behind Suspense so client navigations can show
// the shell instantly (each slug is still fully prerendered for direct visits).
export default function PostPage(props: PageProps<"/[locale]/news/[slug]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PostPageContent {...props} />
    </Suspense>
  );
}
