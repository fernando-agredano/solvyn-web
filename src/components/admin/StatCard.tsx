import { ADMIN_PANEL_CLASSES } from "./styles";

interface StatCardProps {
  label: string;
  value: number;
  note?: string;
}

export function StatCard({ label, value, note }: StatCardProps) {
  return (
    <div className={`${ADMIN_PANEL_CLASSES} p-5`}>
      <p className="m-0 text-sm text-label">{label}</p>
      <p className="wide m-0 mt-2 text-[32px] font-bold text-heading">
        {value}
      </p>
      {note && <p className="m-0 mt-1 text-[13px] text-muted">{note}</p>}
    </div>
  );
}
