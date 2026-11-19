import { ContactForm } from "@/components/contact/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { PageHero } from "@/components/sections/PageHero";
import { Icon } from "@/components/ui/Icon";
import { getContent, getSite } from "@/lib/content";
import { hasLocale } from "@/lib/i18n";
import { crumbs, resolveLocale } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  return pageMetadata(locale, "/contact", getContent(locale, "contact").meta);
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const locale = await resolveLocale(params);
  const t = getContent(locale, "contact");
  const common = getContent(locale, "common");
  const site = getSite();
  const c = site.contact;

  const cards = [
    { icon: "pin" as const, label: t.info.locations, value: c.offices.map((o) => o.city).join(" · ") },
    { icon: "mail" as const, label: t.info.email, value: c.email, href: `mailto:${c.email}` },
    { icon: "phone" as const, label: t.info.phone, value: c.phone, href: c.phoneHref },
    { icon: "clock" as const, label: t.info.hours, value: common.footer.hours },
  ];

  return (
    <>
      <PageHero image="/images/photos/airport-aerial.png" eyebrow={t.hero.eyebrow} title={t.hero.title} text={t.hero.text} crumbs={crumbs(locale, { label: common.nav.contact })} />

      <section className="tone-light panel-light section-y">
        <div className="container-x pb-12">
        <Reveal stagger={80} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => {
            const inner = (
              <>
                <span className="grid size-11 place-items-center rounded-xl border border-white/10 bg-gradient-to-br from-sky/15 to-coral/15 text-white">
                  <Icon name={card.icon} className="size-5" />
                </span>
                <span className="mt-6 block font-mono text-[0.68rem] uppercase tracking-[0.16em] text-mist">{card.label}</span>
                <span className="mt-1.5 block font-display text-lg font-semibold text-white">{card.value}</span>
              </>
            );
            return card.href ? (
              <a key={card.label} href={card.href} className="spotlight surface block rounded-3xl p-6 transition-colors hover:border-white/15">
                {inner}
              </a>
            ) : (
              <div key={card.label} className="spotlight surface rounded-3xl p-6">
                {inner}
              </div>
            );
          })}
        </Reveal>
        </div>

        <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Reveal className="spotlight surface rounded-[2rem] p-7 sm:p-12">
            <ContactForm labels={t.form} locale={locale} />
          </Reveal>

          <Reveal delay={150} className="flex flex-col gap-6">
            <div className="surface relative flex-1 overflow-hidden rounded-[2rem] p-8">
              {/* Stylised office map: dots positioned by longitude/latitude */}
              <div className="relative aspect-[4/3] w-full">
                {c.offices.map((o) => {
                  const x = ((o.lon + 10) / 75) * 100;
                  const y = ((58 - o.lat) / 36) * 100;
                  return (
                    <div key={o.city} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
                      <span className="relative flex size-3">
                        <span className={`absolute inset-0 animate-ping rounded-full ${o.type === "hq" ? "bg-coral/70" : "bg-sky/60"}`} />
                        <span className={`relative size-3 rounded-full ${o.type === "hq" ? "bg-coral" : "bg-sky"}`} />
                      </span>
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[0.68rem] uppercase tracking-[0.14em] text-white">
                        {o.city}
                      </span>
                    </div>
                  );
                })}
                <svg className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
                  {c.offices
                    .filter((o) => o.type !== "hq")
                    .map((o) => {
                      const hq = c.offices[0];
                      const x1 = ((hq.lon + 10) / 75) * 100;
                      const y1 = ((58 - hq.lat) / 36) * 100;
                      const x2 = ((o.lon + 10) / 75) * 100;
                      const y2 = ((58 - o.lat) / 36) * 100;
                      return (
                        <line
                          key={o.city}
                          x1={`${x1}%`}
                          y1={`${y1}%`}
                          x2={`${x2}%`}
                          y2={`${y2}%`}
                          stroke="url(#officeLine)"
                          strokeWidth="1"
                          strokeDasharray="4 5"
                        />
                      );
                    })}
                  <defs>
                    <linearGradient id="officeLine">
                      <stop offset="0" stopColor="#ff5a5f" />
                      <stop offset="1" stopColor="#67bad5" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <div className="surface rounded-[2rem] p-8">
              <p className="eyebrow">{t.info.hq}</p>
              <p className="mt-4 font-display text-xl font-semibold text-white">{c.address.building}</p>
              <p className="mt-1 text-fog/70">
                {c.address.street}
                <br />
                {c.address.city}
              </p>
              <p className="mt-5 eyebrow">{t.info.branches}</p>
              <p className="mt-2 text-white">
                {c.offices
                  .filter((o) => o.type === "branch")
                  .map((o) => o.city)
                  .join(" · ")}
              </p>
              <a
                href={c.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-soft hover:text-white"
              >
                {t.info.directions}
                <Icon name="arrowUpRight" className="size-4" />
              </a>
            </div>
          </Reveal>
        </div>
        </div>
      </section>
    </>
  );
}
