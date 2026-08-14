"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/components/shared/themeProvider";

export const footerColumns = [
  {
    title: "Ownership & Data",
    links: [
      { label: "Research Centre", href: "/data" },
      { label: "Engine Failure Index 2026", href: "/data/engine-failure-index-2026" },
      { label: "Failure Rate by Engine", href: "/data/failure-rate-by-engine" },
      { label: "Average Replacement Cost", href: "/data/average-replacement-cost" },
      { label: "Most Enquired Models", href: "/data/most-enquired-models" },
      { label: "Methodology", href: "/data/methodology" },
      { label: "Ownership Economics", href: "/economics" },
      { label: "Repair, Replace or Scrap", href: "/economics/repair-replace-scrap-framework" },
    ],
  },
  {
    title: "Tools & Diagnostics",
    links: [
      { label: "All Tools", href: "/tools" },
      { label: "Repair vs Replace Calculator", href: "/tools/repair-vs-replace-calculator" },
      { label: "Ownership Cost Calculator", href: "/tools/ownership-cost-calculator" },
      { label: "Registration Lookup", href: "/tools/registration-lookup" },
      { label: "VIN Decoder", href: "/tools/vin-decoder" },
      { label: "Oil Finder", href: "/tools/oil-finder" },
      { label: "Engine Compatibility Checker", href: "/tools/engine-compatibility-checker" },
      { label: "Diagnostic Wizard", href: "/tools/diagnostic-wizard" },
      { label: "Engine Value Checker", href: "/tools/engine-value-checker" },
    ],
  },
  {
    title: "Research & Compare",
    links: [
      { label: "All Engines", href: "/engine" },
      { label: "Compare", href: "/compare" },
      { label: "Fitment Guide", href: "/fitment" },
      { label: "Technical Library", href: "/technical" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Recalls", href: "/recalls" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "About & Trust",
    links: [
      { label: "How It Works", href: "/about/how-it-works" },
      { label: "Expert Panel", href: "/about/expert-panel" },
      { label: "Data Verification", href: "/about/data-verification" },
      { label: "Editorial Standards", href: "/about/editorial-standards" },
      { label: "Specialist Vetting", href: "/about/specialist-vetting" },
      { label: "Warranty Standards", href: "/about/warranty-standards" },
      { label: "Verified Outcomes", href: "/about/verified-outcomes" },
      { label: "Corrections", href: "/about/corrections" },
    ],
  },
];

export const footerLegal = {
  copyright: "© 2026 Jaguar Reliability Guide, part of the Engine Finders network.",
  disclaimer: "Independent editorial content; not affiliated with Jaguar Land Rover.",
  links: [],
};

function LogoMark({ isDark }) {
  return (
    <Image
      src="/jaguar-logo.png"
      alt="Jaguar"
      width={124}
      height={63}
      className={`h-auto w-[124px] object-contain ${isDark ? "brightness-0 invert" : ""}`}
    />
  );
}

export default function FooterColumns() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const linkClass = isDark
    ? "text-xs font-semibold text-[var(--color-text-muted)] no-underline hover:text-[var(--color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
    : "text-xs font-semibold text-[var(--color-primary)] no-underline hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";

  const softTextClass = isDark ? "text-[var(--color-text-muted)]" : "text-black";
  const softerTextClass = isDark ? "text-[var(--color-text-soft)]" : "text-black";
  const brandTextClass = isDark ? "text-[var(--color-text)]" : "text-black";

  return (
    <div className="mx-auto w-full max-w-8xl px-4 py-6 md:px-8 md:py-8">
      <Link href="/" className={`mb-6 inline-flex items-center gap-3 no-underline ${brandTextClass}`}>
        <LogoMark isDark={isDark} />
      </Link>

      <div className="grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-4 lg:gap-6">
        {footerColumns.map((column) => (
          <div key={column.title}>
            <h2 className="mb-2 text-[0.75rem] font-extrabold uppercase tracking-wide text-[var(--color-text)]">{column.title}</h2>
            <ul className="grid gap-1.5">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-[var(--color-border)] pt-4">
        <p className={`text-xs ${softTextClass}`}>{footerLegal.copyright}</p>
        <p className={`mt-1 text-xs ${softerTextClass}`}>{footerLegal.disclaimer}</p>
        <ul className={`mt-2 flex flex-wrap gap-x-2 gap-y-1 text-xs ${softTextClass}`}>
          {footerLegal.links.map((link, index) => (
            <li key={link.href} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true">·</span> : null}
              <Link href={link.href} className={linkClass}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
