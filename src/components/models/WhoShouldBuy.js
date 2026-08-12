import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { sectionBody, sectionDescription, sectionH2, sectionTableText } from "@/components/models/sectionTypography";

const buyerImages = [
  "/model/Hero-bg-image.webp",
  "/model/Section 2-bg.webp",
  "/model/Section 3-bg.webp",
  "/hero-day.webp",
  "/model/Hero-bg-image.webp",
];

const proofItems = [
  {
    title: "Built for Real Life",
    text: "Practical. Powerful. Proven.",
    icon: <path d="M16 11a4 4 0 0 1-8 0m11 8a7 7 0 0 0-14 0m15-11a3 3 0 1 1-2.8-3M4 8a3 3 0 1 0 2.8-3" />,
  },
  {
    title: "Data-Backed Ratings",
    text: "UK enquiries analysed in 2025.",
    icon: <path d="M12 3 5 6v6c0 5 3.3 8.8 7 9 3.7-.2 7-4 7-9V6l-7-3Zm-2 9 1.6 1.6L15 10" />,
  },
  {
    title: "Honest Verdicts",
    text: "No hype. Just the truth about ownership.",
    icon: <path d="M12 3.5 14.2 8l4.8.7-3.5 3.4.8 4.8-4.3-2.3-4.3 2.3.8-4.8L5 8.7 9.8 8 12 3.5Zm-4 13.2-1 4 5-2.5 5 2.5-1-4" />,
  },
  {
    title: "Buyer-Focused",
    text: "Find the right model for your needs.",
    icon: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0v-7m-4-3 4 3 4-3M9 9h.01M15 9h.01" />,
  },
];

const profileIcons = {
  family: <path d="M16 11a4 4 0 0 1-8 0m11 8a7 7 0 0 0-14 0m15-11a3 3 0 1 1-2.8-3M4 8a3 3 0 1 0 2.8-3" />,
  commute: <path d="M4 9h16v10H4V9Zm4 0V7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M8 14h8" />,
  budget: <path d="M18 9a6 6 0 1 1-12 0c0-1.4.5-2.7 1.4-3.7L6 3h3.5m5 0H18l-1.4 2.3A5.9 5.9 0 0 1 18 9Zm-6-2v6m-2-4h4" />,
  performance: <path d="M4 15a8 8 0 1 1 16 0M12 15l4-5M8 17h8M7 13h.01M17 13h.01" />,
  keeper: <path d="M12 3 5 6v6c0 5 3.3 8.8 7 9 3.7-.2 7-4 7-9V6l-7-3Z" />,
};

function cleanText(text = "") {
  return text
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
  const match = clean.match(/Buy a\s+(.+?)\?/i);
  return match ? match[1] : "BMW";
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
    <div className="flex items-center gap-1 text-[24px] leading-none text-[var(--color-primary)] md:gap-1.5 md:text-[32px]">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className={index < filled ? "" : "text-[var(--color-primary)] opacity-35"}>
          {star}
        </span>
      ))}
    </div>
  );
}

function CircleIcon({ children }) {
  return (
    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] md:h-16 md:w-16">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
        {children}
      </svg>
    </span>
  );
}

function ProofStrip() {
  return (
    <ul className="hidden overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] shadow-[0_10px_30px_var(--color-shadow)] lg:grid lg:grid-cols-4">
      {proofItems.map((item) => (
        <li key={item.title} className="flex flex-col items-center justify-start border-r border-[var(--color-border)] px-5 py-3.5 text-center last:border-r-0">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-9 w-9 text-[var(--color-primary)]" fill="none" stroke="currentColor" strokeWidth="1.9">
            {item.icon}
          </svg>
          <strong className="mt-1.5 text-[14px] leading-tight text-[var(--color-text)]">{item.title}</strong>
          <span className="mt-0.5 text-[13px] leading-[1.25] text-[var(--color-text-muted)]">{item.text}</span>
        </li>
      ))}
    </ul>
  );
}

