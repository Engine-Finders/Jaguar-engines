"use client";

import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";

const verdictStyles = {
  warning: {
    badge: "text-[#d97517]",
    icon: "text-[#ec8b1f]",
    darkBadge: "text-[#ffb05a]",
    darkIcon: "text-[#ffb05a]",
  },
  success: {
    badge: "text-[#13884a]",
    icon: "text-[#189454]",
    darkBadge: "text-[#67d99a]",
    darkIcon: "text-[#67d99a]",
  },
  trophy: {
    badge: "text-[#13884a]",
    icon: "text-[#189454]",
    darkBadge: "text-[#67d99a]",
    darkIcon: "text-[#67d99a]",
  },
  family: {
    badge: "text-[#13884a]",
    icon: "text-[#189454]",
    darkBadge: "text-[#67d99a]",
    darkIcon: "text-[#67d99a]",
  },
  diamond: {
    badge: "text-[#6d44d7]",
    icon: "text-[#6d44d7]",
    darkBadge: "text-[#b69cff]",
    darkIcon: "text-[#b69cff]",
  },
  crown: {
    badge: "text-[#5f6360]",
    icon: "text-[#8a8e89]",
    darkBadge: "text-[#d0d1cd]",
    darkIcon: "text-[#d0d1cd]",
  },
  fire: {
    badge: "text-[#f06d11]",
    icon: "text-[#f06d11]",
    darkBadge: "text-[#ffad6c]",
    darkIcon: "text-[#ffad6c]",
  },
  demand: {
    badge: "text-[#2f6feb]",
    icon: "text-[#2f6feb]",
    darkBadge: "text-[#8eb6ff]",
    darkIcon: "text-[#8eb6ff]",
  },
  ev: {
    badge: "text-[#0aa0c2]",
    icon: "text-[#0aa0c2]",
    darkBadge: "text-[#6fd4ef]",
    darkIcon: "text-[#6fd4ef]",
  },
};

function ChevronIcon({ className = "h-5 w-5" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 4h8v4a4 4 0 0 1-8 0V4Zm0 2H4v2a3 3 0 0 0 4 2.8M16 6h4v2a3 3 0 0 1-4 2.8M12 12v5m-3 3h6m-7 0h8" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 9v4m0 4h.01M10 4.9 2.6 18a2 2 0 0 0 1.74 3h15.32A2 2 0 0 0 21.4 18L14 4.9a2 2 0 0 0-3.48 0Z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3 5 6v6c0 5 3.3 8.8 7 9 3.7-.2 7-4 7-9V6l-7-3Zm-2 9 1.6 1.6L15 10" />
    </svg>
  );
}

function DiamondIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m12 3 7 7-7 11L5 10l7-7Z" />
    </svg>
  );
}

function FireIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3s1 2.5 1 4.5S11 11 11 11s.3-3-1.5-5.5C7.2 8 6 10 6 13a6 6 0 0 0 12 0c0-3.2-1.8-5.7-4.5-8.2.1 1.7-.2 3.1-1.5 4.7" />
    </svg>
  );
}

function CrownIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m3 8 4 3 5-6 5 6 4-3-2 10H5L3 8Zm4 11h10" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 15c-1.5 1-2 3-2 5 2 0 4-.5 5-2m9-13a8 8 0 0 1-8 8l-3-3a8 8 0 0 1 8-8l3 3Zm-8 8-1.5 4.5L12 18l1.5-4.5" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
    </svg>
  );
}

function SedanIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 14h18l-1.5-4.5A3 3 0 0 0 16.6 7.5H7.4A3 3 0 0 0 4.5 9.5L3 14Zm2 0v3m14-3v3M7 17a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    </svg>
  );
}

function SuvIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 14h16l-1-5H9L6.5 12H4v2Zm2 0v3m12-3v3M7.5 17a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm9 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM9 9V7h6" />
    </svg>
  );
}

function InfoBoltIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
    </svg>
  );
}

function VerdictIcon({ type }) {
  switch (type) {
    case "warning":
      return <WarningIcon />;
    case "success":
      return <ShieldIcon />;
    case "trophy":
      return <TrophyIcon />;
    case "diamond":
      return <DiamondIcon />;
    case "crown":
      return <CrownIcon />;
    case "fire":
      return <FireIcon />;
    case "family":
      return <PeopleIcon />;
    case "demand":
      return <RocketIcon />;
    case "ev":
      return <BoltIcon />;
    default:
      return <ShieldIcon />;
  }
}

function formatVerdictText(text = "") {
  return text.replace(/\s+\/\s+/g, " / ").trim();
}

function getModelHref(item) {
  if (item.href) return item.href;
  if (Array.isArray(item.model) && item.model[0]?.href) return item.model[0].href;
  return "#";
}

