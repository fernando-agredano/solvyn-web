import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary";

const BASE_CLASSES =
  "inline-flex min-h-10 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-[#18181B] text-white hover:bg-[#27272A]",
  secondary:
    "border border-[#D4D4D8] bg-white text-[#18181B] hover:bg-[#F4F4F5]",
};

interface AdminButtonProps {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}

export function AdminButton({
  children,
  href,
  variant = "primary",
  type = "button",
  disabled,
  className = "",
}: AdminButtonProps) {
  const classes = `${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
