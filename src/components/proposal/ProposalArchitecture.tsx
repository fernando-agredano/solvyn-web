import { useState } from "react";
import { CodeIcon } from "@/src/components/ui/icons";
import { ARCH_NODES, type ArchNodeId } from "@/src/config/proposal";
import type { ProposalFacts } from "@/src/lib/proposal";
import type { ProposalCopy } from "@/src/lib/templates";
import { SectionCard } from "./SectionCard";

interface ArchNodeButtonProps {
  nodeId: ArchNodeId;
  isSelected: boolean;
  onSelect: (id: ArchNodeId) => void;
  // "block" fills its column; "pill" is the rounded chip used for external services.
  shape: "block" | "pill";
}

function ArchNodeButton({ nodeId, isSelected, onSelect, shape }: ArchNodeButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => onSelect(nodeId)}
      className={`flex cursor-pointer items-center border text-sm text-foreground transition duration-200 hover:border-white/45 ${
        shape === "block" ? "min-h-[54px] w-full gap-2.5 rounded-xl px-3.5 text-left font-medium" : "min-h-11 rounded-full px-3.5"
      } ${isSelected ? "border-white bg-white/10 shadow-[0_0_24px_rgba(255,255,255,0.15)]" : "border-white/16 bg-white/2"}`}
    >
      {shape === "block" && <span aria-hidden="true" className={`size-2 flex-none rounded-xs ${isSelected ? "bg-white" : "bg-white/40"}`} />}
      {ARCH_NODES[nodeId].label}
    </button>
  );
}

function FlowArrow() {
  return (
    <svg width="34" height="12" viewBox="0 0 34 12" fill="none" aria-hidden="true" className="mt-5 flex-none max-[980px]:mt-0 max-[980px]:rotate-90 max-[980px]:self-center">
      <path className="flow" d="M0 6 H28" stroke="#FFFFFF" strokeWidth="1.2" />
      <path d="M26 2 L32 6 L26 10" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const DEFAULT_NODE: ArchNodeId = "web";

interface ProposalArchitectureProps {
  architecture: ProposalFacts["architecture"];
  notes: ProposalCopy["architectureNotes"];
}

export function ProposalArchitecture({ architecture, notes }: ProposalArchitectureProps) {
  const [selectedId, setSelectedId] = useState<ArchNodeId>(DEFAULT_NODE);
  const { columns, externalNodeIds } = architecture;
  const selected = ARCH_NODES[selectedId];

  return (
    <SectionCard id="architecture-heading" title="Arquitectura" description="Toca cada pieza para ver qué hace, en palabras simples." icon={<CodeIcon size={20} />}>
      <div className="flex items-center gap-3 max-[980px]:flex-col max-[980px]:items-stretch">
        {columns.map((column, index) => (
          <div key={column.id} className="flex min-w-0 flex-1 items-center gap-3 max-[980px]:flex-col max-[980px]:items-stretch">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <span className="pl-0.5 text-xs text-muted">{column.title}</span>
              {column.nodeIds.map((nodeId) => (
                <ArchNodeButton key={nodeId} nodeId={nodeId} isSelected={nodeId === selectedId} onSelect={setSelectedId} shape="block" />
              ))}
            </div>
            {index < columns.length - 1 && <FlowArrow />}
          </div>
        ))}
      </div>

      {externalNodeIds.length > 0 && (
        <div className="flex flex-wrap items-center gap-2.5 border-t border-dashed border-white/14 pt-[18px]">
          <span className="mr-1.5 text-xs text-muted">Servicios externos</span>
          {externalNodeIds.map((nodeId) => (
            <ArchNodeButton key={nodeId} nodeId={nodeId} isSelected={nodeId === selectedId} onSelect={setSelectedId} shape="pill" />
          ))}
        </div>
      )}

      <div aria-live="polite" className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/4 px-5 py-[18px] text-center">
        <span className="inline-flex items-center gap-2 text-base font-semibold">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-signal" />
          {selected.label}
        </span>
        <span className="max-w-[640px] text-sm leading-[1.6] text-text-secondary text-pretty">{notes[selectedId]}</span>
        <span className="rounded-full border border-white/12 px-2.5 py-1 text-xs text-label">Tecnología: {selected.technology}</span>
      </div>
    </SectionCard>
  );
}
