import { cn } from "@/lib/cn";

export function Card({
  children,
  className,
  title,
  description,
  actions,
}: {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-line bg-panel",
        className
      )}
    >
      {title ? (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h3 className="font-serif text-lg font-semibold text-ink">{title}</h3>
            {description ? <p className="mt-0.5 text-xs text-muted">{description}</p> : null}
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-5 py-5", className)}>{children}</div>;
}
