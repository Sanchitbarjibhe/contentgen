import { NextRequest, NextResponse } from "next/server";
import { ANON_COOKIE_MAX_AGE, ANON_ID_COOKIE, newAnonId } from "@/lib/anonymous";

export default function proxy(request: NextRequest) {
    const url = request.nextUrl.clone();
    let shouldRedirect = false;

    if (url.pathname.includes("_")) {
        url.pathname = url.pathname.replace(/_/g, "-");
        shouldRedirect = true;
    }

    const lowerPath = url.pathname.toLowerCase();
    if (lowerPath !== url.pathname) {
        url.pathname = lowerPath;
        shouldRedirect = true;
    }

    if (shouldRedirect) {
        return NextResponse.redirect(url, 301);
    }

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
        '/((?!_next|api|[^?]*\\.[\\w]+$|_next/image).*)',
    ],
};