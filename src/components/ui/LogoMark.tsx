/**
 * Vector re-drawing of the AirviaTech wing mark (sky + coral wings, dark keel)
 * so it can be animated. Coordinates follow the official PNG logo.
 */
export function LogoMark({ className, keel = "#2f3148" }: { className?: string; keel?: string }) {
  return (
    <svg viewBox="40 40 530 640" className={className} aria-hidden="true">
      <polygon data-wing="left" points="303,52 59,665 303,535" fill="#67bad5" />
      <polygon data-wing="right" points="303,52 548,665 303,535" fill="#ff5a5f" />
      <polygon data-wing="keel" points="303,52 207,483 303,535 398,483" fill={keel} />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className}>
      <span className="font-display font-bold tracking-[-0.03em] text-white">AirviaTech</span>
    </span>
  );
}
