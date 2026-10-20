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
  "Negocio",
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
      <table className="w-full border-collapse text-left text-[15px]">
        <thead>
          <tr className="border-b border-border-subtle text-sm text-label">
            {HEADERS.map((header) => (
              <th key={header} scope="col" className="px-4 py-3 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr
              key={lead.id}
              className="border-b border-border-subtle last:border-0 hover:bg-white/[0.03]"
            >
              <td className="px-4 py-3">
                <Link
                  href={`/admin/leads/${lead.id}`}
                  className="font-semibold text-heading no-underline hover:underline"
                >
                  {lead.name}
                </Link>
                <span className="block text-[13px] text-muted">
                  {lead.email}
                </span>
              </td>
              <td className="px-4 py-3 text-[#D4D4D4]">
                {lead.proposal?.facts.industryLabel ?? "—"}
              </td>
              <td className="px-4 py-3">
                <LabelBadge label={lead.label} />
              </td>
              <td className="px-4 py-3 tabular-nums text-[#D4D4D4]">
                {lead.score}
              </td>
              <td className="px-4 py-3 text-[#D4D4D4]">
                {STATUS_LABELS[lead.status]}
              </td>
              <td className="px-4 py-3 whitespace-nowrap tabular-nums text-[#D4D4D4]">
                {formatInvestmentRange(lead.proposal?.facts.investment ?? null)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-[#D4D4D4]">
                {formatLeadDateTime(lead.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
