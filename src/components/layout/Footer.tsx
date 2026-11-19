import Image from "next/image";
import Link from "next/link";
import { getContent, getNavigation, getProducts, getSite } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";
import { BackToTop } from "./BackToTop";
import { CurrentYear } from "./CurrentYear";
import { DeparturesBoard, type BoardRow } from "./DeparturesBoard";
import { NewsletterForm } from "./NewsletterForm";
import { Runway } from "./Runway";

const FLIGHTS = [
  { flight: "AT 101", gate: "A1", time: "09:10" },
  { flight: "AT 214", gate: "A4", time: "09:35" },
  { flight: "AT 330", gate: "B2", time: "10:05" },
  { flight: "AT 452", gate: "B7", time: "10:40" },
  { flight: "AT 518", gate: "C3", time: "11:15" },
  { flight: "AT 676", gate: "C9", time: "11:50" },
];

export function Footer({ locale }: { locale: Locale }) {
  const { footer, newsletter, nav } = getContent(locale, "common");
  const products = getProducts(locale);
  const site = getSite();
  const board = footer.board;

  const destinations = [...getNavigation(locale).map((n) => ({ label: n.label, href: n.href })), { label: nav.contact, href: "/contact" }];
  const rows: BoardRow[] = destinations.slice(0, FLIGHTS.length).map((d, i) => ({
    ...FLIGHTS[i],
    destination: d.label,
    href: localePath(locale, d.href),
    status: board.statuses[i % board.statuses.length],
  }));

  return (
    <footer className="relative overflow-hidden border-t border-white/8 bg-ink-950">
      <div className="container-x grid gap-12 pb-16 pt-20 lg:grid-cols-[1.55fr_1fr] lg:gap-16">
        <DeparturesBoard
          rows={rows}
          labels={board}
          lang={locale}
          notice={`✈  ${site.company.vision}  ·  ${footer.tagline}  ·  ${site.contact.phone}  ·  ${site.contact.email}`}
        />

        <div className="flex flex-col gap-10">
          <div>
            <Image src="/images/brand/logo-light.png" alt="AirviaTech" width={2787} height={795} className="h-10 w-auto" />
            <p className="mt-5 max-w-sm text-fog/70">{footer.tagline}</p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-white">{newsletter.title}</h2>
            <p className="mb-5 mt-2 text-sm text-fog/65">{newsletter.text}</p>
            <NewsletterForm labels={newsletter} locale={locale} />
          </div>

          <dl className="grid gap-5 text-sm sm:grid-cols-2">
            <div>
              <dt className="eyebrow !text-fog/50">{footer.visitUs}</dt>
              <dd className="mt-2 leading-relaxed text-fog/80">
                {site.contact.address.building}
                <br />
                {site.contact.address.street}
                <br />
                {site.contact.address.city}
              </dd>
            </div>
            <div className="space-y-4">
              <div>
                <dt className="eyebrow !text-fog/50">{footer.phoneUs}</dt>
                <dd className="mt-2">
                  <a href={site.contact.phoneHref} className="text-white hover:text-sky-soft">
                    {site.contact.phone}
                  </a>
                  <span className="block text-fog/55">{footer.hours}</span>
                </dd>
              </div>
              <div>
                <dt className="eyebrow !text-fog/50">{footer.emailUs}</dt>
                <dd className="mt-2">
                  <a href={`mailto:${site.contact.email}`} className="text-white hover:text-sky-soft">
                    {site.contact.email}
                  </a>
                </dd>
              </div>
            </div>
          </dl>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              {site.social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid size-10 place-items-center rounded-full border border-white/12 text-fog/80 transition-colors hover:border-white/40 hover:text-white"
                >
                  <Icon name={s.label === "LinkedIn" ? "linkedin" : "instagram"} className="size-[18px]" />
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2" title={footer.certified}>
              {site.badges.map((b) => (
                <span key={b.name} className="grid size-10 place-items-center rounded-lg bg-white p-1.5" title={b.name}>
                  <Image src={b.image} alt={b.name} width={64} height={64} className="h-full w-auto object-contain" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* product links as a quiet strip */}
      <div className="container-x">
        <nav aria-label={footer.productsTitle} className="flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-white/8 py-5 text-sm">
          <span className="eyebrow !text-fog/50">{footer.productsTitle}</span>
          {products.map((p) => (
            <Link key={p.slug} href={localePath(locale, `/products/${p.slug}`)} className="text-fog/75 transition-colors hover:text-white">
              {p.name}
            </Link>
          ))}
        </nav>
      </div>

      <Runway caption={board.runway} />

      <div className="relative bg-[#0d1028]">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-6 text-xs text-fog/50 sm:flex-row">
          <p>
            © {site.company.foundedYear} – <CurrentYear fallback={2026} /> {site.company.legalName} {footer.rights}
          </p>
          <p lang="en" className="uppercase tracking-[0.3em]">
            {site.company.tagline}
          </p>
          <BackToTop label={footer.backToTop} />
        </div>
      </div>
    </footer>
  );
}
