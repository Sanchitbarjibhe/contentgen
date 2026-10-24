"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  Eye,
  MousePointer2,
  Plus,
} from "lucide-react";
import AdBookingModal from "@/components/AdBookingModal";
import { formatAdPrice } from "@/lib/ad-pricing";
import type { BillboardSlot } from "@/lib/marketplace-types";
import { getSafeExternalUrl } from "@/lib/marketplace-types";

type AdSize = "feature" | "wide" | "medium" | "compact";

interface Advertiser {
  id?: string;
  name: string;
  category: string;
  initials: string;
  clicks: number;
  views: number;
  accent: string;
  weeklyBudget: number;
  tier?: string | null;
  imageUrl?: string | null;
  websiteUrl?: string | null;
}

const ADVERTISERS: Advertiser[] = [
  {
    name: "Northstar Studio",
    category: "SaaS · AI Automation",
    initials: "N",
    clicks: 128,
    views: 3420,
    accent: "from-violet-600/80 via-indigo-600/65 to-slate-950",
    weeklyBudget: 80,
  },
  {
    name: "Goodkind Coffee",
    category: "Food · Artisan Cafe",
    initials: "G",
    clicks: 94,
    views: 2810,
    accent: "from-amber-600/70 via-orange-900/55 to-slate-950",
    weeklyBudget: 40,
  },
  {
    name: "Pixel & Pine",
    category: "Retail · Minimalist Gear",
    initials: "P",
    clicks: 76,
    views: 2490,
    accent: "from-emerald-600/70 via-teal-900/55 to-slate-950",
    weeklyBudget: 25,
  },
  {
    name: "Orbit Analytics",
    category: "Tech · Data Intelligence",
    initials: "O",
    clicks: 63,
    views: 2180,
    accent: "from-sky-600/70 via-blue-900/55 to-slate-950",
    weeklyBudget: 20,
  },
  {
    name: "Sunday Supply",
    category: "Retail · Everyday Essentials",
    initials: "S",
    clicks: 57,
    views: 1920,
    accent: "from-pink-600/70 via-rose-900/55 to-slate-950",
    weeklyBudget: 12,
  },
  {
    name: "Brightside Co.",
    category: "Services · Creative Studio",
    initials: "B",
    clicks: 48,
    views: 1640,
    accent: "from-yellow-600/70 via-amber-900/55 to-slate-950",
    weeklyBudget: 10,
  },
  {
    name: "Cloudberry",
    category: "Food · Botanical Blends",
    initials: "C",
    clicks: 41,
    views: 1470,
    accent: "from-fuchsia-600/70 via-purple-900/55 to-slate-950",
    weeklyBudget: 8,
  },
  {
    name: "Forma Works",
    category: "Tech · Thoughtful Design",
    initials: "F",
    clicks: 32,
    views: 1210,
    accent: "from-cyan-600/70 via-blue-900/55 to-slate-950",
    weeklyBudget: 8,
  },
];

const OPEN_SLOTS = Array.from({ length: 8 }, (_, index) => index + 1);
const SIZE_CLASSES: Record<AdSize, string> = {
  feature: "col-span-6 row-span-2 md:col-span-4 xl:col-span-6",
  wide: "col-span-3 row-span-2 md:col-span-4 xl:col-span-4",
  medium: "col-span-3 row-span-1 md:col-span-2 xl:col-span-3",
  compact: "col-span-3 row-span-1 md:col-span-2 xl:col-span-2",
};

const BOOKING_SLOT_CLASS =
  "col-span-3 row-span-1 md:col-span-2 xl:col-span-2";

function adSizeForBudget(weeklyBudget: number): AdSize {
  if (weeklyBudget >= 60) return "feature";
  if (weeklyBudget >= 35) return "wide";
  if (weeklyBudget >= 18) return "medium";
  return "compact";
}

function adSizeForAdvertiser(advertiser: Advertiser): AdSize {
  if (advertiser.tier === "FEATURED") return "feature";
  if (advertiser.tier === "MEDIUM") return "medium";
  if (advertiser.tier === "STANDARD") return "compact";
  return adSizeForBudget(advertiser.weeklyBudget);
}

