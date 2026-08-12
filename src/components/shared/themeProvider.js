"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";

const themes = {
  light: {
    "--color-page": "#ffffff",
    "--color-page-soft": "#f4f7fb",
    "--color-surface": "#ffffff",
    "--color-surface-raised": "rgba(255, 255, 255, 0.9)",
    "--color-surface-glass": "rgba(244, 247, 251, 0.55)",
    "--color-table-surface": "rgba(255, 255, 255, 0.9)",
    "--color-text": "#071827",
    "--color-text-muted": "#27384a",
    "--color-text-soft": "#617084",
    "--color-border": "#d7dde6",
    "--color-border-strong": "#b7c2d1",
    "--color-primary": "#075fd8",
    "--color-primary-strong": "#034daf",
    "--color-primary-soft": "#dceaff",
    "--color-accent": "#1581ff",
    "--color-accent-red": "#ed1c24",
    "--color-accent-red-soft": "#fff0f0",
    "--color-accent-green": "#13884a",
    "--color-accent-green-soft": "#eefaf3",
    "--color-shadow": "rgba(10, 26, 43, 0.16)",
    "--color-hero-overlay": "rgba(255, 255, 255, 0.72)",
    "--color-hero-fade": "rgba(255, 255, 255, 0.96)",
    "--color-navbar": "rgba(255, 255, 255, 0.96)",
    "--color-glass-border": "rgba(0, 0, 0, 0.1)",
    "--color-glass-shadow": "rgba(0, 0, 0, 0.06)",
  },
  dark: {
    "--color-page": "#02070b",
    "--color-page-soft": "#07121d",
    "--color-surface": "#0a1520",
    "--color-surface-raised": "rgba(10, 21, 32, 0.88)",
    "--color-surface-glass": "rgba(9, 21, 33, 0.5)",
    "--color-table-surface": "rgba(14, 28, 51, 0.96)",
    "--color-text": "#f6f8fb",
    "--color-text-muted": "#d7dce3",
    "--color-text-soft": "#9da8b5",
    "--color-border": "#223343",
    "--color-border-strong": "#375067",
    "--color-primary": "#0b67dc",
    "--color-primary-strong": "#054aa9",
    "--color-primary-soft": "#0c2748",
    "--color-accent": "#2484ff",
    "--color-accent-red": "#ff2d35",
    "--color-accent-red-soft": "rgba(255, 45, 53, 0.15)",
    "--color-accent-green": "#3dd68c",
    "--color-accent-green-soft": "rgba(24, 148, 84, 0.16)",
    "--color-shadow": "rgba(0, 0, 0, 0.5)",
    "--color-hero-overlay": "rgba(2, 7, 11, 0.74)",
    "--color-hero-fade": "rgba(2, 7, 11, 0.97)",
    "--color-navbar": "rgba(2, 7, 11, 0.92)",
    "--color-glass-border": "rgba(255, 255, 255, 0.15)",
    "--color-glass-shadow": "rgba(0, 0, 0, 0.35)",
  },
};

const ThemeContext = createContext(null);

function getStoredTheme() {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem("site-theme");
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribeToThemeChange(callback) {
  window.addEventListener("storage", callback);
  window.addEventListener("site-theme-change", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("site-theme-change", callback);
  };
}

function saveTheme(theme) {
  window.localStorage.setItem("site-theme", theme);
  window.dispatchEvent(new Event("site-theme-change"));
}

export function ThemeProvider({ children }) {
  const theme = useSyncExternalStore(subscribeToThemeChange, getStoredTheme, () => "light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme: saveTheme,
      toggleTheme: () => saveTheme(theme === "dark" ? "light" : "dark"),
    }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <div style={themes[theme]}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
