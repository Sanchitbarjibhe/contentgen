export const AD_PRICING = {
  week: {
    USD: 500,
    EUR: 500,
    INR: 49900,
  },
  month: {
    USD: 2000,
    EUR: 2000,
    INR: 199900,
  },
} as const;

export type AdDuration = keyof typeof AD_PRICING;
export type AdCurrency = keyof (typeof AD_PRICING)["week"];
export type AdGateway = "stripe" | "razorpay";

const CURRENCY_LOCALES: Record<AdCurrency, string> = {
  USD: "en-US",
  EUR: "de-DE",
  INR: "en-IN",
};

export function formatAdPrice(duration: AdDuration, currency: AdCurrency) {
  return new Intl.NumberFormat(CURRENCY_LOCALES[currency], {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(AD_PRICING[duration][currency] / 100);
}
