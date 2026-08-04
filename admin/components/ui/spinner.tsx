"use client";

import { Loader2 } from "lucide-react";

export function Spinner({ label, className }: { label?: string; className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 py-12 text-muted ${className ?? ""}`}>
      <Loader2 className="size-5 animate-spin text-turquoise" />
      {label ? <span className="text-sm">{label}</span> : null}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner label="Loading…" />
    </div>
  );
}
