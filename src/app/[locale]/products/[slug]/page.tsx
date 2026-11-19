import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/sections/PageSkeleton";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { CodeWindow } from "@/components/products/CodeWindow";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { PageHero } from "@/components/sections/PageHero";
import { Figure } from "@/components/ui/Figure";
import { Icon } from "@/components/ui/Icon";
import { getContent, getProduct, getProducts, type Product } from "@/lib/content";
import { defaultLocale, hasLocale, localePath, type Locale } from "@/lib/i18n";
import { crumbs, navLabel } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getProducts(defaultLocale).map((p) => ({ slug: p.slug }));
}

async function load(params: Promise<{ locale: string; slug: string }>) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();
  const product = getProduct(locale, slug);
  if (!product) notFound();
  return { locale, product };
}

export async function generateMetadata({ params }: PageProps<"/[locale]/products/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) return {};
  const p = getProduct(locale, slug);
  if (!p) return {};
  return pageMetadata(locale, `/products/${slug}`, {
    title: p.name,
    description: `${p.headline}. ${p.intro[0]}`,
    image: p.image,
  });
}

type Section = Product["sections"][number];

function SectionBlock({ section, index, stepLabel }: { section: Section; index: number; stepLabel: string }) {
  return (
    <section className="container-x py-16 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.6fr]">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)] lg:self-start">
          <span className="font-mono text-xs text-coral">{String(index + 1).padStart(2, "0")}</span>
          <SplitHeading className="display-md mt-3 !text-3xl sm:!text-[2.6rem]">{section.title}</SplitHeading>
          {"intro" in section && section.intro && (
            <Reveal>
              <p className="mt-5 text-lg leading-relaxed text-fog/70">{section.intro}</p>
            </Reveal>
          )}
        </div>

        {section.layout === "grid" && (
          <Reveal stagger={80} className="grid gap-4 sm:grid-cols-2">
            {section.items.map((it, i) => (
              <div key={i} className="spotlight surface rounded-3xl p-7">
                <span className="grid size-10 place-items-center rounded-xl border border-white/10 bg-gradient-to-br from-sky/15 to-coral/15 font-mono text-xs text-white">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {"title" in it && it.title && <h3 className="mt-5 font-display text-xl font-semibold text-white">{it.title}</h3>}
                <p className="mt-2.5 leading-relaxed text-fog/70">{it.text}</p>
              </div>
            ))}
          </Reveal>
        )}

        {section.layout === "list" && (
          <Reveal stagger={70} as="ul" className="divide-y divide-white/8 border-y border-white/8">
            {section.items.map((it, i) => (
              <li key={i} className="flex items-start gap-5 py-5 text-lg text-white/90">
                <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-sky/12 text-sky">
                  <Icon name="check" className="size-4" />
                </span>
                {it.text}
              </li>
            ))}
          </Reveal>
        )}

        {section.layout === "steps" && (
          <Reveal stagger={110} as="ol" className="relative grid gap-4 sm:grid-cols-2">
            {section.items.map((it, i) => (
              <li key={i} className="spotlight surface relative overflow-hidden rounded-3xl p-7">
                <span className="absolute -right-3 -top-6 font-display text-[7rem] font-bold leading-none text-white/[0.04]">{i + 1}</span>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-sky">{stepLabel} {String(i + 1).padStart(2, "0")}</span>
                {"title" in it && it.title && <h3 className="mt-4 font-display text-xl font-semibold text-white">{it.title}</h3>}
                <p className="mt-2.5 leading-relaxed text-fog/70">{it.text}</p>
              </li>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
}

function OtherProducts({ locale, current }: { locale: Locale; current: string }) {
  const ui = getContent(locale, "common").ui;
  const all = getProducts(locale);
  const idx = all.findIndex((p) => p.slug === current);
  const next = all[(idx + 1) % all.length];
  const others = all.filter((p) => p.slug !== current && p.slug !== next.slug);

  return (
    <section className="container-x pb-8 pt-16">
      <Link
        href={localePath(locale, `/products/${next.slug}`)}
        className="spotlight group relative grid overflow-hidden rounded-[2rem] border border-white/8 bg-ink-900 lg:grid-cols-[1.3fr_1fr]"
      >
        <div className="p-8 sm:p-14">
          <p className="eyebrow">{ui.nextProduct}</p>
          <h2 className="display-lg mt-5 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-3">{next.name}</h2>
          <p className="mt-4 text-lg text-fog/70">{next.tagline}</p>
          <span className="mt-10 inline-grid size-14 place-items-center rounded-full border border-white/15 text-white transition-all duration-500 group-hover:rotate-45 group-hover:border-coral group-hover:bg-coral">
            <Icon name="arrowUpRight" className="size-6" />
          </span>
        </div>
        <div className="grid place-items-center border-t border-white/8 bg-ink-850 p-8 lg:border-l lg:border-t-0">
          <div className="w-full max-w-xs">
            <Figure name={next.figure} play intensity={0.7} />
          </div>
        </div>
      </Link>

      <div className="mt-10 flex items-center justify-between">
        <p className="eyebrow">{ui.otherProducts}</p>
        <Link href={localePath(locale, "/products")} className="text-sm font-semibold text-white hover:text-sky-soft">
          {ui.backToProducts} →
        </Link>
      </div>
      <ul className="no-scrollbar mt-5 flex snap-x gap-3 overflow-x-auto pb-2">
        {others.map((p) => (
          <li key={p.slug} className="snap-start">
            <Link
              href={localePath(locale, `/products/${p.slug}`)}
              className="spotlight surface flex w-64 items-center gap-4 rounded-2xl p-3 pr-5 transition-colors hover:border-white/15"
            >
              <span className="w-16 shrink-0 overflow-hidden rounded-xl bg-ink-850">
                <Figure name={p.figure} intensity={0.5} />
              </span>
              <span>
                <span className="block font-display text-[0.95rem] font-semibold leading-tight text-white">{p.name}</span>
                <span className="mt-1 block text-xs text-mist">{p.category}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

async function ProductPageContent({ params }: PageProps<"/[locale]/products/[slug]">) {
  const { locale, product: p } = await load(params);

  return (
    <>
      <PageHero
        eyebrow={p.category}
        title={p.name}
        text={p.headline}
        crumbs={crumbs(locale, { label: navLabel(locale, "/products"), href: "/products" }, { label: p.name })}
        aside={
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgb(103_186_213/0.25),transparent_65%)] blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-ink-850/90 p-6 backdrop-blur">
              <Figure name={p.figure} play intensity={0.85} label={p.name} />
              <p className="mt-2 border-t border-white/8 pt-4 text-center font-mono text-[0.68rem] uppercase tracking-[0.2em] text-mist">
                {p.tagline}
              </p>
            </div>
          </div>
        }
      />

      {/* Intro */}
      <section className="tone-light panel-light section-y">
        <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SplitHeading className="display-md">{p.subheadline}</SplitHeading>
            <Reveal stagger={100} className="mt-8 space-y-5 text-lg leading-relaxed text-fog/75">
              {p.intro.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </Reveal>
          </div>
          {"code" in p && p.code ? (
            <Reveal>
              <CodeWindow title={p.code.title} lines={p.code.lines} />
            </Reveal>
          ) : (
            <ParallaxImage src={p.image} alt={p.name} className="aspect-[5/4] w-full" priority />
          )}
        </div>
        </div>
      </section>

      {p.sections.map((s, i) => (
        <SectionBlock key={s.title} section={s} index={i} stepLabel={getContent(locale, "common").ui.step} />
      ))}

      <OtherProducts locale={locale} current={p.slug} />
      <ContactCTA locale={locale} title={p.closing.title} text={p.closing.text} />
    </>
  );
}

// The slug is URL data: keep it behind Suspense so client navigations can show
// the shell instantly (each slug is still fully prerendered for direct visits).
export default function ProductPage(props: PageProps<"/[locale]/products/[slug]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ProductPageContent {...props} />
    </Suspense>
  );
}
