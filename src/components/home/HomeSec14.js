"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";

const iconPaths = {
  check: <path d="m5 12 4 4L19 6" />,
  chat: <path d="M5 18.5V20l3.2-1.6H17a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v6.4a4 4 0 0 0 2 3.5Z" />,
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />,
};

function Icon({ name, className = "h-5 w-5" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {iconPaths[name] || iconPaths.check}
    </svg>
  );
}

function StarBox({ faded = false }) {
  return (
    <span className={`flex h-6 w-6 items-center justify-center text-white ${faded ? "bg-[#9ed9c0]" : "bg-[#00b67a]"}`}>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="m12 2.8 2.8 5.8 6.4.9-4.6 4.5 1.1 6.3-5.7-3-5.7 3 1.1-6.3-4.6-4.5 6.4-.9L12 2.8Z" />
      </svg>
    </span>
  );
}

function TrustIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-[#00b67a]" fill="currentColor">
      <path d="m12 2.8 2.8 5.8 6.4.9-4.6 4.5 1.1 6.3-5.7-3-5.7 3 1.1-6.3-4.6-4.5 6.4-.9L12 2.8Z" />
    </svg>
  );
}

export default function HomeSec14({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [showDesktopImage, setShowDesktopImage] = useState(false);
  const stats = data.stats || [];
  const review = data.review || null;
  const image = data.image || null;
  const primaryCta = data.primaryCta || { href: "#", label: "", subLabel: "" };
  const secondaryCta = data.secondaryCta || { href: "#", label: "", subLabel: "" };

  useEffect(() => {
    function syncViewport() {
      setShowDesktopImage(window.innerWidth >= 768);
    }

    syncViewport();
    window.addEventListener("resize", syncViewport);

    return () => {
      window.removeEventListener("resize", syncViewport);
    };
  }, []);

  return (
    <section className={`px-3 pb-7 pt-2 md:px-6 md:pb-8 ${isDark ? "bg-[#02070b]" : "bg-white"}`}>
      <div className={`relative mx-auto w-full max-w-8xl overflow-hidden rounded-lg border ${isDark ? "border-[#223343] bg-[#07121d]" : "border-[#dfe5ed] bg-white"}`}>
        {showDesktopImage && image?.src ? (
          <div className="absolute inset-y-0 right-0 hidden w-[42%] md:block">
            <Image src={image.src} alt={image.alt || ""} fill className="object-cover object-center" sizes="42vw" />
            <div className={isDark ? "absolute inset-0 bg-[linear-gradient(90deg,#07121d_0%,rgba(7,18,29,0.68)_28%,rgba(7,18,29,0.1)_100%)]" : "absolute inset-0 bg-[linear-gradient(90deg,white_0%,rgba(255,255,255,0.64)_28%,rgba(255,255,255,0.04)_100%)]"} />
          </div>
        ) : null}

        <div className="relative px-5 py-5 md:grid md:grid-cols-[minmax(0,1fr)_34%] md:gap-5 md:px-10 md:py-6">
          <div>
            <h2 className={`text-[2rem] font-bold leading-tight tracking-normal md:text-[2.18rem] ${isDark ? "text-white" : "text-[#071827]"}`} dangerouslySetInnerHTML={{ __html: data.h2 || data.title || "Not Sure Where to Start?" }} />
            <div className="mt-3">
              <MStripe />
            </div>
            <p className={`mt-2 text-[1rem] leading-snug md:text-[1.08rem] ${isDark ? "text-white/78" : "text-[#172334]"}`} dangerouslySetInnerHTML={{ __html: data.subHeadline }} />

            {stats.length ? (
              <ul className="mt-5 grid gap-2 text-[0.88rem] md:grid-cols-4 md:gap-0">
                {stats.map((stat) => (
                  <li key={stat} className={`flex items-center gap-2 md:border-r md:px-4 md:first:pl-0 md:last:border-r-0 ${isDark ? "text-white/78 md:border-[#375067]" : "text-[#172334] md:border-[#d7dde6]"}`}>
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
                      <Icon name="check" className="h-3.5 w-3.5" />
                    </span>
                    <span className="leading-tight">{stat}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-6 grid gap-3 md:grid-cols-[272px_240px_minmax(0,1fr)] md:items-center">
              <Link href={primaryCta.href} className="btn-cta flex min-h-16 items-center gap-4 rounded-lg bg-[var(--color-primary)] px-5 py-3 text-white">
                <Icon name="chat" className="h-8 w-8 shrink-0" />
                <span className="min-w-0">
                  <span className="block text-[0.88rem] font-bold leading-tight">{primaryCta.label}</span>
                  <span className="mt-1 block text-[0.78rem] leading-tight text-white/84">{primaryCta.subLabel || primaryCta.note || ""}</span>
                </span>
              </Link>

              <Link href={secondaryCta.href} className={`flex min-h-16 items-center gap-4 rounded-lg border px-5 py-3 ${isDark ? "border-[#375067] bg-[#0a1520] text-white" : "border-[#d7dde6] bg-white text-[#071827]"}`}>
                <Icon name="phone" className="h-7 w-7 shrink-0" />
                <span className="min-w-0">
                  <span className="block text-[0.88rem] font-bold leading-tight">{secondaryCta.label}</span>
                  <span className={`mt-1 block text-[0.78rem] leading-tight ${isDark ? "text-white/70" : "text-[#27384a]"}`}>{secondaryCta.subLabel || secondaryCta.note || ""}</span>
                </span>
              </Link>

              {review ? (
                <div className="min-w-0">
                  <div className={`flex items-center gap-1 text-[1.05rem] font-bold ${isDark ? "text-white" : "text-[#071827]"}`}>
                    <TrustIcon />
                    <span>{review.brand}</span>
                  </div>
                  <div className="mt-1 flex gap-0.5">
                    {Array.from({ length: review.stars || 0 }).map((_, index) => (
                      <StarBox key={index} faded={index === (review.stars || 0) - 1} />
                    ))}
                  </div>
                  <p className={`mt-1 text-[0.74rem] leading-tight ${isDark ? "text-white/70" : "text-[#27384a]"}`}>{review.score}</p>
                </div>
              ) : null}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
