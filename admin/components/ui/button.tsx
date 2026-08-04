import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "gold" | "ghost" | "outline" | "danger" | "subtle";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary:
    "bg-turquoise text-[#06201d] hover:bg-turquoise-deep hover:text-white shadow-[0_8px_24px_rgba(20,184,166,0.25)]",
  gold: "bg-gold text-[#1a1003] hover:bg-gold-deep hover:text-white shadow-[0_8px_24px_rgba(217,119,6,0.22)]",
  ghost:
    "bg-white/[0.04] text-ink border border-line hover:bg-white/[0.08] hover:border-line-strong",
  outline: "border border-line-strong text-ink hover:bg-white/[0.06]",
  danger: "bg-rose/15 text-rose border border-rose/30 hover:bg-rose/25",
  subtle: "bg-transparent text-muted hover:text-ink hover:bg-white/[0.05]",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[0.72rem] gap-1.5 rounded-lg",
  md: "h-9.5 px-4 text-[0.78rem] gap-2 rounded-lg",
  lg: "h-11 px-5 text-[0.8rem] gap-2 rounded-xl",
  icon: "h-9 w-9 rounded-lg justify-center",
};

type BaseProps = {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
};

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type LinkProps = BaseProps &
  React.ComponentProps<typeof Link> & {
    href: string;
  };

export type AnyButtonProps = ButtonProps | LinkProps;

const baseClass =
  "inline-flex items-center justify-center font-medium tracking-wide uppercase whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-turquoise/60 disabled:opacity-45 disabled:pointer-events-none cursor-pointer select-none";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", loading, children, disabled, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(baseClass, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : null}
      {children}
    </button>
  );
});

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  children,
  ...rest
}: LinkProps) {
  return (
    <Link
      className={cn(baseClass, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </Link>
  );
}
