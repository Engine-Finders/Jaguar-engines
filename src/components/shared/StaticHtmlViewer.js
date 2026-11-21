"use client";

import { useEffect } from "react";
import HeroRegCta from "@/components/shared/HeroRegCta";
import CarOnBackground from "@/components/shared/CarOnBackground";
import { useTheme } from "@/components/shared/themeProvider";
import { openFreeQuote } from "@/lib/openFreeQuote";
import "./staticHtmlPage.css";

/*
 * Essential (static) page shell, same approach as the BMW site: the page's own content rendered inside the
 * site layout (Navbar + Footer come from app/layout.js), with a hero like the homepage's: breadcrumb,
 * eyebrow, H1, intro, stats and the reg plate + CTA that opens the lead form. Old in-page quote links and
 * reg forms open the same lead form. Styles for the page content: ./staticHtmlPage.css (site theme tokens).
 */

// The homepage hero car (black XF on the light theme, white on the dark one).
const HERO_CAR = { light: "/hero/home-xf45-light.webp", dark: "/hero/home-xf45-dark.webp" };

export default function StaticHtmlViewer({ hero = {}, content = "", jsonLd = [], scripts = [] }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const cleanups = [];
    const on = (el, type, fn, opts) => {
      el.addEventListener(type, fn, opts);
      cleanups.push(() => el.removeEventListener(type, fn, opts));
    };

    // Height of the site's sticky header, for the sticky "On this page" bar and anchor offsets.
    const setHeaderHeight = () => {
      const header = document.querySelector("header.sticky");
      if (header) document.documentElement.style.setProperty("--main-header-height", `${header.offsetHeight}px`);
    };
    setHeaderHeight();
    on(window, "resize", setHeaderHeight);

    const host = document.querySelector(".static-content-host");
    if (!host) return () => cleanups.forEach((fn) => fn());

    // 0. The page's own inline scripts (interactive tools) run once the content is in the DOM.
    scripts.forEach((code) => {
      const el = document.createElement("script");
      el.textContent = code;
      host.appendChild(el);
      cleanups.push(() => el.remove());
    });

    // 1. Old registration lookup forms in the page content -> the lead form, prefilled with the reg.
    host.querySelectorAll("form.registration-lookup").forEach((form) => {
      on(form, "submit", (event) => {
        const input = form.querySelector("input[name='reg'], input[type='text']");
        if (!input) return;
        event.preventDefault();
        openFreeQuote({ reg: (input.value || "").trim() });
      });
    });

    // 2. Old quote links ("#quote", "/quote") -> the lead form.
    host.querySelectorAll("a[href='#quote'], a[href='/quote']").forEach((link) => {
      on(link, "click", (event) => {
        event.preventDefault();
        openFreeQuote();
      });
    });

    // 3. "On this page" links: smooth scroll below the site header and the sticky bar.
    const offset = () =>
      (document.querySelector("header.sticky")?.offsetHeight || 76) + (host.querySelector(".toc-bar")?.offsetHeight || 52) + 12;
    host.querySelectorAll('a[href^="#"]').forEach((link) => {
      on(link, "click", (event) => {
        const id = link.getAttribute("href");
        if (!id || id.length < 2 || id === "#quote") return;
        let target = null;
        try {
          target = host.querySelector(id);
        } catch {
          return;
        }
        if (!target) return;
        event.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset(), behavior: "smooth" });
        window.history.replaceState(null, "", id);
      });
    });

    // 4. Highlight the current section in the "On this page" bar.
    const tocLinks = Array.from(host.querySelectorAll(".toc-bar a[href^='#']"));
    if (tocLinks.length) {
      const sections = tocLinks.map((a) => {
        try {
          return host.querySelector(a.getAttribute("href"));
        } catch {
          return null;
        }
      });
      const onScroll = () => {
        const pos = window.scrollY + offset() + 20;
        let active = 0;
        sections.forEach((section, i) => {
          if (section && section.getBoundingClientRect().top + window.scrollY <= pos) active = i;
        });
        tocLinks.forEach((a, i) => a.classList.toggle("active", i === active));
      };
      on(window, "scroll", onScroll, { passive: true });
      onScroll();
    }

    return () => cleanups.forEach((fn) => fn());
  }, [content, scripts]);

  const image = hero.image || (isDark ? HERO_CAR.dark : HERO_CAR.light);
  const ownImage = Boolean(hero.image);

  return (
    <main className="static-page-root w-full bg-[var(--color-page)] text-[var(--color-text)]">
      {jsonLd.map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      ))}

      {/* ==================== HERO ==================== */}
      <section className="relative w-full border-b border-[var(--color-border)] bg-[var(--color-page)]">
        <div className="mx-auto flex w-full max-w-8xl flex-col gap-7 px-4 pb-8 pt-5 md:px-8 md:pb-12 md:pt-7 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="min-w-0 max-w-[720px] flex-1">
            {hero.breadcrumb ? (
              <div className="static-hero-breadcrumb mb-4 md:mb-5" dangerouslySetInnerHTML={{ __html: hero.breadcrumb }} />
            ) : null}
            {hero.eyebrow ? (
              <span className={`inline-block text-[0.68rem] font-bold uppercase tracking-[0.14em] md:text-[0.73rem] ${isDark ? "text-white/60" : "text-[var(--color-text-muted)]"}`}>
                {hero.eyebrow}
              </span>
            ) : null}
            <h1
              className="static-hero-title mt-1.5 text-[2.1rem] leading-[1.02] text-[var(--color-text)] md:text-[3rem] lg:text-[3.35rem]"
              dangerouslySetInnerHTML={{ __html: hero.h1 || "Jaguar Engine Guide" }}
            />
            <div aria-hidden="true" className={`mt-3 h-px w-11 ${isDark ? "bg-white/40" : "bg-[#a5a6a2]"}`} />
            {hero.subHtml || hero.sub ? (
              <p
                className="static-hero-sub mt-3 max-w-[660px] text-[0.95rem] leading-[1.55] text-[var(--color-text-muted)] md:text-[1.05rem]"
                dangerouslySetInnerHTML={{ __html: hero.subHtml || hero.sub }}
              />
            ) : null}

            {hero.stats?.length ? (
              <ul className="mt-5 grid max-w-[680px] grid-cols-2 gap-2.5 sm:grid-cols-4">
                {hero.stats.map((stat) => (
                  <li
                    key={`${stat.figure}-${stat.label}`}
                    className="flex flex-col justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-center shadow-[0_6px_18px_var(--color-shadow)]"
                  >
                    <span className="text-[1rem] font-bold leading-tight text-[var(--color-text)] md:text-[1.1rem]">{stat.figure}</span>
                    <span className="mt-0.5 text-[11px] leading-[1.3] text-[var(--color-text-soft)] md:text-[11.5px]">{stat.label}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {/* Reg plate + CTA, exactly as in the homepage hero: opens the lead form */}
            <HeroRegCta className="mt-6 max-w-[620px]" label="Explore Jaguar Engine Replacement Options" />
          </div>

          <div aria-hidden="true" className="relative mx-auto w-full max-w-[520px] shrink-0 lg:mx-0 lg:w-[42%]">
            {ownImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="" className="w-full rounded-xl object-cover" />
            ) : (
              <CarOnBackground
                src={image}
                isDark={isDark}
                className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-[var(--color-border)]"
                bgClassName="object-cover object-[70%_center]"
                carClassName="inset-x-[8%] bottom-[12%] top-[22%]"
                sizes="(min-width: 1024px) 520px, 100vw"
              />
            )}
          </div>
        </div>
      </section>

      {/* ==================== PAGE CONTENT ==================== */}
      <div className="mx-auto w-full max-w-8xl px-4 pb-10 md:px-8">
        <div className="static-content-host" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </main>
  );
}
