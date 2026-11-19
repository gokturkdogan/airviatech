import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/content";
import { formatDate, localePath, type Locale } from "@/lib/i18n";
import { Caps } from "@/components/ui/Caps";
import { Icon } from "@/components/ui/Icon";

export function NewsCard({
  post,
  locale,
  category,
  readMore,
  featured = false,
}: {
  post: Post;
  locale: Locale;
  category: string;
  readMore: string;
  featured?: boolean;
}) {
  return (
    <Link
      href={localePath(locale, `/news/${post.slug}`)}
      className={`spotlight group flex h-full flex-col overflow-hidden rounded-3xl border border-white/8 bg-ink-900 transition-colors hover:border-white/15 ${
        featured ? "lg:grid lg:grid-cols-[1.15fr_1fr]" : ""
      }`}
    >
      <div className={`relative overflow-hidden bg-ink-800 ${featured ? "aspect-[4/3] lg:aspect-auto lg:h-full" : "aspect-[4/3]"}`}>
        <Image
          src={post.image}
          alt=""
          fill
          sizes={featured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
          className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-ink-950/60 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-white backdrop-blur">
          <Caps text={category} />
        </span>
      </div>
      <div className={`flex flex-1 flex-col p-6 ${featured ? "lg:p-10" : "sm:p-7"}`}>
        <time dateTime={post.date} className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-mist">
          {formatDate(post.date, locale)}
        </time>
        <h3
          className={`mt-3 font-display font-semibold leading-snug tracking-tight text-white ${
            featured ? "text-2xl lg:text-4xl" : "text-xl"
          }`}
        >
          {post.title}
        </h3>
        {featured && <p className="mt-4 text-fog/70 lg:text-lg">{post.excerpt}</p>}
        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-white">
          {readMore}
          <Icon name="arrowUpRight" className="size-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
