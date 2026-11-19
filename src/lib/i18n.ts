export const locales = ["en", "tr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const localeMeta: Record<Locale, { label: string; short: string; tag: string }> = {
  en: { label: "English", short: "EN", tag: "en-US" },
  tr: { label: "Türkçe", short: "TR", tag: "tr-TR" },
};

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Prefix an internal path with the locale: ("tr", "/about") -> "/tr/about" */
export function localePath(locale: Locale, path = "/"): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** Swap the locale segment of a pathname: "/en/about" -> "/tr/about" */
export function switchLocalePath(pathname: string, target: Locale): string {
  const parts = pathname.split("/");
  if (parts.length > 1 && hasLocale(parts[1])) {
    parts[1] = target;
    return parts.join("/") || `/${target}`;
  }
  return localePath(target, pathname);
}

export function formatDate(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(localeMeta[locale].tag, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00Z`));
}

const CITY_TR: Record<string, string> = {
  Istanbul: "İstanbul",
  London: "Londra",
  Singapore: "Singapur",
  "New York": "New York",
  Dubai: "Dubai",
  Antalya: "Antalya",
};

/** Localised city name for route labels. */
export function cityName(name: string, locale: Locale): string {
  return locale === "tr" ? (CITY_TR[name] ?? name) : name;
}
