"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export function Pagination({
  page,
  totalPages,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPage: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i += 1) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-1.5 py-5">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page <= 1}
        className="flex size-8 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:bg-white/[0.06] hover:text-ink disabled:opacity-40 disabled:pointer-events-none"
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPage(p)}
          className={cn(
            "size-8 rounded-lg border text-xs font-medium transition-colors",
            p === page
              ? "border-turquoise/40 bg-turquoise/15 text-turquoise"
              : "border-line text-muted hover:bg-white/[0.06] hover:text-ink"
          )}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPage(page + 1)}
        disabled={page >= totalPages}
        className="flex size-8 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:bg-white/[0.06] hover:text-ink disabled:opacity-40 disabled:pointer-events-none"
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
