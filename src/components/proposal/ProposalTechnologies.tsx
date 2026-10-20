import { TECHNOLOGIES, type TechId } from "@/src/config/proposal";
import type { ProposalCopy } from "@/src/lib/templates";
import { SectionCard } from "./SectionCard";

interface ProposalTechnologiesProps {
  technologyIds: TechId[];
  notes: ProposalCopy["technologyNotes"];
}

export function ProposalTechnologies({ technologyIds, notes }: ProposalTechnologiesProps) {
  return (
    <SectionCard id="technologies-heading" title="Tecnologías" className="gap-[18px]">
      {technologyIds.map((id) => (
        <div key={id} className="flex flex-col gap-[3px] border-b border-white/6 pb-3.5">
          <span className="semi text-[15px] font-semibold">{TECHNOLOGIES[id].name}</span>
          <span className="text-sm text-text-secondary">{notes[id]}</span>
        </div>
      ))}
    </SectionCard>
  );
}
