function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(request: Request) {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return Response.json(
            { status: "error", message: "Please enter a valid email address." },
            { status: 400 },
        );
    }

    const email = isRecord(body) && typeof body.email === "string" ? body.email.trim() : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return Response.json(
            { status: "error", message: "Please enter a valid email address." },
            { status: 400 },
        );
    }

    return Response.json({
        status: "coming_soon",
        message: "Early access signup is coming soon. Your email has not been saved yet.",
    });
}
