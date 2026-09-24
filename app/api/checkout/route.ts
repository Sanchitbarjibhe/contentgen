import { NextRequest, NextResponse } from "next/server";
import { stripe, PRICE_IDS } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { ANON_ID_COOKIE, getOrCreateUsage, newAnonId } from "@/lib/anonymous";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    const priceId = PRICE_IDS.PRO;
    if (!priceId) {
        return NextResponse.json({ error: "Premium pricing is not configured." }, { status: 503 });
    }

    const userId = req.cookies.get(ANON_ID_COOKIE)?.value ?? newAnonId();
    const usage = await getOrCreateUsage(userId);
    if (usage.isPremium) return NextResponse.json({ error: "Already upgraded." }, { status: 409 });

    let customerId = usage.stripeCustomerId;
    if (!customerId) {
        const customer = await stripe.customers.create({ metadata: { anonId: userId } });
        customerId = customer.id;
        await prisma.userUsage.update({ where: { userId }, data: { stripeCustomerId: customerId } });
    }

    const origin = req.headers.get("origin") ?? new URL(req.url).origin;
    const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: customerId,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${origin}/dashboard?upgraded=1`,
        cancel_url: `${origin}/dashboard`,
        metadata: { anonId: userId },
        subscription_data: { metadata: { anonId: userId } },
    });

    return NextResponse.json({ url: session.url });
}