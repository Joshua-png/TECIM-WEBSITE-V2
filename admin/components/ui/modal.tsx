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
  scrollBody,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
  scrollBody?: boolean;
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
        className="fixed inset-0 bg-scrim backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "rise relative my-auto w-full rounded-2xl border border-line-strong bg-panel shadow-modal",
          wide ? "max-w-3xl" : "max-w-lg",
          scrollBody && "flex max-h-[calc(100vh-4rem)] flex-col"
        )}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-ink">{title}</h2>
            {subtitle ? <p className="mt-0.5 text-xs text-muted">{subtitle}</p> : null}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-overlay-strong hover:text-ink"
            aria-label="Close"
          >
            <X className="size-4.5" />
          </button>
        </div>
        <div className={cn("px-6 py-5", scrollBody && "overflow-y-auto")}>{children}</div>
        {footer ? (
          <div
            className={cn(
              "flex items-center justify-end gap-2.5 border-t border-line px-6 py-4",
              scrollBody && "shrink-0"
            )}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
