// app/page.tsx
'use client'
import Link from "next/link";
import { Sparkles } from "lucide-react";
import HeroButtons from "@/components/HeroButtons";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/auth/signin"); // Sign in page route
  };

  const handleExploreDashboard = () => {
    // Sign-in न करता थेट guest dashboard वर नेण्यासाठी
    router.push("/dashboard");
  };

  const handleReadBlogs = () => {
    router.push("/blog"); // Blog route
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300 ring-1 ring-inset ring-indigo-500/30">
        <Sparkles className="size-4" />
        HookCraft AI
      </span>
      <h1 className="text-4xl font-bold text-center">Stop losing viewers in the first 3 seconds.</h1>
      <p className="max-w-md text-zinc-500">
        Generate 10 psychology-backed hooks, a retention score, an SEO description,
        and 15 hashtags — for every Reel, Short, and TikTok you make.
      </p>
      <HeroButtons
        onSignIn={handleSignIn}
        onExploreDashboard={handleExploreDashboard}
        onReadBlogs={handleReadBlogs}
      />
    </main>
  );
}
