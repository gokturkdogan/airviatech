import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Eyebrow } from "@/components/sections/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { getContent, getSite } from "@/lib/content";
import { cityName, type Locale } from "@/lib/i18n";
import { FlightMapStage } from "./FlightMapStage";
import { OfficeClock } from "./OfficeClock";

/** Demo traffic for the flight map: outbound and inbound AirviaTech rotations. */
const FLIGHTS = [
  { flight: "AT 214", to: "LHR" },
  { flight: "AT 330", to: "DXB" },
  { flight: "AT 452", to: "SVO", inbound: true },
  { flight: "AT 518", to: "CAI" },
  { flight: "AT 676", to: "FRA", inbound: true },
  { flight: "AT 101", to: "AYT" },
  { flight: "AT 802", to: "DOH", inbound: true },
  { flight: "AT 903", to: "MAD" },
];

/** 40.99 → 40°59′ N */
function dms(value: number, pos: string, neg: string) {
  const abs = Math.abs(value);
  const deg = Math.floor(abs);
  const min = Math.round((abs - deg) * 60);
  return `${deg}°${String(min).padStart(2, "0")}′ ${value >= 0 ? pos : neg}`;
}

/**
 * "Arrivals" block above the footer: a 3D flight map drawn from Natural
 * Earth data with the Istanbul HQ beacon, live routes and AirviaTech jets,
 * plus an arrival card (address, directions) and the office network clocks.
 */
export function LocationMap({ locale }: { locale: Locale }) {
  const t = getContent(locale, "common").location;
  const site = getSite();
  const { contact } = site;
  // destinations that fall inside the drawn region (Europe, Middle East, North Africa)
  const cities = site.globe.destinations
    .filter((d) => d.lon > -16 && d.lon < 66 && d.lat > 14 && d.lat < 66)
    .map((d) => ({ code: d.code, name: d.name, lat: d.lat, lon: d.lon }));
  const hq = contact.offices.find((o) => o.type === "hq") ?? contact.offices[0];
  const lat = dms(hq.lat, "N", "S");
  const lon = dms(hq.lon, "E", "W");

  return (
    <section aria-labelledby="location-title" className="relative pb-24 pt-8">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Eyebrow>{t.eyebrow}</Eyebrow>
            <SplitHeading as="h2" id="location-title" className="display-md mt-5">
              {t.title}
            </SplitHeading>
            <Reveal>
              <p className="mt-5 text-lg leading-relaxed text-fog/75">{t.text}</p>
            </Reveal>
          </div>
          <p className="font-code text-sm tracking-[0.18em] text-fog/50">
            {lat} · {lon}
          </p>
        </div>

        <Reveal className="relative mt-12 overflow-hidden rounded-[2rem] border border-white/10 bg-ink-900 shadow-[0_40px_100px_-50px_rgb(0_0_0/0.9)]">
          <FlightMapStage
            hub={{ code: site.globe.hub.code, name: site.globe.hub.name, lat: site.globe.hub.lat, lon: site.globe.hub.lon }}
            cities={cities}
            flights={FLIGHTS.filter((f) => cities.some((c) => c.code === f.to))}
            labels={{ live: t.live, airborne: t.airborne, hubLabel: t.hubLabel }}
          />

          {/* arrival card: over the map from sm, below it on phones */}
            <div className="relative z-30 mx-4 -mt-24 mb-4 overflow-hidden rounded-2xl bg-[#f7f8fc] text-[#1b2044] shadow-[0_30px_60px_-25px_rgb(5_8_30/0.8)] sm:absolute sm:left-6 sm:top-6 sm:m-0 sm:w-[340px]">
              <div className="flex items-center justify-between bg-[#1b2044] px-5 py-2.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white">
                <span className="flex items-center gap-2">
                  <Icon name="plane" className="size-3.5 rotate-45 text-coral" />
                  {t.arrival}
                </span>
                <OfficeClock tz={hq.tz} className="font-code tabular-nums text-sky-soft" />
              </div>
              <div className="px-5 pb-5 pt-4">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <div className="font-display text-5xl font-bold leading-none tracking-tight">{hq.code}</div>
                    <div className="mt-1 text-sm text-[#5f6795]">{cityName(hq.city, locale)} · Ataşehir</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[#7a809f]">{t.gate}</div>
                    <div className="font-display text-3xl font-bold leading-none text-coral">{contact.address.gate}</div>
                  </div>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-dashed border-[#d3d8e8] pt-4 text-sm">
                  <div className="col-span-2">
                    <dt className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[#7a809f]">{t.terminal}</dt>
                    <dd className="font-semibold">{contact.address.building}</dd>
                    <dd className="text-[0.8rem] text-[#5f6795]">
                      {contact.address.street}, {contact.address.city}
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[#7a809f]">{t.coordinates}</dt>
                    <dd className="font-code text-[0.8rem]">
                      {lat} · {lon}
                    </dd>
                  </div>
                </dl>
                <div className="mt-5 flex gap-2">
                  <a
                    href={contact.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#1b2044] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-coral"
                  >
                    <Icon name="pin" className="size-4" />
                    {t.directions}
                  </a>
                  <a
                    href={contact.phoneHref}
                    aria-label={t.call}
                    title={t.call}
                    className="grid size-10 place-items-center rounded-full border border-[#d3d8e8] text-[#1b2044] transition-colors hover:border-coral hover:text-coral"
                  >
                    <Icon name="phone" className="size-4" />
                  </a>
                </div>
              </div>
            </div>

          {/* office network with live local times */}
          <div className="grid border-t border-white/10 sm:grid-cols-2 lg:grid-cols-[auto_repeat(4,1fr)]">
            <div className="flex items-center gap-3 px-6 py-5 text-xs font-bold uppercase tracking-[0.16em] text-fog/55 lg:border-r lg:border-white/10">
              <Icon name="globe" className="size-4 text-sky-soft" />
              {t.offices}
            </div>
            {contact.offices.map((o) => (
              <div key={o.code} className="flex items-center justify-between gap-4 border-t border-white/10 px-6 py-5 sm:border-l lg:border-t-0">
                <div className="flex items-center gap-3">
                  <span className={`size-2 rounded-full ${o.type === "hq" ? "bg-coral" : "bg-sky"}`} />
                  <div>
                    <div className="font-display text-xl font-bold leading-none text-white">{o.code}</div>
                    <div className="mt-1 text-xs text-fog/60">
                      {cityName(o.city, locale)} · {o.type === "hq" ? t.hq : t.branch}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <OfficeClock tz={o.tz} className="font-code text-lg tabular-nums text-white" />
                  <div className="text-[0.6rem] uppercase tracking-[0.14em] text-fog/45">{t.localTime}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
