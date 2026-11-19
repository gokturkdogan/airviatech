/**
 * Content layer.
 *
 * All copy lives in JSON files under `src/content/{locale}/*.json` and
 * locale-independent data (stats, contact, airlines, suppliers…) lives in
 * `src/content/shared/site.json`. Strings may contain `{{token}}` placeholders
 * that are resolved from `site.tokens`, so a figure like the airline count is
 * changed in exactly one place.
 *
 * When the content moves to a CMS / admin panel later, only this file needs to
 * change: keep the same function signatures and return the same shapes.
 */
import site from "@/content/shared/site.json";

import enCommon from "@/content/en/common.json";
import enHome from "@/content/en/home.json";
import enAbout from "@/content/en/about.json";
import enCareer from "@/content/en/career.json";
import enPlatform from "@/content/en/platform.json";
import enFeatures from "@/content/en/features.json";
import enInfrastructure from "@/content/en/infrastructure.json";
import enProducts from "@/content/en/products.json";
import enSuppliers from "@/content/en/suppliers.json";
import enNews from "@/content/en/news.json";
import enContact from "@/content/en/contact.json";

import trCommon from "@/content/tr/common.json";
import trHome from "@/content/tr/home.json";
import trAbout from "@/content/tr/about.json";
import trCareer from "@/content/tr/career.json";
import trPlatform from "@/content/tr/platform.json";
import trFeatures from "@/content/tr/features.json";
import trInfrastructure from "@/content/tr/infrastructure.json";
import trProducts from "@/content/tr/products.json";
import trSuppliers from "@/content/tr/suppliers.json";
import trNews from "@/content/tr/news.json";
import trContact from "@/content/tr/contact.json";

import type { Locale } from "./i18n";

const en = {
  common: enCommon,
  home: enHome,
  about: enAbout,
  career: enCareer,
  platform: enPlatform,
  features: enFeatures,
  infrastructure: enInfrastructure,
  products: enProducts,
  suppliers: enSuppliers,
  news: enNews,
  contact: enContact,
};

export type Dictionary = typeof en;
export type ContentKey = keyof Dictionary;

/*
 * The English files define the shape. Assigning the Turkish files to that type
 * makes TypeScript fail the build if a translation is missing a key or has a
 * different structure.
 */
const tr: Dictionary = {
  common: trCommon,
  home: trHome,
  about: trAbout,
  career: trCareer,
  platform: trPlatform,
  features: trFeatures,
  infrastructure: trInfrastructure,
  products: trProducts,
  suppliers: trSuppliers,
  news: trNews,
  contact: trContact,
};

const dictionaries: Record<Locale, Dictionary> = { en, tr };

export type Site = typeof site;
export type StatKey = keyof Site["stats"];
export type Product = Dictionary["products"]["items"][number];
export type Post = Dictionary["news"]["posts"][number];
export type PostBlock = Post["body"][number];

const tokens = site.tokens as Record<string, string>;

function interpolate<T>(value: T): T {
  if (typeof value === "string") {
    return value.replace(/\{\{(\w+)\}\}/g, (match, key: string) => tokens[key] ?? match) as T;
  }
  if (Array.isArray(value)) return value.map(interpolate) as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = interpolate(v);
    return out as T;
  }
  return value;
}

const cache = new Map<string, unknown>();

export function getContent<K extends ContentKey>(locale: Locale, key: K): Dictionary[K] {
  const id = `${locale}:${key}`;
  if (!cache.has(id)) cache.set(id, interpolate(dictionaries[locale][key]));
  return cache.get(id) as Dictionary[K];
}

export function getSite(): Site {
  return site;
}

export function getProducts(locale: Locale) {
  return getContent(locale, "products").items;
}

export function getProduct(locale: Locale, slug: string): Product | undefined {
  return getProducts(locale).find((p) => p.slug === slug);
}

export function getPosts(locale: Locale): Post[] {
  return [...getContent(locale, "news").posts].sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(locale: Locale, slug: string): Post | undefined {
  return getPosts(locale).find((p) => p.slug === slug);
}

export function readingTime(post: Post): number {
  const words = post.body
    .map((b) => ("text" in b && b.text ? b.text : "") + ("items" in b && b.items ? b.items.join(" ") : ""))
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/** Navigation shape shared with client components. */
export type NavChild = { label: string; href: string; desc?: string };
export type NavFeature = { image: string; title: string; text: string; cta: string };
export type NavItem = { label: string; href: string; children?: NavChild[]; feature?: NavFeature };

export function getNavigation(locale: Locale): NavItem[] {
  const { nav } = getContent(locale, "common");
  const products = getProducts(locale);
  return nav.items.map((item) => {
    const feature = "feature" in item ? item.feature : undefined;
    if (!("children" in item) || !item.children) return { label: item.label, href: item.href };
    if (typeof item.children === "string") {
      // "products" placeholder: the submenu is generated from products.json
      return {
        label: item.label,
        href: item.href,
        children: products.map((p) => ({ label: p.name, href: `/products/${p.slug}`, desc: p.tagline })),
        feature,
      };
    }
    return { label: item.label, href: item.href, children: item.children, feature };
  });
}
