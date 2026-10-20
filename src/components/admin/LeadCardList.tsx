import Link from "next/link";
import type { LeadSummary } from "@/src/lib/admin/leads/records";
import {
  formatInvestmentRange,
  formatLeadDateTime,
  STATUS_LABELS,
} from "@/src/lib/admin/leads/labels";
import { LabelBadge } from "./LabelBadge";
import { ADMIN_PANEL_CLASSES } from "./styles";

// The phone version of LeadsTable: the same fields, one card per lead, stacked.
export function LeadCardList({ leads }: { leads: LeadSummary[] }) {
  return (
    <ul className="m-0 flex list-none flex-col gap-3 p-0 min-[860px]:hidden">
      {leads.map((lead) => (
        <li key={lead.id}>
          <Link
            href={`/admin/leads/${lead.id}`}
            className={`${ADMIN_PANEL_CLASSES} flex flex-col gap-3 p-4 no-underline transition duration-200 hover:border-white/28`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="m-0 truncate font-semibold text-heading">
                  {lead.name}
                </p>
                <p className="m-0 truncate text-[13px] text-muted">
                  {lead.email}
                </p>
              </div>
              <LabelBadge label={lead.label} />
            </div>
            <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-2 text-[14px]">
              <dt className="text-label">Puntaje</dt>
              <dd className="m-0 text-right tabular-nums text-[#D4D4D4]">
                {lead.score}
              </dd>
              <dt className="text-label">Estado</dt>
              <dd className="m-0 text-right text-[#D4D4D4]">
                {STATUS_LABELS[lead.status]}
              </dd>
              <dt className="text-label">Inversión</dt>
              <dd className="m-0 text-right tabular-nums text-[#D4D4D4]">
                {formatInvestmentRange(lead.proposal?.facts.investment ?? null)}
              </dd>
              <dt className="text-label">Fecha</dt>
              <dd className="m-0 text-right text-[#D4D4D4]">
                {formatLeadDateTime(lead.createdAt)}
              </dd>
            </dl>
          </Link>
        </li>
      ))}
    </ul>
  );
}
