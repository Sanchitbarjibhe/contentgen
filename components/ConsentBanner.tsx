'use client';
// components/ConsentBanner.tsx  (HookTos AI — v1)
// Minimal cookie banner that drives Google Consent Mode v2.
// Styled to match the HookTos dark glass theme (Tailwind v4).

import { useEffect, useState } from 'react';

const KEY = 'hooktos_consent';

function update(granted: boolean) {
  const value = granted ? 'granted' : 'denied';
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      ad_storage: value,
      ad_user_data: value,
      ad_personalization: value,
      analytics_storage: value,
    });
  }
  try {
    localStorage.setItem(KEY, value);
  } catch {
    /* private mode — ignore */
  }
}

export default function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-2xl border border-slate-800 bg-slate-900/90 p-4 text-sm text-slate-200 shadow-xl backdrop-blur"
    >
      <p>
        We use cookies to measure traffic and improve HookTos AI. See our{' '}
        <a href="/privacy" className="underline">privacy policy</a>.
      </p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => { update(true); setShow(false); }}
          className="rounded-lg bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-500"
        >
          Accept
        </button>
        <button
          onClick={() => { update(false); setShow(false); }}
          className="rounded-lg border border-slate-700 px-4 py-2 hover:bg-slate-800"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
