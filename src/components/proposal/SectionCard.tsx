import type { ReactNode } from "react";

interface SectionCardProps {
  id: string;
  title: string;
  description?: string;
  // Extra content aligned to the right of the heading (e.g. preview controls).
  actions?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function SectionCard({ id, title, description, actions, className = "gap-6", children }: SectionCardProps) {
  return (
    <section aria-labelledby={id} className={`flex min-w-0 flex-col rounded-[18px] border border-white/10 p-7 ${className}`}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h2 id={id} className="semi m-0 text-2xl font-semibold">
            {title}
          </h2>
          {description && <span className="text-[15px] text-text-secondary">{description}</span>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}
