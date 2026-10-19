import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import Stripe from "stripe";
import { z } from "zod";
import {
  AD_PRICING,
  type AdCurrency,
  type AdGateway,
} from "@/lib/ad-pricing";

export const runtime = "nodejs";

const RequestSchema = z
  .object({
    slot: z.number().int().min(1).max(8),
    duration: z.enum(["week", "month"]),
    country: z.string().regex(/^[a-zA-Z]{2}$/).optional(),
    currency: z.enum(["USD", "EUR", "INR"]).optional(),
    gateway: z.enum(["stripe", "razorpay"]).optional(),
    bannerName: z.string().trim().max(120).optional(),
  })
  .strict();

const EURO_COUNTRIES = new Set([
  "AT",
  "BE",
  "CY",
  "DE",
  "EE",
  "ES",
  "FI",
  "FR",
  "GR",
  "HR",
  "IE",
  "IT",
  "LT",
  "LU",
  "LV",
  "MT",
  "NL",
  "PT",
  "SI",
  "SK",
]);

function detectCountry(request: NextRequest) {
  const vercelCountry = request.headers.get("x-vercel-ip-country");
  const cloudflareCountry = request.headers.get("cf-ipcountry");
  const country = (vercelCountry ?? cloudflareCountry ?? "").toUpperCase();
  return /^[A-Z]{2}$/.test(country) && country !== "XX" ? country : undefined;
}

function currencyForCountry(country: string | undefined): AdCurrency {
  if (country === "IN") return "INR";
  if (country && EURO_COUNTRIES.has(country)) return "EUR";
  return "USD";
}

function gatewayForCurrency(currency: AdCurrency): AdGateway {
  return currency === "INR" ? "razorpay" : "stripe";
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  const originHeader = request.headers.get("origin");
  if (originHeader) {
    try {
      if (new URL(originHeader).origin !== request.nextUrl.origin) {
        return errorResponse("Checkout requests must come from this site.", 403);
      }
    } catch {
      return errorResponse("The request origin is invalid.", 403);
    }
  }

  const body: unknown = await request.json().catch(() => null);
  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("Invalid ad booking details.", 400);
  }

  const country = (parsed.data.country ?? detectCountry(request))?.toUpperCase();
  const inferredCurrency = currencyForCountry(country);
  const currency =
    parsed.data.currency ??
    (parsed.data.country
      ? inferredCurrency
      : parsed.data.gateway === "razorpay"
        ? "INR"
        : parsed.data.gateway === "stripe"
          ? "USD"
          : inferredCurrency);

  if (parsed.data.country && currency !== inferredCurrency) {
    return errorResponse("The selected country and currency do not match.", 400);
  }

  const gateway = gatewayForCurrency(currency);
  if (parsed.data.gateway && parsed.data.gateway !== gateway) {
    return errorResponse("The selected payment gateway does not support this currency.", 400);
  }

  const amount = AD_PRICING[parsed.data.duration][currency];
  const bannerName = parsed.data.bannerName?.trim().slice(0, 120) ?? "";
  let origin: string;
  try {
    const configuredOrigin = new URL(
      process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin,
    );
    if (
      configuredOrigin.protocol !== "https:" &&
      configuredOrigin.hostname !== "localhost"
    ) {
      return errorResponse("The checkout return URL must use HTTPS.", 503);
    }
    origin = configuredOrigin.origin;
  } catch {
    return errorResponse("Checkout return URL is not configured correctly.", 503);
  }

  try {
    if (gateway === "stripe") {
      const secretKey = process.env.STRIPE_SECRET_KEY;
      if (!secretKey) {
        return errorResponse("Stripe checkout is not configured on this server.", 503);
      }

      const stripe = new Stripe(secretKey);
      const session = await stripe.checkout.sessions.create({
        ui_mode: "embedded",
        mode: "payment",
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: currency.toLowerCase(),
              unit_amount: amount,
              product_data: {
                name: `Home Talk billboard · ${parsed.data.duration === "week" ? "1 week" : "1 month"}`,
                description: `Ad space #${parsed.data.slot}${bannerName ? ` · ${bannerName}` : ""}`,
              },
            },
          },
        ],
        return_url: `${origin}/directory?success=true&provider=stripe&session_id={CHECKOUT_SESSION_ID}`,
        metadata: {
          slot: String(parsed.data.slot),
          duration: parsed.data.duration,
          country: country ?? "unknown",
          bannerName,
        },
      });

      if (!session.client_secret) {
        console.error("[ad checkout] Stripe did not return an embedded session secret.");
        return errorResponse("Unable to initialize Stripe checkout.", 502);
      }

      return NextResponse.json({
        gateway,
        sessionId: session.id,
        clientSecret: session.client_secret,
      });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_SECRET_KEY;
    if (!keyId || !keySecret) {
      return errorResponse("Razorpay checkout is not configured on this server.", 503);
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `ad-${parsed.data.slot}-${Date.now()}`,
      notes: {
        slot: String(parsed.data.slot),
        duration: parsed.data.duration,
        country: country ?? "unknown",
        bannerName,
      },
    });

    return NextResponse.json({
      gateway,
      orderId: order.id,
      amount,
      currency: order.currency,
      keyId,
    });
  } catch (error) {
    console.error(`[ad checkout] ${gateway} checkout creation failed:`, error);
    return errorResponse("Unable to start checkout. Please try again.", 502);
  }
}
