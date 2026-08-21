"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";

const themes = {
  light: {
    "--color-page": "#f3f3f1",
    "--color-page-soft": "#ececea",
    "--color-surface": "#f6f6f4",
    "--color-surface-raised": "rgba(246, 246, 244, 0.94)",
    "--color-surface-glass": "rgba(236, 236, 232, 0.82)",
    "--color-table-surface": "rgba(246, 246, 244, 0.96)",
    "--color-text": "#111210",
    "--color-text-muted": "#4a4b48",
    "--color-text-soft": "#777873",
    "--color-border": "#d7d7d2",
    "--color-border-strong": "#b5b6b1",
    "--color-primary": "#111210",
    "--color-primary-strong": "#000000",
    "--color-primary-soft": "#ececea",
    "--color-chrome": "#b7b8b3",
    "--color-chrome-strong": "#9b9c97",
    "--color-chrome-bright": "#90908d",
    "--color-chrome-soft": "rgba(183, 184, 179, 0.22)",
    "--color-accent": "#292b29",
    "--color-accent-red": "#9f1d28",
    "--color-accent-red-soft": "#f7e9ea",
    "--color-accent-green": "#16724f",
    "--color-accent-green-soft": "#e7f1ec",
    "--color-shadow": "rgba(16, 18, 16, 0.12)",
    "--color-hero-overlay": "rgba(243, 243, 241, 0.68)",
    "--color-hero-fade": "rgba(243, 243, 241, 0.96)",
    "--color-navbar": "rgba(243, 243, 241, 0.96)",
    "--color-glass-border": "rgba(17, 18, 16, 0.12)",
    "--color-glass-shadow": "rgba(17, 18, 16, 0.08)",
    "--color-cta-bg": "#111210",
    "--color-cta-text": "#ffffff",
    "--color-btn-hover": "rgba(255, 255, 255, 0.14)",
    "--color-btn-hover-text": "#ffffff",
  },
  dark: {
    "--color-page": "#0b0c0c",
    "--color-page-soft": "#111212",
    "--color-surface": "#121313",
    "--color-surface-raised": "rgba(18, 19, 19, 0.94)",
    "--color-surface-glass": "rgba(20, 21, 21, 0.62)",
    "--color-table-surface": "rgba(18, 19, 19, 0.96)",
    "--color-text": "#f4f4f2",
    "--color-text-muted": "#cfcfcb",
    "--color-text-soft": "#9a9a95",
    "--color-border": "#2e2e2c",
    "--color-border-strong": "#555652",
    "--color-primary": "#d8d9d5",
    "--color-primary-strong": "#ececea",
    "--color-primary-soft": "rgba(216, 217, 213, 0.12)",
    "--color-chrome": "#c8c9c4",
    "--color-chrome-strong": "#ececea",
    "--color-chrome-bright": "#c8c9c4",
    "--color-chrome-soft": "rgba(200, 201, 196, 0.16)",
    "--color-accent": "#d8d9d5",
    "--color-accent-red": "#d36a70",
    "--color-accent-red-soft": "rgba(159, 29, 40, 0.2)",
    "--color-accent-green": "#9db8aa",
    "--color-accent-green-soft": "rgba(157, 184, 170, 0.14)",
    "--color-shadow": "rgba(0, 0, 0, 0.62)",
    "--color-hero-overlay": "rgba(11, 12, 12, 0.72)",
    "--color-hero-fade": "rgba(11, 12, 12, 0.96)",
    "--color-navbar": "rgba(11, 12, 12, 0.96)",
    "--color-glass-border": "rgba(255, 255, 255, 0.18)",
    "--color-glass-shadow": "rgba(0, 0, 0, 0.5)",
    "--color-cta-bg": "#d8d9d5",
    "--color-cta-text": "#111210",
    "--color-btn-hover": "rgba(0, 0, 0, 0.1)",
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
