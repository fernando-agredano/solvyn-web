import type { LeadStatus } from "@/src/lib/admin/leads/filters";
import { STATUS_LABELS } from "@/src/lib/admin/leads/labels";

// The dot fades as the lead leaves the funnel. Green is reserved for "active": a scheduled meeting.
const DOT_CLASSES: Record<LeadStatus, string> = {
  nuevo: "bg-[#18181B]",
  contactado: "bg-[#52525B]",
  reunion: "bg-[#059669]",
  propuesta_enviada: "bg-[#71717A]",
  cerrado: "bg-[#A1A1AA]",
  descartado: "bg-[#D4D4D8]",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] bg-white px-2.5 py-0.5 text-xs font-medium whitespace-nowrap text-[#3F3F46]">
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full ${DOT_CLASSES[status]}`}
      />
      {STATUS_LABELS[status]}
    </span>
  );
}
