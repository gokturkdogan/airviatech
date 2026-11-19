"use client";

import { useRef } from "react";
import { FlightMap } from "@/components/three/scenes";
import type { MapCity, MapFlight } from "@/components/three/FlightMap";

/**
 * Wraps the 3D flight map with a live HUD. The scene writes the tracked
 * aircraft's flight level and speed straight into the HUD every few frames.
 */
export function FlightMapStage({
  hub,
  cities,
  flights,
  labels,
}: {
  hub: MapCity;
  cities: MapCity[];
  flights: MapFlight[];
  labels: { live: string; airborne: string; hubLabel: string };
}) {
  const hud = useRef<HTMLDivElement>(null);
  const first = flights[0];
  return (
    <div className="relative h-[560px] bg-[radial-gradient(ellipse_80%_70%_at_50%_45%,#1a2150,#11163a_75%)] sm:h-[640px]">
      <FlightMap className="absolute inset-0" hub={hub} cities={cities} flights={flights} hubLabel={labels.hubLabel} hud={hud} />

      {/* HUD */}
      <div
        ref={hud}
        className="absolute right-4 top-4 z-30 hidden w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#141836]/80 font-code text-[11px] text-fog/80 shadow-xl backdrop-blur-md sm:right-6 sm:top-6 md:block"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 uppercase tracking-[0.16em]">
          <span className="flex items-center gap-2 text-emerald-300">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-300" />
            {labels.live}
          </span>
          <span>
            {flights.length} {labels.airborne}
          </span>
        </div>
        {first && (
          <div className="grid grid-cols-2 gap-y-2 px-4 py-3">
            <span className="text-fog/50">FLT</span>
            <span className="text-right font-bold text-white">{first.flight}</span>
            <span className="text-fog/50">ROUTE</span>
            <span className="text-right text-white">
              {first.inbound ? `${first.to} → ${hub.code}` : `${hub.code} → ${first.to}`}
            </span>
            <span className="text-fog/50">ALT</span>
            <span data-fl className="text-right tabular-nums text-sky-soft">
              FL000
            </span>
            <span className="text-fog/50">GS</span>
            <span data-kts className="text-right tabular-nums text-sky-soft">
              — kt
            </span>
          </div>
        )}
      </div>

      <p className="pointer-events-none absolute bottom-3 right-4 z-10 text-[10px] text-fog/35">Map data: Natural Earth</p>

      {/* bottom fade into the office strip */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-ink-900/80" />
    </div>
  );
}
