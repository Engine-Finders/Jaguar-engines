"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";

const iconPaths = {
  chart: <path d="M4 19V9m5 10V5m5 14v-7m5 7H3" />,
  engine: <path d="M3 13h2v-3h4V7H7V5h8v2h-2v3h3l2 2h3v7h-3l-2 2H7v-3H5v-3H3v-2Zm6-1v7h6.2l1.8-2h2v-3h-2l-1.8-2H9Z" />,
  gear: <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-5v3m0 12v3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1M3 12h3m12 0h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />,
  shield: <path d="M12 3 5 6v6c0 5 3.3 8.8 7 9 3.7-.2 7-4 7-9V6l-7-3Zm-2 9 1.5 1.5L15 10" />,
  shortcut: <path d="M9 12h6M9 8h6m-6 8h3M5 4h14v16H5V4Zm12 2H7v12h10V6Z" />,
  car: <path d="M5 13 7 7h10l2 6M4 13h16v6H4v-6Zm2 0V9m12 4V9M7 17h.01M17 17h.01" />,
  book: <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H11v16H6.5A2.5 2.5 0 0 0 4 22V6.5Zm16 0A2.5 2.5 0 0 0 17.5 4H13v16h4.5A2.5 2.5 0 0 1 20 22V6.5Z" />,
  clipboard: <path d="M9 4h6l1 2h3v15H5V6h3l1-2Zm1 7h4m-4 4h6m-6 4h5" />,
  thermometer: <path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0ZM5 14h3m-3-4h3" />,
  disc: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm6.4-2.4-4.3 4.3M5.6 17.4l4.3-4.3M6.6 5.6l4.3 4.3M17.4 18.4l-4.3-4.3" />,
  drop: <path d="M12 3s7 7.1 7 12a7 7 0 0 1-14 0c0-4.9 7-12 7-12Z" />,
  bolt: <path d="m13 2-8 12h6l-1 8 8-12h-6l1-8Z" />,
  smoke: <path d="M7 17c0-2 1.2-3.1 2.6-4.2C11 11.6 12 10.7 12 9.2A2.9 2.9 0 0 0 9.1 6c-1.2 0-2.2.6-3 1.8M14 18c0-1.5.8-2.4 2-3.4 1.2-.9 2-1.8 2-3.2A2.4 2.4 0 0 0 15.6 9c-.8 0-1.5.3-2.1 1M5 21c0-1.3.7-2.2 1.7-3M11 21c0-1.3.8-2.2 1.8-3M17 21c0-1.3.8-2.2 1.8-3" />,
  fuel: <path d="M6 5h7v14H6V5Zm7 2h2l3 3v7a2 2 0 0 1-2 2h-1m-7-6h3" />,
  flame: <path d="M12 3s1 2.5 1 4.5S11 11 11 11s.3-3-1.5-5.5C7.2 8 6 10 6 13a6 6 0 0 0 12 0c0-3.2-1.8-5.7-4.5-8.2.1 1.7-.2 3.1-1.5 4.7" />,
  refresh: <path d="M20 6v5h-5M4 18v-5h5M18.2 9A7 7 0 0 0 6.7 6.7L4 9m2 6a7 7 0 0 0 11.3 2.3L20 15" />,
  exhaust: <path d="M4 15c3 0 3-4 6-4h5v5h-5c-3 0-3 4-6 4m11-6h3a3 3 0 0 0 0-6h-2m-4 3c-1-3-3-5-7-5" />,
  steering: <path d="M12 6a6 6 0 1 0 6 6m-6-6v6m0-6A6 6 0 0 0 6 12m6 0h6m-6 0-4.5 4.5M12 12l4.5 4.5" />,
  warning: <path d="M12 9v4m0 4h.01M10 4.9 2.6 18a2 2 0 0 0 1.74 3h15.32A2 2 0 0 0 21.4 18L14 4.9a2 2 0 0 0-3.48 0Z" />,
  wrench: <path d="m14.7 6.3 3-3a4 4 0 0 1 0 5.7l-1.4 1.4-2.7-2.7L7 14.3V17H4.3l6.6-6.6-2.7-2.7 1.4-1.4a4 4 0 0 1 5.1 0Z" />,
  trophy: <path d="M8 4h8v4a4 4 0 0 1-8 0V4Zm0 2H4v2a3 3 0 0 0 4 2.8M16 6h4v2a3 3 0 0 1-4 2.8M12 12v5m-3 3h6m-7 0h8" />,
  scales: <path d="M12 3v18M5 7h14M7 7l-3 7h6L7 7Zm10 0-3 7h6l-3-7Z" />,
  question: <path d="M9.5 9a2.5 2.5 0 1 1 4.2 1.8c-.9.8-1.7 1.3-1.7 2.7M12 17h.01" />,
  users: <path d="M16 21v-2a4 4 0 0 0-8 0v2m12 0v-2.5a3.5 3.5 0 0 0-3-3.45M4 21v-2.5a3.5 3.5 0 0 1 3-3.45M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm6-1a3 3 0 1 0 0-6M6 10a3 3 0 1 1 0-6" />
};

const severityMeta = {
  catastrophic: {
    label: "Catastrophic",
    shortLabel: "STOP",
    badge: "border-[#f7c8cc] bg-[#fff0f1] text-[#c42430]",
    darkBadge: "border-[rgba(255,90,100,0.34)] bg-[rgba(255,45,53,0.14)] text-[#ff9aa0]",
    panel: "border-[#ef939b] bg-[#fff3f4]",
    darkPanel: "border-[rgba(255,90,100,0.34)] bg-[rgba(55,10,15,0.88)]",
    icon: "warning"
  },
  immediate: {
    label: "Immediate",
    shortLabel: "RECOVER",
    badge: "border-[#f5d4ad] bg-[#fff6ea] text-[#d97810]",
    darkBadge: "border-[rgba(246,161,73,0.34)] bg-[rgba(246,161,73,0.14)] text-[#ffba6c]",
    panel: "border-[#f0c58a] bg-[#fff7ed]",
    darkPanel: "border-[rgba(246,161,73,0.34)] bg-[rgba(56,28,4,0.88)]",
    icon: "thermometer"
  },
  monitor: {
    label: "Monitor",
    shortLabel: "WATCH",
    badge: "border-[#ecd7a7] bg-[#fff9ea] text-[#9c6a00]",
    darkBadge: "border-[rgba(222,177,65,0.34)] bg-[rgba(222,177,65,0.13)] text-[#ffd473]",
    panel: "border-[#e7d39d] bg-[#fffdf1]",
    darkPanel: "border-[rgba(222,177,65,0.34)] bg-[rgba(50,40,8,0.88)]",
    icon: "disc"
  },
  low: {
    label: "Low Risk",
    shortLabel: "REPAIR",
    badge: "border-[#cce7d7] bg-[#eefaf3] text-[#17824f]",
    darkBadge: "border-[rgba(77,198,124,0.34)] bg-[rgba(24,148,84,0.13)] text-[#74d7a1]",
    panel: "border-[#cde8d7] bg-[#f4fdf7]",
    darkPanel: "border-[rgba(77,198,124,0.34)] bg-[rgba(8,43,25,0.88)]",
    icon: "shield"
  }
};

