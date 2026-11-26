'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { ANALYTICS_CONSENT_KEY, GA_MEASUREMENT_ID, trackEvent } from '@/lib/gtag';

// Sends a page_view whenever the URL changes (including the first load).
function PageViewTracker({ ready }: { ready: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!ready) return;

    const query = searchParams?.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;
    trackEvent('page_view', {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, ready, searchParams]);

  return null;
}

export default function GoogleAnalytics() {
  const [scriptReady, setScriptReady] = useState(false);

  if (!GA_MEASUREMENT_ID || process.env.NODE_ENV !== 'production') return null;

  return (
    <>
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};

          window.gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            functionality_storage: 'granted',
            security_storage: 'granted',
            wait_for_update: 500
          });

          try {
            var saved = window.localStorage.getItem('${ANALYTICS_CONSENT_KEY}');
            if (saved === 'granted') {
              window.gtag('consent', 'update', {
                ad_storage: 'granted',
                ad_user_data: 'granted',
                ad_personalization: 'granted',
                analytics_storage: 'granted'
              });
            }
          } catch (error) {}

          window.gtag('set', 'ads_data_redaction', true);
          window.gtag('set', 'url_passthrough', true);
          window.gtag('js', new Date());
          window.gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
        `}
      </Script>

      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />

      <Suspense fallback={null}>
        <PageViewTracker ready={scriptReady} />
      </Suspense>
    </>
  );
}
