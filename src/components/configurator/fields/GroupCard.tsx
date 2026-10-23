import type { ReactNode } from "react";

interface GroupCardProps {
  title: string;
  icon: ReactNode;
  className?: string;
  children: ReactNode;
}

// A question with its options, framed as a card with an icon. The visible title is also the group's name.
export function GroupCard({ title, icon, className = "", children }: GroupCardProps) {
  return (
    <fieldset className={`m-0 flex min-w-0 flex-col justify-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3 lg:[@media(max-height:780px)]:gap-2 ${className}`}>
      <legend className="sr-only">{title}</legend>
      <div className="flex items-center justify-center gap-2 text-center">
        <span
          aria-hidden="true"
          className="flex size-8 flex-none items-center justify-center rounded-lg border border-white/12 bg-white/[0.05] text-white"
        >
          {icon}
        </span>
        <span className="text-sm font-semibold">{title}</span>
      </div>
      {children}
    </fieldset>
  );
}
