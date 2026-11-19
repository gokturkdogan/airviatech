import { FlyBy } from "@/components/motion/FlyBy";
import { ProductIndex } from "@/components/products/ProductIndex";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { PageHero } from "@/components/sections/PageHero";
import { getContent } from "@/lib/content";
import { hasLocale, localePath } from "@/lib/i18n";
import { crumbs, navLabel, resolveLocale } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/products">) {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  return pageMetadata(locale, "/products", getContent(locale, "products").meta);
}

export default async function ProductsPage({ params }: PageProps<"/[locale]/products">) {
  const locale = await resolveLocale(params);
  const t = getContent(locale, "products");

  return (
    <>
      <PageHero
        eyebrow={t.hero.eyebrow}
        title={t.hero.title}
        text={t.hero.text}
        crumbs={crumbs(locale, { label: navLabel(locale, "/products") })}
      />
      <section className="tone-light panel-light section-y">
        <div className="container-x">
        <ProductIndex
          items={t.items.map((p) => ({
            slug: p.slug,
            name: p.name,
            tagline: p.tagline,
            category: p.category,
            image: p.image,
            figure: p.figure,
            href: localePath(locale, `/products/${p.slug}`),
          }))}
        />
        </div>
      </section>
      <FlyBy direction="rtl" className="mt-8" />
      <ContactCTA locale={locale} title={t.closing.title} text={t.closing.text} />
    </>
  );
}
