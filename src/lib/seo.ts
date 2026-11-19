import type { Metadata } from "next";
import { localeMeta, localePath, locales, type Locale } from "./i18n";

export const LIVE_URL = "https://www.airviatech.com";

/**
 * Absolute base URL for canonical, Open Graph and sitemap links.
 * 1. NEXT_PUBLIC_SITE_URL when set explicitly
 * 2. on Vercel, the project's production domain (set automatically at build time)
 * 3. otherwise the live domain
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : LIVE_URL);

/** Only the real domain may be indexed; preview and temporary deploys stay out of search. */
export const INDEXABLE = SITE_URL === LIVE_URL;

/** Per-page metadata with canonical + hreflang alternates for both languages. */
export function pageMetadata(
  locale: Locale,
  path: string,
  { title, description, image }: { title: string; description: string; image?: string },
): Metadata {
  const languages: Record<string, string> = Object.fromEntries(locales.map((l) => [l, localePath(l, path)]));
  languages["x-default"] = localePath("en", path);
  return {
    title,
    description,
    alternates: { canonical: localePath(locale, path), languages },
    openGraph: {
      title,
      description,
      url: localePath(locale, path),
      siteName: "AirviaTech",
      locale: localeMeta[locale].tag.replace("-", "_"),
      type: "website",
      images: [{ url: image ?? "/images/photos/airport-aerial.png" }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
