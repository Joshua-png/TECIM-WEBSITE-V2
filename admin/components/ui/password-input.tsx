"use client";

import { Eye, EyeOff, KeyRound } from "lucide-react";
import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { controlClass } from "@/components/ui/field";

type PasswordInputProps = InputHTMLAttributes<HTMLInputElement> & {
  showKeyIcon?: boolean;
};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ className, showKeyIcon = true, ...rest }, ref) {
    const [visible, setVisible] = useState(false);
    return (
      <div className="relative">
        {showKeyIcon ? (
          <KeyRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
        ) : null}
        <input
          ref={ref}
          type={visible ? "text" : "password"}
          className={cn(controlClass, "h-9.5", showKeyIcon && "pl-9", "pr-10", className)}
          {...rest}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          title={visible ? "Hide password" : "Show password"}
          className="absolute right-1.5 top-1/2 inline-flex size-6.5 -translate-y-1/2 items-center justify-center rounded-md text-faint transition-colors hover:text-ink"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    );
  }
);
