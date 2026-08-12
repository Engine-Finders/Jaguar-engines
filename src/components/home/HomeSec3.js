"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";

const iconPaths = {
  chart: <path d="M4 19V9m5 10V5m5 14v-7m5 7H3" />,
  engine: <path d="M3 13h2v-3h4V7H7V5h8v2h-2v3h3l2 2h3v7h-3l-2 2H7v-3H5v-3H3v-2Zm6-1v7h6.2l1.8-2h2v-3h-2l-1.8-2H9Z" />,
  gear: <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-5v3m0 12v3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1M3 12h3m12 0h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />,
  shield: <path d="M12 3 5 6v6c0 5 3.3 8.8 7 9 3.7-.2 7-4 7-9V6l-7-3Zm-2 9 1.5 1.5L15 10" />,
  shortcut: <path d="M9 12h6M9 8h6m-6 8h3M5 4h14v16H5V4Zm12 2H7v12h10V6Z" />,
  car: <path d="M5 13 7 7h10l2 6M4 13h16v6H4v-6Zm2 0V9m12 4V9M7 17h.01M17 17h.01" />,
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
    <div className="flex items-center gap-2 md:gap-4">
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
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                    : isDark
                      ? "border-[#375067] bg-transparent text-white/64"
                      : "border-[#d7dde6] bg-transparent text-[#607085]"
                }`}
              >
                {done ? "✓" : stepNumber}
              </span>
              <span className={`truncate text-[0.72rem] font-semibold uppercase tracking-[0.06em] md:text-[0.78rem] ${done || active ? "text-[var(--color-primary)]" : isDark ? "text-white/62" : "text-[#607085]"}`}>
                {label}
              </span>
            </div>
            {index < labels.length - 1 ? <span className={`h-px flex-1 ${done ? "bg-[var(--color-primary)]" : isDark ? "bg-[#375067]" : "bg-[#d7dde6]"}`} /> : null}
          </div>
        );
      })}
    </div>
  );
}

function TrustStrip({ items, isDark }) {
  return (
    <ul className={`mt-6 grid grid-cols-2 overflow-hidden rounded-xl border shadow-[0_14px_34px_rgba(10,26,43,0.08)] md:grid-cols-4 ${isDark ? "border-[#223343] bg-[rgba(10,21,32,0.86)]" : "border-[#d7dde6] bg-white/95"}`}>
      {items.map((item, index) => (
        <li key={`trust-strip-${index}`} className={`flex items-center gap-3 border-b px-3 py-4 md:border-b-0 md:border-r md:px-4 last:border-b-0 md:last:border-r-0 ${isDark ? "border-[#223343]" : "border-[#d7dde6]"}`}>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
            <Icon name={item.icon} className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <strong className={`block text-[0.95rem] leading-tight ${isDark ? "text-white" : "text-[#071827]"}`}>{item.value || ""}</strong>
            <span className={`block text-[0.72rem] leading-[1.3] ${isDark ? "text-white/72" : "text-[#27384a]"}`}>{item.text || item.label}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function SideInfo({ data, isDark }) {
  return (
    <div className="grid gap-4">
      <section className={`rounded-xl border p-4 shadow-[0_12px_34px_rgba(10,26,43,0.05)] ${isDark ? "border-[#223343] bg-[rgba(10,21,32,0.88)]" : "border-[#d7dde6] bg-white"}`}>
        <h3 className="text-[0.82rem] font-bold uppercase tracking-[0.08em] text-[var(--color-primary)]">How It Works</h3>
        <ul className="mt-4 grid gap-3">
          {data.steps.map((step) => (
            <li key={step.step} className={`rounded-lg border p-3 ${isDark ? "border-[#223343] bg-[rgba(14,28,41,0.84)]" : "border-[#e4e9f0] bg-[#fbfdff]"}`}>
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white">
                  <Icon name={step.icon} className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[0.76rem] font-bold uppercase tracking-[0.08em] text-[var(--color-primary)]">Step {step.step}</p>
                  <p className={`mt-1 text-[0.88rem] font-semibold leading-tight ${isDark ? "text-white" : "text-[#071827]"}`}>{step.title}</p>
                  <p className={`mt-1 text-[0.76rem] leading-[1.4] ${isDark ? "text-white/72" : "text-[#27384a]"}`}>{step.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className={`rounded-xl border p-4 shadow-[0_12px_34px_rgba(10,26,43,0.05)] ${isDark ? "border-[#223343] bg-[rgba(10,21,32,0.88)]" : "border-[#d7dde6] bg-white"}`}>
        <h3 className="text-[0.82rem] font-bold uppercase tracking-[0.08em] text-[var(--color-primary)]">Why Trust This Tool</h3>
        <ul className="mt-4 grid gap-3">
          {data.items.map((item) => (
            <li key={item.title} className={`rounded-lg border p-3 ${isDark ? "border-[#223343] bg-[rgba(14,28,41,0.84)]" : "border-[#e4e9f0] bg-[#fbfdff]"}`}>
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                  <Icon name={item.icon} className="h-5 w-5" />
                </span>
                <div>
                  <p className={`text-[0.88rem] font-semibold leading-tight ${isDark ? "text-white" : "text-[#071827]"}`}>{item.title}</p>
                  <p className={`mt-1 text-[0.76rem] leading-[1.4] ${isDark ? "text-white/72" : "text-[#27384a]"}`}>{item.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function ShortcutCard({ diagnosis, isDark, onSelect }) {
  const severity = severityMeta[diagnosis.severity];

  return (
    <button
      type="button"
      onClick={() => onSelect(diagnosis.key)}
      className={`rounded-lg border p-3 text-left transition hover:border-[var(--color-primary)] ${isDark ? "border-[#223343] bg-[rgba(14,28,41,0.84)] hover:bg-[rgba(18,38,56,0.9)]" : "border-[#d7dde6] bg-white hover:bg-[#f8fbff]"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
          <Icon name={diagnosis.icon} className="h-5 w-5" />
        </span>
        <span className={`rounded-full border px-2 py-1 text-[0.64rem] font-bold uppercase tracking-[0.08em] ${isDark ? severity.darkBadge : severity.badge}`}>
          {severity.shortLabel}
        </span>
      </div>
      <p className={`mt-3 text-[0.85rem] font-semibold leading-tight ${isDark ? "text-white" : "text-[#071827]"}`}>{diagnosis.shortcutLabel}</p>
      <p className={`mt-1 text-[0.72rem] leading-[1.4] ${isDark ? "text-white/68" : "text-[#27384a]"}`}>{diagnosis.evidenceLabel}</p>
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
            ? "border-[#223343] bg-[rgba(14,28,41,0.84)] hover:border-[#375067]"
            : "border-[#d7dde6] bg-white hover:border-[var(--color-primary)]"
      }`}
    >
      <span className={`flex h-11 w-11 items-center justify-center rounded-full ${selected ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"}`}>
        <Icon name={category.icon} className="h-5 w-5" />
      </span>
      <p className={`mt-3 text-[0.92rem] font-semibold leading-tight ${selected ? "text-[#071827]" : isDark ? "text-white" : "text-[#071827]"}`}>{category.label}</p>
      <p className={`mt-1 text-[0.76rem] leading-[1.35] ${selected ? "text-[#27384a]" : isDark ? "text-white/72" : "text-[#27384a]"}`}>{category.description}</p>
    </button>
  );
}

