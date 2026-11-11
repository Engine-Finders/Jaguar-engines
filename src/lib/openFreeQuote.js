/** Custom event name listened to by FreeQuoteSticky. */
export const FREE_QUOTE_EVENT = "jaguar:open-free-quote";

/**
 * Open the sticky free-quote modal (same form / submission).
 * Optional reg prefills the plate and triggers vehicle lookup.
 */
export function openFreeQuote({ reg } = {}) {
  if (typeof window === "undefined") return;
  const cleaned = String(reg || "")
    .replace(/\s+/g, "")
    .toUpperCase();
  window.dispatchEvent(
    new CustomEvent(FREE_QUOTE_EVENT, {
      detail: { reg: cleaned },
    }),
  );
}
