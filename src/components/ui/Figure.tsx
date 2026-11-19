"use client";

import * as H from "@lucasmarkes/hairline/react";
import type { ComponentType } from "react";

/**
 * Hairline isometric line figures (https://hairline.lucasmarkes.com) that
 * answer the pointer. Content JSON references them by name, e.g. "Hub".
 */
const figures = H as unknown as Record<
  string,
  ComponentType<{ intensity?: number; theme?: "auto" | "light" | "dark"; play?: boolean; label?: string; className?: string }>
>;

export function Figure({
  name,
  intensity = 0.6,
  play = false,
  label,
  className,
}: {
  name: string;
  intensity?: number;
  play?: boolean;
  label?: string;
  className?: string;
}) {
  const Cmp = figures[name];
  if (!Cmp) return null;
  return <Cmp intensity={intensity} theme="dark" play={play} label={label} className={className} />;
}
