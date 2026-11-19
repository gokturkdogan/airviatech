/** Instant-navigation placeholder shown while a slug page streams in. */
export function PageSkeleton() {
  return (
    <div aria-busy="true" className="container-x pb-24 pt-[calc(var(--header-h)+7rem)]">
      <div className="h-3 w-40 animate-pulse rounded-full bg-white/8" />
      <div className="mt-8 h-16 w-3/4 animate-pulse rounded-2xl bg-white/6 sm:h-24" />
      <div className="mt-4 h-16 w-1/2 animate-pulse rounded-2xl bg-white/5 sm:h-24" />
      <div className="mt-10 h-5 w-2/3 animate-pulse rounded-full bg-white/5" />
      <div className="mt-3 h-5 w-1/2 animate-pulse rounded-full bg-white/5" />
    </div>
  );
}