function AnswerButton({ answer, isDark, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(answer.diagnosisKey)}
      className={`flex w-full items-center justify-between gap-4 rounded-lg border px-4 py-4 text-left transition ${isDark ? "border-[#223343] bg-[rgba(14,28,41,0.84)] text-white hover:border-[#375067]" : "border-[#d7dde6] bg-white text-[#071827] hover:border-[var(--color-primary)] hover:bg-[#f8fbff]"}`}
    >
      <span className="text-[0.88rem] leading-[1.4]">{answer.label}</span>
      <span className="shrink-0 text-[var(--color-primary)]">
        <ArrowIcon className="h-4 w-4" />
      </span>
    </button>
  );
}

function SeverityBadge({ severity, isDark }) {
  const meta = severityMeta[severity];

  return <span className={`inline-flex rounded-full border px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.08em] ${isDark ? meta.darkBadge : meta.badge}`}>{meta.label}</span>;
}

function OverridePanel({ diagnosis, isDark, onContinue }) {
  const meta = severityMeta[diagnosis.severity];

  return (
    <div className={`rounded-xl border p-5 md:p-6 ${isDark ? meta.darkPanel : meta.panel}`}>
      <div className="flex items-start gap-4">
        <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${isDark ? "bg-[rgba(255,255,255,0.08)] text-white" : "bg-white text-[#071827]"}`}>
          <Icon name={meta.icon} className="h-7 w-7" />
        </span>
        <div className="min-w-0">
          <SeverityBadge severity={diagnosis.severity} isDark={isDark} />
          <h3 className={`mt-3 text-[1.3rem] font-bold leading-tight md:text-[1.7rem] ${isDark ? "text-white" : "text-[#071827]"}`}>{diagnosis.overrideCopy.headline}</h3>
          <p className={`mt-3 text-[0.9rem] leading-[1.5] ${isDark ? "text-white/78" : "text-[#27384a]"}`}>{diagnosis.overrideCopy.body}</p>
          <ul className="mt-4 grid gap-2">
            {diagnosis.overrideCopy.actions.map((action) => (
              <li key={action} className={`flex items-start gap-3 text-[0.82rem] leading-[1.45] ${isDark ? "text-white/74" : "text-[#27384a]"}`}>
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
                  <Icon name="shield" className="h-3 w-3" strokeWidth={2.3} />
                </span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-col gap-3 md:flex-row">
            <button type="button" onClick={onContinue} className="flex items-center justify-center gap-3 rounded-lg bg-[var(--color-primary)] px-5 py-3 text-[0.88rem] font-bold text-white">
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
    <article className={`rounded-lg border p-4 ${highlight ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]" : isDark ? "border-[#223343] bg-[rgba(14,28,41,0.84)]" : "border-[#d7dde6] bg-white"}`}>
      <p className={`text-[0.72rem] font-bold uppercase tracking-[0.08em] ${highlight ? "text-[var(--color-primary)]" : isDark ? "text-white/62" : "text-[#607085]"}`}>{title}</p>
      <p className={`mt-2 text-[1.1rem] font-bold leading-tight ${highlight ? "text-[#071827]" : isDark ? "text-white" : "text-[#071827]"}`}>{value}</p>
      <p className={`mt-1 text-[0.76rem] leading-[1.35] ${highlight ? "text-[#27384a]" : isDark ? "text-white/68" : "text-[#27384a]"}`}>{note}</p>
    </article>
  );
}

function ResultsScreen({ diagnosis, verdict, engineOption, ctas, isDark, calculatorContext }) {
  const severity = severityMeta[diagnosis.severity];
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
      <section className={`rounded-xl border p-5 shadow-[0_12px_34px_rgba(10,26,43,0.06)] ${isDark ? "border-[#223343] bg-[rgba(10,21,32,0.9)]" : "border-[#d7dde6] bg-white"}`}>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <SeverityBadge severity={diagnosis.severity} isDark={isDark} />
              <span className={`text-[0.76rem] font-semibold uppercase tracking-[0.08em] ${isDark ? "text-white/62" : "text-[#607085]"}`}>{diagnosis.evidenceLabel}</span>
            </div>
            <h3 className={`mt-3 text-[1.45rem] font-bold leading-tight md:text-[2rem] ${isDark ? "text-white" : "text-[#071827]"}`}>{diagnosis.headline}</h3>
            <p className={`mt-3 max-w-[760px] text-[0.92rem] leading-[1.55] ${isDark ? "text-white/78" : "text-[#27384a]"}`} dangerouslySetInnerHTML={{ __html: diagnosis.summary }} />
          </div>
          <div className={`rounded-xl border px-4 py-3 ${isDark ? severity.darkBadge : severity.badge}`}>
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.08em]">Tracked engine codes</p>
            <p className="mt-1 text-[0.86rem] font-semibold leading-tight">{diagnosis.engineCodes.join(" / ")}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <CostCard title="Repair cost" value={`${fmtCurrency(diagnosis.repairCost.low)} - ${fmtCurrency(diagnosis.repairCost.high)}`} note="If the issue is caught before secondary damage spreads." isDark={isDark} />
          <CostCard title={engineOption.label} value={`${fmtCurrency(verdict.replacement.low)} - ${fmtCurrency(verdict.replacement.high)}`} note="Replacement range for the engine route you selected." highlight isDark={isDark} />
          <CostCard title="Main dealer estimate" value={`${fmtCurrency(dealerRange.low)} - ${fmtCurrency(dealerRange.high)}`} note="Indicative dealer-level pricing using the same fault profile." isDark={isDark} />
          <CostCard title="Replacement vs car value" value={`${verdict.replacementPct}%`} note={`Repair sits near ${verdict.repairPct}% of car value.`} isDark={isDark} />
        </div>
      </section>

      <section className={`rounded-xl border p-5 shadow-[0_12px_34px_rgba(10,26,43,0.06)] ${isDark ? "border-[#223343] bg-[rgba(10,21,32,0.9)]" : "border-[#d7dde6] bg-white"}`}>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.95fr)]">
          <div>
            <h4 className={`text-[0.82rem] font-bold uppercase tracking-[0.08em] text-[var(--color-primary)]`}>Commonly affecting</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {diagnosis.chassis.map((item) => (
                <span key={`${item.code}-${item.model}`} className={`rounded-lg border px-3 py-2 text-[0.78rem] ${isDark ? "border-[#223343] bg-[rgba(14,28,41,0.84)] text-white" : "border-[#d7dde6] bg-[#fbfdff] text-[#071827]"}`}>
                  <strong>{item.model}</strong> {item.code}
                  <span className={`${isDark ? "text-white/64" : "text-[#607085]"}`}> {item.years}</span>
                </span>
              ))}
            </div>

            <h4 className="mt-5 text-[0.82rem] font-bold uppercase tracking-[0.08em] text-[var(--color-primary)]">OEM references</h4>
            <div className={`mt-3 overflow-hidden rounded-lg border ${isDark ? "border-[#223343]" : "border-[#d7dde6]"}`}>
              {diagnosis.oemParts.map((part) => (
                <div key={part.part} className={`grid grid-cols-[minmax(0,1fr)_minmax(140px,0.8fr)] gap-3 border-b px-4 py-3 last:border-b-0 ${isDark ? "border-[#223343] bg-[rgba(14,28,41,0.84)]" : "border-[#d7dde6] bg-white"}`}>
                  <span className={`text-[0.82rem] ${isDark ? "text-white/78" : "text-[#27384a]"}`}>{part.label}</span>
                  <span className={`text-[0.82rem] font-semibold ${isDark ? "text-white" : "text-[#071827]"}`}>{part.part}</span>
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

            <div className={`mt-4 rounded-xl border p-4 ${isDark ? "border-[#223343] bg-[rgba(14,28,41,0.84)]" : "border-[#d7dde6] bg-[#fbfdff]"}`}>
              <p className="text-[0.82rem] font-bold uppercase tracking-[0.08em] text-[var(--color-primary)]">Next steps</p>
              <ul className="mt-3 grid gap-2">
                {diagnosis.nextSteps.map((step) => (
                  <li key={step} className={`flex items-start gap-3 text-[0.8rem] leading-[1.45] ${isDark ? "text-white/76" : "text-[#27384a]"}`}>
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
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
                  className="btn-cta flex items-center justify-center gap-3 rounded-lg bg-[var(--color-primary)] px-5 py-3 text-[0.86rem] font-bold text-white"
                >
                  <span>{ctas.quote.label}</span>
                  <ArrowIcon className="h-4 w-4" />
                </button>
                <Link href={ctas.specialist.href} className={`flex items-center justify-center gap-3 rounded-lg border px-5 py-3 text-[0.86rem] font-bold ${isDark ? "border-[#375067] bg-[rgba(14,28,41,0.84)] text-white" : "border-[#d7dde6] bg-white text-[#071827]"}`}>
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
    src: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80",
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
    <section className={`relative overflow-hidden px-3 py-7 md:px-6 md:py-8 ${isDark ? "bg-[#02070b]" : "bg-white"}`}>
      <div className="absolute inset-x-0 top-0 hidden h-[320px] md:block">
        <Image src={heroImage.src} alt={heroImage.alt} fill className="object-cover object-center" sizes="100vw" />
        <div className={isDark ? "absolute inset-0 bg-[linear-gradient(90deg,rgba(2,7,11,0.95)_0%,rgba(2,7,11,0.72)_36%,rgba(2,7,11,0.2)_78%)]" : "absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.88)_42%,rgba(255,255,255,0.12)_80%)]"} />
        <div className={isDark ? "absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(0deg,#02070b_0%,transparent_100%)]" : "absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(0deg,white_0%,transparent_100%)]"} />
      </div>

      <div className="relative mx-auto w-full max-w-8xl">
        <div className="max-w-[760px]">
          <h2 className={`text-[2.35rem] font-bold leading-[0.98] tracking-normal md:text-[3.45rem] ${isDark ? "text-white" : "text-[#071827]"}`} dangerouslySetInnerHTML={{ __html: data.h2 || "Jaguar Diagnostic Calculator" }} />
          <div className="mt-4">
            <MStripe />
          </div>
          <p className={`mt-4 max-w-[660px] text-[0.92rem] leading-[1.48] md:text-[1.04rem] ${isDark ? "text-white/78" : "text-[#27384a]"}`} dangerouslySetInnerHTML={{ __html: data.subHeadline }} />
        </div>

        <TrustStrip items={data.trustStrip || []} isDark={isDark} />

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_320px] lg:items-start">
          <div className={`overflow-hidden rounded-2xl border shadow-[0_14px_36px_rgba(10,26,43,0.08)] ${isDark ? "border-[#223343] bg-[rgba(7,18,29,0.92)]" : "border-[#d7dde6] bg-white"}`}>
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
                      <h3 className={`mt-2 text-[1.35rem] font-bold leading-tight md:text-[1.7rem] ${isDark ? "text-white" : "text-[#071827]"}`}>Jump straight to the likely failure</h3>
                    </div>
                    <p className={`max-w-[300px] text-[0.8rem] leading-[1.4] md:text-right ${isDark ? "text-white/66" : "text-[#607085]"}`}>15 shortcut cards for drivers who already know the problem, plus the symptom route below for everyone else.</p>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {knownFaults.map((diagnosis) => (
                      <ShortcutCard key={diagnosis.key} diagnosis={diagnosis} isDark={isDark} onSelect={goToDiagnosis} />
                    ))}
                  </div>

                  <div className={`mt-6 border-t pt-6 ${isDark ? "border-[#223343]" : "border-[#d7dde6]"}`}>
                    <p className="text-[0.76rem] font-bold uppercase tracking-[0.08em] text-[var(--color-primary)]">Symptom route</p>
                    <h3 className={`mt-2 text-[1.35rem] font-bold leading-tight md:text-[1.7rem] ${isDark ? "text-white" : "text-[#071827]"}`}>Tell us where the issue starts</h3>
                    <p className={`mt-2 text-[0.82rem] leading-[1.45] ${isDark ? "text-white/72" : "text-[#27384a]"}`}>Pick the category that best matches the fault. The next screen narrows it into a specific diagnosis path.</p>

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
                        className="flex items-center justify-center gap-3 rounded-lg bg-[var(--color-primary)] px-5 py-3 text-[0.88rem] font-bold text-white disabled:cursor-not-allowed disabled:bg-[#9eb5d8]"
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
                  <h3 className={`mt-2 text-[1.35rem] font-bold leading-tight md:text-[1.7rem] ${isDark ? "text-white" : "text-[#071827]"}`}>{selectedCategory.question}</h3>
                  <p className={`mt-2 text-[0.82rem] leading-[1.45] ${isDark ? "text-white/72" : "text-[#27384a]"}`}>Choose the closest symptom cluster. We route high-risk faults into safety advice before showing cost maths.</p>

                  <div className="mt-5 grid gap-3">
                    {selectedCategory.answers.map((answer) => (
                      <AnswerButton key={answer.label} answer={answer} isDark={isDark} onSelect={goToDiagnosis} />
                    ))}
                  </div>

                  <div className="mt-5">
                    <button type="button" onClick={() => setStage("entry")} className={`text-[0.82rem] font-semibold ${isDark ? "text-white/72" : "text-[#607085]"}`}>
                      Back to symptom categories
                    </button>
                  </div>
                </div>
              ) : null}

              {stage === "override" && selectedDiagnosis ? <OverridePanel diagnosis={selectedDiagnosis} isDark={isDark} onContinue={() => setStage("vehicle")} /> : null}

              {stage === "vehicle" ? (
                <div>
                  <p className="text-[0.76rem] font-bold uppercase tracking-[0.08em] text-[var(--color-primary)]">Vehicle context</p>
                  <h3 className={`mt-2 text-[1.35rem] font-bold leading-tight md:text-[1.7rem] ${isDark ? "text-white" : "text-[#071827]"}`}>Tell us about the car</h3>

                  <div className="mt-5">
                    <p className={`text-[0.78rem] font-bold uppercase tracking-[0.08em] ${isDark ? "text-white/64" : "text-[#607085]"}`}>Vehicle age</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {calculator.ageOptions.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedAgeId(item.id)}
                          className={`rounded-full border px-4 py-2 text-[0.82rem] font-semibold ${selectedAgeId === item.id ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white" : isDark ? "border-[#375067] bg-[rgba(14,28,41,0.84)] text-white" : "border-[#d7dde6] bg-white text-[#071827]"}`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className={`text-[0.78rem] font-bold uppercase tracking-[0.08em] ${isDark ? "text-white/64" : "text-[#607085]"}`}>Estimated current value</p>
                    <div className={`mt-3 rounded-xl border px-5 py-4 ${isDark ? "border-[#223343] bg-[rgba(14,28,41,0.84)]" : "border-[#d7dde6] bg-[#fbfdff]"}`}>
                      <strong className={`block text-[2rem] leading-none ${isDark ? "text-white" : "text-[#071827]"}`}>{fmtCurrency(carValue)}</strong>
                      <span className={`mt-1 block text-[0.76rem] ${isDark ? "text-white/64" : "text-[#607085]"}`}>What would the car roughly sell for in its current condition?</span>
                      <input
                        type="range"
                        min={0}
                        max={calculator.valueSteps.length - 1}
                        step={1}
                        value={calculator.valueSteps.indexOf(carValue)}
                        onChange={(event) => setCarValue(calculator.valueSteps[Number(event.target.value)])}
                        className="mt-4 w-full accent-[var(--color-primary)]"
                      />
                      <div className={`mt-3 flex justify-between gap-2 text-[0.66rem] ${isDark ? "text-white/56" : "text-[#607085]"}`}>
                        {calculator.valueSteps.map((step) => (
                          <span key={step}>{formatStepValue(step)}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <button type="button" onClick={goBackFromVehicle} className={`text-[0.82rem] font-semibold ${isDark ? "text-white/72" : "text-[#607085]"}`}>
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStage("engine")}
                      disabled={!selectedAgeId}
                      className="flex items-center justify-center gap-3 rounded-lg bg-[var(--color-primary)] px-5 py-3 text-[0.88rem] font-bold text-white disabled:cursor-not-allowed disabled:bg-[#9eb5d8]"
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
                  <h3 className={`mt-2 text-[1.35rem] font-bold leading-tight md:text-[1.7rem] ${isDark ? "text-white" : "text-[#071827]"}`}>Which replacement path are you comparing?</h3>
                  <p className={`mt-2 text-[0.82rem] leading-[1.45] ${isDark ? "text-white/72" : "text-[#27384a]"}`}>This changes the replacement range and therefore the verdict. Reconditioned stays the conservative baseline.</p>

                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    {calculator.engineOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSelectedEngine(option.id)}
                        className={`rounded-xl border p-4 text-left ${selectedEngine === option.id ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]" : isDark ? "border-[#223343] bg-[rgba(14,28,41,0.84)]" : "border-[#d7dde6] bg-white"}`}
                      >
                        <p className={`text-[0.92rem] font-semibold leading-tight ${selectedEngine === option.id ? "text-[#071827]" : isDark ? "text-white" : "text-[#071827]"}`}>{option.label}</p>
                        <p className={`mt-2 text-[0.76rem] leading-[1.35] ${selectedEngine === option.id ? "text-[#27384a]" : isDark ? "text-white/72" : "text-[#607085]"}`}>{option.subLabel}</p>
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <button type="button" onClick={() => setStage("vehicle")} className={`text-[0.82rem] font-semibold ${isDark ? "text-white/72" : "text-[#607085]"}`}>
                      Back
                    </button>
                    <button type="button" onClick={() => setStage("results")} className="flex items-center justify-center gap-3 rounded-lg bg-[var(--color-primary)] px-5 py-3 text-[0.88rem] font-bold text-white">
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
                      <h3 className={`mt-2 text-[1.35rem] font-bold leading-tight md:text-[1.7rem] ${isDark ? "text-white" : "text-[#071827]"}`}>Diagnosis, cost range, and ownership verdict</h3>
                    </div>
                    <button type="button" onClick={resetFlow} className={`text-[0.82rem] font-semibold ${isDark ? "text-white/72" : "text-[#607085]"}`}>
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

          <SideInfo data={{ steps: data.howItWorks?.steps || [], items: calculator.whyTrust || [] }} isDark={isDark} />
        </div>
      </div>
    </section>
  );
}
