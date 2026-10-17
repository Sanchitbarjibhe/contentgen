"use client";

import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";

export default function AuthActions() {
    const { isLoaded, isSignedIn } = useAuth();

    if (!isLoaded) {
        return null;
    }

    if (isSignedIn) {
        return <UserButton />;
    }

    return (
        <>
            <Link href="/sign-in" className="text-sm font-medium text-zinc-400 hover:text-zinc-100">
                Sign in
            </Link>
            <Link href="/sign-up" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
                Sign up
            </Link>
        </>
    );
}