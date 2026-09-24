// app/page.tsx
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300 ring-1 ring-inset ring-indigo-500/30">
        <Sparkles className="size-4" />
        HookCraft AI
      </span>
      <h1 className="max-w-xl text-4xl font-semibold text-zinc-100">
        Stop losing viewers in the first 3 seconds.
      </h1>
      <p className="max-w-md text-zinc-500">
        Generate 10 psychology-backed hooks, a retention score, an SEO description,
        and 15 hashtags — for every Reel, Short, and TikTok you make.
      </p>
      <Link
        href="/sign-up"
        className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-500"
      >
        Start free — 5 hooks a day
      </Link>
    </main>
  );
}
