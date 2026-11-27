"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error("[app] Root layout render failed:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#020617",
          color: "#f8fafc",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            boxSizing: "border-box",
            textAlign: "center",
          }}
        >
          <title>Something went wrong | HookTos AI</title>
          <h1 style={{ fontSize: "1.5rem", margin: 0 }}>
            HookTos AI could not load
          </h1>
          <p style={{ maxWidth: "32rem", color: "#94a3b8", lineHeight: 1.6 }}>
            An unexpected error occurred. Please try again in a moment.
          </p>
          {error.digest ? (
            <p style={{ color: "#64748b", fontSize: "0.75rem" }}>
              Reference: {error.digest}
            </p>
          ) : null}
          <button
            onClick={() => retry()}
            style={{
              marginTop: "12px",
              border: 0,
              borderRadius: "8px",
              background: "#4f46e5",
              color: "white",
              padding: "10px 18px",
              fontSize: "0.95rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
            type="button"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
