"use client";

import { useTheme } from "@/components/shared/themeProvider";
import { homeIconSrc } from "@/components/home/homeIcons";

/*
 * Jaguar brand icons (IBS set) for the model page sections, as drop-in replacements for the lucide icons
 * the sections were built with: same names, same `className` sizing, so a section only swaps its import.
 *
 * Each icon is drawn as a CSS mask over the theme's artwork (/Jaguar Black in light, /Jaguar Silver in dark),
 * so the shape always comes from the brand files while the colour follows the context:
 *  - tone "auto" (default): light theme = the surrounding text colour (Jaguar black); dark theme = a brushed
 *    silver gradient, matching the Silver set.
 *  - tone "current": always the surrounding text colour (for inverted tiles, e.g. white icon on a black tile).
 * The artwork is trimmed edge-to-edge, so it is drawn at 94% of the box to match lucide's built-in padding.
 */

const SILVER = "linear-gradient(180deg,#f4f4f2 0%,#d2d2cf 48%,#a7a7a3 100%)";

export function BrandGlyph({ name, className = "h-5 w-5", tone = "auto", scale = 0.94, style }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const src = homeIconSrc(name, isDark);
  if (!src) return null;
  const mask = `url("${src}") center / contain no-repeat`;
  return (
    <span aria-hidden="true" className={`inline-flex shrink-0 items-center justify-center ${className}`} style={style}>
      <span
        className="block"
        style={{
          width: `${scale * 100}%`,
          height: `${scale * 100}%`,
          WebkitMask: mask,
          mask,
          background: isDark && tone === "auto" ? SILVER : "currentColor",
        }}
      />
    </span>
  );
}

// Lucide-compatible component for one brand icon (ignores lucide-only props such as strokeWidth).
function brand(name, scale) {
  function Icon({ className, tone, style }) {
    return <BrandGlyph name={name} className={className} tone={tone} scale={scale} style={style} />;
  }
  Icon.displayName = `Brand(${name})`;
  return Icon;
}

/* lucide name -> brand artwork */
export const Award = brand("transparent-data");
export const BarChart3 = brand("real-inquiries");
export const BookOpen = brand("generations");
export const BriefcaseBusiness = brand("commuter");
export const Calculator = brand("calculator");
export const CalendarDays = brand("calendar");
export const Caravan = brand("towing");
export const CarFront = brand("vehicle");
export const ChartColumnIncreasing = brand("enquiries");
export const ChartLine = brand("enquiries");
export const ChartNoAxesCombined = brand("trend");
export const CircleAlert = brand("check-watch-2");
export const CircleCheck = brand("good-choice");
export const CircleStar = brand("high-demand");
export const Clock = brand("labour-time");
export const Clock3 = brand("labour-time");
export const Crown = brand("flagship-choice");
export const Engine = brand("engine");
export const FileSearch = brand("doc-search");
export const FileText = brand("oem-references");
export const Fuel = brand("fuel");
export const Gauge = brand("diagnosis");
export const Gem = brand("niche-style");
export const Handshake = brand("handshake");
export const Heart = brand("heart");
export const Info = brand("note");
export const Layers = brand("platform");
export const Medal = brand("transparent-data");
export const PiggyBank = brand("pound-shield");
export const Rocket = brand("trend");
export const Scale = brand("scale");
export const Search = brand("search");
export const Settings = brand("drivetrain");
export const Shield = brand("safe-buy");
export const ShieldCheck = brand("genuine-failure-data");
export const ShoppingCart = brand("basket");
export const Stethoscope = brand("diagnose");
export const Tag = brand("price-tag");
export const Target = brand("specific-knowledge");
export const TrendingUp = brand("trend");
export const TriangleAlert = brand("fire");
export const Trophy = brand("top-choice");
export const UsersRound = brand("users-team");
export const Wrench = brand("vetted-specialist");
export const Zap = brand("electrical");

/* brand-only icons */
export const SteeringWheel = brand("steering-wheel");
export const History = brand("history");
export const StarBadge = brand("independent");
export const PoundShield = brand("pound-shield");
export const RealData = brand("real-inquiries");
export const Faq = brand("faq");
export const Phone = brand("phone");

/** Black (light) / silver (dark) numbered disc, 1-10; null outside that range. */
export function NumberGlyph({ value, className, tone }) {
  const n = Number(value);
  if (!(n >= 1 && n <= 10)) return null;
  return <BrandGlyph name={`number-${n}`} className={className} tone={tone} scale={1} />;
}
