'use client';
// components/GoogleAnalytics.tsx  (HookTos AI — v1)
// GA4 + Google Consent Mode v2 + page_view on every App Router route change.
//
// Setup:
//  1. In Vercel → Project → Settings → Environment Variables add
//       NEXT_PUBLIC_GA_ID = G-XXXXXXXXXX   (your GA4 Measurement ID)
//  2. In GA4 → Admin → Data streams → your stream → Enhanced measurement → ⚙
//       turn OFF "Page changes based on browser history events"
//     (this component sends page_view itself; leaving both on double-counts).

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? '';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

// Sends a page_view whenever the URL changes (including the first load).
function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_ID || typeof window.gtag !== 'function') return;
    const query = searchParams?.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}

export default function GoogleAnalytics() {
  // Skip in development and when no ID is set.
  if (!GA_ID || process.env.NODE_ENV !== 'production') return null;

  return (
    <>
      {/* 1. Consent defaults + config are queued BEFORE gtag.js loads */}
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;

          // Consent Mode v2 — everything denied until the visitor chooses.
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            functionality_storage: 'granted',
            security_storage: 'granted',
            wait_for_update: 500
          });

          // Re-apply a choice the visitor already made on an earlier visit.
          try {
            var saved = localStorage.getItem('hooktos_consent');
            if (saved === 'granted') {
              gtag('consent', 'update', {
                ad_storage: 'granted',
                ad_user_data: 'granted',
                ad_personalization: 'granted',
                analytics_storage: 'granted'
              });
            }
          } catch (e) {}

          gtag('set', 'ads_data_redaction', true);
          gtag('set', 'url_passthrough', true);
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: false });
        `}
      </Script>

      {/* 2. The GA4 library itself */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />

      {/* 3. Route-change tracking (useSearchParams needs a Suspense boundary) */}
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  );
}