function BuyerRow({ row, index }) {
  const iconKey = profileIconKey(row.buyerProfile);

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
          <CircleIcon>{profileIcons[iconKey]}</CircleIcon>
          <div className="min-w-0">
            <h3 className="text-[16px] font-bold leading-[1.12] text-[var(--color-text)] md:text-[18px]" dangerouslySetInnerHTML={{ __html: cleanText(row.buyerProfile) }} />
            <div className="mt-3 lg:hidden">
              <Stars rating={row.rating} />
            </div>
          </div>
        </div>
      </div>

      <div className="hidden items-center justify-center border-r border-[var(--color-border)] px-3 py-3 lg:flex">
        <Stars rating={row.rating} />
      </div>

      <p className={`border-t border-[var(--color-border)] px-3 py-3 text-[var(--color-text)] md:px-4 md:py-3 lg:border-t-0 ${sectionTableText} md:text-[14px]`} dangerouslySetInnerHTML={{ __html: cleanText(row.verdict) }} />
    </article>
  );
}

export default function WhoShouldBuy({ data }) {
  if (!data) return null;

  const title = splitTitle(data.h2);
  const modelName = modelNameFromTitle(data.h2);
  const profiles = data.profiles || [];

  return (
    <section className="bg-[var(--color-page)] py-6 text-[var(--color-text)] md:py-8">
      <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[minmax(0,0.92fr)_minmax(520px,1fr)] lg:items-start">
        <div>
          <h2 className="max-w-[760px] text-[29px] font-bold leading-[1.08] tracking-normal text-[var(--color-text)] md:text-[45px]">
            <span dangerouslySetInnerHTML={{ __html: title.before }} />
            {title.accent ? (
              <>
                {" "}
                <span className="text-[var(--color-primary)]" dangerouslySetInnerHTML={{ __html: title.accent }} />
              </>
            ) : null}
          </h2>
          <div className="mt-3">
            <MStripe />
          </div>
          <p className={`mt-3 max-w-[620px] text-[var(--color-text-muted)] ${sectionDescription}`}>
            Different buyers, different priorities. Here is our verdict on who the <span dangerouslySetInnerHTML={{ __html: modelName }} /> is perfect for - and who should think twice.
          </p>
        </div>

        <ProofStrip />
      </div>

      <div className="mt-6 overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] shadow-[0_12px_32px_var(--color-shadow)]">
        <div className="hidden grid-cols-[40%_18%_42%] bg-[var(--color-primary-strong)] text-[14px] font-bold text-white lg:grid">
          {(data.columns || ["Buyer Profile", "Rating", "Our Verdict"]).map((column, index) => (
            <div key={column} className={`px-3 py-2.5 ${index > 0 ? "border-l border-white/20" : ""}`}>
              {column}
            </div>
          ))}
        </div>

        <div className="grid gap-5 bg-[var(--color-page)] md:gap-0 lg:block">
          {profiles.map((row, index) => (
            <BuyerRow key={`${row.buyerProfile}-${index}`} row={row} index={index} />
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4 rounded-md border border-[var(--color-border)] bg-[var(--color-page-soft)] p-4 shadow-[0_8px_24px_var(--color-shadow)] md:flex-row md:items-center md:justify-between md:p-5">
        <div className="flex gap-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-[20px] font-bold italic leading-none text-white">
            i
          </span>
          <p className={`max-w-[760px] text-[var(--color-text)] ${sectionBody}`}>
            <strong className="font-bold text-[var(--color-primary)]">Real talk.</strong> The right <span dangerouslySetInnerHTML={{ __html: modelName }} /> for you depends on your budget, your mileage, and your patience for maintenance. Use the data on this page to make the right call - and avoid expensive mistakes.
          </p>
        </div>
        <Link
          href="#engine-database"
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-4 rounded-md bg-[var(--color-primary)] px-5 py-3 text-[16px] font-bold text-white shadow-[0_12px_28px_var(--color-shadow)] transition-all duration-200 hover:text-black hover:shadow-[0_18px_36px_rgba(0,0,0,0.24)] md:min-w-[260px]"
        >
          Explore <span dangerouslySetInnerHTML={{ __html: modelName }} /> Engines
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14m-6-6 6 6-6 6" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
