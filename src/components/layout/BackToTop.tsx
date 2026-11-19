"use client";

import { Icon } from "@/components/ui/Icon";

export function BackToTop({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.8 });
        else window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="group inline-flex items-center gap-2 text-fog/60 transition-colors hover:text-white"
    >
      {label}
      <span className="grid size-8 place-items-center rounded-full border border-white/10 transition-transform duration-500 group-hover:-translate-y-1">
        <Icon name="arrowUp" className="size-4" />
      </span>
    </button>
  );
}
