import type { ReactNode } from "react";
import { ADMIN_LABEL_CLASSES, ADMIN_PANEL_CLASSES } from "./styles";

interface StatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  note?: string;
}

// Compact on purpose: the number is the content, the card only frames it.
export function StatCard({ label, value, icon, note }: StatCardProps) {
  return (
    <div className={`${ADMIN_PANEL_CLASSES} flex flex-col gap-3 p-4`}>
      <div className="flex items-center justify-between gap-3">
        <p className={`m-0 ${ADMIN_LABEL_CLASSES}`}>{label}</p>
        <span className="flex size-9 flex-none items-center justify-center rounded-lg bg-[#F4F4F5] text-[#18181B]">
          {icon}
        </span>
      </div>
      <div>
        <p className="m-0 text-2xl font-semibold tabular-nums text-[#18181B]">
          {value}
        </p>
        {note && <p className="m-0 mt-1 text-xs text-[#71717A]">{note}</p>}
      </div>
    </div>
  );
}
