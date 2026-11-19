import { notFound } from "next/navigation";

// Always a 404: nothing to prefetch, so skip instant-navigation validation.
export const instant = false;

// Unknown URLs inside a locale render the localized not-found page.
export default function CatchAll() {
  notFound();
}
