"use client";

/**
 * WebGL scenes are client-only and code-split so the three.js bundle never
 * blocks first paint. Import scenes from here, not from their files.
 */
import dynamic from "next/dynamic";

export const SkyHero = dynamic(() => import("./Sky").then((m) => m.SkyHero), { ssr: false });
export const SkyBackdrop = dynamic(() => import("./Sky").then((m) => m.SkyBackdrop), { ssr: false });
export const SupplierNetwork = dynamic(() => import("./SupplierNetwork"), { ssr: false });
