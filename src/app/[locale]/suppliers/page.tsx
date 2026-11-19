import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { PageHero } from "@/components/sections/PageHero";
import { Eyebrow, SectionHeading } from "@/components/sections/SectionHeading";
import { StatsBand } from "@/components/sections/StatsBand";
import { SupplierTabs } from "@/components/suppliers/SupplierTabs";
import { SupplierNetwork } from "@/components/three/scenes";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { getContent, getSite } from "@/lib/content";
import { hasLocale } from "@/lib/i18n";
import { crumbs, navLabel, resolveLocale } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";

const COLORS: Record<string, string> = {
  gds: "#67bad5",
  ndc: "#ff5a5f",
  xml: "#c9a6d9",
  ota: "#f2b880",
  charter: "#7fd1b9",
};

export async function generateMetadata({ params }: PageProps<"/[locale]/suppliers">) {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  return pageMetadata(locale, "/suppliers", getContent(locale, "suppliers").meta);
}

export default async function SuppliersPage({ params }: PageProps<"/[locale]/suppliers">) {
  const locale = await resolveLocale(params);
  const t = getContent(locale, "suppliers");
  const site = getSite();
  const cats = t.categories as Record<string, { label: string; full: string; text: string }>;
  const categories = site.suppliers.map((s) => ({ id: s.id, items: s.items, color: COLORS[s.id], ...cats[s.id] }));

  return (
    <>
      <PageHero
        eyebrow={t.hero.eyebrow}
        title={t.hero.title}
        text={t.hero.text}
        crumbs={crumbs(locale, { label: navLabel(locale, "/suppliers") })}
      />

      <section className="container-x">
        <StatsBand locale={locale} keys={t.stats} />
      </section>

      {/* 3D network */}
      <section className="relative mt-24 overflow-hidden border-y border-white/8 bg-[radial-gradient(ellipse_at_center,var(--color-ink-800),var(--color-ink-950)_70%)]">
        <div className="container-x pointer-events-none relative z-10 flex flex-wrap items-end justify-between gap-6 pt-16">
          <div>
            <Eyebrow>{t.network.eyebrow}</Eyebrow>
            <SplitHeading className="display-md mt-5">{t.network.title}</SplitHeading>
          </div>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-mist">{t.network.hint}</p>
        </div>
        <SupplierNetwork className="h-[78vh] min-h-[560px] w-full cursor-grab active:cursor-grabbing" center={t.network.center} categories={categories} />
        <ul className="container-x pointer-events-none relative z-10 -mt-20 flex flex-wrap gap-x-6 gap-y-2 pb-10">
          {categories.map((c) => (
            <li key={c.id} className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-fog/80">
              <span className="size-2 rounded-full" style={{ background: c.color }} />
              {c.label} · {c.items.length}
            </li>
          ))}
        </ul>
      </section>

      {/* Categories */}
      <section className="tone-light panel-light section-y">
        <div className="container-x">
        <SupplierTabs categories={categories} />
        </div>
      </section>

      {/* Ecosystem map */}
      <section className="container-x pb-12 pt-24">
        <SectionHeading title={t.map.title} text={t.map.text} />
        <ParallaxImage src="/images/ecosystem/ecosystem-map.png" alt={t.map.title} className="mt-12 aspect-[16/10] w-full bg-white" strength={3} />
      </section>

      <ContactCTA locale={locale} />
    </>
  );
}
