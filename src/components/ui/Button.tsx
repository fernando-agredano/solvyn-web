import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "sm" | "md" | "lg";

const BASE_CLASSES =
  "inline-flex items-center justify-center rounded-[10px] no-underline transition duration-200 ease-[ease]";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-heading font-semibold text-black hover:-translate-y-px hover:shadow-[0_0_0_1px_#fff,0_8px_32px_rgba(255,255,255,0.22)]",
  secondary:
    "border border-white/[0.22] font-medium text-foreground hover:border-white/50 hover:bg-white/[0.04]",
};

// Every size keeps the 44px minimum touch target.
const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "min-h-12 px-5 text-[15px]",
  md: "min-h-11 px-[18px] text-[15px]",
  lg: "min-h-[52px] px-[26px] text-base",
};

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

export function Button({ href, children, variant = "primary", size = "lg", className = "" }: ButtonProps) {
  return (
    <Link
      href={href}
      className={`${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
    >
      {children}
    </Link>
  );
}
