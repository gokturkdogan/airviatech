"use client";

import { animate, stagger } from "animejs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { NavItem } from "@/lib/content";
import { LOCALE_COOKIE, localeMeta, localePath, locales, switchLocalePath, type Locale } from "@/lib/i18n";
import { Icon, type IconName } from "@/components/ui/Icon";

type Labels = { contact: string; cta: string; menu: string; close: string; language: string; allProducts: string };

function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

function LanguageSwitch({ locale, pathname, label }: { locale: Locale; pathname: string; label: string }) {
  return (
    <div role="group" aria-label={label} className="relative flex rounded-full border border-white/10 bg-white/[0.03] p-1 font-mono text-[0.7rem]">
      <span
        aria-hidden="true"
        className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-white/10 transition-transform duration-500 ease-[var(--ease-out-expo)]"
        style={{ transform: `translateX(${locales.indexOf(locale) * 100}%)` }}
      />
      {locales.map((l) => (
        <Link
          key={l}
          href={switchLocalePath(pathname, l)}
          hrefLang={l}
          lang={l}
          aria-current={l === locale ? "true" : undefined}
          onClick={() => rememberLocale(l)}
          className={`relative z-10 w-9 rounded-full py-1.5 text-center tracking-widest transition-colors ${
            l === locale ? "text-white" : "text-mist hover:text-white"
          }`}
          title={localeMeta[l].label}
        >
          {localeMeta[l].short}
        </Link>
      ))}
    </div>
  );
}

/** Icon for each menu destination (falls back to a plane). */
const NAV_ICONS: Record<string, IconName> = {
  "/about": "building",
  "/about/career": "briefcase",
  "/airviatech": "layers",
  "/airviatech/features": "sliders",
  "/airviatech/infrastructure": "server",
  "/products/airviatech-aggregator": "globe",
  "/products/airviago-charter": "plane",
  "/products/airviatech-api": "code",
  "/products/airviatech-agent": "users",
  "/products/airviatech-e-commerce": "cart",
  "/products/airviatech-app": "mobile",
  "/products/airviatech-enterprise": "briefcase",
};

/**
 * Hover / focus mega panel: a photo feature card on the left and icon links
 * on the right. A short close delay lets the pointer travel from the trigger.
 */
