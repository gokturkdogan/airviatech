import { Reveal } from "@/components/motion/Reveal";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Figure } from "@/components/ui/Figure";
import { Icon } from "@/components/ui/Icon";
import { getContent, getSite } from "@/lib/content";
import { hasLocale } from "@/lib/i18n";
import { crumbs, navLabel, resolveLocale } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/about/career">) {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  return pageMetadata(locale, "/about/career", getContent(locale, "career").meta);
}

export default async function CareerPage({ params }: PageProps<"/[locale]/about/career">) {
  const locale = await resolveLocale(params);
  const t = getContent(locale, "career");
  const site = getSite();
  const mail = (subject: string) => `mailto:${site.contact.careersEmail}?subject=${encodeURIComponent(subject)}`;

  return (
    <>
      <PageHero
        image="/images/photos/corporate.jpg"
        eyebrow={t.hero.eyebrow}
        title={t.hero.title}
        text={t.hero.text}
        crumbs={crumbs(locale, { label: navLabel(locale, "/about"), href: "/about" }, { label: navLabel(locale, "/about/career") })}
      />

      <section className="tone-light panel-light section-y">
        <div className="container-x pb-16">
        <Reveal stagger={120} className="grid gap-8 text-lg leading-relaxed text-fog/75 lg:grid-cols-3">
          {t.intro.paragraphs.map((p, i) => (
            <p key={p} className={i === 0 ? "font-display text-2xl leading-snug text-white" : ""}>
              {p}
            </p>
          ))}
        </Reveal>
        </div>

        <div className="container-x">
        <Reveal stagger={110} className="grid gap-4 md:grid-cols-3">
          {t.values.map((v) => (
            <div key={v.title} className="spotlight surface overflow-hidden rounded-3xl">
              <div className="bg-ink-850 px-10 pt-4">
                <Figure name={v.figure} intensity={0.7} />
              </div>
              <div className="border-t border-white/8 p-7">
                <h3 className="font-display text-xl font-semibold text-white">{v.title}</h3>
                <p className="mt-2 text-fog/65">{v.text}</p>
              </div>
            </div>
          ))}
        </Reveal>
        </div>
      </section>

      <section className="container-x pb-12 pt-24">
        <SectionHeading title={t.openings.title} text={t.openings.text} size="lg" />
        <Reveal stagger={100} as="ul" className="mt-14 divide-y divide-white/8 border-y border-white/8">
          {t.openings.items.map((job) => (
            <li key={job.title}>
              <a
                href={mail(`${t.openings.mailSubject}: ${job.title}`)}
                className="group flex flex-wrap items-center justify-between gap-6 py-8 transition-colors hover:bg-white/[0.02] sm:px-4"
              >
                <div>
                  <h3 className="font-display text-2xl font-semibold text-white transition-colors group-hover:text-sky-soft sm:text-3xl">
                    {job.title}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-mist">
                    {[job.team, job.location, job.type].map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 px-3 py-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="inline-flex items-center gap-3 font-display font-semibold text-white">
                  {t.openings.applyLabel}
                  <span className="grid size-12 place-items-center rounded-full border border-white/15 transition-all duration-500 group-hover:rotate-45 group-hover:border-coral group-hover:bg-coral">
                    <Icon name="arrowUpRight" className="size-5" />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </Reveal>
        <div className="mt-12">
          <ButtonLink href={mail(t.openings.mailSubject)} icon="mail">
            {t.openings.cta}
          </ButtonLink>
        </div>
      </section>

      <ContactCTA locale={locale} />
    </>
  );
}
