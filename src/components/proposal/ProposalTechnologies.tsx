import { CodeIcon } from "@/src/components/ui/icons";
import { TECHNOLOGIES, type TechId } from "@/src/config/proposal";
import type { ProposalCopy } from "@/src/lib/templates";
import { SectionCard } from "./SectionCard";

interface ProposalTechnologiesProps {
  technologyIds: TechId[];
  notes: ProposalCopy["technologyNotes"];
}

export function ProposalTechnologies({ technologyIds, notes }: ProposalTechnologiesProps) {
  return (
    <SectionCard id="technologies-heading" title="Tecnologías" description="Herramientas probadas, elegidas para tu caso." icon={<CodeIcon size={20} />} className="gap-5">
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {technologyIds.map((id) => (
          <li key={id} className="flex flex-col gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <span className="flex items-center gap-2 text-[15px] font-semibold">
              <span aria-hidden="true" className="size-1.5 flex-none rounded-full bg-signal" />
              {TECHNOLOGIES[id].name}
            </span>
            <span className="text-[13px] leading-normal text-text-secondary">{notes[id]}</span>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
