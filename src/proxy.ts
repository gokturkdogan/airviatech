import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, LOCALE_COOKIE, type Locale } from "@/lib/i18n";
import { PRESENTATION_MODE } from "@/lib/presentation";

/**
 * Locale routing: any path without a locale prefix is redirected to
 * /{locale}/… using the visitor's saved choice, then Accept-Language.
 */
function detectLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (saved && hasLocale(saved)) return saved;
  const header = request.headers.get("accept-language") ?? "";
  const preferred = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { lang: tag.slice(0, 2).toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { lang } of preferred) if (hasLocale(lang)) return lang;
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";
  if (hasLocale(first)) {
    // Presentation mode: only the home page is reachable
    const isHome = pathname === `/${first}` || pathname === `/${first}/`;
    if (PRESENTATION_MODE && !isHome) {
      const home = request.nextUrl.clone();
      home.pathname = `/${first}`;
      home.search = "";
      return NextResponse.redirect(home);
    }
    return;
  }

  const url = request.nextUrl.clone();
  url.pathname = PRESENTATION_MODE ? `/${detectLocale(request)}` : `/${detectLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, API routes, metadata files and anything with a file extension
  matcher: ["/((?!_next|api|images|data|icon|apple-icon|sitemap.xml|robots.txt|.*\\..*).*)"],
};
