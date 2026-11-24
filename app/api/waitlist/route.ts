import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
    try {
        const body: unknown = await request.json().catch(() => null);
        const email =
            isRecord(body) && typeof body.email === "string"
                ? body.email.trim().toLowerCase()
                : "";
        const feedback =
            isRecord(body) && typeof body.feedback === "string"
                ? body.feedback.trim().slice(0, 1000)
                : null;
        const source =
            isRecord(body) && typeof body.source === "string" && body.source.trim()
                ? body.source.trim().slice(0, 100)
                : "premium_modal";

        if (!isValidEmail(email)) {
            return NextResponse.json(
                { ok: false, error: "Please enter a valid email address." },
                { status: 400 },
            );
        }

        const entry = await prisma.waitlistEntry.upsert({
            where: { email },
            update: {
                ...(feedback ? { feedback } : {}),
                source,
            },
            create: {
                email,
                feedback: feedback || null,
                source,
            },
            select: { id: true, email: true },
        });

        return NextResponse.json({
            ok: true,
            message: "You're on the early-access waitlist! Thanks for your feedback.",
            entry,
        });
    } catch (error) {
        console.error("[waitlist] unable to save entry:", error);
        return NextResponse.json(
            { ok: false, error: "Could not save your request right now. Please try again." },
            { status: 500 },
        );
    }
}
