import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong bg-panel/40 px-6 py-16 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-xl border border-line bg-overlay">
        <Icon className="size-5.5 text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      {description ? <p className="mt-1 max-w-sm text-sm text-muted">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
