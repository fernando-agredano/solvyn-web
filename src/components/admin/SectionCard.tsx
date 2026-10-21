import type { ReactNode } from "react";
import { ADMIN_PANEL_CLASSES } from "./styles";

// A card with a small title: the unit of every panel screen. Titles stay small so the data leads.
export function SectionCard({
  title,
  headingId,
  icon,
  action,
  className = "",
  children,
}: {
  title: string;
  headingId?: string;
  icon?: ReactNode;
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
        <div className="flex items-center gap-2.5">
          {icon && (
            <span className="flex size-8 flex-none items-center justify-center rounded-lg bg-[#F4F4F5] text-[#18181B]">
              {icon}
            </span>
          )}
          <h2
            id={headingId}
            className="m-0 text-sm font-semibold text-[#18181B]"
          >
            {title}
          </h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
