import type { ReactNode } from "react";

interface SectionCardProps {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  // Extra content centered under the heading (e.g. preview controls).
  actions?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function SectionCard({ id, title, description, icon, actions, className = "gap-6", children }: SectionCardProps) {
  return (
    <section
      aria-labelledby={id}
      className={`flex min-w-0 flex-col rounded-2xl border border-white/10 bg-linear-to-b from-white/[0.035] to-transparent p-5 sm:p-7 ${className}`}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        {icon && (
          <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-xl border border-white/12 bg-white/[0.05] text-white">
            {icon}
          </span>
        )}
        <div className="flex flex-col gap-1.5">
          <h2 id={id} className="m-0 text-[clamp(1.25rem,1.8vw,1.5rem)] leading-tight font-semibold tracking-[-0.01em] text-balance">
            {title}
          </h2>
          {description && <span className="text-sm text-text-secondary">{description}</span>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}
