import type { NextConfig } from "next";

/**
 * Permanent redirects from the old WordPress URLs so existing links and
 * search rankings keep working after the migration.
 */
const posts: [string, string][] = [
  ["airviatech-and-wingie-enuygun-group-join-forces-in-travel-technology", "airviatech-and-wingie-enuygun-group-join-forces-in-travel-technology"],
  ["ucuzabilet-selects-airviatech-for-its-airline-content-infrastructure", "ucuzabilet-selects-airviatech-for-its-airline-content-infrastructure"],
  ["turkish-airlines-ndc-application-process-why-you-should-choose-airviatech-as-your-aggregator", "turkish-airlines-ndc-application-process-why-you-should-choose-airviatech-as-your-aggregator"],
  ["airviatech-becomes-the-first-iata-certified-aggregator-based-in-turkey", "airviatech-becomes-the-first-iata-certified-aggregator-based-in-turkey"],
  ["airviatech-launches-a-fresh-perspective-backed-by-20-years-of-industry-experience", "airviatech-launches-a-fresh-perspective-backed-by-20-years-of-industry-experience"],
  ["what-airviatech-brings-to-the-travel-industry-more-than-just-technology", "what-airviatech-brings-to-the-travel-industry-more-than-just-technology"],
  ["airviatech-enters-the-market-with-a-strong-future-focused-vision", "airviatech-enters-the-market-with-a-strong-future-focused-vision"],
];

const trPosts: [string, string][] = [
  ["airviatech-ve-wingie-enuygun-grouptan-seyahat-teknolojilerinde-guc-birligi", posts[0][1]],
  ["ucuzabilet-hava-yolu-icerik-altyapisinda-airviatechi-tercih-etti", posts[1][1]],
  ["turkish-airlines-ndc-basvuru-sureci-ve-neden-airviatechi-secmelisiniz", posts[2][1]],
  ["airviatech-iata-sertifikali-ilk-turkiye-merkezli-aggregator-oldu", posts[3][1]],
  ["airviatech-kuruldu-20-yillik-deneyimle-sektore-yepyeni-bir-bakis", posts[4][1]],
  ["airviatech-seyahat-sektorune-ne-getiriyor-sadece-teknolojiden-fazlasi", posts[5][1]],
  ["gelecegin-seyahat-teknolojisi-airviatech-ile-bugun-basliyor", posts[6][1]],
];

const legacy: [string, string][] = [
  // English (old site served English at the root)
  ["/our-products", "/en/products"],
  ["/news-insights", "/en/news"],
  ["/contact-us", "/en/contact"],
  ["/airviatech/airviatech-features", "/en/airviatech/features"],
  ["/airviatech/our-infrastructure", "/en/airviatech/infrastructure"],
  ...posts.map(([from, to]): [string, string] => [`/${from}`, `/en/news/${to}`]),
  // Turkish
  ["/tr/hakkimizda", "/tr/about"],
  ["/tr/hakkimizda/kariyer", "/tr/about/career"],
  ["/tr/airviatech-online-ucak-bileti-yazilimi", "/tr/airviatech"],
  ["/tr/airviatech-online-ucak-bileti-yazilimi/airviatech-ozellikleri", "/tr/airviatech/features"],
  ["/tr/airviatech-online-ucak-bileti-yazilimi/altyapimiz", "/tr/airviatech/infrastructure"],
  ["/tr/urunlerimiz", "/tr/products"],
  ["/tr/urunlerimiz/airviatech-aggregator", "/tr/products/airviatech-aggregator"],
  ["/tr/urunlerimiz/airviatech-api", "/tr/products/airviatech-api"],
  ["/tr/products/airviatech-havayolu-aggregator", "/tr/products/airviatech-aggregator"],
  ["/tr/products/airviago-charter-sistemi", "/tr/products/airviago-charter"],
  ["/tr/products/airviatech-tek-api", "/tr/products/airviatech-api"],
  ["/tr/products/airviatech-acenta-b2b", "/tr/products/airviatech-agent"],
  ["/tr/products/airviatech-b2c", "/tr/products/airviatech-e-commerce"],
  ["/tr/products/airviatech-mobil-uygulama", "/tr/products/airviatech-app"],
  ["/tr/products/airviatech-kurumsal", "/tr/products/airviatech-enterprise"],
  ["/tr/tedarikciler", "/tr/suppliers"],
  ["/tr/haberler", "/tr/news"],
  ["/tr/iletisim", "/tr/contact"],
  ...trPosts.map(([from, to]): [string, string] => [`/tr/${from}`, `/tr/news/${to}`]),
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return legacy.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
};

export default nextConfig;
