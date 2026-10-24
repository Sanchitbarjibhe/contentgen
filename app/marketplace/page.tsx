import { ArrowDown, Sparkles } from "lucide-react";
import {
  getActiveBusinessListings,
  getLiveBillboardSlots,
} from "@/app/actions/marketplace";
import BusinessListingDialog from "@/components/BusinessListingDialog";
import BusinessMarqueeRows from "@/components/BusinessMarqueeRows";
import DirectoryPaymentStatus from "@/components/DirectoryPaymentStatus";
import VirtualBillboard from "@/components/VirtualBillboard";
import { getPageMetadata } from '@/lib/seo.config';

export const metadata = getPageMetadata('marketplace', '/marketplace');

export const dynamic = "force-dynamic";

export default async function MarketplacePage() {
  const [billboardSlots, businessListings] = await Promise.all([
    getLiveBillboardSlots(),
    getActiveBusinessListings(),
  ]);

  return (
    <main className="relative isolate overflow-hidden bg-transparent text-slate-100">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-48 left-1/3 size-[34rem] rounded-full bg-purple-600/10 blur-[140px]" />
        <div className="absolute right-[-15rem] top-[55rem] size-[32rem] rounded-full bg-blue-600/10 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/*<div className="pt-4">
          <DirectoryPaymentStatus />
        </div>
         <section
          aria-label="Virtual billboard ads"
          className="flex min-h-[calc(100svh-73px)] flex-col justify-center"
          id="virtual-billboard"
        >
          <VirtualBillboard slots={billboardSlots} />
        </section> */}

        <div aria-hidden="true" className="border-t border-slate-800/70" />

        <section
          aria-labelledby="business-directory-title"
          className="flex min-h-[calc(100svh-73px)] flex-col justify-center py-14 sm:py-20"
          id="business-directory"
        >
          <div className="mx-auto w-full max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/[0.08] px-3 py-1 text-xs font-semibold tracking-wide text-blue-200">
                <Sparkles aria-hidden="true" className="size-3.5" />
                MEET YOUR NEIGHBORS
              </span>
              <h2
                className="mt-5 text-balance text-3xl font-extrabold tracking-tight text-white sm:text-5xl"
                id="business-directory-title"
              >
                Good businesses.{" "}
                <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
                  Great things in motion.
                </span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base sm:leading-7">
                Explore independent businesses from the HookTos community.
                Your next favorite might be just around the corner.
              </p>
            </div>

            <div className="mt-8 space-y-1 sm:mt-10">
              <BusinessMarqueeRows listings={businessListings} />
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10">
              <BusinessListingDialog />
              <a
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-5 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
                href="#virtual-billboard"
              >
                Back to billboard
                <ArrowDown aria-hidden="true" className="size-4 rotate-180" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
