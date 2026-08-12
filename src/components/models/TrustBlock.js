import Image from "next/image";
import MStripe from "@/components/reusableComponents/MStripe";
import { sectionDescription } from "@/components/models/sectionTypography";

const iconPaths = {
  data: <path d="M5 19V9m5 10V5m5 14v-7m5 7H3" />,
  heart: <path d="M12 21s-7-4.5-9.2-9.1C1.2 8.6 3.3 5 6.8 5c2 0 3.5 1.1 4.2 2.5C11.7 6.1 13.2 5 15.2 5c3.5 0 5.6 3.6 4 6.9C19 16.5 12 21 12 21Z" />,
  wrench: <path d="m14.7 6.3 3-3a5 5 0 0 1-6.4 6.4l-6.8 6.8a2.1 2.1 0 0 0 3 3l6.8-6.8a5 5 0 0 1 6.4-6.4l-3 3" />,
  shield: <path d="M12 3 5 6v6c0 5 3.3 8.8 7 9 3.7-.2 7-4 7-9V6l-7-3Zm0 5 1.1 2.2 2.4.3-1.7 1.7.4 2.4-2.2-1.1-2.2 1.1.4-2.4-1.7-1.7 2.4-.3L12 8Z" />,
};

function cleanText(text = "") {
  return text
    .replaceAll("Ãƒâ€šÃ‚Â£", "\u00a3")
    .replaceAll("Ã‚Â£", "\u00a3")
    .replaceAll("Ã¢â‚¬â€œ", "-")
    .replaceAll("Ã¢â‚¬â€", "-")
    .replace(/\s+-\s+/g, " - ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitTitle(title = "") {
  const clean = cleanText(title);
  const marker = "BMWEngines.uk";
  const index = clean.indexOf(marker);

  if (index === -1) return { before: clean, accent: "" };

  return {
    before: clean.slice(0, index).trim(),
    accent: clean.slice(index).trim(),
  };
}

function iconKey(item = {}) {
  const value = `${item.icon || ""} ${item.title || ""}`.toLowerCase();
  if (value.includes("heart") || value.includes("not to repair") || value.includes("💚")) return "heart";
  if (value.includes("wrench") || value.includes("specialist") || value.includes("🔧")) return "wrench";
  if (value.includes("part of") || value.includes("trophy") || value.includes("🏆")) return "shield";
  return "data";
}

function SignalIcon({ item }) {
  const key = iconKey(item);
  const isHeart = key === "heart";

  return (
    <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-[var(--color-page-soft)] md:h-16 md:w-16 ${isHeart ? "text-[#36b96d]" : "text-[var(--color-primary)]"}`}>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8 md:h-9 md:w-9" fill={isHeart ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {iconPaths[key]}
      </svg>
    </span>
  );
}

export default function TrustBlock({ data }) {
  if (!data) return null;

  const title = splitTitle(data.h2);
  const signals = data.signals || [];

  return (
    <section className="overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-3.5 text-[var(--color-text)] shadow-[0_10px_30px_var(--color-shadow)] md:p-5">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,1fr)] lg:items-center">
        <div>
          <h2 className="max-w-[650px] text-[29px] font-bold leading-[1.08] tracking-normal text-[var(--color-text)] md:text-[45px]">
            <span dangerouslySetInnerHTML={{ __html: title.before }} />
            {title.accent ? (
              <>
                <br />
                <span className="text-[var(--color-primary)]" dangerouslySetInnerHTML={{ __html: title.accent }} />
              </>
            ) : null}
          </h2>
          <div className="mt-2.5">
            <MStripe />
          </div>

          <div className="mt-4">
            {signals.map((item) => (
              <article key={item.title} className="flex gap-3.5 border-b border-[var(--color-border)] py-3.5 first:pt-0 last:border-b-0 last:pb-0 md:gap-4 md:py-3.5">
                <SignalIcon item={item} />
                <p className="text-[var(--color-text)] text-[15px] leading-[1.42] md:text-[16px]">
                  <strong className="font-bold text-[var(--color-primary)]" dangerouslySetInnerHTML={{ __html: cleanText(item.title) }} />
                  {" - "}
                  <span dangerouslySetInnerHTML={{ __html: cleanText(item.text) }} />
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="relative hidden min-h-[340px] lg:block">
          <div className="absolute right-8 top-0 h-[230px] w-[390px] opacity-30">
            <svg aria-hidden="true" viewBox="0 0 430 260" className="h-full w-full text-[var(--color-primary)]" fill="none">
              <path d="M12 220h400" stroke="currentColor" strokeOpacity=".25" />
              {[40, 85, 130, 175, 220, 265, 310, 355, 400].map((x) => (
                <path key={x} d={`M${x} 30v190`} stroke="currentColor" strokeOpacity=".12" />
              ))}
              <path d="M22 180 70 178 120 150 165 115 210 82 260 100 315 55" stroke="currentColor" strokeWidth="3" />
              {[22, 70, 120, 165, 210, 260, 315].map((x, index) => (
                <circle key={x} cx={x} cy={[180, 178, 150, 115, 82, 100, 55][index]} r="6" fill="var(--color-surface)" stroke="currentColor" strokeWidth="3" />
              ))}
              {[190, 220, 250, 285, 330, 370, 405].map((x, index) => (
                <rect key={x} x={x} y={190 - index * 15} width="16" height={30 + index * 15} fill="currentColor" opacity=".18" />
              ))}
            </svg>
          </div>
          <div className="absolute left-0 top-10 h-[220px] w-[220px] opacity-25">
            <svg aria-hidden="true" viewBox="0 0 240 240" className="h-full w-full text-[var(--color-primary)]">
              {Array.from({ length: 210 }).map((_, index) => {
                const x = 30 + ((index * 29) % 170);
                const y = 20 + ((index * 47) % 190);
                return <circle key={index} cx={x} cy={y} r="1.8" fill="currentColor" />;
              })}
            </svg>
          </div>
          <Image src="/model/Section 2-bg.webp" alt="" fill className="relative z-10 object-contain object-right-bottom" sizes="(min-width: 1024px) 48vw, 100vw" />
        </div>
      </div>
    </section>
  );
}
