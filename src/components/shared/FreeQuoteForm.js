"use client";

import { Suspense, useEffect, useId, useRef, useState } from "react";
import QuoteForm from "@/components/shared/QuoteForm";

export default function FreeQuoteSticky() {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_28px_var(--color-shadow)] hover:bg-[var(--color-primary-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        Get a Free Quote
      </button>

      {open ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center p-3 sm:items-center sm:p-4" role="presentation">
          <button
            type="button"
            aria-label="Close quote form"
            className="absolute inset-0 bg-black/45"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-[61] max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-lg"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
              <h2 id={titleId} className="text-base font-bold text-[var(--color-text)]">
                Get a Free Quote
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                className="rounded border border-[var(--color-border)] px-2 py-1 text-sm font-bold text-[var(--color-text)]"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <Suspense fallback={<p className="p-4 text-sm text-[var(--color-text-soft)]">Loading…</p>}>
              <QuoteForm compact onSuccess={() => {}} />
            </Suspense>
          </div>
        </div>
      ) : null}
    </>
  );
}
