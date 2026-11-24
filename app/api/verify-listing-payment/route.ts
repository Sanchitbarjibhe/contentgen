import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import type { Orders } from "razorpay/dist/types/orders";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import Stripe from "stripe";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RazorpayVerificationSchema = z
  .object({
    pendingListingId: z.string().min(1).max(100),
    razorpay_order_id: z.string().min(1).max(100),
    razorpay_payment_id: z.string().min(1).max(100),
    razorpay_signature: z.string().regex(/^[a-fA-F0-9]{64}$/),
  })
  .strict();

function isPrismaError(error: unknown, code: string) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === code
  );
}

function createSlug(name: string) {
  const slug = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "business-listing";
}

async function finalizeListingPayment(paymentId: string) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await prisma.$transaction(
        async (transaction) => {
          const payment = await transaction.listingPayment.findUnique({
            where: { id: paymentId },
          });
          if (!payment) throw new Error("The listing payment record was not found.");

          if (payment.businessListingId) {
            return transaction.businessListing.findUniqueOrThrow({
              where: { id: payment.businessListingId },
              select: { id: true, slug: true },
            });
          }

          const baseSlug = createSlug(payment.name);
          let listing:
            | { id: string; slug: string }
            | undefined;

          for (let suffix = 0; suffix < 10; suffix++) {
            const slug = suffix === 0 ? baseSlug : `${baseSlug}-${suffix + 1}`;
            const existing = await transaction.businessListing.findUnique({
              where: { slug },
              select: { id: true },
            });
            if (existing) continue;

            listing = await transaction.businessListing.create({
              data: {
                name: payment.name,
                slug,
                category: payment.category,
                tag: payment.tag,
                websiteUrl: payment.websiteUrl,
                logoUrl: payment.logoUrl,
                description: payment.description,
                isPaid: true,
                isApproved: true,
              },
              select: { id: true, slug: true },
            });
            break;
          }

          if (!listing) {
            throw new Error("Unable to create a unique business listing slug.");
          }

          await transaction.listingPayment.update({
            where: { id: paymentId },
            data: {
              businessListingId: listing.id,
              completedAt: new Date(),
            },
          });

          return listing;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (error) {
      if (
        (isPrismaError(error, "P2034") || isPrismaError(error, "P2002")) &&
        attempt < 2
      ) {
        continue;
      }
      throw error;
    }
  }

  throw new Error("Unable to finalize the listing payment.");
}

function isListingOrder(order: Orders.RazorpayOrder, paymentId: string) {
  return (
    order.status === "paid" &&
    order.currency === "INR" &&
    order.notes?.listingPaymentId === paymentId
  );
}

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Checkout session is required." }, { status: 400 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Stripe payment verification is not configured." },
      { status: 503 },
    );
  }

  try {
    const session = await new Stripe(secretKey).checkout.sessions.retrieve(sessionId);
    const paymentId = session.metadata?.listingPaymentId;
    if (
      !paymentId ||
      session.mode !== "payment" ||
      session.payment_status !== "paid"
    ) {
      return NextResponse.json({ verified: false });
    }

    const payment = await prisma.listingPayment.findUnique({
      where: { id: paymentId },
      select: { gateway: true, amount: true, currency: true, stripeSessionId: true },
    });
    if (
      !payment ||
      payment.gateway !== "stripe" ||
      payment.stripeSessionId !== session.id ||
      payment.amount !== session.amount_total ||
      payment.currency.toLowerCase() !== session.currency
    ) {
      return NextResponse.json({ verified: false });
    }

    const listing = await finalizeListingPayment(paymentId);
    return NextResponse.json({ verified: true, slug: listing.slug });
  } catch (error) {
    console.error("[business listing] Stripe payment verification failed:", error);
    return NextResponse.json(
      { error: "Unable to verify payment. Please contact support if you were charged." },
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
  const parsed = RazorpayVerificationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid Razorpay payment details." }, { status: 400 });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_SECRET_KEY;
  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: "Razorpay payment verification is not configured." },
      { status: 503 },
    );
  }

  try {
    const paymentRecord = await prisma.listingPayment.findUnique({
      where: { id: parsed.data.pendingListingId },
      select: {
        gateway: true,
        amount: true,
        currency: true,
        razorpayOrderId: true,
      },
    });
    if (
      !paymentRecord ||
      paymentRecord.gateway !== "razorpay" ||
      paymentRecord.razorpayOrderId !== parsed.data.razorpay_order_id ||
      paymentRecord.currency !== "INR"
    ) {
      return NextResponse.json({ error: "The listing payment order is invalid." }, { status: 400 });
    }

    const signatureIsValid = validatePaymentVerification(
      {
        order_id: parsed.data.razorpay_order_id,
        payment_id: parsed.data.razorpay_payment_id,
      },
      parsed.data.razorpay_signature,
      keySecret,
    );
    if (!signatureIsValid) {
      return NextResponse.json({ error: "Razorpay payment signature is invalid." }, { status: 400 });
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const [payment, order] = await Promise.all([
      razorpay.payments.fetch(parsed.data.razorpay_payment_id),
      razorpay.orders.fetch(parsed.data.razorpay_order_id),
    ]);

    if (
      payment.order_id !== parsed.data.razorpay_order_id ||
      payment.status !== "captured" ||
      payment.currency !== paymentRecord.currency ||
      Number(payment.amount) !== paymentRecord.amount ||
      Number(order.amount) !== paymentRecord.amount ||
      !isListingOrder(order, parsed.data.pendingListingId)
    ) {
      return NextResponse.json(
        { error: "The payment has not been captured for this listing order." },
        { status: 409 },
      );
    }

    const listing = await finalizeListingPayment(parsed.data.pendingListingId);
    return NextResponse.json({ verified: true, slug: listing.slug });
  } catch (error) {
    console.error("[business listing] Razorpay payment verification failed:", error);
    return NextResponse.json(
      { error: "Unable to verify payment. Please contact support if you were charged." },
      { status: 502 },
    );
  }
}
