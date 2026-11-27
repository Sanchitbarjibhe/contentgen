const configuredMeasurementId =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";

export const GA_MEASUREMENT_ID = /^G-[A-Z0-9]{10}$/.test(
  configuredMeasurementId,
)
  ? configuredMeasurementId
  : "";

export const ANALYTICS_CONSENT_KEY = "hooktos_consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function updateAnalyticsConsent(granted: boolean) {
  if (typeof window === "undefined") return;

  const consent = granted ? "granted" : "denied";

  if (GA_MEASUREMENT_ID && typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      ad_storage: consent,
      ad_user_data: consent,
      ad_personalization: consent,
      analytics_storage: consent,
    });
  }

  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, consent);
  } catch {
    // Consent still applies for this page load when storage is unavailable.
  }
}

export function trackEvent(
  eventName: string,
  parameters?: Record<string, string | number | boolean>,
) {
  if (
    !GA_MEASUREMENT_ID ||
    typeof window === "undefined" ||
    typeof window.gtag !== "function"
  ) {
    return;
  }

  window.gtag("event", eventName, parameters);
}
