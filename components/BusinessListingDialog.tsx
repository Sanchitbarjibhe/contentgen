"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import BusinessListingForm from "@/components/BusinessListingForm";

export default function BusinessListingDialog() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

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
        Get your free lifetime listing
        <ArrowRight aria-hidden="true" className="size-4" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/85 p-3 backdrop-blur-md sm:p-6"
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <section
            aria-labelledby="listing-dialog-title"
            aria-modal="true"
            className="relative my-auto w-full max-w-2xl rounded-3xl border border-slate-700/80 bg-slate-950 p-3 shadow-2xl shadow-purple-950/40 sm:p-5"
            role="dialog"
          >
            <h2 className="sr-only" id="listing-dialog-title">
              Add your business to the directory
            </h2>
            <button
              aria-label="Close business listing form"
              className="absolute right-5 top-5 z-10 rounded-lg border border-slate-700 bg-slate-950/90 p-2 text-slate-400 transition hover:border-slate-500 hover:text-white"
              onClick={() => setOpen(false)}
              ref={closeRef}
              type="button"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
            <BusinessListingForm />
          </section>
        </div>
      )}
    </>
  );
}
