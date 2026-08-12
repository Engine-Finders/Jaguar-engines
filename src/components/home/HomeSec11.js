"use client";

import Image from "next/image";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";

const iconPaths = {
  timeline: <path d="M12 8v8M8 12h8M5 5h14v14H5z" />,
  car: <path d="m5 13 1.4-4.2A3 3 0 0 1 9.2 7h5.6a3 3 0 0 1 2.8 1.8L19 13m-15 0h16v5H4v-5Zm2 5v2m12-2v2M7 13l-2-1m12 1 2-1M8 16h.01M16 16h.01" />,
  insight: <path d="M4 20h16M7 16V9m5 7V5m5 11v-4m-9 8 4-4 3 3 5-7" />,
  chevron: <path d="m9 6 6 6-6 6" />,
};

function Icon({ name, className = "h-5 w-5", strokeWidth = 2 }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      {iconPaths[name] || iconPaths.car}
    </svg>
  );
}

function EraIcon({ isDark }) {
  return (
    <span className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 text-[var(--color-primary)] shadow-[0_8px_20px_rgba(7,95,216,0.12)] md:h-14 md:w-14 ${isDark ? "border-[#3e5e7c] bg-[#0a1520]" : "border-[var(--color-primary)] bg-white"}`}>
      <Icon name="car" className="h-5.5 w-5.5 md:h-6 md:w-6" strokeWidth={2.1} />
    </span>
  );
}

function HeaderImage({ data, isDark }) {
  return (
    <div className={`relative mt-5 overflow-hidden rounded-md border shadow-[0_12px_28px_rgba(10,26,43,0.06)] md:mt-0 md:h-[308px] md:rounded-none md:border-0 md:bg-transparent md:shadow-none ${isDark ? "border-[#223343] bg-[#0a1520]" : "border-[#dfe5ed] bg-white"}`}>
      <div className="relative h-[220px] sm:h-[250px] md:h-full">
        <Image
          src={data.headerImage.src}
          alt={data.headerImage.alt}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 48vw"
        />
        <div className={isDark ? "absolute inset-0 bg-[linear-gradient(180deg,rgba(2,7,11,0.14)_0%,rgba(2,7,11,0.32)_100%)] md:hidden" : "absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0.06)_100%)] md:hidden"} />
        <div className={`absolute left-[-28px] top-0 hidden h-full w-18 skew-x-[-22deg] md:block ${isDark ? "bg-[#02070b]" : "bg-white"}`} />
        <div className="absolute left-[-10px] top-0 hidden h-full w-2 skew-x-[-22deg] bg-[var(--color-primary)] md:block" />
      </div>
    </div>
  );
}

function DesktopHeader({ data, isDark }) {
  return (
    <div className="hidden md:grid md:grid-cols-[minmax(0,1fr)_48%] md:items-start">
      <div className="relative z-10 max-w-[640px] pt-6">
        <h2 className={`text-[3.35rem] font-bold leading-[1.05] tracking-normal ${isDark ? "text-white" : "text-[#071827]"}`} dangerouslySetInnerHTML={{ __html: data.h2 || "Jaguar Model Lineup" }} />
        <div className="mt-4">
          <MStripe />
        </div>
        <p className={`mt-5 max-w-[520px] text-[0.96rem] leading-[1.55] ${isDark ? "text-white/78" : "text-[#172334]"}`} dangerouslySetInnerHTML={{ __html: data.subHeadline }} />
      </div>
      <HeaderImage data={data} isDark={isDark} />
    </div>
  );
}

function MobileHeader({ data, isDark }) {
  return (
    <div className="md:hidden">
      <h2 className={`mt-3 text-[2rem] font-bold leading-[1.06] tracking-normal sm:text-[2.35rem] ${isDark ? "text-white" : "text-[#071827]"}`} dangerouslySetInnerHTML={{ __html: data.h2 || "Jaguar Model Lineup" }} />
      <div className="mt-4">
        <MStripe />
      </div>
      <p className={`mt-4 max-w-[380px] text-[0.94rem] leading-[1.5] sm:text-[0.98rem] ${isDark ? "text-white/78" : "text-[#172334]"}`} dangerouslySetInnerHTML={{ __html: data.subHeadline }} />
      <HeaderImage data={data} isDark={isDark} />
    </div>
  );
}

function DesktopTimeline({ data, isDark }) {
  return (
    <div className={`hidden overflow-hidden rounded-md border shadow-[0_14px_36px_rgba(10,26,43,0.06)] md:block ${isDark ? "border-[#223343] bg-[rgba(10,21,32,0.92)]" : "border-[#dfe5ed] bg-white"}`}>
      <div className="grid grid-cols-[300px_1fr_680px] bg-[linear-gradient(90deg,#3478f6_0%,#1f63df_100%)] text-white">
        {data.columns.map((column) => (
          <div key={column} className="border-r border-white/18 px-8 py-3 text-center text-[1rem] font-bold uppercase last:border-r-0">
            {column}
          </div>
        ))}
      </div>

      <div className="relative">
        <div className="absolute bottom-5 left-[53px] top-5 w-px bg-[var(--color-primary)]" />
        {data.eras.map((row) => (
          <div key={row.era} className={`grid grid-cols-[300px_1fr_680px] border-b last:border-b-0 ${isDark ? "border-[#223343]" : "border-[#e7ebf0]"}`}>
            <div className="flex items-center gap-6 px-6 py-5">
              <EraIcon isDark={isDark} />
              <p className={`text-[1.05rem] font-bold ${isDark ? "text-white" : "text-[#071827]"}`}>{row.era}</p>
            </div>

            <div className={`grid grid-cols-[1fr_156px] items-center gap-5 border-l px-6 py-4 ${isDark ? "border-[#223343]" : "border-[#e7ebf0]"}`}>
              <p className={`text-[1rem] font-semibold leading-[1.4] ${isDark ? "text-white/84" : "text-[#172334]"}`}>{row.engines}</p>
              {row.engineImage?.src ? (
                <div className="relative h-28 overflow-hidden rounded-md">
                  <Image src={row.engineImage.src} alt={row.engineImage.alt || ""} fill className="object-contain" sizes="156px" />
                </div>
              ) : (
                <div />
              )}
            </div>

            <div className={`grid grid-cols-[1fr_168px] items-center gap-6 border-l px-6 py-4 ${isDark ? "border-[#223343]" : "border-[#e7ebf0]"}`}>
              <div className="grid grid-cols-3 gap-3">
                {(row.modelImages || []).map((image, index) => (
                  <div key={`${row.era}-${index}`} className="relative h-20 overflow-hidden rounded-md">
                    <Image src={image.src} alt={image.alt || ""} fill className="object-contain" sizes="140px" />
                  </div>
                ))}
              </div>
              <p className={`text-[1rem] font-medium ${isDark ? "text-white/84" : "text-[#172334]"}`}>{row.models}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileTimeline({ data, isDark }) {
  return (
    <div className="relative mt-4 md:hidden">
      <div className="absolute bottom-6 left-[29px] top-6 w-px bg-[var(--color-primary)]" />
      <div className="grid gap-3">
        {data.eras.map((row) => (
          <div key={row.era} className="relative flex gap-3">
            <div className="w-11 shrink-0 pt-4">
              <EraIcon isDark={isDark} />
            </div>

            <article className={`min-w-0 flex-1 rounded-md border px-4 py-4 shadow-[0_10px_24px_rgba(10,26,43,0.05)] ${isDark ? "border-[#223343] bg-[rgba(10,21,32,0.92)]" : "border-[#dfe5ed] bg-white"}`}>
              <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
                <div>
                  <p className={`text-[0.92rem] font-bold sm:text-[0.98rem] ${isDark ? "text-white" : "text-[#071827]"}`}>{row.era}</p>
                </div>

                <div className={`grid gap-4 border-t pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0 ${isDark ? "border-[#223343]" : "border-[#e7ebf0]"}`}>
                  <div className="grid gap-2 sm:grid-cols-[1fr_110px] sm:items-center">
                    <div>
                      <p className="text-[0.76rem] font-bold uppercase text-[var(--color-primary)]">Key Engines</p>
                      <p className={`mt-1.5 text-[0.9rem] leading-[1.4] sm:text-[0.95rem] ${isDark ? "text-white/84" : "text-[#172334]"}`}>{row.engines}</p>
                    </div>
                    {row.engineImage?.src ? (
                      <div className="relative mx-auto h-22 w-full max-w-[112px] overflow-hidden rounded-md sm:h-24 sm:max-w-[120px]">
                        <Image src={row.engineImage.src} alt={row.engineImage.alt || ""} fill className="object-contain" sizes="120px" />
                      </div>
                    ) : null}
                  </div>

                  <div className={`grid gap-2 border-t pt-3 sm:grid-cols-[1fr_auto] sm:items-center ${isDark ? "border-[#223343]" : "border-[#e7ebf0]"}`}>
                    <div>
                      <p className="text-[0.76rem] font-bold uppercase text-[var(--color-primary)]">Iconic Models</p>
                      {(row.modelImages || []).length ? (
                        <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                          {(row.modelImages || []).map((image, index) => (
                            <div key={`${row.era}-mobile-${index}`} className="relative h-12 overflow-hidden rounded-md sm:h-14">
                              <Image src={image.src} alt={image.alt || ""} fill className="object-contain" sizes="90px" />
                            </div>
                          ))}
                        </div>
                      ) : null}
                      <p className={`mt-1.5 text-[0.9rem] leading-[1.4] sm:text-[0.95rem] ${isDark ? "text-white/84" : "text-[#172334]"}`}>{row.models}</p>
                    </div>
                    <span className="hidden text-[var(--color-primary)] sm:block">
                      <Icon name="chevron" className="h-7 w-7" />
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>
    </div>
  );
}

function KeyTakeaway({ text, isDark }) {
  return (
    <div className={`mt-4 rounded-md border px-4 py-4 shadow-[0_12px_28px_rgba(10,26,43,0.04)] md:mt-4 md:px-8 md:py-5 ${isDark ? "border-[#223343] bg-[linear-gradient(180deg,#0a1520_0%,#07121d_100%)]" : "border-[#dfe5ed] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)]"}`}>
      <div className="grid gap-4 md:grid-cols-[92px_1fr] md:items-center">
        <span className="flex h-15 w-15 items-center justify-center rounded-md bg-[var(--color-primary)] text-white shadow-[0_12px_26px_rgba(7,95,216,0.2)] md:h-16 md:w-16">
          <Icon name="insight" className="h-9 w-9 md:h-8 md:w-8" strokeWidth={2.2} />
        </span>
        <p className={`text-[0.9rem] leading-[1.52] md:text-[1.02rem] ${isDark ? "text-white/84" : "text-[#172334]"}`}>
          <span className="mr-2 font-bold uppercase text-[var(--color-primary)]">Key Takeaway:</span>
          <span dangerouslySetInnerHTML={{ __html: text }} />
        </p>
      </div>
    </div>
  );
}

export default function HomeSec11({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className={`relative overflow-hidden px-4 py-7 md:px-6 md:py-8 ${isDark ? "bg-[#02070b]" : "bg-white"}`}>
      <div className="absolute inset-x-0 top-0 hidden h-[318px] md:block">
        <div className={isDark ? "absolute inset-0 bg-[linear-gradient(90deg,#02070b_0%,rgba(2,7,11,0.96)_44%,rgba(2,7,11,0)_70%)]" : "absolute inset-0 bg-[linear-gradient(90deg,white_0%,rgba(255,255,255,0.96)_44%,rgba(255,255,255,0)_70%)]"} />
      </div>

      <div className="relative mx-auto w-full max-w-8xl">
        <DesktopHeader data={data} isDark={isDark} />
        <MobileHeader data={data} isDark={isDark} />
        <div className="mt-6">
          <DesktopTimeline data={data} isDark={isDark} />
          <MobileTimeline data={data} isDark={isDark} />
        </div>
        <KeyTakeaway text={data.keyTakeaway} isDark={isDark} />
      </div>
    </section>
  );
}
