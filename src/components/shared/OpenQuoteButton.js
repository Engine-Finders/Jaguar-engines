"use client";

import { openFreeQuote } from "@/lib/openFreeQuote";

/** Drop-in for quote Links — opens sticky free-quote modal instead of /quote. */
export default function OpenQuoteButton({
  className = "",
  children,
  reg,
  type = "button",
  onClick,
  ...rest
}) {
  return (
    <button
      type={type}
      className={className}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        openFreeQuote({ reg });
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