function NavPanel({ item, locale, pathname }: { item: NavItem; locale: Locale; pathname: string }) {
  const children = item.children ?? [];
  const wide = children.length > 4;
  return (
    <div
      className="invisible absolute left-1/2 top-full z-20 pt-4 opacity-0 transition-[opacity,visibility,translate] delay-150 duration-300 ease-[var(--ease-out-expo)] [translate:-50%_10px] group-focus-within/nav:visible group-focus-within/nav:opacity-100 group-focus-within/nav:delay-0 group-focus-within/nav:[translate:-50%_0] group-hover/nav:visible group-hover/nav:opacity-100 group-hover/nav:delay-0 group-hover/nav:[translate:-50%_0]"
    >
      {/* caret */}
      <span className="absolute left-1/2 top-[11px] z-10 size-3 -translate-x-1/2 rotate-45 rounded-[3px] border-l border-t border-white/10 bg-[#1e2346]" />
      <div
        className={`grid overflow-hidden rounded-[22px] border border-white/10 bg-[#1e2346]/[0.97] p-2 shadow-[0_40px_90px_-30px_rgb(4_6_20/0.95),0_0_0_1px_rgb(255_255_255/0.02)] backdrop-blur-xl ${
          wide ? "w-[900px] grid-cols-[250px_1fr]" : "w-[640px] grid-cols-[230px_1fr]"
        }`}
      >
        {item.feature && (
          <Link
            href={localePath(locale, item.href)}
            className="group/feat relative flex min-h-[230px] flex-col justify-end overflow-hidden rounded-2xl p-5"
          >
            <Image
              src={item.feature.image}
              alt=""
              fill
              sizes="250px"
              className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover/feat:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-[#141836] via-[#141836]/70 to-[#141836]/10" />
            <span className="relative">
              <span className="block font-display text-[1.05rem] font-semibold leading-snug text-white">{item.feature.title}</span>
              <span className="mt-1.5 block text-[0.8rem] leading-relaxed text-fog/75">{item.feature.text}</span>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-white">
                {item.feature.cta}
                <Icon name="arrowRight" className="size-3.5 transition-transform duration-500 group-hover/feat:translate-x-1" />
              </span>
            </span>
          </Link>
        )}

        <ul className={`grid content-start gap-0.5 p-2 ${wide ? "grid-cols-2" : ""} ${item.feature ? "" : "col-span-2"}`}>
          {children.map((child, i) => {
            const href = localePath(locale, child.href);
            const current = pathname === href;
            return (
              <li
                key={child.href}
                className="translate-y-1 opacity-0 transition-[opacity,translate] duration-500 ease-[var(--ease-out-expo)] group-focus-within/nav:translate-y-0 group-focus-within/nav:opacity-100 group-hover/nav:translate-y-0 group-hover/nav:opacity-100"
                style={{ transitionDelay: `${60 + i * 35}ms` }}
              >
                <Link
                  href={href}
                  aria-current={current ? "page" : undefined}
                  className={`group/item flex items-center gap-3.5 rounded-xl p-3 transition-colors hover:bg-white/[0.06] ${current ? "bg-white/[0.05]" : ""}`}
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-sky-soft transition-colors duration-300 group-hover/item:border-coral group-hover/item:bg-coral group-hover/item:text-white">
                    <Icon name={NAV_ICONS[child.href] ?? "plane"} className="size-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.9rem] font-semibold text-white">{child.label}</span>
                    {child.desc && <span className="mt-0.5 block text-[0.78rem] leading-snug text-fog/60">{child.desc}</span>}
                  </span>
                  <Icon
                    name="arrowUpRight"
                    className="size-4 shrink-0 -translate-x-1 text-fog/60 opacity-0 transition-all duration-300 group-hover/item:translate-x-0 group-hover/item:opacity-100"
                  />
                </Link>
              </li>
            );
          })}
          {wide && item.feature && children.length % 2 === 1 && (
            <li
              className="translate-y-1 opacity-0 transition-[opacity,translate] duration-500 ease-[var(--ease-out-expo)] group-focus-within/nav:translate-y-0 group-focus-within/nav:opacity-100 group-hover/nav:translate-y-0 group-hover/nav:opacity-100"
              style={{ transitionDelay: `${60 + children.length * 35}ms` }}
            >
              <Link
                href={localePath(locale, item.href)}
                className="group/item flex h-full items-center justify-between gap-3 rounded-xl border border-dashed border-white/15 p-3 pl-4 text-[0.9rem] font-semibold text-white transition-colors hover:border-coral hover:bg-coral/10"
              >
                {item.feature.cta}
                <Icon name="arrowRight" className="size-4 transition-transform duration-300 group-hover/item:translate-x-1" />
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export function Header({ locale, nav, labels }: { locale: Locale; nav: NavItem[]; labels: Labels }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  // The menu belongs to the page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (value: boolean | ((o: boolean) => boolean)) =>
    setOpenOn(() => ((typeof value === "function" ? value(open) : value) ? pathname : null));
  const [openSub, setOpenSub] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => {
    const full = localePath(locale, href);
    return pathname === full || pathname.startsWith(`${full}/`);
  };

  // Header state follows scroll direction
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 480 && y > lastY + 2 ? true : y < lastY - 2 ? false : (h) => h);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const panel = panelRef.current;
    if (!open || !panel) return;
    window.__lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const anim = animate(panel.querySelectorAll("[data-menu-item]"), {
      opacity: [0, 1],
      y: [40, 0],
      delay: stagger(60, { start: 150 }),
      duration: 900,
      ease: "out(4)",
    });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenOn(null);
    window.addEventListener("keydown", onKey);
    return () => {
      anim.revert();
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      window.__lenis?.start();
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[var(--ease-out-expo)] ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="container-x pt-3">
          <div
            className={`flex h-[60px] items-center justify-between gap-6 rounded-2xl pl-4 pr-2 transition-[background,border-color,box-shadow] duration-500 ${
              scrolled || open
                ? "glass shadow-[0_20px_60px_-30px_rgb(0_0_0/0.8)]"
                : "border border-transparent bg-transparent"
            }`}
          >
            <Link href={localePath(locale)} className="relative z-10 flex shrink-0 items-center" aria-label="AirviaTech">
              <Image
                src="/images/brand/logo-light.png"
                alt="AirviaTech — Wings of Technology"
                width={2787}
                height={795}
                loading="eager"
                fetchPriority="high"
                className="h-[34px] w-auto"
              />
            </Link>

            <nav aria-label="Main" className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {nav.map((item) => (
                  <li key={item.href} className="group/nav relative">
                    <Link
                      href={localePath(locale, item.href)}
                      className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-[0.9rem] font-medium transition-colors group-hover/nav:bg-white/[0.07] group-hover/nav:text-white ${
                        isActive(item.href) ? "text-white" : "text-fog/75"
                      }`}
                    >
                      {item.label}
                      {item.children && (
                        <Icon name="chevronDown" className="size-3.5 opacity-60 transition-transform duration-300 group-hover/nav:rotate-180" />
                      )}
                      {isActive(item.href) && (
                        <span className="absolute inset-x-3.5 -bottom-0.5 h-px bg-gradient-to-r from-sky to-coral" />
                      )}
                    </Link>
                    {item.children && <NavPanel item={item} locale={locale} pathname={pathname} />}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              <div className="hidden sm:block">
                <LanguageSwitch locale={locale} pathname={pathname} label={labels.language} />
              </div>
              <Link
                href={localePath(locale, "/contact")}
                className="magnetic hidden h-10 items-center gap-2 rounded-full bg-white px-5 font-display text-[0.875rem] font-semibold text-ink-950 transition-colors hover:bg-snow md:inline-flex"
              >
                {labels.cta}
                <Icon name="arrowUpRight" className="size-4" />
              </Link>
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? labels.close : labels.menu}
                className="grid size-10 place-items-center rounded-full border border-white/10 text-white lg:hidden"
              >
                <Icon name={open ? "close" : "menu"} className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        ref={panelRef}
        data-lenis-prevent
        className={`fixed inset-0 z-40 overflow-y-auto bg-ink-950/96 backdrop-blur-xl transition-[opacity,visibility] duration-500 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="pointer-events-none absolute -right-40 top-20 size-[420px] rounded-full bg-coral/20 blur-[120px]" />
        <div className="pointer-events-none absolute -left-40 bottom-0 size-[420px] rounded-full bg-sky/20 blur-[120px]" />
        <nav aria-label="Mobile" className="container-x relative pb-16 pt-28">
          <ul className="divide-y divide-white/8 border-y border-white/8">
            {nav.map((item, i) => (
              <li key={item.href} data-menu-item>
                <div className="flex items-center justify-between">
                  <Link
                    href={localePath(locale, item.href)}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 py-5 font-display text-3xl font-semibold tracking-tight text-white"
                  >
                    <span className="font-mono text-xs text-mist">0{i + 1}</span>
                    {item.label}
                  </Link>
                  {item.children && (
                    <button
                      type="button"
                      aria-label={item.label}
                      aria-expanded={openSub === item.href}
                      onClick={() => setOpenSub((s) => (s === item.href ? null : item.href))}
                      className="grid size-10 place-items-center rounded-full border border-white/10"
                    >
                      <Icon name="plus" className={`size-4 transition-transform duration-300 ${openSub === item.href ? "rotate-45" : ""}`} />
                    </button>
                  )}
                </div>
                {item.children && (
                  <div
                    className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease-out-expo)] ${
                      openSub === item.href ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <ul className="overflow-hidden">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={localePath(locale, child.href)}
                            onClick={() => setOpen(false)}
                            className="block py-2.5 pl-9 text-lg text-fog/80 hover:text-white"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                      <li className="h-4" />
                    </ul>
                  </div>
                )}
              </li>
            ))}
            <li data-menu-item>
              <Link
                href={localePath(locale, "/contact")}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4 py-5 font-display text-3xl font-semibold tracking-tight text-coral"
              >
                <span className="font-mono text-xs text-mist">0{nav.length + 1}</span>
                {labels.contact}
              </Link>
            </li>
          </ul>
          <div data-menu-item className="mt-10 flex items-center justify-between">
            <LanguageSwitch locale={locale} pathname={pathname} label={labels.language} />
            <span lang="en" className="eyebrow">
              Wings of Technology
            </span>
          </div>
        </nav>
      </div>
    </>
  );
}
