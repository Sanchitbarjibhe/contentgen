import type {
  FreeListingStats,
} from "@/app/actions/marketplace";
import type { BusinessListingItem } from "@/lib/marketplace-types";

export default function ScarcityBanner({
  stats,
  listings,
}: {
  stats: FreeListingStats;
  listings: BusinessListingItem[];
}) {
  const onboardedBusinesses = listings.filter(
    (listing) => !listing.id.startsWith("fallback-"),
  );
  const creatorNames = onboardedBusinesses.length
    ? onboardedBusinesses.slice(0, 20).map((listing) => listing.name)
    : ["Feastables", "Prime Hydration", "Viewstats"];

  return (
    <section
      aria-label="Free creator listing availability"
      className="relative mx-auto mb-8 mt-10 max-w-5xl overflow-hidden rounded-3xl border border-purple-400/25 bg-gradient-to-r from-purple-950/50 via-indigo-950/45 to-slate-900/70 px-5 py-5 text-center shadow-xl shadow-purple-950/20 backdrop-blur-xl sm:mt-12 sm:px-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-purple-400/[0.08] to-transparent"
      />
      <div className="relative">
        <p className="text-sm font-bold text-orange-200 sm:text-base">
          🔥 {stats.claimed}/{stats.capacity} Free Creator Listings Claimed — Only{" "}
          {stats.remaining} Free Spots Remaining!
        </p>
        {creatorNames.length > 0 && (
          <div
            aria-label={`Featured creators onboarded: ${creatorNames.join(", ")}`}
            className="business-marquee mt-2 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
          >
            <div className="business-marquee-track flex w-max">
              {[0, 1].map((copy) => (
                <p
                  aria-hidden={copy === 1}
                  className="shrink-0 px-4 text-xs leading-5 text-slate-400 sm:text-sm"
                  key={copy}
                >
                  <span className="font-semibold text-slate-300">
                    Featured creators onboarded:
                  </span>{" "}
                  <span className="text-slate-200">{creatorNames.join(" · ")}</span>
                  {onboardedBusinesses.length > creatorNames.length
                    ? " · and more"
                    : ""}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