const verdictMeta = {
  repair: {
    title: "Repair it",
    text: "Repair cost is proportionate to the car's value and the selected engine route does not improve the maths enough to justify replacement.",
    badge: "border-[#cce7d7] bg-[#eefaf3] text-[#17824f]",
    darkBadge: "border-[rgba(77,198,124,0.34)] bg-[rgba(24,148,84,0.13)] text-[#74d7a1]"
  },
  replace: {
    title: "Replace the engine",
    text: "Replacement looks commercially stronger than major repair on the numbers provided, especially given this diagnosis risk profile.",
    badge: "border-[#d4e3fb] bg-[#eff6ff] text-[#0d59cc]",
    darkBadge: "border-[rgba(79,146,255,0.34)] bg-[rgba(11,103,220,0.14)] text-[#8bb8ff]"
  },
  exit: {
    title: "Proceed carefully or walk away",
    text: "The projected spend is too close to the car's value. This is where the specialist inspection decides whether the car is still worth saving.",
    badge: "border-[#f5d4ad] bg-[#fff6ea] text-[#d97810]",
    darkBadge: "border-[rgba(246,161,73,0.34)] bg-[rgba(246,161,73,0.14)] text-[#ffba6c]"
  }
};

function Icon({ name, className = "h-5 w-5", strokeWidth = 1.9 }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {iconPaths[name] || iconPaths.question}
    </svg>
  );
}

function ArrowIcon({ className = "h-5 w-5" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function fmtCurrency(value) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0
  }).format(value);
}

function formatStepValue(value) {
  if (value >= 1000) {
    return `GBP${value / 1000}k`;
  }

  return `GBP${value}`;
}

function averageRange(range) {
  return (range.low + range.high) / 2;
}

function getReplacementRange(diagnosis, engineOptions, selectedEngine) {
  const option = engineOptions.find((item) => item.id === selectedEngine) || engineOptions[0];

  return {
    low: Math.round(diagnosis.replacementBase.low * option.multiplier),
    high: Math.round(diagnosis.replacementBase.high * option.multiplier)
  };
}

function getMainDealerRange(range, multiplier) {
  return {
    low: Math.round(range.low * multiplier),
    high: Math.round(range.high * multiplier)
  };
}

function getVerdict(diagnosis, carValue, selectedEngine, ageId, engineOptions) {
  const replacement = getReplacementRange(diagnosis, engineOptions, selectedEngine);
  const repairMid = averageRange(diagnosis.repairCost);
  const replacementMid = averageRange(replacement);
  const repairPct = carValue ? repairMid / carValue : 0;
  const replacePct = carValue ? replacementMid / carValue : 0;
  const ageAdjustments = {
    under5: 0.1,
    "5to10": 0.04,
    "10to15": 0,
    over15: -0.08
  };
  const ageAdjustment = ageAdjustments[ageId] || 0;
  const replaceThreshold = 0.68 + ageAdjustment;
  const repairThreshold = 0.3 + ageAdjustment / 2;
  let decision = "exit";

  if (diagnosis.severity === "catastrophic" || diagnosis.severity === "immediate") {
    if (repairPct <= 0.22) {
      decision = "repair";
    } else if (replacePct <= replaceThreshold) {
      decision = "replace";
    }
  } else if (repairPct <= repairThreshold || (diagnosis.severity === "low" && repairPct <= 0.45 + ageAdjustment / 2)) {
    decision = "repair";
  } else if (replacePct <= replaceThreshold) {
    decision = "replace";
  }

  return {
    decision,
    repairMid,
    replacement,
    replacementMid,
    replacementPct: Math.round(replacePct * 100),
    repairPct: Math.round(repairPct * 100)
  };
}

function ProgressBar({ percent }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[rgba(117,126,140,0.18)]">
      <div className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-300" style={{ width: `${percent}%` }} />
    </div>
  );
}

function StepIndicator({ labels, stageIndex, isDark }) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:gap-4">
      {labels.map((label, index) => {
        const stepNumber = index + 1;
        const active = stepNumber === stageIndex;
        const done = stepNumber < stageIndex;

        return (
          <div key={label} className="flex min-w-0 flex-1 items-center gap-2 md:gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[0.82rem] font-bold ${
                  done || active
                    ? isDark
                      ? "border-[var(--color-chrome)] bg-[var(--color-chrome)] text-[var(--color-page)]"
                      : "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                    : isDark
                      ? "border-[var(--color-border)] bg-transparent text-white/64"
                      : "border-[var(--color-border)] bg-transparent text-[var(--color-text-soft)]"
                }`}
              >
                {done ? "✓" : stepNumber}
              </span>
              <span className={`truncate text-[0.68rem] font-semibold uppercase tracking-[0.06em] md:text-[0.78rem] ${done || active ? "text-[var(--color-primary)]" : isDark ? "text-white/62" : "text-[var(--color-text-soft)]"}`}>
                {label}
              </span>
            </div>
            {index < labels.length - 1 ? <span className={`hidden h-px flex-1 sm:block ${done ? "bg-[var(--color-primary)]" : "bg-[var(--color-border)]"}`} /> : null}
          </div>
        );
      })}
    </div>
  );
}

function TrustStrip({ items, isDark }) {
  const cols = items.length === 3 ? "grid-cols-3" : items.length === 4 ? "grid-cols-4" : "grid-cols-2";

  return (
    <ul
      className={`grid overflow-hidden rounded-lg border ${cols} ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
          : "border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_8px_20px_var(--color-shadow)]"
      }`}
    >
      {items.map((item, index) => (
        <li
          key={`trust-strip-${index}`}
          className="flex flex-col items-center gap-1.5 border-r border-[var(--color-border)] px-1.5 py-2.5 text-center last:border-r-0 md:flex-row md:items-center md:gap-2.5 md:px-3 md:py-3 md:text-left"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center md:h-12 md:w-12">
            <HomeIcon name={item.icon} isDark={isDark} className="h-9 w-9 md:h-11 md:w-11" />
          </span>
          <span className="min-w-0">
            {item.value ? (
              <strong className={`block text-[0.68rem] leading-tight md:text-[0.86rem] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
                {item.value}
              </strong>
            ) : null}
            <span
              className={`block text-[0.54rem] leading-[1.2] md:text-[0.72rem] md:leading-[1.25] ${
                isDark ? "text-white/78" : "text-[var(--color-text-muted)]"
              } ${item.value ? "mt-0.5" : ""}`}
            >
              {item.text || item.label}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function HowItWorksCard({ steps, isDark, onStart, showButton = true }) {
  return (
    <section
      className={`h-full rounded-xl border p-4 md:p-5 ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
          : "border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_10px_28px_var(--color-shadow)]"
      }`}
    >
      <h3 className="text-[0.78rem] font-bold uppercase tracking-[0.08em] text-[var(--color-chrome-bright)]">
        How It Works
      </h3>
      <ul className="mt-4 grid gap-4">
        {steps.map((step) => (
          <li key={step.step} className="flex items-start gap-3">
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[0.88rem] font-bold ${
                isDark ? "bg-[var(--color-chrome)] text-[var(--color-page)]" : "bg-[var(--color-primary)] text-white"
              }`}
            >
              {step.step}
            </span>
            <div className="min-w-0 flex-1">
              <p className={`text-[0.92rem] font-semibold leading-tight ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
                {step.title}
              </p>
              <p className={`mt-1 text-[0.78rem] leading-[1.4] ${isDark ? "text-white/72" : "text-[var(--color-text-muted)]"}`}>
                {step.text}
              </p>
            </div>
          </li>
        ))}
      </ul>
      {showButton && onStart ? (
        <button
          type="button"
          onClick={onStart}
          className="btn-cta mt-5 flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-[0.82rem] font-bold"
        >
          <span>START DIAGNOSIS</span>
          <ArrowIcon className="h-4 w-4" />
        </button>
      ) : null}
    </section>
  );
}

