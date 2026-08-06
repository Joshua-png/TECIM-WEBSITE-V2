import type { ContentStatus } from "@/lib/types";
import { cn } from "@/lib/cn";

export function StatusPill({ status }: { status: ContentStatus }) {
  const published = status === "published";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider",
        published
          ? "border-turquoise/30 bg-turquoise/10 text-turquoise"
          : "border-gold/30 bg-gold/10 text-gold"
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          published ? "bg-turquoise live-dot" : "bg-gold"
        )}
      />
      {published ? "Published" : "Draft"}
    </span>
  );
}

export function Badge({ children, tone = "neutral", className }: {
  children: React.ReactNode;
  tone?: "neutral" | "turquoise" | "gold" | "rose" | "burgundy";
  className?: string;
}) {
  const tones = {
    neutral: "bg-overlay text-muted border-line",
    turquoise: "bg-turquoise/10 text-turquoise border-turquoise/25",
    gold: "bg-gold/10 text-gold border-gold/25",
    rose: "bg-rose/10 text-rose border-rose/25",
    burgundy: "bg-burgundy/15 text-rose border-burgundy/30",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.68rem] font-medium tracking-wide",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
