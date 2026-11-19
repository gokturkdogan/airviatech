/**
 * Side-view airliner in AirviaTech livery (nose to the right).
 * Drawn on a 160 × 48 box; size it with width/height classes.
 */
export function JetSide({ className, gear = false }: { className?: string; gear?: boolean }) {
  return (
    <svg viewBox="0 0 160 48" className={className} aria-hidden="true">
      {/* far wing + engine (shadowed) */}
      <path d="M70 26 L86 13 L92 13 L84 26 Z" fill="#b9c2d6" />
      {/* tail fin with the wing-mark */}
      <path d="M14 22 L6 2 L16 2 L36 21 Z" fill="#ffffff" />
      <path d="M11 4 L16 4 L19 17 Z" fill="#67bad5" />
      <path d="M16 4 L23 4 L19 17 Z" fill="#ff5a5f" />
      {/* horizontal stabiliser */}
      <path d="M12 25 L1 21 L7 20 L22 24 Z" fill="#d7deeb" />
      {/* fuselage */}
      <path
        d="M12 26 C12 21 17 19.5 25 19.5 L126 19.5 C139 19.5 150 22.5 155 27 C150 31.5 139 33.5 126 33.5 L25 33.5 C17 33.5 12 31 12 26 Z"
        fill="#f4f6fb"
      />
      {/* navy belly + coral cheatline */}
      <path d="M22 30.5 L130 30.5 C141 30.5 149 30 153 29.2 C149 31.8 140 33.5 126 33.5 L25 33.5 C20 33.5 16 32.6 14 31.2 Z" fill="#22284f" />
      <rect x="28" y="28.4" width="104" height="0.9" fill="#ff5a5f" />
      {/* windows */}
      {Array.from({ length: 22 }, (_, i) => (
        <rect key={i} x={34 + i * 4.2} y={23.2} width={1.9} height={2.4} rx={0.9} fill="#1d2142" />
      ))}
      <path d="M142 23.4 L149 24.6 L147.5 26.2 L141.5 25.6 Z" fill="#1d2142" />
      {/* near wing + engine */}
      <path d="M66 29 L50 44 L58 44 L86 29 Z" fill="#dfe5f0" />
      <rect x="66" y="33.5" width="20" height="6.5" rx="3.2" fill="#22284f" />
      <rect x="84.5" y="34" width="2" height="5.5" rx="1" fill="#8792ad" />
      {gear && (
        <g fill="#2c3157">
          <rect x="70" y="40" width="1.6" height="6" />
          <circle cx="70.8" cy="46.2" r="1.8" />
          <rect x="136" y="33" width="1.4" height="9" />
          <circle cx="136.7" cy="42.4" r="1.6" />
        </g>
      )}
    </svg>
  );
}
