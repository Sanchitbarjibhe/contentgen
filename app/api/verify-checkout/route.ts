import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import type { Orders } from "razorpay/dist/types/orders";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import Stripe from "stripe";
import { z } from "zod";
import { AD_PRICING } from "@/lib/ad-pricing";

export const runtime = "nodejs";

const RequestSchema = z
  .object({
    razorpay_order_id: z.string().min(1).max(100),
    razorpay_payment_id: z.string().min(1).max(100),
    razorpay_signature: z.string().regex(/^[a-fA-F0-9]{64}$/),
  })
  .strict();

function isBillboardOrder(order: Orders.RazorpayOrder) {
  const duration = order.notes?.duration;
  const slot = Number(order.notes?.slot);
  return (
    order.status === "paid" &&
    order.currency === "INR" &&
    order.receipt?.startsWith("ad-") === true &&
    Number.isInteger(slot) &&
    slot >= 1 &&
    slot <= 8 &&
    (duration === "week" || duration === "month") &&
    Number(order.amount) === AD_PRICING[duration].INR
  );
}

export async function GET(request: NextRequest) {
  const provider = request.nextUrl.searchParams.get("provider");
  const stripeSessionId = request.nextUrl.searchParams.get("session_id");
  const razorpayOrderId = request.nextUrl.searchParams.get("order_id");

  try {
    if (provider === "stripe" && stripeSessionId) {
      const secretKey = process.env.STRIPE_SECRET_KEY;
      if (!secretKey) {
        return NextResponse.json(
          { error: "Stripe payment verification is not configured." },
          { status: 503 },
        );
      }
      const session = await new Stripe(secretKey).checkout.sessions.retrieve(
        stripeSessionId,
      );
      const currency = session.currency?.toUpperCase();
      const duration = session.metadata?.duration;
      const slot = Number(session.metadata?.slot);
      const validCurrency =
        currency === "USD" || currency === "EUR" || currency === "INR";
      const validDuration = duration === "week" || duration === "month";
      const verified =
        session.mode === "payment" &&
        session.payment_status === "paid" &&
        Number.isInteger(slot) &&
        slot >= 1 &&
        slot <= 8 &&
        validCurrency &&
        validDuration &&
        session.amount_total === AD_PRICING[duration][currency];
      return NextResponse.json({ verified });
    }

    if (provider === "razorpay" && razorpayOrderId) {
      const keyId = process.env.RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_SECRET_KEY;
      if (!keyId || !keySecret) {
        return NextResponse.json(
          { error: "Razorpay payment verification is not configured." },
          { status: 503 },
        );
      }
      const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
      const order = await razorpay.orders.fetch(razorpayOrderId);
      return NextResponse.json({ verified: isBillboardOrder(order) });
    }

    return NextResponse.json(
      { error: "Payment provider or checkout reference is invalid." },
      { status: 400 },
    );
  } catch (error) {
    console.error("[ad checkout] unable to confirm checkout return:", error);
    return NextResponse.json(
      { error: "Unable to confirm payment status. Please refresh or contact support." },
      { status: 502 },
    );
  }
}

export async function POST(request: NextRequest) {
  const originHeader = request.headers.get("origin");
  if (originHeader) {
    try {
      if (new URL(originHeader).origin !== request.nextUrl.origin) {
        return NextResponse.json(
          { error: "Payment verification requests must come from this site." },
          { status: 403 },
        );
      }
    } catch {
      return NextResponse.json({ error: "The request origin is invalid." }, { status: 403 });
    }
  }

  const body: unknown = await request.json().catch(() => null);
  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid Razorpay payment details." }, { status: 400 });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_SECRET_KEY;
  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: "Razorpay payment verification is not configured on this server." },
      { status: 503 },
    );
  }

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

  try {
    const isValid = validatePaymentVerification(
      {
        order_id: parsed.data.razorpay_order_id,
        payment_id: parsed.data.razorpay_payment_id,
      },
      parsed.data.razorpay_signature,
      keySecret,
    );

    if (!isValid) {
      return NextResponse.json({ error: "Razorpay payment signature is invalid." }, { status: 400 });
    }

    const [payment, order] = await Promise.all([
      razorpay.payments.fetch(parsed.data.razorpay_payment_id),
      razorpay.orders.fetch(parsed.data.razorpay_order_id),
    ]);
    if (
      payment.order_id !== parsed.data.razorpay_order_id ||
      payment.status !== "captured" ||
      payment.currency !== "INR" ||
      Number(payment.amount) !== Number(order.amount) ||
      !isBillboardOrder(order)
    ) {
      return NextResponse.json(
        { error: "The payment has not been captured for this order." },
        { status: 409 },
      );
    }

    return NextResponse.json({ verified: true });
  } catch (error) {
    console.error("[ad checkout] Razorpay payment verification failed:", error);
    return NextResponse.json(
      { error: "Unable to verify payment. Please contact support if you were charged." },
      { status: 502 },
    );
  }
}
