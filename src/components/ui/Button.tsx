import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type BaseProps = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
};

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>;
type LinkButtonProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-600",
  secondary:
    "border border-stone-300 bg-white text-stone-900 hover:bg-stone-50 focus-visible:ring-brand-600",
  ghost: "text-stone-700 hover:bg-stone-100 focus-visible:ring-brand-600",
};

const baseClasses =
  "inline-flex min-h-11 items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

function getButtonClasses(variant: ButtonVariant, className?: string) {
  return [baseClasses, variants[variant], className].filter(Boolean).join(" ");
}

export function Button({ children, className, variant = "primary", type = "button", ...props }: ButtonProps) {
  return (
    <button className={getButtonClasses(variant, className)} type={type} {...props}>
      {children}
    </button>
  );
}

export function LinkButton({ children, className, variant = "primary", href, ...props }: LinkButtonProps) {
  return (
    <Link className={getButtonClasses(variant, className)} href={href} {...props}>
      {children}
    </Link>
  );
}
