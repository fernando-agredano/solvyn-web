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
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} & (
  | { href: string; onClick?: () => void; type?: never; disabled?: never }
  | { href?: never; onClick: () => void; type?: "button"; disabled?: boolean }
  | { href?: never; onClick?: never; type: "submit"; disabled?: boolean }
);

const DISABLED_CLASSES =
  "disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0 disabled:hover:shadow-none";

export function Button({
  href,
  onClick,
  type = "button",
  disabled,
  children,
  variant = "primary",
  size = "lg",
  className = "",
}: ButtonProps) {
  const classes = `${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`;

  if (href !== undefined) {
    return (
      <Link href={href} onClick={onClick} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${classes} ${DISABLED_CLASSES} cursor-pointer`}
    >
      {children}
    </button>
  );
}
