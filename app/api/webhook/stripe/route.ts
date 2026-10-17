// app/api/webhook/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe, planFromPriceId } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("[stripe webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription" && session.subscription && session.metadata?.userId) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          await syncSubscription(session.metadata.userId, subscription);
        } else if (session.mode === "subscription" && session.metadata?.anonId) {
          await prisma.userUsage.update({
            where: { userId: session.metadata.anonId },
            data: { isPremium: true, stripeCustomerId: session.customer as string },
          });
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        if (userId) {
          await syncSubscription(userId, subscription);
        } else if (subscription.metadata?.anonId) {
          await prisma.userUsage.update({
            where: { userId: subscription.metadata.anonId },
            data: { isPremium: event.type !== "customer.subscription.deleted" && isPremiumStripeStatus(subscription.status) },
          });
        } else {
          // Fall back to matching by Stripe customer id if metadata is missing.
          await prisma.subscription.updateMany({
            where: { stripeCustomerId: subscription.customer as string },
            data: statusUpdateFrom(subscription),
          });
          await prisma.userUsage.updateMany({
            where: { stripeCustomerId: subscription.customer as string },
            data: { isPremium: event.type !== "customer.subscription.deleted" && isPremiumStripeStatus(subscription.status) },
          });
        }
        break;
      }

      default:
        break; // Ignore events we don't act on.
    }
  } catch (err) {
    console.error("[stripe webhook] handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

function isPremiumStripeStatus(status: Stripe.Subscription.Status): boolean {
  return status === "active" || status === "trialing";
}

async function syncSubscription(userId: string, subscription: Stripe.Subscription) {
  const priceId = subscription.items.data[0]?.price.id ?? null;

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      stripeCustomerId: subscription.customer as string,
      ...statusUpdateFrom(subscription, priceId),
    },
    update: {
      stripeCustomerId: subscription.customer as string,
      ...statusUpdateFrom(subscription, priceId),
    },
  });
}

function statusUpdateFrom(subscription: Stripe.Subscription, priceId?: string | null) {
  const resolvedPriceId = priceId ?? subscription.items.data[0]?.price.id ?? null;
  return {
    stripeSubscriptionId: subscription.id,
    stripePriceId: resolvedPriceId,
    stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    status: mapStripeStatus(subscription.status),
    plan: planFromPriceId(resolvedPriceId),
  };
}

function mapStripeStatus(
  status: Stripe.Subscription.Status
): "ACTIVE" | "TRIALING" | "PAST_DUE" | "CANCELED" | "INCOMPLETE" {
  switch (status) {
    case "active":
      return "ACTIVE";
    case "trialing":
      return "TRIALING";
    case "past_due":
      return "PAST_DUE";
    case "canceled":
    case "unpaid":
      return "CANCELED";
    default:
      return "INCOMPLETE";
  }
}
