import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Caps } from "@/components/ui/Caps";

export function Eyebrow({ children, index, className = "" }: { children: string; index?: string; className?: string }) {
  return (
    <p className={`eyebrow ${className}`}>
      <span aria-hidden="true" className="h-px w-7 bg-coral" />
      {index && <span className="text-white/40">{index}</span>}
      <Caps text={children} />
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  index,
  title,
  text,
  align = "left",
  size = "md",
  as = "h2",
  children,
  className = "",
}: {
  eyebrow?: string;
  index?: string;
  title: string;
  text?: string;
  align?: "left" | "center";
  size?: "md" | "lg";
  as?: "h1" | "h2" | "h3";
  children?: ReactNode;
  className?: string;
}) {
  const center = align === "center";
  return (
    <div className={`${center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${className}`}>
      {eyebrow && <Eyebrow index={index} className={center ? "justify-center" : ""}>{eyebrow}</Eyebrow>}
      <SplitHeading as={as} className={`${size === "lg" ? "display-lg" : "display-md"} mt-5`}>
        {title}
      </SplitHeading>
      {text && (
        <Reveal delay={150}>
          <p className={`mt-6 text-lg leading-relaxed text-fog/70 ${center ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>{text}</p>
        </Reveal>
      )}
      {children}
    </div>
  );
}
