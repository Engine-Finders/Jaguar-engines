import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { sectionBody, sectionButton, sectionH2, sectionTableText } from "@/components/models/sectionTypography";

function cleanText(text = "") {
  return text
    .replaceAll("Ãƒâ€šÃ‚Â£", "\u00a3")
    .replaceAll("Ã‚Â£", "\u00a3")
    .replaceAll("Ã¢â‚¬â€œ", "-")
    .replaceAll("Ã¢â‚¬â€", "-")
    .replaceAll("Ã¢â€ â€™", "->")
    .replaceAll("✅", "")
    .replaceAll("❌", "")
    .replace(/\s+-\s+/g, " - ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitTitle(title = "") {
  const clean = cleanText(title);
  const marker = "Frequently Asked Questions";
  const index = clean.indexOf(marker);

  if (index === -1) return { before: clean, accent: "" };

  return {
    before: clean.slice(0, index).trim(),
    accent: clean.slice(index).trim(),
  };
}

function Icon({ name, className = "h-6 w-6" }) {
  const path =
    name === "document" ? (
      <path d="M7 3h8l4 4v14H7V3Zm8 0v5h5M10 12h6M10 16h6" />
    ) : (
      <path d="M5 12h14m-6-6 6 6-6 6" />
    );

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {path}
    </svg>
  );
}

function FaqItem({ item, index }) {
  return (
    <details className="group overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] shadow-[0_6px_16px_var(--color-shadow)]">
      <summary className="grid cursor-pointer list-none grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3.5 marker:hidden md:px-4">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[var(--color-primary)] text-[14px] font-bold leading-none text-white">
          {item.id || index + 1}
        </span>
        <h3 className="font-bold text-[15px] leading-[1.15] text-[var(--color-text)] md:text-[17px]">{cleanText(item.question)}</h3>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[var(--color-text-muted)] transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <div className={`border-t border-[var(--color-border)] px-4 pb-4 pt-2.5 text-[var(--color-text-muted)] md:px-4 ${sectionBody}`}>
        {cleanText(item.answer)}
      </div>
    </details>
  );
}

export default function FAQAccordion({ data }) {
  if (!data) return null;

  const title = splitTitle(data.h2);
  const items = data.items || [];
  const midpoint = Math.ceil(items.length / 2);
  const columns = [items.slice(0, midpoint), items.slice(midpoint)];

  return (
    <section className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4 text-[var(--color-text)] shadow-[0_10px_30px_var(--color-shadow)] md:p-6">
      <h2 className={`max-w-[980px] font-bold tracking-normal text-[var(--color-text)] ${sectionH2}`}>
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

      <div className="mt-5 grid gap-3 lg:grid-cols-2 lg:gap-x-6">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="grid gap-3">
            {column.map((item, index) => (
              <FaqItem key={item.id || item.question} item={item} index={columnIndex * midpoint + index} />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-4 rounded-md bg-[var(--color-page-soft)] p-4 md:flex-row md:items-center md:justify-between md:p-5">
        <div className="flex gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white md:h-16 md:w-16">
            <Icon name="document" className="h-8 w-8 md:h-9 md:w-9" />
          </span>
          <div>
            <h3 className="text-[18px] font-bold leading-tight text-[var(--color-text)] md:text-[20px]">Need a head-to-head comparison?</h3>
            <p className={`mt-1 max-w-[620px] text-[var(--color-text-muted)] ${sectionBody} md:text-[16px]`}>
              Read our in-depth BMW 3 Series vs 5 Series reliability guide.
            </p>
          </div>
        </div>
        <Link href="#" className={`inline-flex min-h-12 shrink-0 items-center justify-center gap-4 rounded-md bg-[var(--color-primary)] px-5 py-3 font-bold text-white shadow-[0_12px_28px_var(--color-shadow)] transition-all duration-200 hover:text-black md:min-w-[300px] ${sectionButton}`}>
          Read the Full Head-to-Head
          <Icon className="h-6 w-6" />
        </Link>
      </div>
    </section>
  );
}
