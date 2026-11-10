"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, StarHalf } from "lucide-react";
import { Award, BriefcaseBusiness, Caravan, Clock, Crown, Gauge, Gem, Info, PiggyBank, Shield, ShieldCheck, UsersRound, SteeringWheel } from "@/components/models/brandIcons";
import { useTheme } from "@/components/shared/themeProvider";
import CarOnBackground from "@/components/shared/CarOnBackground";
import { carImageFor } from "@/components/shared/carImage";
import { outsideTags } from "@/components/models/outsideTags";

/*
 * Model page "Who Should Buy" (section 10), built from the reference (drawn at 1402px; tokens are scaled to
 * 1536px). Header: title + copy, the four-item proof strip on the right. Then the buyer table: black header;
 * per buyer a photo, an icon circle and the profile, the star rating and our verdict; then the "Real talk"
 * bar with the explore button. Sizes come from the --wb-* tokens in globals.css. Below lg every buyer is a
 * card (photo on top on phones). E-Pace rows carry the reference photos; other models stand their own car
 * photo in Jaguar's scene.
 */

function cleanText(text = "") {
  return String(text ?? "")
    .replaceAll("Â£", "£")
    .replaceAll("â€“", "–")
    .replaceAll("â€”", "—")
    .replace(/\s+/g, " ")
    .trim();
}

function typeset(text = "") {
  return outsideTags(cleanText(text), (part) =>
    part.replace(/(\d)\s*-\s*(£?\d)/g, "$1–$2").replace(/\s-\s/g, " — "),
  );
}

// Buyer profile -> line icon (reference: people, briefcase, piggy bank, caravan, shield).
function ProfileIcon({ profile, className }) {
  const name = cleanText(profile).toLowerCase();
  const Icon = name.includes("family")
    ? UsersRound
    : name.includes("commut")
      ? BriefcaseBusiness
      : name.includes("budget")
        ? PiggyBank
        : name.includes("tow") || name.includes("working")
          ? Caravan
          : name.includes("performance") || name.includes("enthusiast") || name.includes("sports")
            ? Gauge
            : name.includes("collector")
              ? Gem
              : name.includes("keeper") || name.includes("long")
                ? Clock
                : name.includes("premium")
                  ? Shield
                  : Crown;
  return <Icon aria-hidden="true" className={className} strokeWidth={1.5} />;
}

// "★★★★½" -> 4.5; null when the rating is a word ("🏆 Best").
function ratingValue(rating = "") {
  const text = cleanText(rating);
  const full = (text.match(/[★⭐]/g) || []).length;
  const half = text.includes("½") ? 0.5 : 0;
  return full || half ? Math.min(5, full + half) : null;
}

const PROOF_ICONS = { users: UsersRound, shield: ShieldCheck, award: Award, wheel: SteeringWheel };

function palette(isDark) {
  return isDark
    ? {
        text: "text-white",
        muted: "text-white/[0.72]",
        accent: "bg-[linear-gradient(180deg,#e4e4e1_0%,#9a9a97_100%)] bg-clip-text text-transparent",
        card: "border-white/[0.16] bg-[rgba(14,16,17,0.92)]",
        head: "bg-[#2a2b2c] text-white",
        rule: "border-white/[0.1]",
        circle: "bg-white/[0.08] text-white",
        star: "text-[#ececea]",
        empty: "text-[#ececea]/80",
      }
    : {
        text: "text-[#111210]",
        muted: "text-[#3d3e3b]",
        accent: "bg-[linear-gradient(180deg,#8a8b87_0%,#6b6c68_100%)] bg-clip-text text-transparent",
        card: "border-[#e8e8e5] bg-white shadow-[0_6px_20px_rgba(16,18,16,0.05)]",
        head: "bg-[#1a1b1a] text-white",
        rule: "border-[#ececea]",
        circle: "bg-[#efefed] text-[#111210]",
        star: "text-[#111210]",
        empty: "text-[#111210]/80",
      };
}

/* ---------- Pieces ---------- */

