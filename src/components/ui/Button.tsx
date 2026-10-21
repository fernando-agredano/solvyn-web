import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "sm" | "md" | "lg";

const BASE_CLASSES =
  "group inline-flex items-center justify-center gap-2 rounded-[10px] no-underline transition-colors duration-200 ease-out";

// Hover only shifts tone: no lift and no halo. The primary softens to a light gray and the secondary gains a faint fill.
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-heading font-semibold text-black hover:bg-[#E4E4E4] active:bg-[#D2D2D2]",
  secondary:
    "border border-white/[0.22] font-medium text-foreground hover:border-white/40 hover:bg-white/[0.07] active:bg-white/[0.1]",
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
  withArrow?: boolean;
  className?: string;
} & (
  | { href: string; onClick?: () => void; type?: never; disabled?: never }
  | { href?: never; onClick: () => void; type?: "button"; disabled?: boolean }
  | { href?: never; onClick?: never; type: "submit"; disabled?: boolean }
);

const DISABLED_CLASSES =
  "disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-heading";

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="flex-none transition-transform duration-200 group-hover:translate-x-0.5"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function Button({
  href,
  onClick,
  type = "button",
  disabled,
  children,
  variant = "primary",
  size = "lg",
  withArrow = false,
  className = "",
}: ButtonProps) {
  const classes = `${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`;
  const content = (
    <>
      {children}
      {withArrow && <ArrowIcon />}
    </>
  );

  if (href !== undefined) {
    return (
      <Link href={href} onClick={onClick} className={classes}>
        {content}
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
      {content}
    </button>
  );
}
