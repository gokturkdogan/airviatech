import type { MetadataRoute } from "next";
import { getPosts, getProducts } from "@/lib/content";
import { defaultLocale, localePath, locales } from "@/lib/i18n";
import { SITE_URL } from "@/lib/seo";

const STATIC = ["/", "/about", "/about/career", "/airviatech", "/airviatech/features", "/airviatech/infrastructure", "/products", "/suppliers", "/news", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...STATIC,
    ...getProducts(defaultLocale).map((p) => `/products/${p.slug}`),
    ...getPosts(defaultLocale).map((p) => `/news/${p.slug}`),
  ];
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${SITE_URL}${localePath(locale, path)}`,
      changeFrequency: path.startsWith("/news") ? ("weekly" as const) : ("monthly" as const),
      priority: path === "/" ? 1 : 0.7,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}${localePath(l, path)}`])) },
    })),
  );
}
