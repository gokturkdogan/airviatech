# AirviaTech — web sitesi

AirviaTech'in kurumsal sitesi (eski WordPress sitesinin yerine). Next.js 16 (App Router), Three.js, anime.js ve Hairline ile yazıldı. Veritabanı yok: tüm içerik JSON dosyalarından okunuyor.

```bash
npm install
npm run dev      # http://localhost:3000  →  /en veya /tr'ye yönlenir
npm run build && npm start
npm run lint
```

## Teknoloji

| Alan | Kullanılan |
| --- | --- |
| Framework | Next.js 16 App Router, `cacheComponents` + Partial Prefetching. Tüm sayfalar build sırasında statik üretilir |
| 3D | `three`, `@react-three/fiber`, `@react-three/drei` |
| Animasyon | `animejs` v4 (splitText, onScroll, timeline, SVG motion path), `lenis` (yumuşak kaydırma) |
| Çizim figürleri | `@lucasmarkes/hairline` (ürün ve özellik kartlarında, fareye tepki veren çizgi figürleri) |
| Stil | Tailwind CSS v4. Tasarım token'ları `src/app/globals.css` içinde |
| Fontlar | Kumbh Sans (başlık), Mulish (metin ve etiketler), JetBrains Mono (yalnızca kod) |

## İçerik yönetimi (JSON)

```
src/content/
  shared/site.json      dilden bağımsız veriler: iletişim, ofisler, istatistikler,
                        havayolu logoları, tedarikçi listeleri, küre rotaları, {{token}} değerleri
  en/*.json             İngilizce metinler (yapının referansı)
  tr/*.json             Türkçe metinler (EN ile birebir aynı yapıda olmalı)
```

- **Rakamlar tek yerden değişir.** Metinlerdeki `{{airlines}}`, `{{dailyQueries}}` gibi ifadeler `site.json → tokens` alanından doldurulur. Sayaçlar `site.json → stats` alanından okunur. Değerlerin hepsi şimdilik eski siteden alınmış mock değerler.
- **Çeviri kontrolü otomatik.** `src/lib/content.ts`, TR dosyalarını EN tipine atar. Bir anahtar eksikse ya da yapı farklıysa `tsc`/`build` hata verir.
- **Ürün ve haber eklemek** için `products.json → items` veya `news.json → posts` dizisine kayıt eklemek yeterli. Sayfa, menü, footer ve sitemap kendiliğinden güncellenir. Slug'lar iki dilde aynı olmalı.
- **Figür seçimi.** `figure` alanı bir Hairline figür adı alır (`Hub`, `Relay`, `Terminal`, `Cabinet`, `Phone` vb.).
- **Panel/CMS'e taşırken** yalnızca `src/lib/content.ts` değişir. Aynı fonksiyon imzaları (`getContent`, `getProducts`, `getPosts`…) korunursa sayfalara dokunmak gerekmez.

## Diller ve URL'ler

- `/en/...` ve `/tr/...`. Kök adres, çerezdeki tercih → `Accept-Language` → `en` sırasıyla yönlendirilir (`src/proxy.ts`).
- Eski WordPress URL'leri (`/our-products`, `/tr/hakkimizda`, eski haber slug'ları…) `next.config.ts` içinde 308 ile yeni adreslere yönlendirilir.
- Her sayfada canonical ve hreflang tanımlı. `sitemap.xml` ve `robots.txt` otomatik üretilir.

## Dizinler

```
src/app/[locale]/        sayfalar (kök layout burada)
src/app/api/             contact & newsletter uç noktaları (şimdilik sadece log; e-posta/CRM bağlanacak)
src/components/three/    WebGL: Airliner (kodla modellenmiş uçak), Sky (bulutlar, ana sayfa ve iç sayfa gökyüzü), SupplierNetwork
src/components/motion/   anime.js bileşenleri: SplitHeading, Reveal, ScrollText, Counter, ParallaxImage, FlightPath
src/components/…         layout, sections, products, news, contact, ui
public/images/           eski siteden alınan görseller
```

## Notlar

- 3D uçak three.js primitifleriyle kodda modellendi (lisans gerektiren model dosyası yok); bulut dokuları tarayıcıda canvas ile üretiliyor.
- İç sayfa hero'su `PageHero` için `image` verilirse fotoğraf (yavaş zoom), verilmezse bulutlu gökyüzü sahnesi kullanılır.
- 3D sahneler `ssr:false` ile ayrı paketlenir. Yalnızca ekrandayken render edilir ve `prefers-reduced-motion` açıkken durur.
- Next 16, gezinme sırasında önceki sayfayı `<Activity>` ile gizli tutar. Animasyonlar ve WebGL bu yüzden effect cleanup'larında kendini geri alır.
- Form uç noktaları gönderimleri doğrulayıp yalnızca sunucu loguna yazar. Gerçek gönderim için `src/app/api/contact/route.ts → deliver()` doldurulmalı.
