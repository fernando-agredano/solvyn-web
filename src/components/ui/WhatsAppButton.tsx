"use client";

import type { ReactNode } from "react";
import { Button } from "@/src/components/ui/Button";
import { track } from "@/src/lib/analytics";

interface WhatsAppButtonProps {
  href: string;
  variant?: "primary" | "secondary";
  className?: string;
  children: ReactNode;
}

// A client component so the click can be tracked from server-rendered sections, which can't pass handlers.
export function WhatsAppButton({
  href,
  variant,
  className,
  children,
}: WhatsAppButtonProps) {
  return (
    <Button
      href={href}
      variant={variant}
      className={className}
      onClick={() => track("whatsapp_clicked")}
    >
      {children}
    </Button>
  );
}
