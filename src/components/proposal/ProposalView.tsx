import type { Proposal } from "@/src/hooks/useProposal";
import { ProposalArchitecture } from "./ProposalArchitecture";
import { ProposalHeader } from "./ProposalHeader";
import { ProposalKpis } from "./ProposalKpis";
import { ProposalModules } from "./ProposalModules";

export function ProposalView({ proposal }: { proposal: Proposal }) {
  const { facts, copy } = proposal;
  return (
    <main id="contenido" className="step-in mx-auto flex max-w-[1180px] flex-col gap-7 px-6 pt-14 pb-[120px]">
      <ProposalHeader businessName={facts.businessName} title={copy.title} summary={copy.summary} />
      <ProposalKpis facts={facts} />
      <ProposalModules modules={facts.modules} />
      <ProposalArchitecture architecture={facts.architecture} notes={copy.architectureNotes} />
    </main>
  );
}
