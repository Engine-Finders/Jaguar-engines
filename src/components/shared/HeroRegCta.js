"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import UkPlateInput from "@/components/shared/UkPlateInput";

function ArrowIcon({ className = "h-4 w-4" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

/**
 * Hero-only reg plate + CTA → /quote?reg=
 * No supporting paragraph (per CTA brief).
 */
export default function HeroRegCta({
  label = "Explore Jaguar Engine Replacement Options",
  href = "/quote",
  className = "",
  buttonClassName = "",
}) {
  const router = useRouter();
  const [reg, setReg] = useState("");

  function onSubmit(event) {
    event.preventDefault();
    const cleaned = String(reg || "")
      .replace(/\s+/g, "")
      .toUpperCase();
    if (cleaned) {
      router.push(`/quote?reg=${encodeURIComponent(cleaned)}`);
      return;
    }
    router.push(href || "/quote");
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`mt-4 flex w-full max-w-[560px] flex-col gap-2 sm:flex-row sm:items-stretch ${className}`}
    >
      <UkPlateInput value={reg} onChange={setReg} placeholder="Your Reg" className="sm:min-w-0 sm:flex-1" />
      <button
        type="submit"
        className={`btn-cta inline-flex min-h-[3.25rem] shrink-0 items-center justify-center gap-2 rounded-md px-4 text-[0.78rem] font-bold sm:min-h-14 sm:max-w-[260px] sm:px-5 sm:text-[0.84rem] ${buttonClassName}`}
      >
        <span className="text-left leading-tight">{String(label).replace(/\s*(?:→|â†’)\s*$/, "")}</span>
        <ArrowIcon className="h-4 w-4 shrink-0" />
      </button>
    </form>
  );
}