function getModelName(item) {
  if (typeof item.model === "string") return item.model;
  if (Array.isArray(item.model)) return item.model.map((m) => m.name).join(" / ");
  return "";
}

function verdictIconKey(type) {
  switch (type) {
    case "warning":
      return "check-watch";
    case "success":
      return "safe-buy";
    case "trophy":
      return "top-choice";
    case "diamond":
      return "niche-style";
    case "crown":
      return "flagship-choice";
    case "fire":
      return "fire";
    case "family":
      return "best-family";
    case "demand":
      return "high-demand";
    case "ev":
      return "ev";
    default:
      return "safe-buy";
  }
}

function VerdictBadge({ verdict, variant = "plain" }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const style = verdictStyles[verdict.type] || verdictStyles.success;
  const text = formatVerdictText(verdict.text);
  const colorClass = theme === "dark" ? style.darkBadge : style.badge;
  const iconKey = verdictIconKey(verdict.type);

  if (variant === "pill") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.72rem] font-medium leading-none ${
          theme === "dark"
            ? "border-white/14 bg-[rgba(0,0,0,0.45)] text-white/90"
            : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]"
        }`}
      >
        <HomeIcon name={iconKey} isDark={isDark} className="h-6 w-6" />
        <span className={colorClass}>{text}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 text-[0.74rem] font-medium leading-tight ${colorClass}`}>
      <HomeIcon name={iconKey} isDark={isDark} className="h-6 w-6" />
      <span>{text}</span>
    </span>
  );
}

function CategoryHeader({ label, icon }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="mb-3 flex items-center gap-2.5 md:mb-4 md:gap-3">
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
          isDark ? "border-white/20 text-white/85" : "border-[var(--color-chrome)] text-[var(--color-text-muted)]"
        }`}
      >
        {icon === "suv" ? <SuvIcon /> : <SedanIcon />}
      </span>
      <p
        className={`shrink-0 text-[0.72rem] font-semibold uppercase tracking-[0.12em] ${
          isDark ? "text-white/80" : "text-[var(--color-text-muted)]"
        }`}
      >
        {label}
      </p>
      <span className={`h-px flex-1 ${isDark ? "bg-white/18" : "bg-[var(--color-chrome)]/55"}`} />
      {isDark ? (
        <span aria-hidden="true" className="hidden h-2 w-5 -skew-x-[28deg] bg-[var(--color-chrome)] md:block" />
      ) : null}
    </div>
  );
}

function DesktopCard({ item }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const href = getModelHref(item);
  const name = getModelName(item);

  return (
    <Link
      href={href}
      className={`group flex h-full flex-col items-center rounded-xl border px-3 pb-3.5 pt-4 text-center transition ${
        isDark
          ? "border-white/12 bg-[rgba(18,18,18,0.62)] shadow-[0_12px_28px_rgba(0,0,0,0.35)] backdrop-blur-md hover:border-white/22"
          : "border-[var(--color-border)] bg-white shadow-[0_8px_22px_rgba(16,18,16,0.08)] hover:border-[var(--color-chrome)]"
      }`}
    >
      <h3 className={`text-[1.15rem] font-semibold leading-none ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
        {name}
      </h3>

      {isDark ? (
        <p className="mt-1.5 text-[0.78rem] text-white/65">{item.generations}</p>
      ) : null}

      <div className="relative mt-3 h-[120px] w-full overflow-hidden rounded-md md:h-[140px]">
        <Image
          src="/home-image/right.webp"
          alt={item.image.alt || name}
          fill
          className="object-cover object-center transition duration-300 group-hover:scale-[1.03]"
          sizes="180px"
        />
      </div>

      {!isDark ? (
        <p className="mt-2 text-[0.78rem] text-[var(--color-text-soft)]">{item.generations}</p>
      ) : null}

      <div className="mt-2.5">
        <VerdictBadge verdict={item.verdict} variant={isDark ? "pill" : "plain"} />
      </div>
    </Link>
  );
}

