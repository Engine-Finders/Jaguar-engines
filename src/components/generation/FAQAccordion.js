"use client";

import { useState } from "react";
import MStripe from "@/components/reusableComponents/MStripe";
import GenIcon from "./GenIcons";

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--color-primary-soft)] text-[0.85rem] font-bold text-[var(--color-primary)]">
          {item.id}
        </span>
        <span className="flex-1 text-[0.92rem] font-semibold leading-snug text-[var(--color-text)]" dangerouslySetInnerHTML={{ __html: item.question }} />
        <span className={`shrink-0 text-[var(--color-primary)] transition-transform ${isOpen ? "rotate-45" : ""}`}>
          <GenIcon name="plus" className="h-5 w-5" />
        </span>
      </button>
      {isOpen ? (
        <p className="px-5 pb-4 pl-[60px] text-[0.85rem] leading-[1.55] text-[var(--color-text-muted)]" dangerouslySetInnerHTML={{ __html: item.answer }} />
      ) : null}
    </div>
  );
}

export default function FAQAccordion({ data }) {
  const [openId, setOpenId] = useState(null);
  if (!data) return null;

  const items = data.items || [];
  const mid = Math.ceil(items.length / 2);
  const left = items.slice(0, mid);
  const right = items.slice(mid);

  return (
    <section className="w-full bg-[var(--color-page)] py-8 text-[var(--color-text)] md:py-10">
      <div className="relative mx-auto w-full max-w-8xl px-4 md:px-8">
        <h2
          className="text-[2.15rem] font-bold leading-[1.1] tracking-normal text-[var(--color-text)] md:text-[3rem]"
          dangerouslySetInnerHTML={{ __html: data.h2 || "FAQ" }}
        />
        <div className="mt-3">
          <MStripe />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-x-5">
          <div className="flex flex-col gap-3">
            {left.map((item) => (
              <FAQItem key={item.id} item={item} isOpen={openId === item.id} onToggle={() => setOpenId(openId === item.id ? null : item.id)} />
            ))}
          </div>
          <div className="flex flex-col gap-3">
            {right.map((item) => (
              <FAQItem key={item.id} item={item} isOpen={openId === item.id} onToggle={() => setOpenId(openId === item.id ? null : item.id)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
