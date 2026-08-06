"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "tecim.theme";

const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void } | null>(null);

function systemTheme(): Theme {
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const mounted = useRef(false);

  useEffect(() => {
    let next: Theme;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      next = stored === "light" || stored === "dark" ? stored : systemTheme();
    } catch {
      next = systemTheme();
    }
    setTheme(next);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // storage unavailable — theme still applies for this session
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
