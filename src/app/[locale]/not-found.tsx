import { locale as rootLocale } from "next/root-params";
import { ButtonLink } from "@/components/ui/Button";
import { SkyBackdrop } from "@/components/three/scenes";
import { getContent } from "@/lib/content";
import { defaultLocale, hasLocale, localePath } from "@/lib/i18n";

export default async function NotFound() {
  // not-found receives no params; the root param getter gives us the locale
  const value = await rootLocale();
  const locale = value && hasLocale(value) ? value : defaultLocale;
  const t = getContent(locale, "common").notFound;

  return (
    <section className="relative isolate grid min-h-[100svh] place-items-center overflow-hidden px-6 text-center">
      <div className="sky-gradient absolute inset-0 -z-10" />
      <SkyBackdrop className="absolute inset-0 -z-10" />
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-coral">{t.code}</p>
        <h1 className="display-lg mx-auto mt-6 max-w-3xl">{t.title}</h1>
        <p className="mx-auto mt-6 max-w-md text-fog/70">{t.text}</p>
        <div className="mt-10 flex justify-center">
          <ButtonLink href={localePath(locale)}>{t.cta}</ButtonLink>
        </div>
      </div>
    </section>
  );
}
