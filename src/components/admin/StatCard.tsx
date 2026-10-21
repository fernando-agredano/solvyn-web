import type { ReactNode } from "react";
import { ADMIN_LABEL_CLASSES, ADMIN_PANEL_CLASSES } from "./styles";

interface StatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  note?: string;
}

// Horizontal on purpose: icon on the left, label over the number on the right. The card stays about 75px tall,
// so the four of them take one short row instead of a block of the screen.
export function StatCard({ label, value, icon, note }: StatCardProps) {
  return (
    <div
      className={`${ADMIN_PANEL_CLASSES} flex items-center gap-3 px-4 py-3.5`}
    >
      <span className="flex size-10 flex-none items-center justify-center rounded-lg bg-[#F4F4F5] text-[#18181B]">
        {icon}
      </span>
      <div className="min-w-0">
        <p className={`m-0 truncate ${ADMIN_LABEL_CLASSES}`}>{label}</p>
        <p className="m-0 mt-0.5 text-2xl leading-none font-semibold tabular-nums text-[#18181B]">
          {value}
        </p>
        {note && <p className="m-0 mt-1 text-xs text-[#71717A]">{note}</p>}
      </div>
    </div>
  );
}
