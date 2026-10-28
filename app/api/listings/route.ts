import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import Stripe from "stripe";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { FREE_LISTING_CAPACITY } from "@/lib/marketplace-listings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REQUEST_BODY_LIMIT = 16_384;
const USD_LISTING_PRICE_CENTS = 2900;
const INR_LISTING_PRICE_PAISE = 200000;

const requestSchema = z
  .object({
    name: z.string().trim().min(1, "Business name is required.").max(100),
    category: z.string().trim().min(1, "Category is required.").max(60),
    tag: z.string().trim().min(1, "Business tag is required.").max(80),
    websiteUrl: z
      .string()
      .trim()
      .url("Enter a valid website URL.")
      .max(2048)
      .regex(/^https?:\/\//i, "Website URL must use HTTP or HTTPS."),
    logoUrl: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z
        .string()
        .trim()
        .url("Enter a valid logo URL.")
        .max(2048)
        .regex(/^https?:\/\//i, "Logo URL must use HTTP or HTTPS.")
        .optional(),
    ),
    description: z
      .string()
      .trim()
      .min(1, "A business description is required.")
      .max(800, "Description must be 800 characters or fewer."),
    countryHint: z.enum(["IN", "GLOBAL"]).optional(),
  })
  .strict();

function createSlug(name: string) {
  const slug = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "business-listing";
}

function errorResponse(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

function isPrismaError(error: unknown, code: string) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === code
  );
}

type ListingDetails = Omit<z.infer<typeof requestSchema>, "countryHint">;

async function createFreeListing(data: ListingDetails) {
  for (let transactionAttempt = 0; transactionAttempt < 3; transactionAttempt++) {
    try {
      return await prisma.$transaction(
        async (transaction) => {
          const freeCount = await transaction.businessListing.count({
            where: { isApproved: true },
          });
          if (freeCount >= FREE_LISTING_CAPACITY) {
            return { kind: "paid" as const };
          }

          const baseSlug = createSlug(data.name);
          for (let suffix = 0; suffix < 10; suffix++) {
            const slug = suffix === 0 ? baseSlug : `${baseSlug}-${suffix + 1}`;
            const existing = await transaction.businessListing.findUnique({
              where: { slug },
              select: { id: true },
            });
            if (existing) continue;

            const listing = await transaction.businessListing.create({
              data: { ...data, slug, isPaid: false, isApproved: true },
              select: {
                id: true,
                name: true,
                slug: true,
                category: true,
                tag: true,
                websiteUrl: true,
                description: true,
                createdAt: true,
              },
            });

            return { kind: "free" as const, listing };
          }

          return { kind: "conflict" as const };
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (error) {
      if (
        (isPrismaError(error, "P2034") || isPrismaError(error, "P2002")) &&
        transactionAttempt < 2
      ) {
        continue;
      }
      throw error;
    }
  }

  throw new Error("Unable to determine free listing availability.");
}

export async function POST(request: NextRequest) {
  const originHeader = request.headers.get("origin");
  if (originHeader) {
    try {
      if (new URL(originHeader).origin !== request.nextUrl.origin) {
        return errorResponse("Listing requests must come from this site.", 403);
      }
    } catch {
      return errorResponse("The request origin is invalid.", 403);
    }
  }

  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  ) {
    return errorResponse("Request body must be JSON.", 415);
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > REQUEST_BODY_LIMIT) {
    return errorResponse("Request body is too large.", 413);
  }

  let body: unknown;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > REQUEST_BODY_LIMIT) {
      return errorResponse("Request body is too large.", 413);
    }
    body = JSON.parse(rawBody);
  } catch {
    return errorResponse("Request body must be valid JSON.", 400);
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(
      parsed.error.issues[0]?.message ?? "Invalid listing details.",
      422,
    );
  }

  const { countryHint, ...listingDetails } = parsed.data;

  let result: Awaited<ReturnType<typeof createFreeListing>>;
  try {
    result = await createFreeListing(listingDetails);
  } catch (error) {
    console.error("[business listing] database create failed:", error);
    return errorResponse(
      "Unable to save your listing right now. Please try again.",
      500,
    );
  }

  if (result.kind === "free") {
    return NextResponse.json(
      { listing: result.listing, paymentRequired: false },
      { status: 201 },
    );
  }
  if (result.kind === "conflict") {
    return errorResponse(
      "A listing with this business name already exists. Please contact support.",
      409,
    );
  }

  const vercelCountry = request.headers
    .get("x-vercel-ip-country")
    ?.toUpperCase();
  const country =
    vercelCountry &&
    /^[A-Z]{2}$/.test(vercelCountry) &&
    vercelCountry !== "XX"
      ? vercelCountry
      : countryHint === "IN"
        ? "IN"
        : undefined;
  const gateway = country === "IN" ? "razorpay" : "stripe";
  const currency = gateway === "razorpay" ? "INR" : "USD";
  const amount =
    gateway === "razorpay" ? INR_LISTING_PRICE_PAISE : USD_LISTING_PRICE_CENTS;
  const configuredOrigin = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin;

  let origin: string;
  try {
    const parsedOrigin = new URL(configuredOrigin);
    if (
      parsedOrigin.protocol !== "https:" &&
      parsedOrigin.hostname !== "localhost"
    ) {
      return errorResponse("The checkout return URL must use HTTPS.", 503);
    }
    origin = parsedOrigin.origin;
  } catch {
    return errorResponse("Checkout return URL is not configured correctly.", 503);
  }

  try {
    const payment = await prisma.listingPayment.create({
      data: {
        ...listingDetails,
        gateway,
        amount,
        currency,
      },
      select: { id: true },
    });

    if (gateway === "stripe") {
      const secretKey = process.env.STRIPE_SECRET_KEY;
      if (!secretKey) {
        return errorResponse("Stripe checkout is not configured on this server.", 503);
      }

      const session = await new Stripe(secretKey).checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: amount,
              product_data: {
                name: "HookTos Featured Business Listing",
                description: "Permanent business directory listing with an SEO backlink",
              },
            },
          },
        ],
        success_url: `${origin}/marketplace?listing_payment=success&provider=stripe&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/marketplace?listing_payment=cancelled`,
        metadata: { listingPaymentId: payment.id },
      });

      if (!session.url) {
        return errorResponse("Unable to initialize Stripe checkout.", 502);
      }

      await prisma.listingPayment.update({
        where: { id: payment.id },
        data: { stripeSessionId: session.id },
      });

      return NextResponse.json({
        paymentRequired: true,
        gateway,
        checkoutUrl: session.url,
        amount,
        currency,
      });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_SECRET_KEY;
    if (!keyId || !keySecret) {
      return errorResponse(
        "Razorpay checkout is not configured on this server.",
        503,
      );
    }

    const order = await new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    }).orders.create({
      amount,
      currency,
      receipt: `listing-${payment.id}`,
      notes: { listingPaymentId: payment.id },
    });

    await prisma.listingPayment.update({
      where: { id: payment.id },
      data: { razorpayOrderId: order.id },
    });

    return NextResponse.json({
      paymentRequired: true,
      gateway,
      pendingListingId: payment.id,
      orderId: order.id,
      amount,
      currency,
      keyId,
    });
  } catch (error) {
    console.error(`[business listing] ${gateway} checkout creation failed:`, error);
    return errorResponse("Unable to start checkout. Please try again.", 502);
  }
}
