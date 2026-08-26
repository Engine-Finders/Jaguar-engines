"use client";

import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";
import { sectionBody, sectionDescription, sectionTableText } from "@/components/models/sectionTypography";

const buyerImages = [
  "/model/Hero-bg-image.webp",
  "/model/Section 2-bg.webp",
  "/model/Section 3-bg.webp",
  "/hero-day.webp",
  "/model/Hero-bg-image.webp",
];

const proofItems = [
  { title: "Built for Real Life", text: "Practical. Powerful. Proven.", icon: "best-family" },
  { title: "Data-Backed Ratings", text: "UK enquiries analysed in 2025.", icon: "chart" },
  { title: "Honest Verdicts", text: "No hype. Just the truth about ownership.", icon: "scale" },
  { title: "Buyer-Focused", text: "Find the right model for your needs.", icon: "safest-buy" },
];

const profileIconKeys = {
  family: "best-family",
  commute: "car",
  budget: "pound",
  performance: "trophy",
  keeper: "shield",
};

function cleanText(text = "") {
  return String(text ?? "")
    .replaceAll("Ã‚Â£", "\u00a3")
    .replaceAll("Ãƒâ€šÃ‚Â£", "\u00a3")
    .replaceAll("Ã¢â‚¬â€œ", "-")
    .replaceAll("Ã¢â‚¬â€", "-")
    .replaceAll("ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“", "-")
    .replaceAll("ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â", "-")
    .replace(/\s+-\s+/g, " - ")
    .replace(/\s+/g, " ")
    .trim();
}

function modelNameFromTitle(title = "") {
  const clean = cleanText(title);
  const match = clean.match(/Buy (?:an?|the)\s+(.+?)\?/i);
  return match ? match[1] : "Jaguar";
}

function splitTitle(title = "") {
  const clean = cleanText(title);
  const modelName = modelNameFromTitle(clean);
  const index = clean.indexOf(modelName);

  if (index === -1) {
    return { before: clean, accent: "" };
  }

  return {
    before: clean.slice(0, index).trim(),
    accent: clean.slice(index).trim(),
  };
}

function profileIconKey(profile = "") {
  const value = profile.toLowerCase();
  if (value.includes("family")) return "family";
  if (value.includes("commuter") || value.includes("daily")) return "commute";
  if (value.includes("budget")) return "budget";
  if (value.includes("performance")) return "performance";
  return "keeper";
}

function filledStars(rating = "") {
  const text = String(rating);
  const empty = (text.match(/\u2606/g) || []).length;
  const filled = (text.match(/\u2b50/g) || []).length + (text.match(/\u2605/g) || []).length;

  if (filled > 0) return filled;
  if (empty > 0) return Math.max(0, 5 - empty);

  return 0;
}

function Stars({ rating }) {
  const filled = filledStars(rating);
  const star = String.fromCharCode(9733);

  return (
    <div className="flex items-center gap-1 text-[24px] leading-none text-[var(--color-chrome-bright)] md:gap-1.5 md:text-[32px]">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className={index < filled ? "" : "opacity-35"}>
          {star}
        </span>
      ))}
    </div>
  );
}

