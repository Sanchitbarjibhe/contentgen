import type { BusinessListingItem } from "@/lib/marketplace-types";
import { getSafeExternalUrl } from "@/lib/marketplace-types";
import BusinessListingLogo from "@/components/BusinessListingLogo";

interface Business {
  id?: string;
  name: string;
  niche: string;
  initials: string;
  accent: string;
  websiteUrl?: string;
  logoUrl?: string | null;
}

const BUSINESS_ACCENTS = [
  "from-violet-500 to-indigo-500",
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-teal-500",
  "from-sky-500 to-blue-500",
  "from-fuchsia-500 to-purple-500",
  "from-cyan-500 to-blue-500",
  "from-pink-500 to-rose-500",
  "from-orange-500 to-rose-500",
] as const;

const ROW_CLASSES = [
  "business-marquee-row-one",
  "business-marquee-row-two business-marquee-reverse",
  "business-marquee-row-three",
  "business-marquee-row-four business-marquee-reverse",
];

function ListingRow({
  businesses,
  rowIndex,
}: {
  businesses: readonly Business[];
  rowIndex: number;
}) {
  return (
    <div
      aria-label={`Business listings row ${rowIndex + 1}`}
      className="business-marquee group flex max-w-full overflow-hidden py-2"
    >
      <div
        className={`business-marquee-track flex w-max shrink-0 ${
          ROW_CLASSES[rowIndex]
        }`}
      >
        {[0, 1].map((copy) => (
          <div
            aria-hidden={copy === 1}
            className="flex shrink-0 gap-3 pr-3 sm:gap-4 sm:pr-4"
            key={copy}
          >
            {businesses.map((business) => (
              <article
                className="flex w-60 shrink-0 items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 px-3 py-3 shadow-lg shadow-slate-950/20 backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-purple-400/30 hover:bg-slate-900/90 sm:w-72 sm:gap-3.5 sm:px-4 sm:py-3.5"
                key={business.id ?? business.name}
              >
                <BusinessListingLogo
                  accent={business.accent}
                  initials={business.initials}
                  key={`${business.id ?? business.name}:${business.logoUrl ?? ""}:${business.websiteUrl ?? ""}`}
                  logoUrl={business.logoUrl ?? null}
                  name={business.name}
                  websiteUrl={business.websiteUrl ?? ""}
                />
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-bold text-slate-100">
                    {getSafeExternalUrl(business.websiteUrl) ? (
                      <a
                        href={getSafeExternalUrl(business.websiteUrl) ?? undefined}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {business.name}
                      </a>
                    ) : (
                      business.name
                    )}
                  </h3>
                  <p className="mt-1 truncate text-xs font-medium text-slate-400">
                    {business.niche}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BusinessMarqueeRows({
  listings,
}: {
  listings: BusinessListingItem[];
}) {
  const businesses = listings.map((listing, index) => ({
    id: listing.id,
    name: listing.name,
    niche: `${listing.category} · ${listing.tag}`,
    initials: listing.name.charAt(0).toUpperCase(),
    accent: BUSINESS_ACCENTS[index % BUSINESS_ACCENTS.length],
    websiteUrl: listing.websiteUrl,
    logoUrl: listing.logoUrl,
  }));

  if (businesses.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate-400">
        No approved businesses are listed yet.
      </p>
    );
  }

  const rowCount = Math.min(4, businesses.length);
  const rowSize = Math.ceil(businesses.length / rowCount);
  const rows = Array.from({ length: rowCount }, (_, index) =>
    businesses.slice(index * rowSize, (index + 1) * rowSize),
  );

  return (
    <div
      aria-label="Discover independent businesses"
      className="space-y-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
    >
      {rows.map((row, rowIndex) => (
        <ListingRow businesses={row} key={rowIndex} rowIndex={rowIndex} />
      ))}
    </div>
  );
}
