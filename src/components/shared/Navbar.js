"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/components/shared/themeProvider";
import { DesktopNavMenus, MobileNavMenus } from "@/components/shared/NavMenus";

function MenuIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function ThemeIcon({ theme }) {
  if (theme === "dark") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M3 12h2M19 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.6 6.6 0 0 0 21 12.8Z" />
    </svg>
  );
}

function LogoMark() {
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-text)] bg-[var(--color-surface)] text-[10px] font-bold leading-none md:h-14 md:w-14">
      <span className="grid h-8 w-8 grid-cols-2 overflow-hidden rounded-full border border-[var(--color-border-strong)]">
        <span className="bg-[var(--color-surface)]" />
        <span className="bg-[var(--color-primary)]" />
        <span className="bg-[var(--color-primary)]" />
        <span className="bg-[var(--color-surface)]" />
      </span>
    </span>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const nextThemeLabel = theme === "dark" ? "Switch to day theme" : "Switch to night theme";

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-navbar)] backdrop-blur">
      <nav className="mx-auto flex w-full max-w-8xl items-center justify-between gap-3 px-4 py-3 md:px-8 md:py-4">
        <Link href="/" className="flex shrink-0 items-center gap-3 text-[var(--color-text)] no-underline">
          <LogoMark />
          <span className="leading-tight">
            <span className="block text-[1.6rem] font-extrabold tracking-normal md:text-3xl">BMW</span>
            <span className="block text-[0.85rem] font-semibold tracking-normal md:text-xl">RELIABILITY GUIDE</span>
          </span>
        </Link>

        <DesktopNavMenus />

        <div className="hidden items-center gap-4 lg:flex">
          <button
            type="button"
            aria-label={nextThemeLabel}
            title={nextThemeLabel}
            onClick={toggleTheme}
            className="flex h-11 w-11 items-center justify-center rounded border border-[var(--color-border-strong)] text-[var(--color-text)]"
          >
            <ThemeIcon theme={theme} />
          </button>
        </div>

        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <button
            type="button"
            aria-label={nextThemeLabel}
            title={nextThemeLabel}
            onClick={toggleTheme}
            className="flex h-11 w-11 items-center justify-center rounded border border-[var(--color-border-strong)] text-[var(--color-text)]"
          >
            <ThemeIcon theme={theme} />
          </button>
          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center text-[var(--color-text)]"
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {isMenuOpen ? (
        <div
          id="mobile-nav"
          className="max-h-[calc(100dvh-5.5rem)] overflow-y-auto overscroll-contain border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 lg:hidden"
        >
          <MobileNavMenus onNavigate={() => setIsMenuOpen(false)} />
        </div>
      ) : null}
    </header>
  );
}
