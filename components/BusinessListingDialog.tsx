"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight } from "lucide-react";
import BusinessListingForm from "@/components/BusinessListingForm";

export default function BusinessListingDialog({
  freeSpotsRemaining,
}: {
  freeSpotsRemaining?: number | null;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-purple-950/30 transition hover:from-purple-500 hover:to-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-300"
        onClick={() => setOpen(true)}
        ref={triggerRef}
        type="button"
      >
        {freeSpotsRemaining === 0 ? "Get your Featured Listing" : "Get your Free Listing"}
        <ArrowRight aria-hidden="true" className="size-4" />
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-slate-950/85 px-3 pb-3 pt-20 backdrop-blur-md sm:px-6 sm:pb-6 sm:pt-24"
            onClick={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
          >
            <div
              aria-labelledby="listing-dialog-title"
              aria-modal="true"
              className="my-3 w-full max-w-2xl sm:my-6"
              ref={dialogRef}
              role="dialog"
              tabIndex={-1}
            >
              <h2 className="sr-only" id="listing-dialog-title">
                Add your business to the directory
              </h2>
              <BusinessListingForm
                freeSpotsRemaining={freeSpotsRemaining}
                onClose={() => setOpen(false)}
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
