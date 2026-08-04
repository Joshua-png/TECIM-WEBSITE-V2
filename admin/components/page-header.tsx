export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow ? (
          <p className="mb-1 text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-gold">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-serif text-3xl font-medium leading-tight text-ink">{title}</h2>
        {description ? <p className="mt-1.5 max-w-xl text-sm text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2.5">{actions}</div> : null}
    </div>
  );
}
