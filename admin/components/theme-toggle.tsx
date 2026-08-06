"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={
        className ??
        "inline-flex size-9 items-center justify-center rounded-lg border border-line bg-panel text-muted transition-colors hover:border-line-strong hover:text-ink"
      }
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
