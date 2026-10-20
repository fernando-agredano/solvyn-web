import { LABEL_TEXT } from "@/src/lib/admin/leads/labels";
import type { LeadLabelValue } from "@/src/lib/admin/leads/filters";

// Brightness carries the temperature, not color: the hotter the lead, the brighter the badge.
const LABEL_CLASSES: Record<LeadLabelValue, string> = {
  caliente: "border-white bg-white font-semibold text-black",
  tibio: "border-white/40 bg-white/10 text-[#D4D4D4]",
  frio: "border-white/14 text-muted",
};

export function LabelBadge({ label }: { label: LeadLabelValue }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[13px] ${LABEL_CLASSES[label]}`}
    >
      {LABEL_TEXT[label]}
    </span>
  );
}
