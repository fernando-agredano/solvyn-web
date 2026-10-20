"use client";

import { ProposalArchitecture } from "./ProposalArchitecture";
import { ProposalCta } from "./ProposalCta";
import { ProposalHeader } from "./ProposalHeader";
import { ProposalKpis } from "./ProposalKpis";
import { ProposalModules } from "./ProposalModules";
import { ProposalPhases } from "./ProposalPhases";
import { ProposalTechnologies } from "./ProposalTechnologies";
import type { ModuleKind } from "@/src/lib/modules";
import type { ProposalFacts } from "@/src/lib/proposal";
import type { ProposalCopy } from "@/src/lib/templates";
import { SolutionPreview } from "./preview/SolutionPreview";

interface ProposalViewProps {
  facts: ProposalFacts;
  copy: ProposalCopy;
  onToggleModule: (module: { id: string; kind: ModuleKind }) => void;
}

export function ProposalView({ facts, copy, onToggleModule }: ProposalViewProps) {
  return (
    <main id="contenido" className="step-in mx-auto flex max-w-[1180px] flex-col gap-7 px-6 pt-14 pb-[120px]">
      <ProposalHeader businessName={facts.businessName} title={copy.title} summary={copy.summary} />
      <ProposalKpis facts={facts} />
      <ProposalModules modules={facts.modules} onToggleModule={onToggleModule} />
      <ProposalArchitecture architecture={facts.architecture} notes={copy.architectureNotes} />
      <SolutionPreview facts={facts} />
      <div className="grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-5 max-[980px]:grid-cols-1">
        <ProposalPhases phases={facts.phases} />
        <ProposalTechnologies technologyIds={facts.technologies} notes={copy.technologyNotes} />
      </div>
      <ProposalCta />
    </main>
  );
}
