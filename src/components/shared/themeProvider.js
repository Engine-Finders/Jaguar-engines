"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";

const themes = {
  light: {
    "--color-page": "#ffffff",
    "--color-page-soft": "#f5f5f3",
    "--color-surface": "#ffffff",
    "--color-surface-raised": "rgba(255, 255, 255, 0.94)",
    "--color-surface-glass": "rgba(255, 255, 255, 0.78)",
    "--color-table-surface": "rgba(255, 255, 255, 0.96)",
    "--color-text": "#111210",
    "--color-text-muted": "#464844",
    "--color-text-soft": "#747671",
    "--color-border": "#d9d9d4",
    "--color-border-strong": "#b8bab5",
    "--color-primary": "#111210",
    "--color-primary-strong": "#000000",
    "--color-primary-soft": "#ececea",
    "--color-chrome": "#111210",
    "--color-accent": "#292b29",
    "--color-accent-red": "#9f1d28",
    "--color-accent-red-soft": "#f7e9ea",
    "--color-accent-green": "#16724f",
    "--color-accent-green-soft": "#e7f1ec",
    "--color-shadow": "rgba(16, 18, 16, 0.13)",
    "--color-hero-overlay": "rgba(255, 255, 255, 0.72)",
    "--color-hero-fade": "rgba(255, 255, 255, 0.97)",
    "--color-navbar": "rgba(255, 255, 255, 0.98)",
    "--color-glass-border": "rgba(17, 18, 16, 0.12)",
    "--color-glass-shadow": "rgba(17, 18, 16, 0.08)",
    "--color-btn-hover": "rgba(0, 0, 0, 0.18)",
    "--color-btn-hover-text": "#ffffff",
  },
  dark: {
    "--color-page": "#050606",
    "--color-page-soft": "#0b0d0d",
    "--color-surface": "#101212",
    "--color-surface-raised": "rgba(17, 19, 19, 0.94)",
    "--color-surface-glass": "rgba(14, 16, 16, 0.78)",
    "--color-table-surface": "rgba(18, 20, 20, 0.96)",
    "--color-text": "#f3f3f0",
    "--color-text-muted": "#d0d1cd",
    "--color-text-soft": "#999b97",
    "--color-border": "#343735",
    "--color-border-strong": "#5b5e5b",
    "--color-primary": "#eeeeeb",
    "--color-primary-strong": "#ffffff",
    "--color-primary-soft": "rgba(238, 238, 235, 0.11)",
    "--color-chrome": "#1f221e",
    "--color-accent": "#d8d9d5",
    "--color-accent-red": "#d36a70",
    "--color-accent-red-soft": "rgba(159, 29, 40, 0.2)",
    "--color-accent-green": "#9db8aa",
    "--color-accent-green-soft": "rgba(157, 184, 170, 0.14)",
    "--color-shadow": "rgba(0, 0, 0, 0.62)",
    "--color-hero-overlay": "rgba(5, 6, 6, 0.76)",
    "--color-hero-fade": "rgba(5, 6, 6, 0.98)",
    "--color-navbar": "rgba(3, 4, 4, 0.98)",
    "--color-glass-border": "rgba(255, 255, 255, 0.2)",
    "--color-glass-shadow": "rgba(0, 0, 0, 0.5)",
    "--color-btn-hover": "rgba(0, 0, 0, 0.12)",
    "--color-btn-hover-text": "#000000",
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
