"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error("[app] Route render failed:", error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center text-slate-100">
      <h1 className="text-2xl font-bold">This page could not load</h1>
      <p className="mt-3 max-w-lg text-slate-400">
        Something went wrong while loading this page. Please try again.
      </p>
      {error.digest ? (
        <p className="mt-2 text-xs text-slate-500">
          Reference: {error.digest}
        </p>
      ) : null}
      <button
        className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-500"
        onClick={() => retry()}
        type="button"
      >
        Try again
      </button>
    </main>
  );
}
