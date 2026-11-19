import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "ghost" | "light" | "link";

const base =
  "group/btn relative inline-flex items-center justify-center gap-3 rounded-full font-display text-[0.95rem] font-semibold tracking-[-0.01em] transition-[background,color,box-shadow,border-color] duration-300 ease-[var(--ease-out-expo)] focus-visible:outline-offset-4 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "magnetic h-12 pl-6 pr-2 text-white bg-[linear-gradient(110deg,var(--color-coral),#ff7a6b_45%,#e8495f)] shadow-[0_10px_40px_-12px_rgb(255_90_95/0.7),inset_0_1px_0_rgb(255_255_255/0.25)] hover:shadow-[0_14px_50px_-10px_rgb(255_90_95/0.9),inset_0_1px_0_rgb(255_255_255/0.3)]",
  ghost:
    "magnetic h-12 pl-6 pr-2 text-white border border-white/12 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/25 backdrop-blur-md",
  light: "magnetic h-12 pl-6 pr-2 text-ink-950 bg-white hover:bg-snow",
  link: "h-auto px-0 text-white hover:text-sky-soft",
};

const bubble: Record<Variant, string> = {
  primary: "bg-white/15 text-white",
  ghost: "bg-white/8 text-white group-hover/btn:bg-white group-hover/btn:text-ink-950",
  light: "bg-ink-950 text-white",
  link: "bg-transparent text-current",
};

function Inner({ children, icon, variant }: { children: ReactNode; icon: IconName; variant: Variant }) {
  return (
    <>
      <span>{children}</span>
      <span
        className={`relative grid size-8 place-items-center overflow-hidden rounded-full transition-colors duration-300 ${bubble[variant]}`}
      >
        <Icon
          name={icon}
          className="size-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-6"
        />
        <Icon
          name={icon}
          className="absolute size-4 -translate-x-6 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-0"
        />
      </span>
    </>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  icon = "arrowRight",
  className = "",
  external,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  icon?: IconName;
  className?: string;
  external?: boolean;
}) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (external || /^(https?:|mailto:|tel:)/.test(href)) {
    return (
      <a href={href} className={cls} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
        <Inner icon={icon} variant={variant}>{children}</Inner>
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      <Inner icon={icon} variant={variant}>{children}</Inner>
    </Link>
  );
}

export function Button({
  children,
  variant = "primary",
  icon = "arrowRight",
  className = "",
  ...props
}: {
  children: ReactNode;
  variant?: Variant;
  icon?: IconName;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${base} ${variants[variant]} disabled:opacity-60 ${className}`} {...props}>
      <Inner icon={icon} variant={variant}>{children}</Inner>
    </button>
  );
}
