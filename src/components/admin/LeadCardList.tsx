import Link from "next/link";
import type { LeadSummary } from "@/src/lib/admin/leads/records";
import {
  formatInvestmentRange,
  formatLeadDateTime,
} from "@/src/lib/admin/leads/labels";
import { LabelBadge } from "./LabelBadge";
import { LeadAvatar } from "./LeadAvatar";
import { ScoreBar } from "./ScoreBar";
import { StatusBadge } from "./StatusBadge";

// The phone version of LeadsTable: the same fields, one card per lead, stacked inside the page's card.
export function LeadCardList({ leads }: { leads: LeadSummary[] }) {
  return (
    <ul className="m-0 flex list-none flex-col gap-3 p-4 min-[860px]:hidden">
      {leads.map((lead) => (
        <li key={lead.id}>
          <Link
            href={`/admin/leads/${lead.id}`}
            className="flex flex-col gap-3 rounded-xl border border-[#E4E4E7] bg-white p-4 no-underline transition-colors duration-150 hover:border-[#A1A1AA]"
          >
            <div className="flex items-center gap-3">
              <LeadAvatar name={lead.name} />
              <div className="min-w-0 flex-1">
                <p className="m-0 truncate text-sm font-medium text-[#18181B]">
                  {lead.name}
                </p>
                <p className="m-0 truncate text-xs text-[#71717A]">
                  {lead.email}
                </p>
              </div>
              <LabelBadge label={lead.label} />
            </div>
            <dl className="m-0 grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2.5 border-t border-[#F4F4F5] pt-3 text-sm">
              <dt className="text-[#71717A]">Puntaje</dt>
              <dd className="m-0 justify-self-end">
                <ScoreBar score={lead.score} />
              </dd>
              <dt className="text-[#71717A]">Estado</dt>
              <dd className="m-0 justify-self-end">
                <StatusBadge status={lead.status} />
              </dd>
              <dt className="text-[#71717A]">Inversión</dt>
              <dd className="m-0 justify-self-end font-medium tabular-nums text-[#18181B]">
                {formatInvestmentRange(lead.proposal?.facts.investment ?? null)}
              </dd>
              <dt className="text-[#71717A]">Registro</dt>
              <dd className="m-0 justify-self-end text-[#52525B]">
                {formatLeadDateTime(lead.createdAt)}
              </dd>
            </dl>
          </Link>
        </li>
      ))}
    </ul>
  );
}
