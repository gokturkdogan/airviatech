import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { getContent, getSite, type StatKey } from "@/lib/content";
import { localeMeta, type Locale } from "@/lib/i18n";

export function StatsBand({ locale, keys, className = "" }: { locale: Locale; keys: string[]; className?: string }) {
  const site = getSite();
  const labels = getContent(locale, "common").stats;
  const units = labels.units as Record<string, string>;

  return (
    <Reveal stagger={120} className={`grid divide-y divide-white/8 border-y border-white/8 sm:grid-cols-3 sm:divide-x sm:divide-y-0 ${className}`}>
      {keys.map((key, i) => {
        const stat = site.stats[key as StatKey] as { value: number; suffix: string; unit: string; decimals?: number };
        if (!stat) return null;
        return (
          <div key={key} className="group relative px-2 py-10 sm:px-8 sm:py-12">
            <span className="font-mono text-[0.7rem] text-white/30">0{i + 1}</span>
            <div className="mt-3 flex items-baseline gap-2">
              <Counter
                value={stat.value}
                decimals={stat.decimals ?? 0}
                suffix={stat.suffix}
                locale={localeMeta[locale].tag}
                className="font-display text-6xl font-bold tracking-[-0.05em] text-white lg:text-7xl"
              />
              {stat.unit && <span className="font-display text-2xl font-semibold text-mist">{units[stat.unit]}</span>}
            </div>
            <p className="mt-3 text-fog/65">{labels[key as keyof typeof labels] as string}</p>
            <span className="absolute inset-x-8 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-sky to-coral transition-transform duration-700 group-hover:scale-x-100" />
          </div>
        );
      })}
    </Reveal>
  );
}