function MobileRow({ item }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const href = getModelHref(item);
  const name = getModelName(item);

  return (
    <Link
      href={href}
      className={`grid grid-cols-[72px_minmax(0,1fr)_auto_16px] items-center gap-2.5 rounded-xl border px-3 py-2.5 ${
        isDark
          ? "border-white/12 bg-[rgba(18,18,18,0.72)]"
          : "border-[var(--color-border)] bg-white shadow-[0_6px_16px_rgba(16,18,16,0.06)]"
      }`}
    >
      <div className="relative h-11 w-[4.5rem] overflow-hidden rounded-md">
        <Image src="/home-image/right.webp" alt={item.image.alt || name} fill className="object-cover object-center" sizes="72px" />
      </div>

      <div className="min-w-0">
        <p className={`text-[0.92rem] font-semibold leading-tight ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
          {name}
        </p>
        <p className={`mt-0.5 text-[0.76rem] leading-[1.25] ${isDark ? "text-white/65" : "text-[var(--color-text-muted)]"}`}>
          {item.generations}
        </p>
      </div>

      <VerdictBadge verdict={item.verdict} />

      <span className={`flex justify-end ${isDark ? "text-white/55" : "text-[var(--color-text-soft)]"}`}>
        <ChevronIcon className="h-4 w-4" />
      </span>
    </Link>
  );
}

function IPaceNote({ note }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  if (!note) return null;

  return (
    <div
      className={`mt-5 flex items-start gap-3 rounded-xl border px-4 py-3.5 md:mt-6 md:px-5 ${
        isDark
          ? "border-white/12 bg-[rgba(18,18,18,0.55)]"
          : "border-[var(--color-border)] bg-[var(--color-page-soft)]"
      }`}
    >
      <span
        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
          isDark ? "border-white/20 text-white/85" : "border-[var(--color-chrome)] text-[var(--color-text)]"
        }`}
      >
        <InfoBoltIcon />
      </span>
      <p className={`text-[0.82rem] leading-[1.4] md:text-[0.88rem] ${isDark ? "text-white/80" : "text-[var(--color-text-muted)]"}`}>
        <strong className={isDark ? "text-white" : "text-[var(--color-text)]"}>{note.label}</strong> {note.text}
      </p>
    </div>
  );
}

export default function HomeSec2({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const categories = data.categories || [];
  const headerImage =
    isDark && data.headerImageDark?.src
      ? data.headerImageDark
      : data.headerImage || { src: "/home-image/sec2-bg.webp", alt: "" };

  return (
    <section className="find-your-vehicle bg-[var(--color-page)]">
      {/* Header - image only here, not full section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-[62%] md:w-[48%]">
          <Image
            src={headerImage.src}
            alt={headerImage.alt || ""}
            fill
            className="object-cover object-right"
            sizes="(max-width: 768px) 62vw, 48vw"
          />
          <div
            className={
              isDark
                ? "absolute inset-0 bg-[linear-gradient(90deg,var(--color-page)_0%,rgba(11,12,12,0.82)_34%,rgba(11,12,12,0.18)_100%)]"
                : "absolute inset-0 bg-[linear-gradient(90deg,var(--color-page)_0%,rgba(243,243,241,0.88)_34%,rgba(243,243,241,0.18)_100%)]"
            }
          />
        </div>

        <div className="relative mx-auto w-full max-w-8xl px-4 py-7 md:px-6 md:py-10 lg:px-8">
          <div className="max-w-[560px]">
            <h2
              className={`text-[2.2rem] font-bold leading-[0.98] md:text-[3.1rem] md:leading-[0.96] ${
                isDark ? "text-white" : "text-[var(--color-text)]"
              }`}
            >
              Find{" "}
              <br className="md:hidden" />
              <span className="text-[var(--color-chrome-bright)]">Your Vehicle</span>
            </h2>

            <div className="mt-3">
              <MStripe />
            </div>

            <p
              className={`mt-3 max-w-[420px] text-[0.9rem] leading-[1.35] md:max-w-[520px] md:text-[1.05rem] md:leading-[1.4] ${
                isDark ? "text-white/80" : "text-[var(--color-text-muted)]"
              }`}
              dangerouslySetInnerHTML={{ __html: data.subHeadline }}
            />
          </div>
        </div>
      </div>

      {/* Model grid / list */}
      <div className={isDark ? "bg-[var(--color-page-soft)]" : "bg-[#f8f8f7]"}>
        <div className="mx-auto w-full max-w-8xl px-4 py-5 md:px-6 md:py-8 lg:px-8">
          <div className="hidden md:block">
            {categories.map((category) => (
              <div key={category.id} className="mb-7 last:mb-0">
                <CategoryHeader label={category.label} icon={category.icon} />
                <div className="grid grid-cols-5 gap-3 lg:gap-4">
                  {(category.models || []).map((item) => (
                    <DesktopCard key={getModelName(item)} item={item} />
                  ))}
                </div>
              </div>
            ))}
            <IPaceNote note={data.iPaceNote} />
          </div>

          <div className="md:hidden">
            {categories.map((category) => (
              <div key={category.id} className="mb-5 last:mb-0">
                <CategoryHeader label={category.label} icon={category.icon} />
                <div className="flex flex-col gap-2.5">
                  {(category.models || []).map((item) => (
                    <MobileRow key={getModelName(item)} item={item} />
                  ))}
                </div>
              </div>
            ))}
            <IPaceNote note={data.iPaceNote} />
          </div>
        </div>
      </div>
    </section>
  );
}