function WhyTrustCard({ items, isDark }) {
  return (
    <section
      className={`h-full rounded-xl border p-4 md:p-5 ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
          : "border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_10px_28px_var(--color-shadow)]"
      }`}
    >
      <h3 className="text-[0.78rem] font-bold uppercase tracking-[0.08em] text-[var(--color-chrome-bright)]">
        Why Trust This Diagnosis?
      </h3>
      <ul className="mt-3.5 grid gap-3.5">
        {items.map((item) => (
          <li key={item.title} className="flex items-start gap-2.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center md:h-12 md:w-12">
              <HomeIcon name={item.icon} isDark={isDark} className="h-10 w-10 md:h-11 md:w-11" />
            </span>
            <div className="min-w-0">
              <p className={`text-[0.88rem] font-semibold leading-tight ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
                {item.title}
              </p>
              <p
                className={`mt-1 text-[0.76rem] leading-[1.4] ${isDark ? "text-white/72" : "text-[var(--color-text-muted)]"}`}
                dangerouslySetInnerHTML={{ __html: item.text }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function LandingGrid({ steps, items, costTable, isDark, onStart }) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-3.5 lg:grid-cols-[minmax(200px,0.72fr)_minmax(0,1.7fr)_minmax(200px,0.78fr)] lg:items-stretch lg:gap-4">
      <HowItWorksCard steps={steps} isDark={isDark} onStart={onStart} />
      <CostTablePanel table={costTable} isDark={isDark} />
      <WhyTrustCard items={items} isDark={isDark} />
    </div>
  );
}

function SideInfo({ data, isDark, onStart }) {
  return (
    <div className="grid gap-4">
      <HowItWorksCard steps={data.steps} isDark={isDark} onStart={onStart} />
      <WhyTrustCard items={data.items} isDark={isDark} />
    </div>
  );
}

function CostTablePanel({ table, isDark }) {
  if (!table?.rows?.length) return null;

  return (
    <section
      className={`h-full rounded-xl border p-4 md:p-5 ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
          : "border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_10px_28px_var(--color-shadow)]"
      }`}
    >
      <h3 className="text-[0.78rem] font-bold uppercase tracking-[0.08em] text-[var(--color-chrome-bright)]">
        {table.title}
      </h3>

      {/* Mobile stacked cards */}
      <ul className="mt-3 grid gap-3 md:hidden">
        {table.rows.map((row) => (
          <li
            key={`mobile-${row.failure}`}
            className={`rounded-lg border p-3 ${
              isDark ? "border-[var(--color-border)] bg-[var(--color-surface)]" : "border-[var(--color-border)] bg-[var(--color-page-soft)]"
            }`}
          >
            <p
              className={`text-[0.82rem] font-semibold leading-[1.3] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}
              dangerouslySetInnerHTML={{ __html: row.failure }}
            />
            <dl className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-2">
              {[
                ["Recond. S&F", row.recon],
                ["Rebuilt S&F", row.rebuilt],
                ["Used S&F", row.used],
                ["Main Dealer", row.dealer],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className={`text-[0.64rem] uppercase tracking-[0.04em] ${isDark ? "text-white/55" : "text-[var(--color-text-soft)]"}`}>
                    {label}
                  </dt>
                  <dd className={`mt-0.5 text-[0.78rem] font-medium ${isDark ? "text-white/88" : "text-[var(--color-text-muted)]"}`}>
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>

      {/* Desktop / tablet table */}
      <div className="mt-3 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[560px] border-collapse text-left lg:min-w-0">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              {(table.columns || []).map((col) => (
                <th
                  key={col}
                  className={`px-2 py-2 text-[0.68rem] font-bold uppercase tracking-[0.04em] ${
                    isDark ? "text-white/60" : "text-[var(--color-text-soft)]"
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row.failure} className="border-b border-[var(--color-border)] last:border-b-0">
                <td
                  className={`px-2 py-2.5 text-[0.78rem] font-medium leading-[1.3] ${
                    isDark ? "text-white" : "text-[var(--color-text)]"
                  }`}
                  dangerouslySetInnerHTML={{ __html: row.failure }}
                />
                <td className={`whitespace-nowrap px-2 py-2.5 text-[0.76rem] ${isDark ? "text-white/78" : "text-[var(--color-text-muted)]"}`}>
                  {row.recon}
                </td>
                <td className={`whitespace-nowrap px-2 py-2.5 text-[0.76rem] ${isDark ? "text-white/78" : "text-[var(--color-text-muted)]"}`}>
                  {row.rebuilt}
                </td>
                <td className={`whitespace-nowrap px-2 py-2.5 text-[0.76rem] ${isDark ? "text-white/78" : "text-[var(--color-text-muted)]"}`}>
                  {row.used}
                </td>
                <td className={`whitespace-nowrap px-2 py-2.5 text-[0.76rem] ${isDark ? "text-white/78" : "text-[var(--color-text-muted)]"}`}>
                  {row.dealer}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {table.footnote ? (
        <p className={`mt-2 text-[0.72rem] ${isDark ? "text-white/55" : "text-[var(--color-text-soft)]"}`}>
          {table.footnote}
        </p>
      ) : null}
    </section>
  );
}

function BottomBar({ cta, isDark, onStart }) {
  if (!cta) return null;

  return (
    <div
      className={`mt-4 flex flex-col gap-2.5 rounded-xl border px-3.5 py-3 md:mt-5 md:flex-row md:items-center md:justify-between md:gap-4 md:px-4 md:py-2.5 ${
        isDark
          ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
          : "border-[var(--color-border)] bg-[var(--color-page-soft)]"
      }`}
    >
      <div className="flex items-center gap-2.5 md:gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center md:h-11 md:w-11">
          <HomeIcon name="shield" isDark={isDark} className="h-9 w-9 md:h-10 md:w-10" />
        </span>
        <div className="min-w-0">
          <p className={`text-[0.84rem] font-semibold leading-[1.3] md:text-[0.86rem] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
            {cta.title}
          </p>
          {cta.text ? (
            <p className={`mt-0.5 text-[0.74rem] leading-[1.3] ${isDark ? "text-white/70" : "text-[var(--color-text-muted)]"}`}>
              {cta.text}
            </p>
          ) : null}
        </div>
      </div>
      <button
        type="button"
        onClick={onStart}
        className="btn-cta inline-flex shrink-0 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-[0.8rem] font-bold md:px-5"
      >
        <span>{(cta.buttonLabel || "START DIAGNOSIS").replace(/\s*→\s*$/, "")}</span>
        <ArrowIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

function IPaceNote({ note, isDark }) {
  if (!note) return null;

  return (
    <div
      className={`mt-3 flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 md:mt-3.5 md:gap-3 md:px-4 md:py-2.5 ${
        isDark
          ? "border-white/12 bg-[rgba(18,18,18,0.55)]"
          : "border-[var(--color-border)] bg-[var(--color-surface)]"
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border md:h-9 md:w-9 ${
          isDark ? "border-white/20 text-white/85" : "border-[var(--color-chrome)] text-[var(--color-text)]"
        }`}
      >
        <Icon name="bolt" className="h-4 w-4" />
      </span>
      <p className={`min-w-0 text-[0.78rem] leading-[1.35] md:text-[0.8rem] ${isDark ? "text-white/80" : "text-[var(--color-text-muted)]"}`}>
        <strong className={isDark ? "text-white" : "text-[var(--color-text)]"}>{note.label}</strong> {note.text}
      </p>
    </div>
  );
}

function ShortcutCard({ diagnosis, isDark, onSelect }) {
  const severity = severityMeta[diagnosis.severity] || severityMeta.monitor;

  return (
    <button
      type="button"
      onClick={() => onSelect(diagnosis.key)}
      className={`rounded-lg border p-3 text-left transition hover:border-[var(--color-primary)] ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-raised)]" : "border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-page-soft)]"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
          <Icon name={diagnosis.icon} className="h-5 w-5" />
        </span>
        <span className={`rounded-full border px-2 py-1 text-[0.64rem] font-bold uppercase tracking-[0.08em] ${isDark ? severity.darkBadge : severity.badge}`}>
          {severity.shortLabel}
        </span>
      </div>
      <p className={`mt-3 text-[0.85rem] font-semibold leading-tight ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>{diagnosis.shortcutLabel}</p>
      <p className={`mt-1 text-[0.72rem] leading-[1.4] ${isDark ? "text-white/68" : "text-[var(--color-text-muted)]"}`}>{diagnosis.evidenceLabel}</p>
    </button>
  );
}

function CategoryCard({ category, selected, isDark, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(category.id)}
      className={`rounded-xl border p-4 text-left transition ${
        selected
          ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
          : isDark
            ? "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border)]"
            : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]"
      }`}
    >
      <span className={`flex h-11 w-11 items-center justify-center rounded-full ${selected ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"}`}>
        <Icon name={category.icon} className="h-5 w-5" />
      </span>
      <p className={`mt-3 text-[0.92rem] font-semibold leading-tight ${selected ? "text-[var(--color-text)]" : isDark ? "text-white" : "text-[var(--color-text)]"}`}>{category.label}</p>
      <p className={`mt-1 text-[0.76rem] leading-[1.35] ${selected ? "text-[var(--color-text-muted)]" : isDark ? "text-white/72" : "text-[var(--color-text-muted)]"}`}>{category.description}</p>
    </button>
  );
}

function AnswerButton({ answer, isDark, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(answer.diagnosisKey)}
      className={`flex w-full items-center justify-between gap-4 rounded-lg border px-4 py-4 text-left transition ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface)] text-white hover:border-[var(--color-border)]" : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-primary)] hover:bg-[var(--color-page-soft)]"}`}
    >
      <span className="text-[0.88rem] leading-[1.4]">{answer.label}</span>
      <span className="shrink-0 text-[var(--color-primary)]">
        <ArrowIcon className="h-4 w-4" />
      </span>
    </button>
  );
}

function SeverityBadge({ severity, isDark }) {
  const meta = severityMeta[severity] || severityMeta.monitor;

  return <span className={`inline-flex rounded-full border px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.08em] ${isDark ? meta.darkBadge : meta.badge}`}>{meta.label}</span>;
}

function OverridePanel({ diagnosis, isDark, onContinue }) {
  const meta = severityMeta[diagnosis.severity] || severityMeta.monitor;

  return (
    <div className={`rounded-xl border p-5 md:p-6 ${isDark ? meta.darkPanel : meta.panel}`}>
      <div className="flex items-start gap-4">
        <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${isDark ? "bg-[rgba(255,255,255,0.08)] text-white" : "bg-[var(--color-surface)] text-[var(--color-text)]"}`}>
          <Icon name={meta.icon} className="h-7 w-7" />
        </span>
        <div className="min-w-0">
          <SeverityBadge severity={diagnosis.severity} isDark={isDark} />
          <h3 className={`mt-3 text-[1.3rem] font-bold leading-tight md:text-[1.7rem] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>{diagnosis.overrideCopy.headline}</h3>
          <p className={`mt-3 text-[0.9rem] leading-[1.5] ${isDark ? "text-white/78" : "text-[var(--color-text-muted)]"}`}>{diagnosis.overrideCopy.body}</p>
          <ul className="mt-4 grid gap-2">
            {diagnosis.overrideCopy.actions.map((action) => (
              <li key={action} className={`flex items-start gap-3 text-[0.82rem] leading-[1.45] ${isDark ? "text-white/74" : "text-[var(--color-text-muted)]"}`}>
                <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white ${isDark ? "bg-[var(--color-chrome)]" : "bg-[var(--color-primary)]"}`}>
                  <Icon name="shield" className="h-3 w-3" strokeWidth={2.3} />
                </span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-col gap-3 md:flex-row">
            <button type="button" onClick={onContinue} className="btn-cta flex items-center justify-center gap-3 rounded-lg px-5 py-3 text-[0.88rem] font-bold">
              <span>I understand - continue</span>
              <ArrowIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CostCard({ title, value, note, highlight, isDark }) {
  return (
    <article className={`rounded-lg border p-4 ${highlight ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]" : isDark ? "border-[var(--color-border)] bg-[var(--color-surface)]" : "border-[var(--color-border)] bg-[var(--color-surface)]"}`}>
      <p className={`text-[0.72rem] font-bold uppercase tracking-[0.08em] ${highlight ? "text-[var(--color-primary)]" : isDark ? "text-white/62" : "text-[var(--color-text-soft)]"}`}>{title}</p>
      <p className={`mt-2 text-[1.1rem] font-bold leading-tight ${highlight ? "text-[var(--color-text)]" : isDark ? "text-white" : "text-[var(--color-text)]"}`}>{value}</p>
      <p className={`mt-1 text-[0.76rem] leading-[1.35] ${highlight ? "text-[var(--color-text-muted)]" : isDark ? "text-white/68" : "text-[var(--color-text-muted)]"}`}>{note}</p>
    </article>
  );
}

function ResultsScreen({ diagnosis, verdict, engineOption, ctas, isDark, calculatorContext }) {
  const severity = severityMeta[diagnosis.severity] || severityMeta.monitor;
  const verdictInfo = verdictMeta[verdict.decision];
  const dealerRange = getMainDealerRange(verdict.replacement, diagnosis.dealerMultiplier);

  function goToQuoteWithCalculator(event) {
    event.preventDefault();
    const calculator = {
      source: "diagnostic-calculator",
      category: calculatorContext?.categoryLabel || "",
      diagnosis: diagnosis.headline || "",
      diagnosisKey: diagnosis.key || "",
      severity: severity?.label || diagnosis.severity || "",
      evidence: diagnosis.evidenceLabel || "",
      engineCodes: (diagnosis.engineCodes || []).join(" / "),
      vehicleAge: calculatorContext?.ageLabel || "",
      carValue: calculatorContext?.carValue != null ? fmtCurrency(calculatorContext.carValue) : "",
      engineRoute: engineOption?.label || "",
      repairCost: `${fmtCurrency(diagnosis.repairCost.low)} - ${fmtCurrency(diagnosis.repairCost.high)}`,
      replacementCost: `${fmtCurrency(verdict.replacement.low)} - ${fmtCurrency(verdict.replacement.high)}`,
      dealerEstimate: `${fmtCurrency(dealerRange.low)} - ${fmtCurrency(dealerRange.high)}`,
      replacementVsValue: `${verdict.replacementPct}%`,
      repairVsValue: `${verdict.repairPct}%`,
      verdict: verdictInfo?.title || "",
    };

    try {
      sessionStorage.setItem("bmw_quote_calculator", JSON.stringify(calculator));
    } catch {
      // Quote form still works without calculator context
    }

    const href = ctas.quote?.href && ctas.quote.href !== "#" ? ctas.quote.href : "/quote";
    const url = href.includes("?") ? `${href}&from=calculator` : `${href}?from=calculator`;
    window.location.href = url;
  }

  return (
    <div className="grid gap-5">
      <section className={`rounded-xl border p-5 shadow-[0_12px_34px_rgba(10,26,43,0.06)] ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[var(--color-border)] bg-[var(--color-surface)]"}`}>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <SeverityBadge severity={diagnosis.severity} isDark={isDark} />
              <span className={`text-[0.76rem] font-semibold uppercase tracking-[0.08em] ${isDark ? "text-white/62" : "text-[var(--color-text-soft)]"}`}>{diagnosis.evidenceLabel}</span>
            </div>
            <h3 className={`mt-3 text-[1.45rem] font-bold leading-tight md:text-[2rem] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>{diagnosis.headline}</h3>
            <p className={`mt-3 max-w-[760px] text-[0.92rem] leading-[1.55] ${isDark ? "text-white/78" : "text-[var(--color-text-muted)]"}`} dangerouslySetInnerHTML={{ __html: diagnosis.summary }} />
          </div>
          <div className={`rounded-xl border px-4 py-3 ${isDark ? severity.darkBadge : severity.badge}`}>
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.08em]">Tracked engine codes</p>
            <p className="mt-1 text-[0.86rem] font-semibold leading-tight">{diagnosis.engineCodes.join(" / ")}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <CostCard title="Repair cost" value={`${fmtCurrency(diagnosis.repairCost.low)} - ${fmtCurrency(diagnosis.repairCost.high)}`} note="If the issue is caught before secondary damage spreads." isDark={isDark} />
          <CostCard title={engineOption.label} value={`${fmtCurrency(verdict.replacement.low)} - ${fmtCurrency(verdict.replacement.high)}`} note="Replacement range for the engine route you selected." highlight isDark={isDark} />
          <CostCard title="Main dealer estimate" value={`${fmtCurrency(dealerRange.low)} - ${fmtCurrency(dealerRange.high)}`} note="Indicative dealer-level pricing using the same fault profile." isDark={isDark} />
          <CostCard title="Replacement vs car value" value={`${verdict.replacementPct}%`} note={`Repair sits near ${verdict.repairPct}% of car value.`} isDark={isDark} />
        </div>
      </section>

      <section className={`rounded-xl border p-5 shadow-[0_12px_34px_rgba(10,26,43,0.06)] ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[var(--color-border)] bg-[var(--color-surface)]"}`}>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.95fr)]">
          <div>
            <h4 className={`text-[0.82rem] font-bold uppercase tracking-[0.08em] text-[var(--color-primary)]`}>Commonly affecting</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {diagnosis.chassis.map((item) => (
                <span key={`${item.code}-${item.model}`} className={`rounded-lg border px-3 py-2 text-[0.78rem] ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface)] text-white" : "border-[var(--color-border)] bg-[var(--color-page-soft)] text-[var(--color-text)]"}`}>
                  <strong>{item.model}</strong> {item.code}
                  <span className={`${isDark ? "text-white/64" : "text-[var(--color-text-soft)]"}`}> {item.years}</span>
                </span>
              ))}
            </div>

            <h4 className="mt-5 text-[0.82rem] font-bold uppercase tracking-[0.08em] text-[var(--color-primary)]">OEM references</h4>
            <div className={`mt-3 overflow-hidden rounded-lg border ${isDark ? "border-[var(--color-border)]" : "border-[var(--color-border)]"}`}>
              {diagnosis.oemParts.map((part) => (
                <div key={part.part} className={`grid grid-cols-1 gap-1 border-b px-4 py-3 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_minmax(140px,0.8fr)] sm:gap-3 ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface)]" : "border-[var(--color-border)] bg-[var(--color-surface)]"}`}>
                  <span className={`text-[0.82rem] ${isDark ? "text-white/78" : "text-[var(--color-text-muted)]"}`}>{part.label}</span>
                  <span className={`text-[0.82rem] font-semibold ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>{part.part}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className={`rounded-xl border p-4 ${isDark ? verdictInfo.darkBadge : verdictInfo.badge}`}>
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em]">Verdict</p>
              <p className="mt-2 text-[1.15rem] font-bold leading-tight">{verdictInfo.title}</p>
              <p className="mt-2 text-[0.82rem] leading-[1.45]" dangerouslySetInnerHTML={{ __html: verdictInfo.text }} />
            </div>

            <div className={`mt-4 rounded-xl border p-4 ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface)]" : "border-[var(--color-border)] bg-[var(--color-page-soft)]"}`}>
              <p className="text-[0.82rem] font-bold uppercase tracking-[0.08em] text-[var(--color-primary)]">Next steps</p>
              <ul className="mt-3 grid gap-2">
                {diagnosis.nextSteps.map((step) => (
                  <li key={step} className={`flex items-start gap-3 text-[0.8rem] leading-[1.45] ${isDark ? "text-white/76" : "text-[var(--color-text-muted)]"}`}>
                    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white ${isDark ? "bg-[var(--color-chrome)]" : "bg-[var(--color-primary)]"}`}>
                      <Icon name="shield" className="h-3 w-3" strokeWidth={2.3} />
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 grid gap-3">
                <button
                  type="button"
                  onClick={goToQuoteWithCalculator}
                  className="btn-cta flex items-center justify-center gap-3 rounded-lg px-5 py-3 text-[0.86rem] font-bold"
                >
                  <span>{ctas.quote.label}</span>
                  <ArrowIcon className="h-4 w-4" />
                </button>
                <Link href={ctas.specialist.href} className={`flex items-center justify-center gap-3 rounded-lg border px-5 py-3 text-[0.86rem] font-bold ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface)] text-white" : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]"}`}>
                  <span>{ctas.specialist.label}</span>
                  <ArrowIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function HomeSec3({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const fallbackImage = data.headerImage || {
    src: "/home-image/sec2-bg.webp",
    alt: "Jaguar diagnostic calculator",
  };
  const heroImage =
    (isDark ? data.heroImages?.dark : data.heroImages?.light) || fallbackImage;
  const calculator = {
    ...(data.calculator || {}),
    diagnoses: data.calculator?.diagnoses || [],
    knownFaultOrder: data.calculator?.knownFaultOrder || [],
    categories: data.calculator?.categories || [],
    valueSteps: data.calculator?.valueSteps || [2000, 4000, 6000, 8000, 12000],
    engineOptions: data.calculator?.engineOptions || [{ id: "default", label: "Any engine", multiplier: 1 }],
    stepLabels: data.calculator?.stepLabels || ["Symptoms", "Vehicle", "Engine"],
    ageOptions: data.calculator?.ageOptions || [
      { id: "under5", label: "Under 5 years" },
      { id: "5to10", label: "5–10 years" },
      { id: "10to15", label: "10–15 years" },
      { id: "over15", label: "Over 15 years" },
    ],
    whyTrust: data.calculator?.whyTrust || data.whyTrust?.signals || [],
    ctas: data.calculator?.ctas || {
      quote: { label: "Get a quote", href: "/quote" },
      specialist: { label: "Find a specialist", href: "#" },
    },
  };
  const diagnosesByKey = Object.fromEntries(
    (calculator.diagnoses || []).map((item) => [item.key, item])
  );
  const knownFaults = (calculator.knownFaultOrder || [])
    .map((key) => diagnosesByKey[key])
    .filter(Boolean);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [stage, setStage] = useState("entry");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedDiagnosisKey, setSelectedDiagnosisKey] = useState("");
  const [selectedAgeId, setSelectedAgeId] = useState("");
  const [carValue, setCarValue] = useState(
    calculator.valueSteps[2] ?? calculator.valueSteps[0] ?? 6000
  );
  const [selectedEngine, setSelectedEngine] = useState(
    calculator.engineOptions[0]?.id || "default"
  );

  const selectedCategory =
    calculator.categories.find((item) => item.id === selectedCategoryId) || null;
  const selectedDiagnosis = diagnosesByKey[selectedDiagnosisKey] || null;
  const selectedEngineOption =
    calculator.engineOptions.find((item) => item.id === selectedEngine) ||
    calculator.engineOptions[0];
  const verdict = selectedDiagnosis
    ? getVerdict(
        selectedDiagnosis,
        carValue,
        selectedEngine,
        selectedAgeId,
        calculator.engineOptions
      )
    : null;
  const stageIndexMap = {
    entry: 1,
    question: 1,
    override: 1,
    vehicle: 2,
    engine: 3,
    results: 3
  };
  const progressMap = {
    entry: 20,
    question: 34,
    override: 40,
    vehicle: 66,
    engine: 86,
    results: 100
  };

  function resetFlow() {
    setStage("entry");
    setSelectedCategoryId("");
    setSelectedDiagnosisKey("");
    setSelectedAgeId("");
    setCarValue(calculator.valueSteps[2]);
    setSelectedEngine(calculator.engineOptions[0].id);
  }

  function openCalculator() {
    resetFlow();
    setCalculatorOpen(true);
    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        document.getElementById("diagnostic-calculator")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  function goToDiagnosis(key) {
    const diagnosis = diagnosesByKey[key];

    if (!diagnosis) {
      return;
    }

    setSelectedDiagnosisKey(key);

    if (diagnosis.severity === "catastrophic" || diagnosis.severity === "immediate") {
      setStage("override");
      return;
    }

    setStage("vehicle");
  }

  function goBackFromVehicle() {
    if (selectedCategoryId) {
      setStage("question");
      return;
    }

    setStage("entry");
  }

  return (
    <section className={`relative overflow-hidden ${isDark ? "bg-[var(--color-page)]" : "bg-[#ececea]"}`}>
      {/* Header - same treatment as Sec2 */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-[58%] md:w-[46%]">
          <Image
            src={heroImage.src}
            alt={heroImage.alt || ""}
            fill
            className="object-cover object-right"
            sizes="(max-width: 768px) 58vw, 46vw"
          />
          <div
            className={
              isDark
                ? "absolute inset-0 bg-[linear-gradient(90deg,var(--color-page)_0%,rgba(11,12,12,0.82)_34%,rgba(11,12,12,0.18)_100%)]"
                : "absolute inset-0 bg-[linear-gradient(90deg,#ececea_0%,rgba(236,236,234,0.88)_34%,rgba(236,236,234,0.18)_100%)]"
            }
          />
        </div>

        <div className="relative mx-auto w-full max-w-8xl px-3 pb-3 pt-5 md:px-6 md:pb-3.5 md:pt-8 lg:px-8">
          <div className="max-w-[760px]">
            <p
              className={`text-[0.64rem] font-bold uppercase tracking-[0.14em] ${
                isDark ? "text-white/55" : "text-[var(--color-text-muted)]"
              }`}
            >
              Diagnostic Calculator
            </p>
            <h2
              className={`mt-1.5 text-[2.2rem] font-bold leading-[0.98] md:text-[3.4rem] md:leading-[0.96] ${
                isDark ? "text-white" : "text-[var(--color-text)]"
              }`}
            >
              Diagnose Your{" "}
              <span className="text-[var(--color-chrome-bright)]">Jaguar Problem</span>
            </h2>
            <div className="mt-2.5">
              <MStripe />
            </div>
            <p
              className={`mt-2 max-w-[660px] text-[0.88rem] leading-[1.4] md:text-[1.05rem] md:leading-[1.45] ${
                isDark ? "text-white/80" : "text-[var(--color-text-muted)]"
              }`}
              dangerouslySetInnerHTML={{ __html: data.subHeadline }}
            />
          </div>
        </div>
      </div>

      <div className="px-3 pb-5 pt-2 md:px-6 md:pb-7 md:pt-2.5 lg:px-8">
      <div className="relative mx-auto w-full max-w-8xl">
        <TrustStrip items={data.trustStrip || []} isDark={isDark} />

        {!calculatorOpen ? (
          <>
            <LandingGrid
              steps={data.howItWorks?.steps || []}
              items={calculator.whyTrust || []}
              costTable={data.costTable}
              isDark={isDark}
              onStart={openCalculator}
            />
            <BottomBar cta={data.bottomCta} isDark={isDark} onStart={openCalculator} />
            {/* I-Pace note removed */}
          </>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(260px,320px)] lg:items-start">
              <div
                id="diagnostic-calculator"
                className={`overflow-hidden rounded-2xl border ${
                  isDark
                    ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_14px_36px_var(--color-shadow)]"
                }`}
              >
                <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] px-4 py-3 md:px-6">
                  <p className={`text-[0.78rem] font-semibold ${isDark ? "text-white/75" : "text-[var(--color-text-muted)]"}`}>
                    Interactive diagnosis
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCalculatorOpen(false);
                      resetFlow();
                    }}
                    className={`text-[0.78rem] font-semibold ${isDark ? "text-white/70" : "text-[var(--color-text-soft)]"}`}
                  >
                    Back to overview
                  </button>
                </div>
                <div className="px-4 pt-4 md:px-6 md:pt-6">
                  <ProgressBar percent={progressMap[stage]} />
                  <div className="mt-4">
                    <StepIndicator labels={calculator.stepLabels} stageIndex={stageIndexMap[stage]} isDark={isDark} />
                  </div>
                </div>

                <div className="px-4 pb-4 pt-5 md:px-6 md:pb-6">
                  {stage === "entry" ? (
                    <div>
                      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                        <div>
                          <p className="text-[0.76rem] font-bold uppercase tracking-[0.08em] text-[var(--color-primary)]">Known fault shortcuts</p>
                          <h3 className={`mt-2 text-[1.35rem] font-bold leading-tight md:text-[1.7rem] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>Jump straight to the likely failure</h3>
                        </div>
                        <p className={`max-w-[300px] text-[0.8rem] leading-[1.4] md:text-right ${isDark ? "text-white/66" : "text-[var(--color-text-soft)]"}`}>
                          {knownFaults.length} shortcut cards for drivers who already know the problem, plus the symptom route below for everyone else.
                        </p>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {knownFaults.map((diagnosis) => (
                          <ShortcutCard key={diagnosis.key} diagnosis={diagnosis} isDark={isDark} onSelect={goToDiagnosis} />
                        ))}
                      </div>

                      <div className={`mt-6 border-t pt-6 ${isDark ? "border-[var(--color-border)]" : "border-[var(--color-border)]"}`}>
                        <p className="text-[0.76rem] font-bold uppercase tracking-[0.08em] text-[var(--color-primary)]">Symptom route</p>
                        <h3 className={`mt-2 text-[1.35rem] font-bold leading-tight md:text-[1.7rem] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>Tell us where the issue starts</h3>
                        <p className={`mt-2 text-[0.82rem] leading-[1.45] ${isDark ? "text-white/72" : "text-[var(--color-text-muted)]"}`}>Pick the category that best matches the fault. The next screen narrows it into a specific diagnosis path.</p>

                        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                          {calculator.categories.map((category) => (
                            <CategoryCard key={category.id} category={category} selected={selectedCategoryId === category.id} isDark={isDark} onSelect={setSelectedCategoryId} />
                          ))}
                        </div>

                        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                          <button
                            type="button"
                            onClick={() => setStage("question")}
                            disabled={!selectedCategoryId}
                            className="btn-cta flex items-center justify-center gap-3 rounded-lg px-5 py-3 text-[0.88rem] font-bold disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <span>Continue to symptom questions</span>
                            <ArrowIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {stage === "question" && selectedCategory ? (
                    <div>
                      <p className="text-[0.76rem] font-bold uppercase tracking-[0.08em] text-[var(--color-primary)]">Question 2</p>
                      <h3 className={`mt-2 text-[1.35rem] font-bold leading-tight md:text-[1.7rem] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>{selectedCategory.question}</h3>
                      <p className={`mt-2 text-[0.82rem] leading-[1.45] ${isDark ? "text-white/72" : "text-[var(--color-text-muted)]"}`}>Choose the closest symptom cluster. We route high-risk faults into safety advice before showing cost maths.</p>

                      <div className="mt-5 grid gap-3">
                        {selectedCategory.answers.map((answer) => (
                          <AnswerButton key={answer.label} answer={answer} isDark={isDark} onSelect={goToDiagnosis} />
                        ))}
                      </div>

                      <div className="mt-5">
                        <button type="button" onClick={() => setStage("entry")} className={`text-[0.82rem] font-semibold ${isDark ? "text-white/72" : "text-[var(--color-text-soft)]"}`}>
                          Back to symptom categories
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {stage === "override" && selectedDiagnosis ? <OverridePanel diagnosis={selectedDiagnosis} isDark={isDark} onContinue={() => setStage("vehicle")} /> : null}

                  {stage === "vehicle" ? (
                    <div>
                      <p className="text-[0.76rem] font-bold uppercase tracking-[0.08em] text-[var(--color-primary)]">Vehicle context</p>
                      <h3 className={`mt-2 text-[1.35rem] font-bold leading-tight md:text-[1.7rem] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>Tell us about the car</h3>

                      <div className="mt-5">
                        <p className={`text-[0.78rem] font-bold uppercase tracking-[0.08em] ${isDark ? "text-white/64" : "text-[var(--color-text-soft)]"}`}>Vehicle age</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {calculator.ageOptions.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setSelectedAgeId(item.id)}
                              className={`rounded-full border px-4 py-2 text-[0.82rem] font-semibold ${selectedAgeId === item.id ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white" : isDark ? "border-[var(--color-border)] bg-[var(--color-surface)] text-white" : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]"}`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6">
                        <p className={`text-[0.78rem] font-bold uppercase tracking-[0.08em] ${isDark ? "text-white/64" : "text-[var(--color-text-soft)]"}`}>Estimated current value</p>
                        <div className={`mt-3 rounded-xl border px-5 py-4 ${isDark ? "border-[var(--color-border)] bg-[var(--color-surface)]" : "border-[var(--color-border)] bg-[var(--color-page-soft)]"}`}>
                          <strong className={`block text-[2rem] leading-none ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>{fmtCurrency(carValue)}</strong>
                          <span className={`mt-1 block text-[0.76rem] ${isDark ? "text-white/64" : "text-[var(--color-text-soft)]"}`}>What would the car roughly sell for in its current condition?</span>
                          <input
                            type="range"
                            min={0}
                            max={calculator.valueSteps.length - 1}
                            step={1}
                            value={calculator.valueSteps.indexOf(carValue)}
                            onChange={(event) => setCarValue(calculator.valueSteps[Number(event.target.value)])}
                            className="mt-4 w-full accent-[var(--color-primary)]"
                          />
                          <div className={`mt-3 flex justify-between gap-2 text-[0.66rem] ${isDark ? "text-white/56" : "text-[var(--color-text-soft)]"}`}>
                            {calculator.valueSteps.map((step) => (
                              <span key={step}>{formatStepValue(step)}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <button type="button" onClick={goBackFromVehicle} className={`text-[0.82rem] font-semibold ${isDark ? "text-white/72" : "text-[var(--color-text-soft)]"}`}>
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setStage("engine")}
                          disabled={!selectedAgeId}
                          className="btn-cta flex items-center justify-center gap-3 rounded-lg px-5 py-3 text-[0.88rem] font-bold disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <span>Continue to engine route</span>
                          <ArrowIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {stage === "engine" ? (
                    <div>
                      <p className="text-[0.76rem] font-bold uppercase tracking-[0.08em] text-[var(--color-primary)]">Engine route</p>
                      <h3 className={`mt-2 text-[1.35rem] font-bold leading-tight md:text-[1.7rem] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>Which replacement path are you comparing?</h3>
                      <p className={`mt-2 text-[0.82rem] leading-[1.45] ${isDark ? "text-white/72" : "text-[var(--color-text-muted)]"}`}>This changes the replacement range and therefore the verdict. Reconditioned stays the conservative baseline.</p>

                      <div className="mt-5 grid gap-3 md:grid-cols-3">
                        {calculator.engineOptions.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setSelectedEngine(option.id)}
                            className={`rounded-xl border p-4 text-left ${selectedEngine === option.id ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]" : isDark ? "border-[var(--color-border)] bg-[var(--color-surface)]" : "border-[var(--color-border)] bg-[var(--color-surface)]"}`}
                          >
                            <p className={`text-[0.92rem] font-semibold leading-tight ${selectedEngine === option.id ? "text-[var(--color-text)]" : isDark ? "text-white" : "text-[var(--color-text)]"}`}>{option.label}</p>
                            <p className={`mt-2 text-[0.76rem] leading-[1.35] ${selectedEngine === option.id ? "text-[var(--color-text-muted)]" : isDark ? "text-white/72" : "text-[var(--color-text-soft)]"}`}>{option.subLabel}</p>
                          </button>
                        ))}
                      </div>

                      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <button type="button" onClick={() => setStage("vehicle")} className={`text-[0.82rem] font-semibold ${isDark ? "text-white/72" : "text-[var(--color-text-soft)]"}`}>
                          Back
                        </button>
                        <button type="button" onClick={() => setStage("results")} className="btn-cta flex items-center justify-center gap-3 rounded-lg px-5 py-3 text-[0.88rem] font-bold">
                          <span>See diagnosis and costs</span>
                          <ArrowIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {stage === "results" && selectedDiagnosis && verdict ? (
                    <div>
                      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-[0.76rem] font-bold uppercase tracking-[0.08em] text-[var(--color-primary)]">Results dashboard</p>
                          <h3 className={`mt-2 text-[1.35rem] font-bold leading-tight md:text-[1.7rem] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>Diagnosis, cost range, and ownership verdict</h3>
                        </div>
                        <button type="button" onClick={resetFlow} className={`text-[0.82rem] font-semibold ${isDark ? "text-white/72" : "text-[var(--color-text-soft)]"}`}>
                          Start again
                        </button>
                      </div>
                      <ResultsScreen
                        diagnosis={selectedDiagnosis}
                        verdict={verdict}
                        engineOption={selectedEngineOption}
                        ctas={calculator.ctas}
                        isDark={isDark}
                        calculatorContext={{
                          categoryLabel: selectedCategory?.label || "",
                          ageLabel: calculator.ageOptions.find((item) => item.id === selectedAgeId)?.label || "",
                          carValue,
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              </div>

              <SideInfo
                data={{
                  steps: data.howItWorks?.steps || [],
                  items: calculator.whyTrust || [],
                }}
                isDark={isDark}
                onStart={openCalculator}
              />
            </div>
            <IPaceNote note={data.iPaceNote} isDark={isDark} />
          </>
        )}
      </div>
      </div>
    </section>
  );
}
