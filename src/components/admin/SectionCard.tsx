import type { ReactNode } from "react";
import { ADMIN_PANEL_CLASSES } from "./styles";

// A card with a small title: the unit of every panel screen. Titles stay small so the data leads.
export function SectionCard({
  title,
  headingId,
  action,
  className = "",
  children,
}: {
  title: string;
  headingId?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={headingId}
      className={`${ADMIN_PANEL_CLASSES} flex flex-col gap-4 p-5 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id={headingId} className="m-0 text-sm font-semibold text-[#18181B]">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}
