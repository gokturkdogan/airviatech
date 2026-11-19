import { notFound } from "next/navigation";
import { getContent } from "./content";
import { hasLocale, localePath, type Locale } from "./i18n";

/** Await route params, 404 on unknown locales. */
export async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  return locale;
}

/** Breadcrumb trail starting at Home. */
export function crumbs(locale: Locale, ...items: { label: string; href?: string }[]) {
  const home = getContent(locale, "common").nav.home;
  return [{ label: home, href: localePath(locale) }, ...items.map((i) => ({ ...i, href: i.href ? localePath(locale, i.href) : undefined }))];
}

/** Look up a nav label by href so breadcrumbs follow the JSON content. */
export function navLabel(locale: Locale, href: string): string {
  const { nav } = getContent(locale, "common");
  for (const item of nav.items) {
    if (item.href === href) return item.label;
    if (Array.isArray(item.children)) {
      const child = item.children.find((c) => c.href === href);
      if (child) return child.label;
    }
  }
  return href;
}
