"use client";

import { useEffect, useState } from "react";

/** Live HH:MM for an IANA time zone; renders a placeholder until mounted. */
export function OfficeClock({ tz, className }: { tz: string; className?: string }) {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz });
    const tick = () => setTime(fmt.format(new Date()));
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 20_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [tz]);
  return <span className={className}>{time}</span>;
}