function ProofStrip({ items = [], tones }) {
  if (!items.length) return null;
  return (
    <ul className={`grid grid-cols-2 rounded-xl border py-2 sm:grid-cols-4 lg:min-h-[var(--wb-proof-h)] xl:w-[var(--wb-proof-w)] xl:shrink-0 ${tones.card} ${tones.text}`}>
      {items.map((item) => {
        const Icon = PROOF_ICONS[item.icon] || ShieldCheck;
        return (
          <li
            key={item.title}
            className={`flex flex-col items-center justify-center px-3 py-3 text-center even:border-l [&:nth-child(n+3)]:border-t sm:[&:nth-child(n+3)]:border-t-0 sm:[&:not(:first-child)]:border-l ${tones.rule}`}
          >
            <Icon aria-hidden="true" className="h-10 w-10 lg:h-[var(--wb-proof-icon)] lg:w-[var(--wb-proof-icon)]" strokeWidth={1.4} />
            <p className="mt-2.5 text-[13px] font-semibold leading-tight lg:text-[length:var(--wb-proof-title)]">{cleanText(item.title)}</p>
            <p className={`mt-1.5 text-[12px] leading-[1.55] lg:text-[length:var(--wb-proof-text)] lg:leading-[var(--wb-proof-lh)] ${tones.muted}`}>{cleanText(item.text)}</p>
          </li>
        );
      })}
    </ul>
  );
}

const STAR = "h-[22px] w-[22px] lg:h-[var(--wb-star)] lg:w-[var(--wb-star)]";

function Rating({ rating, tones }) {
  const value = ratingValue(rating);
  if (value === null) return <span className="text-[15px] font-semibold" dangerouslySetInnerHTML={{ __html: cleanText(rating) }} />;
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <span className={`inline-flex items-center gap-2 lg:gap-[var(--wb-star-gap)] ${tones.star}`} role="img" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => {
        if (index < full) return <Star key={index} aria-hidden="true" className={`${STAR} fill-current`} strokeWidth={1.3} />;
        if (index === full && half) {
          return (
            <span key={index} className={`relative ${STAR}`}>
              <Star aria-hidden="true" className={`absolute inset-0 h-full w-full ${tones.empty}`} strokeWidth={1.1} />
              <StarHalf aria-hidden="true" className="absolute inset-0 h-full w-full fill-current" strokeWidth={1.3} />
            </span>
          );
        }
        return <Star key={index} aria-hidden="true" className={`${STAR} ${tones.empty}`} strokeWidth={1.1} />;
      })}
    </span>
  );
}

function BuyerPhoto({ row, className = "" }) {
  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {row.photo ? (
        <Image src={row.photo} alt="" fill sizes="(min-width: 1024px) 240px, 100vw" className="object-cover" />
      ) : row.image ? (
        <CarOnBackground
          src={row.image}
          isDark={false}
          className="absolute inset-0"
          bgClassName="object-cover object-[62%_78%]"
          carClassName="inset-x-[8%] top-[18%] bottom-[9%]"
          sizes="(min-width: 1024px) 240px, 100vw"
        />
      ) : null}
    </div>
  );
}

