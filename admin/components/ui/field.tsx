"use client";

import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const controlClass =
  "w-full rounded-lg bg-white/[0.03] border border-line px-3.5 text-sm text-ink placeholder:text-faint outline-none transition-colors focus:border-turquoise/70 focus:ring-2 focus:ring-turquoise/15 disabled:opacity-50 disabled:pointer-events-none";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...rest }, ref) {
    return <input ref={ref} className={cn(controlClass, "h-9.5", className)} {...rest} />;
  }
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...rest }, ref) {
    return <textarea ref={ref} className={cn(controlClass, "py-2.5 min-h-24 resize-y", className)} {...rest} />;
  }
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...rest }, ref) {
    return (
      <select ref={ref} className={cn(controlClass, "h-9.5 pr-8 appearance-none", className)} {...rest}>
        {children}
      </select>
    );
  }
);

export function Field({
  label,
  hint,
  error,
  required,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-[0.72rem] font-medium uppercase tracking-wider text-muted">
          {label}
          {required ? <span className="ml-0.5 text-turquoise">*</span> : null}
        </span>
        {hint ? <span className="text-[0.68rem] text-faint">{hint}</span> : null}
      </span>
      {children}
      {error ? <span className="mt-1.5 block text-[0.75rem] text-rose">{error}</span> : null}
    </label>
  );
}
