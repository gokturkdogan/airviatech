import { ButtonLink } from "@/components/ui/Button";
import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { getContent } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import { Eyebrow } from "./SectionHeading";

export function ContactCTA({
  locale,
  title,
  text,
}: {
  locale: Locale;
  title?: string;
  text?: string;
}) {
  const { cta } = getContent(locale, "common");
  return (
    <section className="container-x section-y">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-ink-900 px-6 py-20 sm:px-14 lg:py-28">
        <div className="pointer-events-none absolute inset-0">
          <Image src="/images/photos/jumbo-sky.jpg" alt="" fill sizes="(min-width: 1360px) 1360px, 100vw" className="animate-kenburns object-cover object-[60%_40%]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(20_24_52/0.96)_0%,rgb(20_24_52/0.82)_45%,rgb(20_24_52/0.25)_100%)]" />
        </div>
        <div className="relative max-w-3xl">
          <Eyebrow>{cta.eyebrow}</Eyebrow>
          <SplitHeading className="display-lg mt-6">{title ?? cta.title}</SplitHeading>
          <Reveal delay={200}>
            <p className="mt-6 max-w-xl text-lg text-fog/75">{text ?? cta.text}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href={localePath(locale, "/contact")}>{cta.primary}</ButtonLink>
              <ButtonLink href={localePath(locale, "/products")} variant="ghost">
                {cta.secondary}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