function ProfileCell({ row, tones }) {
  return (
    <div className="flex items-center gap-4 lg:gap-[var(--wb-gap)]">
      <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full lg:h-[var(--wb-circle)] lg:w-[var(--wb-circle)] ${tones.circle}`}>
        <ProfileIcon profile={row.buyerProfile} className="h-[50%] w-[50%]" />
      </span>
      <h3
        className="text-[17px] font-semibold leading-snug lg:max-w-[9.5em] lg:text-[length:var(--wb-label)] lg:leading-[var(--wb-label-lh)]"
        dangerouslySetInnerHTML={{ __html: typeset(row.buyerProfile) }}
      />
    </div>
  );
}

/* ---------- Section ---------- */

export default function WhoShouldBuy({ data }) {
  const { theme } = useTheme();
  if (!data?.profiles?.length) return null;

  const isDark = theme === "dark";
  const tones = palette(isDark);
  const columns = data.columns?.length === 3 ? data.columns : ["Buyer Profile", "Rating", "Our Verdict"];
  const model = cleanText(data.h2).match(/Buy (?:an?|the)\s+(.+?)\?/i)?.[1] || "";
  const rows = data.profiles.map((row) => ({ ...row, image: row.image || carImageFor(model, row.verdict) }));
  // Reference columns: Buyer Profile 547 | Rating 242 | Our Verdict 527 (of 1316).
  const cols = "lg:grid-cols-[minmax(0,547fr)_minmax(0,242fr)_minmax(0,527fr)]";

  return (
    <section id="who-should-buy" className="model-buyers relative overflow-hidden bg-[var(--color-page)] text-[var(--color-text)]">
      <div className="mx-auto w-full max-w-[1546px] px-4 pb-12 pt-10 sm:px-6 lg:px-[var(--wb-px)] lg:pb-[var(--wb-pb)] lg:pt-[var(--wb-pt)]">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between xl:gap-10">
          <div className="min-w-0">
            <h2 className={`model-buyers-title ${tones.text}`} dangerouslySetInnerHTML={{ __html: typeset(data.h2).replace(/(\w)-(\w)/g, "$1\u2011$2") }} />
            {data.subHeadline ? (
              <p
                className={`mt-3 max-w-[520px] text-[15px] leading-[1.6] lg:mt-[var(--wb-desc-mt)] lg:text-[length:var(--wb-desc)] lg:leading-[var(--wb-desc-lh)] ${tones.muted}`}
                dangerouslySetInnerHTML={{ __html: typeset(data.subHeadline) }}
              />
            ) : null}
          </div>
          <ProofStrip items={data.proof} tones={tones} />
        </div>

        <div className={`mt-6 overflow-hidden rounded-xl border lg:mt-[var(--wb-table-mt)] ${tones.card} ${tones.text}`}>
          <div className={`hidden h-[var(--wb-th-h)] items-center text-[length:var(--wb-th)] font-medium lg:grid ${cols} ${tones.head}`}>
            {columns.map((column, index) => (
              <span key={column} className={`flex h-full items-center px-[var(--wb-cell-px)] ${index > 0 ? "border-l border-white/[0.18]" : ""} ${index === 1 ? "justify-center" : ""}`}>
                {column}
              </span>
            ))}
          </div>
          <ul>
            {rows.map((row, index) => (
              <li
                key={`${row.buyerProfile}-${index}`}
                className={`grid gap-y-3 p-4 sm:grid-cols-[minmax(0,40%)_minmax(0,1fr)] sm:gap-x-5 lg:min-h-[var(--wb-row-h)] lg:gap-0 lg:p-0 ${cols} ${index > 0 ? `border-t ${tones.rule}` : ""}`}
              >
                {/* Profile: photo + icon + name (lg: one cell) */}
                <div className="contents lg:flex lg:items-center lg:gap-[calc(var(--wb-gap)*1.3)] lg:px-[var(--wb-cell-px)] lg:py-[calc(var(--wb-cell-px)*0.5)]">
                  <BuyerPhoto
                    row={row}
                    className="aspect-[16/8] w-full sm:row-span-3 sm:aspect-[16/10] sm:self-start lg:aspect-auto lg:h-[var(--wb-photo-h)] lg:w-[var(--wb-photo-w)] lg:shrink-0"
                  />
                  <ProfileCell row={row} tones={tones} />
                </div>
                <div className={`flex items-center lg:justify-center lg:border-l lg:px-3 ${tones.rule}`}>
                  <Rating rating={row.rating} tones={tones} />
                </div>
                <p
                  className={`text-[14px] leading-[1.6] lg:flex lg:items-center lg:border-l lg:px-[var(--wb-cell-px)] lg:py-[calc(var(--wb-cell-px)*0.6)] lg:text-[length:var(--wb-verdict)] lg:leading-[var(--wb-verdict-lh)] ${tones.rule}`}
                  dangerouslySetInnerHTML={{ __html: typeset(row.verdict) }}
                />
              </li>
            ))}
          </ul>
        </div>

        {data.realTalk?.text || data.cta?.href ? (
          <div
            className={`mt-4 flex flex-col gap-4 rounded-xl border px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:mt-[var(--wb-bar-mt)] lg:min-h-[var(--wb-bar-h)] lg:px-[calc(var(--wb-cell-px)*0.9)] lg:py-2 ${tones.card} ${tones.text}`}
          >
            {data.realTalk?.text ? (
              <div className="flex items-start gap-4 sm:items-center">
                <Info aria-hidden="true" className="h-8 w-8 shrink-0 lg:h-[var(--wb-info)] lg:w-[var(--wb-info)]" strokeWidth={1.3} />
                <p className={`max-w-[760px] text-[13.5px] leading-[1.6] lg:text-[length:var(--wb-bar)] lg:leading-[var(--wb-bar-lh)] ${tones.muted}`}>
                  {data.realTalk.lead ? <strong className={`font-semibold ${tones.text}`}>{cleanText(data.realTalk.lead)} </strong> : null}
                  <span dangerouslySetInnerHTML={{ __html: typeset(data.realTalk.text) }} />
                </p>
              </div>
            ) : null}
            {data.cta?.href ? (
              <Link
                href={data.cta.href}
                className={`btn-cta inline-flex min-h-[46px] shrink-0 items-center justify-center gap-4 rounded-md px-5 text-[15px] !font-medium lg:min-h-[var(--wb-cta-h)] lg:text-[length:var(--wb-cta)] ${
                  isDark ? "" : "bg-[linear-gradient(180deg,#2c2d2b_0%,#121312_100%)]"
                }`}
              >
                {cleanText(data.cta.label)}
                <ArrowRight aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
