"use client";

import HomeIcon, { hasHomeIcon } from "@/components/home/homeIcons";
import { useTheme } from "@/components/shared/themeProvider";

// Controls (arrows, chevrons, plus) stay as line art, as they do on the home page.
const CONTROL_PATHS = {
  arrow: "M5 12h14m-6-6 6 6-6 6",
  chevron: "m9 6 6 6-6 6",
  chevronDown: "m6 9 6 6 6-6",
  plus: "M12 5v14M5 12h14",
};

// Every other icon is the client's artwork. Old line-icon names and the emoji used in the
// page data map to an icon key in homeIcons.js; icon keys can also be passed directly.
const CLIENT_ICON = {
  chart: "real-inquiries",
  tool: "repair-tool",
  wrench: "repair-tool",
  book: "book",
  trophy: "star",
  badge: "star",
  shield: "shield",
  check: "check",
  truck: "uk-wide-delivery",
  scale: "scale",
  warning: "warning",
  dollar: "pound-shield",
  diamond: "premium",
  crown: "crown",
  fire: "fire",
  car: "car",
  engine: "engine",
  info: "info",
  gauge: "diagnosis",
  clock: "labour-time",
  tag: "price-tag",
  refresh: "refresh-cycle",
  pin: "location",
  target: "search",
  cart: "basket",
  ear: "hearing",
  clipboardCheck: "symptoms",
  cloud: "smoke-check",
  fan: "cooling",
  exhaust: "exhaust",
  oilDrop: "oil-leak",
  engineWarning: "know-engine",
  clipboardSearch: "doc-search",
  drum: "cylinders",
  users: "users-team",
  "🔧": "vetted-specialist",
  "📊": "real-inquiries",
  "🏆": "engine-finders",
  "📖": "engine-codes-book",
  "⚡": "ev",
  "💯": "independent",
  "🩺": "diagnose",
  "🤝": "handshake",
  "🔍": "search",
  "💚": "honest-verdict",
  "🔴": "fire",
  "🟠": "warning",
  "🟡": "check-watch",
  "🟢": "safe-buy",
};

/** Client icon key for a line-icon name, emoji or icon key ("info" when unknown). */
export function clientIconKey(name) {
  const key = CLIENT_ICON[name] || name;
  return hasHomeIcon(key) ? key : "info";
}

/**
 * `className` is the icon box, as for HomeIcon (the glyph is drawn at 65% of it, 16px minimum).
 * `inverted` picks the opposite tone, for icons on a filled black (light theme) or silver
 * (dark theme) disc; `onDark` always picks Silver, for icons on a solid coloured block.
 */
export default function GenIcon({ name, className = "h-5 w-5", inverted = false, onDark = false }) {
  const { theme } = useTheme();
  const control = CONTROL_PATHS[name];

  if (control) {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={control} />
      </svg>
    );
  }

  const isDark = theme === "dark";
  const silver = onDark || (inverted ? !isDark : isDark);
  return <HomeIcon name={clientIconKey(name)} isDark={silver} className={`min-h-4 min-w-4 ${className}`} />;
}
