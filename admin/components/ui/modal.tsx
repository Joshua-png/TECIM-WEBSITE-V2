"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/cn";

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-8">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "rise relative my-auto w-full rounded-2xl border border-line-strong bg-panel shadow-[0_30px_80px_rgba(0,0,0,0.55)]",
          wide ? "max-w-3xl" : "max-w-lg"
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-ink">{title}</h2>
            {subtitle ? <p className="mt-0.5 text-xs text-muted">{subtitle}</p> : null}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-white/[0.06] hover:text-ink"
            aria-label="Close"
          >
            <X className="size-4.5" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer ? (
          <div className="flex items-center justify-end gap-2.5 border-t border-line px-6 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
