// lib/stripe.ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
});

export const PRICE_IDS = {
  PRO: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!,
  AGENCY: process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID!,
} as const;

export function planFromPriceId(priceId: string | null | undefined): "FREE" | "PRO" | "AGENCY" {
  if (priceId === PRICE_IDS.PRO) return "PRO";
  if (priceId === PRICE_IDS.AGENCY) return "AGENCY";
  return "FREE";
}
