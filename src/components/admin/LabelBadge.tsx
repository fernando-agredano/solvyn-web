import { LABEL_TEXT } from "@/src/lib/admin/leads/labels";
import type { LeadLabelValue } from "@/src/lib/admin/leads/filters";

// Darkness carries the temperature, not color: the hotter the lead, the darker the badge.
const LABEL_CLASSES: Record<LeadLabelValue, string> = {
  caliente: "bg-[#18181B] text-white",
  tibio: "bg-[#E4E4E7] text-[#27272A]",
  frio: "border border-[#E4E4E7] bg-[#F4F4F5] text-[#52525B]",
};

export function LabelBadge({ label }: { label: LeadLabelValue }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${LABEL_CLASSES[label]}`}
    >
      {LABEL_TEXT[label]}
    </span>
  );
}
