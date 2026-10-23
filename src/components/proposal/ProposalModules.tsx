import { ProposalModuleCard } from "@/src/components/sections/ProposalModuleCard";
import { LayersIcon, SparklesIcon, ZapIcon } from "@/src/components/ui/icons";
import type { ModuleKind } from "@/src/lib/modules";
import type { ProposalFacts } from "@/src/lib/proposal";
import { SectionCard } from "./SectionCard";

const KIND_LABELS: Record<ModuleKind, string> = { core: "esencial", integration: "integración", extra: "sugerido" };
const KIND_ICONS: Record<ModuleKind, React.JSX.Element> = {
  core: <LayersIcon size={18} />,
  integration: <ZapIcon size={18} />,
  extra: <SparklesIcon size={18} />,
};

interface ProposalModulesProps {
  modules: ProposalFacts["modules"];
  onToggleModule: (module: { id: string; kind: ModuleKind }) => void;
}

export function ProposalModules({ modules, onToggleModule }: ProposalModulesProps) {
  return (
    <SectionCard
      id="modules-heading"
      title="Módulos de la solución"
      description="Activa o desactiva los opcionales para ajustar la inversión."
      icon={<LayersIcon size={20} />}
      className="gap-[22px]"
    >
      <div className="grid grid-cols-3 gap-3 max-[980px]:grid-cols-1">
        {modules.map((module) => (
          <ProposalModuleCard
            key={module.id}
            compact
            icon={KIND_ICONS[module.kind]}
            name={module.name}
            description={module.description}
            hoursLabel={`~${module.hours} h, ${KIND_LABELS[module.kind]}`}
            optional={module.optional}
            enabled={module.active}
            onToggle={() => onToggleModule({ id: module.id, kind: module.kind })}
          />
        ))}
      </div>
    </SectionCard>
  );
}
