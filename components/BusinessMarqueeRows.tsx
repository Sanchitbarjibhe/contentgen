import type { BusinessListingItem } from "@/lib/marketplace-types";
import { getSafeExternalUrl } from "@/lib/marketplace-types";

interface Business {
  id?: string;
  name: string;
  niche: string;
  initials: string;
  accent: string;
  websiteUrl?: string;
}

const BUSINESS_ROWS: readonly (readonly Business[])[] = [
  [
    {
      name: "Northstar Studio",
      niche: "SaaS · AI Automation",
      initials: "N",
      accent: "from-violet-500 to-indigo-500",
    },
    {
      name: "Goodkind Coffee",
      niche: "Food · Artisan Cafe",
      initials: "G",
      accent: "from-amber-500 to-orange-500",
    },
    {
      name: "Pixel & Pine",
      niche: "Retail · Minimalist Gear",
      initials: "P",
      accent: "from-emerald-500 to-teal-500",
    },
    {
      name: "Orbit Analytics",
      niche: "Tech · Data Intelligence",
      initials: "O",
      accent: "from-sky-500 to-blue-500",
    },
    {
      name: "Brightside Co.",
      niche: "Services · Creative Studio",
      initials: "B",
      accent: "from-yellow-500 to-amber-500",
    },
  ],
  [
    {
      name: "Cloudberry",
      niche: "Food · Botanical Blends",
      initials: "C",
      accent: "from-fuchsia-500 to-purple-500",
    },
    {
      name: "Forma Works",
      niche: "Tech · Thoughtful Design",
      initials: "F",
      accent: "from-cyan-500 to-blue-500",
    },
    {
      name: "Sunday Supply",
      niche: "Retail · Everyday Essentials",
      initials: "S",
      accent: "from-pink-500 to-rose-500",
    },
    {
      name: "Kindred House",
      niche: "Services · Home Styling",
      initials: "K",
      accent: "from-orange-500 to-rose-500",
    },
    {
      name: "Little Loom",
      niche: "Retail · Artisan Textiles",
      initials: "L",
      accent: "from-teal-500 to-emerald-500",
    },
  ],
  [
    {
      name: "Morrow Health",
      niche: "Health · Daily Wellness",
      initials: "M",
      accent: "from-green-500 to-cyan-500",
    },
    {
      name: "Openfield",
      niche: "SaaS · Team Workflow",
      initials: "O",
      accent: "from-blue-500 to-indigo-500",
    },
    {
      name: "Golden Hour",
      niche: "Food · Small Batch Bakes",
      initials: "G",
      accent: "from-yellow-500 to-orange-500",
    },
    {
      name: "Forma Foundry",
      niche: "Tech · Product Design",
      initials: "F",
      accent: "from-violet-500 to-fuchsia-500",
    },
    {
      name: "Field Notes",
      niche: "Retail · Paper Goods",
      initials: "F",
      accent: "from-lime-500 to-green-500",
    },
  ],
  [
    {
      name: "Good Measure",
      niche: "Services · Growth Strategy",
      initials: "G",
      accent: "from-sky-500 to-cyan-500",
    },
    {
      name: "Sunday State",
      niche: "Wellness · Mindful Living",
      initials: "S",
      accent: "from-rose-500 to-pink-500",
    },
    {
      name: "Copperline",
      niche: "Retail · Modern Ceramics",
      initials: "C",
      accent: "from-orange-500 to-amber-500",
    },
    {
      name: "Signal & Story",
      niche: "SaaS · Brand Intelligence",
      initials: "S",
      accent: "from-indigo-500 to-purple-500",
    },
    {
      name: "Wildwood Table",
      niche: "Food · Seasonal Kitchen",
      initials: "W",
      accent: "from-emerald-500 to-lime-500",
    },
  ],
];

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
                <span
                  aria-hidden="true"
                  className={`flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-black text-white shadow-lg ${business.accent}`}
                >
                  {business.initials}
                </span>
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
  listings: BusinessListingItem[] | null;
}) {
  const businesses =
    listings?.length
      ? listings.map((listing, index) => ({
          id: listing.id,
          name: listing.name,
          niche: `${listing.category} · ${listing.tag}`,
          initials: listing.name.charAt(0).toUpperCase(),
          accent: BUSINESS_ROWS[index % BUSINESS_ROWS.length][0].accent,
          websiteUrl: listing.websiteUrl,
        }))
      : BUSINESS_ROWS.flat();
  const rowSize = Math.ceil(businesses.length / BUSINESS_ROWS.length);
  const rows = BUSINESS_ROWS.map((_, index) =>
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
