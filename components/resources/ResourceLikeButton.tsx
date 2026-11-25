"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

type LikeResponse = {
  likesCount: number;
  liked: boolean;
};

function isLikeResponse(value: unknown): value is LikeResponse {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    Number.isInteger(record.likesCount) &&
    typeof record.liked === "boolean"
  );
}

export default function ResourceLikeButton({
  resourceId,
  initialLikesCount = 0,
  initialLiked = false,
}: {
  resourceId?: string;
  initialLikesCount?: number;
  initialLiked?: boolean;
}) {
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [liked, setLiked] = useState(initialLiked);
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setLikesCount(initialLikesCount);
    setLiked(initialLiked);
  }, [initialLiked, initialLikesCount, resourceId]);

  async function toggleLike() {
    if (!resourceId || pending) return;

    const previous = { liked, likesCount };
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikesCount(Math.max(0, likesCount + (nextLiked ? 1 : -1)));
    setPending(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `/api/resources/${encodeURIComponent(resourceId)}/like`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ liked: nextLiked }),
        },
      );
      const payload: unknown = await response.json();

      if (!response.ok || !isLikeResponse(payload)) {
        const message =
          typeof payload === "object" &&
          payload !== null &&
          "error" in payload &&
          typeof payload.error === "string"
            ? payload.error
            : "Could not update your like. Please try again.";
        throw new Error(message);
      }

      setLiked(payload.liked);
      setLikesCount(payload.likesCount);
      window.dispatchEvent(
        new CustomEvent("resource-like-updated", {
          detail: {
            resourceId,
            likesCount: payload.likesCount,
            liked: payload.liked,
          },
        }),
      );
    } catch (error) {
      console.error("[resources] like request failed:", error);
      setLiked(previous.liked);
      setLikesCount(previous.likesCount);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not update your like. Please try again.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        aria-label={`${liked ? "Unlike" : "Like"} resource; ${likesCount} likes`}
        aria-pressed={liked}
        className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300 disabled:cursor-not-allowed disabled:opacity-60 ${
          liked
            ? "border-rose-400/30 bg-rose-400/10 text-rose-200"
            : "border-slate-700 bg-slate-950/30 text-slate-400 hover:border-rose-400/30 hover:text-rose-200"
        }`}
        disabled={!resourceId || pending}
        onClick={() => void toggleLike()}
        title={
          resourceId
            ? liked
              ? "Remove your like"
              : "Like this resource"
            : "Likes are unavailable while resource data is offline"
        }
        type="button"
      >
        <Heart
          aria-hidden="true"
          className={`size-4 ${liked ? "fill-current" : ""}`}
        />
        <span>{pending ? "Saving…" : "Like"}</span>
        <span aria-live="polite" className="tabular-nums">
          {likesCount}
        </span>
      </button>
      {errorMessage && (
        <p aria-live="polite" className="max-w-48 text-right text-[11px] text-rose-300" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
