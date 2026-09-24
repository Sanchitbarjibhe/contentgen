import { NextRequest, NextResponse } from "next/server";
import { ANON_COOKIE_MAX_AGE, ANON_ID_COOKIE, newAnonId } from "@/lib/anonymous";

export default function proxy(request: NextRequest) {
    const anonId = request.cookies.get(ANON_ID_COOKIE)?.value ?? newAnonId();
    const requestHeaders = new Headers(request.headers);
    if (!request.cookies.has(ANON_ID_COOKIE)) {
        requestHeaders.set("cookie", `${request.headers.get("cookie") ? `${request.headers.get("cookie")}; ` : ""}${ANON_ID_COOKIE}=${anonId}`);
    }
    const response = NextResponse.next({ request: { headers: requestHeaders } });

    if (!request.cookies.has(ANON_ID_COOKIE)) {
        response.cookies.set({
            name: ANON_ID_COOKIE,
            value: anonId,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: ANON_COOKIE_MAX_AGE,
            path: "/",
        });
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.[\\w]+$|_next/image).*)',
        '/(api|trpc)(.*)',
    ],
};