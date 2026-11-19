"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** Copyright year, read on the client so the prerendered shell stays static. */
export function CurrentYear({ fallback }: { fallback: number }) {
  const year = useSyncExternalStore(noop, () => new Date().getFullYear(), () => fallback);
  return <span>{year}</span>;
}
