import type { Metadata, Viewport } from "next";
import { Instrument_Serif, JetBrains_Mono, Kumbh_Sans, Mulish } from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";
import "../globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { InteractionLayer } from "@/components/layout/InteractionLayer";
import { Preloader } from "@/components/layout/Preloader";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { getContent, getNavigation, getSite } from "@/lib/content";
import { hasLocale, locales } from "@/lib/i18n";
import { INDEXABLE, SITE_URL } from "@/lib/seo";

const kumbh = Kumbh_Sans({ subsets: ["latin", "latin-ext"], variable: "--font-kumbh", display: "swap" });
const mulish = Mulish({ subsets: ["latin", "latin-ext"], variable: "--font-mulish", display: "swap" });
const serif = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});
const mono = JetBrains_Mono({ subsets: ["latin", "latin-ext"], variable: "--font-jetbrains", display: "swap" });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const { meta } = getContent(locale, "common");
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: meta.defaultTitle, template: meta.titleTemplate },
    description: meta.description,
    applicationName: meta.siteName,
    formatDetection: { telephone: false },
    robots: INDEXABLE ? undefined : { index: false, follow: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#181c38",
  colorScheme: "dark",
};

/* Runs before paint: enables JS-only animation states and skips the intro
   overlay if it already played this session. */
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('airviatech:intro')||matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('intro-seen')}else{d.classList.add('intro-playing')}}catch(e){d.classList.add('intro-seen')}})();`;

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  const common = getContent(locale, "common");
  const site = getSite();

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.company.name,
    legalName: site.company.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}/images/brand/logo-dark.png`,
    slogan: site.company.vision,
    email: site.contact.email,
    telephone: site.contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.contact.address.building}, ${site.contact.address.street}`,
      addressLocality: "Ataşehir, İstanbul",
      postalCode: "34634",
      addressCountry: "TR",
    },
    sameAs: site.social.map((s) => s.href),
  };

  return (
    <html lang={locale} className={`${kumbh.variable} ${mulish.variable} ${serif.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </head>
      <body>
        <Script id="airviatech-boot" strategy="beforeInteractive">
          {bootScript}
        </Script>
        <a
          href="#main"
          className="fixed left-4 top-4 z-[200] -translate-y-24 rounded-full bg-white px-5 py-3 font-semibold text-ink-950 focus:translate-y-0"
        >
          {common.ui.skipToContent}
        </a>
        <Preloader tagline={site.company.tagline} />
        <SmoothScroll />
        <InteractionLayer />
        <Header
          locale={locale}
          nav={getNavigation(locale)}
          labels={{
            contact: common.nav.contact,
            cta: common.nav.cta,
            menu: common.nav.menu,
            close: common.nav.close,
            language: common.nav.language,
            allProducts: common.nav.allProducts,
          }}
        />
        <main id="main">{children}</main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
