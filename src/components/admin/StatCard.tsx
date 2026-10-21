import { ADMIN_LABEL_CLASSES, ADMIN_PANEL_CLASSES } from "./styles";

interface StatCardProps {
  label: string;
  value: number;
  note?: string;
}

// Compact on purpose: the number is the content, the card only frames it.
export function StatCard({ label, value, note }: StatCardProps) {
  return (
    <div className={`${ADMIN_PANEL_CLASSES} flex flex-col gap-1 p-4`}>
      <p className={`m-0 ${ADMIN_LABEL_CLASSES}`}>{label}</p>
      <p className="m-0 text-2xl font-semibold tabular-nums text-[#18181B]">
        {value}
      </p>
      {note && <p className="m-0 text-xs text-[#71717A]">{note}</p>}
    </div>
  );
}
