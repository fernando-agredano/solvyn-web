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

const HEADERS = [
  "Lead",
  "Industria",
  "Etiqueta",
  "Puntaje",
  "Estado",
  "Inversión estimada",
  "Registro",
];

// Desktop and tablet only: phones get LeadCardList instead. It carries no card of its own: the page frames it.
export function LeadsTable({ leads }: { leads: LeadSummary[] }) {
  return (
    <div className="hidden overflow-x-auto min-[860px]:block">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[#E4E4E7] bg-[#FAFAFA] text-xs font-medium text-[#71717A]">
            {HEADERS.map((header) => (
              <th
                key={header}
                scope="col"
                className="px-4 py-2.5 font-medium whitespace-nowrap first:pl-5 last:pr-5"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr
              key={lead.id}
              className="border-b border-[#F4F4F5] transition-colors duration-150 last:border-0 hover:bg-[#FAFAFA]"
            >
              <td className="px-4 py-3 first:pl-5">
                <div className="flex items-center gap-3">
                  <LeadAvatar name={lead.name} />
                  <div className="min-w-0">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="block truncate font-medium text-[#18181B] no-underline hover:underline"
                    >
                      {lead.name}
                    </Link>
                    <span className="block truncate text-xs text-[#71717A]">
                      {lead.email}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-[#52525B]">
                {lead.proposal?.facts.industryLabel ?? "—"}
              </td>
              <td className="px-4 py-3">
                <LabelBadge label={lead.label} />
              </td>
              <td className="px-4 py-3">
                <ScoreBar score={lead.score} />
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={lead.status} />
              </td>
              <td className="px-4 py-3 font-medium whitespace-nowrap tabular-nums text-[#18181B]">
                {formatInvestmentRange(lead.proposal?.facts.investment ?? null)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-[#52525B] last:pr-5">
                {formatLeadDateTime(lead.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
