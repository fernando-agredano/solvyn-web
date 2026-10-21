import Link from "next/link";
import type { LeadSummary } from "@/src/lib/admin/leads/records";
import {
  formatInvestmentRange,
  formatLeadDateTime,
  STATUS_LABELS,
} from "@/src/lib/admin/leads/labels";
import { LabelBadge } from "./LabelBadge";
import { ADMIN_PANEL_CLASSES } from "./styles";

const HEADERS = [
  "Nombre",
  "Industria",
  "Etiqueta",
  "Puntaje",
  "Estado",
  "Inversión estimada",
  "Fecha",
];

// Desktop and tablet only: phones get LeadCardList instead (same breakpoint as the configurator's header).
export function LeadsTable({ leads }: { leads: LeadSummary[] }) {
  return (
    <div
      className={`${ADMIN_PANEL_CLASSES} hidden overflow-x-auto min-[860px]:block`}
    >
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[#E4E4E7] bg-[#FAFAFA] text-xs font-medium text-[#71717A]">
            {HEADERS.map((header) => (
              <th key={header} scope="col" className="px-4 py-2.5 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr
              key={lead.id}
              className="border-b border-[#F4F4F5] last:border-0 hover:bg-[#FAFAFA]"
            >
              <td className="px-4 py-2.5">
                <Link
                  href={`/admin/leads/${lead.id}`}
                  className="font-medium text-[#18181B] no-underline hover:underline"
                >
                  {lead.name}
                </Link>
                <span className="block text-xs text-[#71717A]">
                  {lead.email}
                </span>
              </td>
              <td className="px-4 py-2.5 text-[#52525B]">
                {lead.proposal?.facts.industryLabel ?? "—"}
              </td>
              <td className="px-4 py-2.5">
                <LabelBadge label={lead.label} />
              </td>
              <td className="px-4 py-2.5 tabular-nums text-[#52525B]">
                {lead.score}
              </td>
              <td className="px-4 py-2.5 text-[#52525B]">
                {STATUS_LABELS[lead.status]}
              </td>
              <td className="whitespace-nowrap px-4 py-2.5 tabular-nums text-[#52525B]">
                {formatInvestmentRange(lead.proposal?.facts.investment ?? null)}
              </td>
              <td className="whitespace-nowrap px-4 py-2.5 text-[#52525B]">
                {formatLeadDateTime(lead.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
