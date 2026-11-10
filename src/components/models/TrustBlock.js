"use client";

import Image from "next/image";
import { Heart, RealData, ShieldCheck, Wrench } from "@/components/models/brandIcons";
import { useTheme } from "@/components/shared/themeProvider";
import CarOnBackground from "@/components/shared/CarOnBackground";
import { outsideTags } from "@/components/models/outsideTags";

/*
 * Model page "Why Owners Trust jaguarengines.uk" (section 12), built from the 1536px reference: one card,
 * title + four trust points on the left (icon tile, bold lead, text, hairline between), the car scene filling
 * the right and fading into the card. E-Pace: the reference scene (light + dark); other models: a front
 * three-quarter photo in Jaguar's scene. Sizes come from the --tr-* tokens in globals.css (shared with
 * the FAQ, section 13, which sits right below in a matching card).
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
    part.replace(/(\d)\s*-\s*(£?\d)/g, "$1–$2").replace(/\s-\s/g, " — ").replace(/([A-Za-z])-([A-Za-z])/g, "$1‑$2"),
  );
}

// "Why E-Pace Owners Trust jaguarengines.uk" -> "Why E-Pace Owners" / "Trust " + accent "jaguarengines.uk"
function splitTitle(title = "") {
  const clean = cleanText(title);
  const match = clean.match(/^(.*?Owners)\s+(Trust)\s+(.+)$/i);
  return match ? { lead: match[1], trust: match[2], accent: match[3] } : { lead: clean, trust: "", accent: "" };
}

// Leading emoji in the data -> the reference's line icons (bars, heart, wrench, shield).
function SignalIcon({ item, index, className }) {
  const key = `${item.icon || ""} ${item.title || ""}`.toLowerCase();
  const Icon = /📊|data/.test(key)
    ? RealData
    : /💚|not to repair/.test(key)
      ? Heart
      : /🔧|specialist/.test(key)
        ? Wrench
        : /🏆|engine finders/.test(key)
          ? ShieldCheck
          : [RealData, Heart, Wrench, ShieldCheck][index % 4];
  return <Icon aria-hidden="true" className={className} strokeWidth={1.5} />;
}

function palette(isDark) {
  return isDark
    ? {
        text: "text-white",
        muted: "text-white/[0.75]",
        accent: "bg-[linear-gradient(180deg,#e4e4e1_0%,#9a9a97_100%)] bg-clip-text text-transparent",
        card: "border-white/[0.16] bg-[rgba(14,16,17,0.92)]",
        tile: "border-white/[0.2] bg-white/[0.04] text-white",
        rule: "border-white/[0.12]",
        fade: "from-[rgba(14,16,17,1)]",
      }
    : {
        text: "text-[#111210]",
        muted: "text-[#2c2d2b]",
        accent: "bg-[linear-gradient(180deg,#8a8b87_0%,#6b6c68_100%)] bg-clip-text text-transparent",
        card: "border-[#e8e8e5] bg-[#f3f3f1] shadow-[0_6px_20px_rgba(16,18,16,0.05)]",
        tile: "border-[#d6d6d3] bg-white text-[#111210] shadow-[0_2px_6px_rgba(16,18,16,0.06)]",
        rule: "border-[#e2e2df]",
        fade: "from-[#f3f3f1]",
      };
}

export default function TrustBlock({ data }) {
  const { theme } = useTheme();
  if (!data?.signals?.length) return null;

  const isDark = theme === "dark";
  const tones = palette(isDark);
  const title = splitTitle(data.h2);
  const scene = data.scenes?.[isDark ? "dark" : "light"] || null;

  const photo = scene ? (
    <Image src={scene.src} alt="" fill sizes="(min-width: 1024px) 870px, 100vw" className="object-cover" />
  ) : data.image ? (
    <CarOnBackground
      src={data.image}
      isDark={isDark}
      className="absolute inset-0"
      bgClassName="object-cover object-[60%_72%]"
      carClassName="left-[18%] right-[3%] top-[22%] bottom-[12%]"
      sizes="(min-width: 1024px) 870px, 100vw"
    />
  ) : null;

  return (
    <section id="why-trust" className="model-trust relative bg-[var(--color-page)] text-[var(--color-text)]">
      <div className="mx-auto w-full max-w-[1546px] px-4 pt-10 sm:px-6 lg:px-[var(--tr-px)] lg:pt-[calc(var(--tr-gap)*1.2)]">
        <div className={`relative isolate overflow-hidden rounded-xl border ${tones.card} ${tones.text}`}>
          {/* lg+: scene fills the right ~58% of the card, faded into the card colour on its left edge */}
          {photo ? (
            <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 hidden w-[var(--tr-scene-w)] max-w-[58%] lg:block">
              {photo}
              <div className={`absolute inset-y-0 left-0 w-[26%] bg-gradient-to-r ${tones.fade} to-transparent`} />
            </div>
          ) : null}

          <div className="px-4 pb-4 pt-6 sm:px-6 lg:max-w-[calc(100%-var(--tr-scene-w)+60px)] lg:px-[var(--tr-card-px)] lg:pb-[calc(var(--tr-item-py)*0.6)] lg:pt-[var(--tr-card-pt)]">
            <h2 className={`model-trust-title ${tones.text}`}>
              <span className="block" dangerouslySetInnerHTML={{ __html: typeset(title.lead) }} />
              {title.trust ? (
                <span className="block">
                  {title.trust} <span className={tones.accent}>{title.accent}</span>
                </span>
              ) : null}
            </h2>

            <ul className="mt-5 lg:mt-[var(--tr-list-mt)] lg:max-w-[var(--tr-list-w)]">
              {data.signals.map((item, index) => (
                <li
                  key={item.title}
                  className={`flex gap-4 py-4 lg:gap-[var(--tr-icon-gap)] lg:py-[var(--tr-item-py)] ${index > 0 ? `border-t ${tones.rule}` : "pt-0 lg:pt-0"}`}
                >
                  <span
                    className={`mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border lg:h-[var(--tr-icon)] lg:w-[var(--tr-icon)] ${tones.tile}`}
                  >
                    <SignalIcon item={item} index={index} className="h-[52%] w-[52%]" />
                  </span>
                  <p className={`text-[13.5px] leading-[1.55] lg:text-[length:var(--tr-item)] lg:leading-[var(--tr-item-lh)] ${tones.muted}`}>
                    <strong className={`text-[15px] font-semibold lg:text-[length:var(--tr-item-title)] ${tones.text}`}>
                      {cleanText(item.title)} {"—"}
                    </strong>{" "}
                    <span dangerouslySetInnerHTML={{ __html: typeset(item.text) }} />
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Phones / tablets: the scene as a band at the bottom of the card */}
          {photo ? <div aria-hidden="true" className="relative aspect-[860/571] sm:aspect-[16/8] lg:hidden">{photo}</div> : null}
        </div>
      </div>
    </section>
  );
}
