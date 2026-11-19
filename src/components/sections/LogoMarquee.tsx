import Image from "next/image";

type Logo = { name: string; logo: string };

function Row({ logos, reverse, duration }: { logos: Logo[]; reverse?: boolean; duration: number }) {
  const loop = [...logos, ...logos];
  return (
    <div className="mask-fade-x group flex overflow-hidden">
      <ul
        className={`flex w-max shrink-0 items-center gap-4 pr-4 ${reverse ? "animate-marquee-reverse" : "animate-marquee"} group-hover:[animation-play-state:paused]`}
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        {loop.map((l, i) => (
          <li
            key={`${l.name}-${i}`}
            aria-hidden={i >= logos.length ? "true" : undefined}
            className="logo-card grid h-20 w-44 shrink-0 place-items-center rounded-2xl border border-white/6 bg-white/[0.02] px-6 transition-colors duration-300 hover:border-white/15 hover:bg-white/[0.05]"
          >
            <Image
              src={l.logo}
              alt={i >= logos.length ? "" : l.name}
              width={200}
              height={80}
              className="logo-mono max-h-10 w-auto object-contain opacity-70 transition-opacity duration-300 hover:opacity-100"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LogoMarquee({ logos }: { logos: Logo[] }) {
  const half = Math.ceil(logos.length / 2);
  return (
    <div className="space-y-4">
      <Row logos={logos.slice(0, half)} duration={70} />
      <Row logos={logos.slice(half)} duration={80} reverse />
    </div>
  );
}
