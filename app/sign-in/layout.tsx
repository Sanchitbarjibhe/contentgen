import type { Metadata } from "next";
import type { ReactNode } from "react";
import { hasClerkConfiguration } from "@/lib/clerk-config";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function SignInLayout({ children }: { children: ReactNode }) {
  return hasClerkConfiguration() ? (
    children
  ) : (
    <main className="grid min-h-screen place-items-center px-6 text-center text-slate-300">
      <p>Sign-in is unavailable until Clerk is configured.</p>
    </main>
  );
}