function AdMetrics({ advertiser }: { advertiser: Advertiser }) {
  const ctr =
    advertiser.views === 0
      ? "0.0"
      : ((advertiser.clicks / advertiser.views) * 100).toFixed(1);

  // return (
  //   <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-medium text-slate-300/80 sm:gap-x-4 sm:text-xs">
  //     <span className="inline-flex items-center gap-1">
  //       <Eye aria-hidden="true" className="size-3 text-blue-300" />
  //       {advertiser.views.toLocaleString()}
  //     </span>
  //     <span className="inline-flex items-center gap-1">
  //       <MousePointer2 aria-hidden="true" className="size-3 text-purple-300" />
  //       {advertiser.clicks.toLocaleString()}
  //     </span>
  //     <span className="inline-flex items-center gap-1">
  //       <BarChart3 aria-hidden="true" className="size-3 text-emerald-300" />
  //       {ctr}% CTR
  //     </span>
  //   </div>
  // );
}

export default function VirtualBillboard({
  slots,
}: {
  slots: BillboardSlot[] | null;
}) {
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const advertisers: Advertiser[] = slots?.length
    ? slots.map((slot, index) => ({
      id: slot.id,
      name: slot.title,
      category: slot.category,
      initials: slot.title.charAt(0).toUpperCase(),
      clicks: slot.clicks,
      views: slot.views,
      accent: ADVERTISERS[index % ADVERTISERS.length].accent,
      weeklyBudget: slot.pricePerWeek,
      tier: slot.tier,
      imageUrl: slot.imageUrl,
      websiteUrl: slot.websiteUrl,
    }))
    : ADVERTISERS.map((advertiser, index) => ({
      ...advertiser,
      id: `fallback-${index}`,
      imageUrl: null,
      websiteUrl: null,
    }));

  const metrics = useMemo(() => {
    const views = advertisers.reduce((total, ad) => total + ad.views, 0);
    const clicks = advertisers.reduce((total, ad) => total + ad.clicks, 0);
    return {
      views,
      clicks,
      ctr: views === 0 ? "0.0" : ((clicks / views) * 100).toFixed(1),
    };
  }, [advertisers]);

  return (
    <section
      aria-labelledby="billboard-title"
      className="relative flex min-h-[calc(100svh-73px)] flex-col justify-center py-12 sm:py-16"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-48 top-1/4 -z-10 size-[30rem] rounded-full bg-purple-700/10 blur-[130px]" />
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-400/[0.08] px-3 py-1 text-xs font-semibold tracking-wide text-purple-200">
              <span
                aria-hidden="true"
                className="size-1.5 animate-pulse rounded-full bg-emerald-300 shadow-[0_0_9px_rgba(110,231,183,0.85)]"
              />
              THE HookTos AD EXCHANGE
            </span>
            <h1
              className="mt-5 text-balance text-3xl font-extrabold tracking-tight text-white sm:text-5xl"
              id="billboard-title"
            >
              Your next customers{" "}
              <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
                are looking.
              </span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base sm:leading-7">
              A live billboard for independent businesses. Every space is
              sized by its tier, with the campaign insights to match.
            </p>
          </div>

          {/* <div className="grid grid-cols-3 gap-2 sm:min-w-[25rem] sm:gap-3">
            {[
              { label: "Views", value: metrics.views, icon: Eye, color: "text-blue-300" },
              { label: "Clicks", value: metrics.clicks, icon: MousePointer2, color: "text-purple-300" },
              { label: "Avg. CTR", value: `${metrics.ctr}%`, icon: BarChart3, color: "text-emerald-300" },
            ].map((metric) => {
              const Icon = metric.icon;
              return (
                <div
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 backdrop-blur-xl sm:p-4"
                  key={metric.label}
                >
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 sm:gap-2 sm:text-xs">
                    <Icon aria-hidden="true" className={`size-3.5 ${metric.color}`} />
                    {metric.label}
                  </div>
                  <p className={`mt-2 text-lg font-bold tabular-nums sm:text-xl ${metric.color}`}>
                    {metric.value}
                  </p>
                </div>
              );
            })}
          </div> */}
        </div>

        <div className="mt-7 rounded-3xl border border-slate-800 bg-slate-900/50 p-3 shadow-2xl shadow-purple-950/10 backdrop-blur-xl sm:mt-9 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                The virtual billboard
              </p>
              <p className="mt-1 text-xs text-slate-600">
                Feature placements and grid ads in one live marketplace
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-1.5 text-xs font-medium text-emerald-200">
              <span
                aria-hidden="true"
                className="size-1.5 animate-pulse rounded-full bg-emerald-300"
              />
              {advertisers.length} live slots active
            </span>
          </div>

          <div
            aria-label="Interactive billboard ad heatmap. Featured, wide, medium, and compact ad spaces."
            className="grid auto-rows-[5.25rem] grid-cols-6 grid-flow-dense gap-2 sm:auto-rows-[6rem] sm:gap-3 md:auto-rows-[6.5rem] md:grid-cols-8 xl:auto-rows-[7.5rem] xl:grid-cols-12"
          >
            {advertisers.map((advertiser, index) => {
              const adSize = adSizeForAdvertiser(advertiser);
              const featured = adSize === "feature" || adSize === "wide";
              return (
                <article
                  aria-label={`${advertiser.name}, ${advertiser.category} sponsored ad`}
                  className={`group relative isolate flex min-w-0 flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${advertiser.accent} p-3 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:border-purple-300/50 hover:shadow-xl hover:shadow-purple-950/30 sm:p-4 ${SIZE_CLASSES[adSize]}`}
                  key={advertiser.id}
                >
                  {advertiser.imageUrl && (
                    <img
                      alt=""
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 -z-20 size-full object-cover opacity-30"
                      loading="lazy"
                      src={advertiser.imageUrl}
                    />
                  )}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.13),transparent_60%)] opacity-60 transition-opacity group-hover:opacity-100"
                  />
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-sm font-black text-white shadow-sm backdrop-blur sm:size-10">
                        {advertiser.initials}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-white sm:text-sm">
                          {getSafeExternalUrl(advertiser.websiteUrl) ? (
                            <a
                              href={
                                getSafeExternalUrl(advertiser.websiteUrl) ??
                                undefined
                              }
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              {advertiser.name}
                            </a>
                          ) : (
                            advertiser.name
                          )}
                        </p>
                        <p className="mt-0.5 truncate text-[9px] text-slate-200/75 sm:text-[11px]">
                          {advertiser.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span
                        aria-hidden="true"
                        className="flex items-center gap-1 rounded-full border border-emerald-200/20 bg-emerald-200/10 px-1.5 py-1 text-[8px] font-semibold text-emerald-100 sm:px-2 sm:text-[9px]"
                      >
                        <span className="size-1 rounded-full bg-emerald-300" />
                        LIVE
                      </span>
                      {featured && (
                        <span className="text-[8px] font-medium text-white/70 sm:text-[9px]">
                          ${advertiser.weeklyBudget}/wk tier
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    {featured && (
                      <p className="mb-1 hidden text-xs leading-5 text-slate-200/75 sm:block">
                        {index === 0
                          ? "Make room for your next big idea."
                          : "Thoughtfully made. Locally loved."}
                      </p>
                    )}
                    {/* <AdMetrics advertiser={advertiser} /> */}
                  </div>
                </article>
              );
            })}

            {OPEN_SLOTS.map((slot) => (
              <button
                aria-label={`Book available ad space ${slot}, from $5 per week`}
                className={`group flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-slate-700/90 bg-slate-950/40 p-2 text-center transition duration-300 hover:border-purple-400/70 hover:bg-purple-500/[0.08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400 ${BOOKING_SLOT_CLASS}`}
                key={slot}
                onClick={() => {
                  setSelectedSlot(slot);
                }}
                type="button"
              >
                <Plus
                  aria-hidden="true"
                  className="size-4 text-slate-600 transition group-hover:scale-110 group-hover:text-purple-300 sm:size-5"
                />
                <span className="text-[9px] font-semibold leading-tight text-slate-500 transition group-hover:text-purple-200 sm:text-[11px]">
                  Book space
                </span>
                <span className="text-[8px] text-slate-600 group-hover:text-purple-300 sm:text-[10px]">
                  from {formatAdPrice("week", "USD")}/wk
                </span>
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 px-1 pt-3">
            <div className="flex items-center gap-2 text-[11px] text-slate-500 sm:text-xs">
              <span className="size-2 rounded-sm bg-gradient-to-br from-purple-500 to-blue-500" />
              Live advertiser
              <span className="ml-2 size-2 rounded-sm border border-dashed border-slate-600" />
              Available space
            </div>
            <p className="text-[10px] text-slate-600 sm:text-[11px]">
              Sample campaign metrics · Placements scale with tier
            </p>
          </div>
        </div>

      </div>

      {selectedSlot !== null && (
        <AdBookingModal
          onClose={() => setSelectedSlot(null)}
          slot={selectedSlot}
        />
      )}
    </section>
  );
}
