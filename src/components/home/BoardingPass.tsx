import Image from "next/image";

type PassCopy = {
  passTitle: string;
  passenger: string;
  passengerValue: string;
  fromLabel: string;
  toLabel: string;
  toCity: string;
  flight: string;
  gate: string;
  seat: string;
  boarding: string;
  boardingValue: string;
  classLabel: string;
  classValue: string;
};

/** Deterministic barcode bars so server and client render the same thing. */
const BARS = Array.from({ length: 46 }, (_, i) => 1 + ((i * 7919) % 5) * 0.6);

function Field({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <div className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#7a809f]">{label}</div>
      <div className="mt-1 whitespace-nowrap font-display text-[0.95rem] font-semibold text-[#1b2044]">{value}</div>
    </div>
  );
}

/**
 * Paper boarding pass: IST → all airlines. The hero's quiet signature
 * element; also carries the trust badges on its stub.
 */
export function BoardingPass({
  copy,
  from,
  airlines,
  channels,
  badges,
}: {
  copy: PassCopy;
  from: { code: string; city: string };
  airlines: string;
  channels: string;
  badges: { name: string; image: string }[];
}) {
  return (
    <div className="boarding-pass relative flex overflow-hidden rounded-[18px] bg-[#f7f8fc] text-[#1b2044] shadow-[0_30px_70px_-30px_rgb(5_8_30/0.75)]">
      {/* brand edge */}
      <div className="w-2 shrink-0 bg-[linear-gradient(180deg,#67bad5_0%,#67bad5_50%,#ff5a5f_50%,#ff5a5f_100%)]" />

      {/* main */}
      <div className="flex min-w-0 flex-1 flex-col gap-4 px-6 py-5 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Image src="/images/brand/icon.png" alt="" width={40} height={40} className="size-5" />
            <span className="font-display text-sm font-bold tracking-tight">AirviaTech</span>
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#7a809f]">{copy.passTitle}</span>
          </div>
          <Field label={copy.passenger} value={copy.passengerValue} className="hidden text-right md:block" />
        </div>

        <div className="flex items-end gap-5 sm:gap-8">
          <div>
            <div className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#7a809f]">{copy.fromLabel}</div>
            <div className="font-display text-4xl font-bold leading-none tracking-tight sm:text-5xl">{from.code}</div>
            <div className="mt-1 text-xs text-[#5f6795]">{from.city}</div>
          </div>

          {/* route with a little jet looping across */}
          <div className="relative mb-6 h-px min-w-16 flex-1 border-t-2 border-dashed border-[#c5cbe0]">
            <svg viewBox="0 0 24 24" className="pass-jet absolute -top-[11px] left-0 size-5 text-coral" aria-hidden="true">
              <path
                fill="currentColor"
                d="M21.5 12c0-.8-.7-1.4-1.5-1.4h-5.2L10 3H7.6l2.6 7.6H5.5L3.6 8H2l1.3 4L2 16h1.6l1.9-2.6h4.7L7.6 21H10l4.8-7.6H20c.8 0 1.5-.6 1.5-1.4Z"
              />
            </svg>
          </div>

          <div className="text-right">
            <div className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#7a809f]">{copy.toLabel}</div>
            <div className="font-display text-4xl font-bold leading-none tracking-tight sm:text-5xl">{airlines}</div>
            <div className="mt-1 text-xs text-[#5f6795]">{copy.toCity}</div>
          </div>
        </div>

        <div className="hidden flex-wrap gap-x-8 gap-y-3 border-t border-[#e1e5f0] pt-4 md:flex">
          <Field label={copy.flight} value="AT 001" />
          <Field label={copy.gate} value={channels} />
          <Field label={copy.classLabel} value={copy.classValue} />
          <Field label={copy.boarding} value={copy.boardingValue} />
        </div>
      </div>

      {/* perforation */}
      <div className="relative hidden w-0 sm:block">
        <span className="absolute inset-y-4 left-0 border-l-2 border-dashed border-[#d3d8e8]" />
      </div>

      {/* stub */}
      <div className="hidden w-56 shrink-0 flex-col justify-between gap-3 px-6 py-5 sm:flex">
        <div className="flex items-center gap-2">
          {badges.map((b) => (
            <span key={b.name} className="grid size-9 place-items-center rounded-md bg-white p-1 shadow-sm" title={b.name}>
              <Image src={b.image} alt={b.name} width={64} height={64} className="h-full w-auto object-contain" />
            </span>
          ))}
        </div>
        <div className="flex h-12 items-stretch gap-[2px]" aria-hidden="true">
          {BARS.map((w, i) => (
            <span key={i} className="pass-bar bg-[#1b2044]" style={{ width: `${w}px`, animationDelay: `${i * 18}ms` }} />
          ))}
        </div>
        <Field label={copy.seat} value={airlines} />
      </div>
    </div>
  );
}