function CircleIcon({ name, isDark }) {
  return (
    <span
      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full md:h-16 md:w-16 ${
        isDark ? "bg-white/10" : "bg-[#ececeb]"
      }`}
    >
      <HomeIcon name={name} isDark={isDark} className="h-10 w-10 object-contain md:h-12 md:w-12" />
    </span>
  );
}

function ProofStrip({ isDark }) {
  return (
    <ul className="hidden overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] shadow-[0_10px_30px_var(--color-shadow)] lg:grid lg:grid-cols-4">
      {proofItems.map((item) => (
        <li
          key={item.title}
          className="flex flex-col items-center justify-start border-r border-[var(--color-border)] px-5 py-3.5 text-center last:border-r-0"
        >
          <span
            className={`flex h-14 w-14 items-center justify-center rounded-full ${
              isDark ? "bg-white/10" : "bg-[#ececeb]"
            }`}
          >
            <HomeIcon name={item.icon} isDark={isDark} className="h-10 w-10 object-contain" />
          </span>
          <strong className="mt-1.5 text-[14px] leading-tight text-[var(--color-text)]">{item.title}</strong>
          <span className="mt-0.5 text-[13px] leading-[1.25] text-[var(--color-text-muted)]">{item.text}</span>
        </li>
      ))}
    </ul>
  );
}

function BuyerRow({ row, index, isDark }) {
  const iconKey = profileIconKeys[profileIconKey(row.buyerProfile)] || "shield";

  return (
    <article className="grid overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] shadow-[0_10px_26px_var(--color-shadow)] md:rounded-none md:border-0 md:border-t md:shadow-none lg:grid-cols-[40%_18%_42%]">
      <div className="grid grid-cols-[31%_69%] md:grid-cols-[300px_1fr] lg:border-r lg:border-[var(--color-border)]">
        <div className="relative min-h-[150px] md:min-h-[124px]">
          <Image
            src={buyerImages[index % buyerImages.length]}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 300px, (min-width: 768px) 300px, 31vw"
          />
        </div>
        <div className="flex min-w-0 items-center gap-3 px-3 py-3.5 md:px-5 md:py-4">
          <CircleIcon name={iconKey} isDark={isDark} />
          <div className="min-w-0">
            <h3
              className="text-[16px] font-bold leading-[1.12] text-[var(--color-text)] md:text-[18px]"
              dangerouslySetInnerHTML={{ __html: cleanText(row.buyerProfile) }}
            />
            <div className="mt-3 lg:hidden">
              <Stars rating={row.rating} />
            </div>
          </div>
        </div>
      </div>

      <div className="hidden items-center justify-center border-r border-[var(--color-border)] px-3 py-3 lg:flex">
        <Stars rating={row.rating} />
      </div>

      <p
        className={`border-t border-[var(--color-border)] px-3 py-3 text-[var(--color-text)] md:px-4 md:py-3 lg:border-t-0 ${sectionTableText} md:text-[14px]`}
        dangerouslySetInnerHTML={{ __html: cleanText(row.verdict) }}
      />
    </article>
  );
}

export default function WhoShouldBuy({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const title = splitTitle(data.h2);
  const modelName = modelNameFromTitle(data.h2);
  const profiles = data.profiles || [];
  const sectionBg = isDark ? "bg-[var(--color-page)]" : "bg-[#ececea]";

  return (
    <section className={`${sectionBg} py-6 text-[var(--color-text)] md:py-8`}>
      <div className="mx-auto w-full max-w-8xl px-4 md:px-8">
        <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[minmax(0,0.92fr)_minmax(520px,1fr)] lg:items-start">
          <div>
            <h2 className="max-w-[760px] text-[29px] font-bold leading-[1.08] tracking-normal text-[var(--color-text)] md:text-[45px]">
              <span dangerouslySetInnerHTML={{ __html: title.before }} />
              {title.accent ? (
                <>
                  {" "}
                  <span
                    className="text-[var(--color-chrome-bright)]"
                    dangerouslySetInnerHTML={{ __html: title.accent }}
                  />
                </>
              ) : null}
            </h2>
            <div className="mt-3">
              <MStripe />
            </div>
            <p className={`mt-3 max-w-[620px] text-[var(--color-text-muted)] ${sectionDescription}`}>
              Different buyers, different priorities. Here is our verdict on who the{" "}
              <span dangerouslySetInnerHTML={{ __html: modelName }} /> is perfect for - and who should think twice.
            </p>
          </div>

          <ProofStrip isDark={isDark} />
        </div>

        <div className="mt-6 overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] shadow-[0_12px_32px_var(--color-shadow)]">
          <div className="hidden grid-cols-[40%_18%_42%] bg-black text-[14px] font-bold text-white lg:grid dark:bg-[var(--color-chrome)] dark:text-[var(--color-page)]">
            {(data.columns || ["Buyer Profile", "Rating", "Our Verdict"]).map((column, index) => (
              <div key={column} className={`px-3 py-2.5 ${index > 0 ? "border-l border-white/20" : ""}`}>
                {column}
              </div>
            ))}
          </div>

          <div className="grid gap-5 bg-[var(--color-page)] md:gap-0 lg:block">
            {profiles.map((row, index) => (
              <BuyerRow key={`${row.buyerProfile}-${index}`} row={row} index={index} isDark={isDark} />
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4 shadow-[0_8px_24px_var(--color-shadow)] md:flex-row md:items-center md:justify-between md:p-5">
          <div className="flex gap-3.5">
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                isDark ? "bg-white/10" : "bg-[#ececeb]"
              }`}
            >
              <HomeIcon name="note" isDark={isDark} className="h-7 w-7 object-contain" />
            </span>
            <p className={`max-w-[760px] text-[var(--color-text)] ${sectionBody}`}>
              <strong className="font-bold text-[var(--color-chrome-bright)]">Real talk.</strong> The right{" "}
              <span dangerouslySetInnerHTML={{ __html: modelName }} /> for you depends on your budget, your mileage,
              and your patience for maintenance. Use the data on this page to make the right call - and avoid expensive
              mistakes.
            </p>
          </div>
          <Link
            href="#engine-database"
            className="btn-cta inline-flex min-h-12 shrink-0 items-center justify-center gap-4 rounded-md px-5 py-3 text-[16px] font-bold shadow-[0_12px_28px_var(--color-shadow)] md:min-w-[260px]"
          >
            Explore <span dangerouslySetInnerHTML={{ __html: modelName }} /> Engines
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
