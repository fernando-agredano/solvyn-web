import { ProposalModuleCard } from "@/src/components/sections/ProposalModuleCard";
import { useConfiguratorStore } from "@/src/lib/configurator/store";
import type { ModuleKind } from "@/src/lib/modules";
import type { ProposalFacts } from "@/src/lib/proposal";
import { SectionCard } from "./SectionCard";

const KIND_LABELS: Record<ModuleKind, string> = { core: "esencial", integration: "integración", extra: "sugerido" };

export function ProposalModules({ modules }: { modules: ProposalFacts["modules"] }) {
  const toggleModule = useConfiguratorStore((state) => state.toggleModule);

  return (
    <SectionCard id="modules-heading" title="Módulos de la solución" description="Activa o desactiva los opcionales para ajustar la inversión." className="gap-[22px]">
      <div className="grid grid-cols-3 gap-3 max-[980px]:grid-cols-1">
        {modules.map((module) => (
          <ProposalModuleCard
            key={module.id}
            compact
            name={module.name}
            description={module.description}
            hoursLabel={`~${module.hours} h, ${KIND_LABELS[module.kind]}`}
            optional={module.optional}
            enabled={module.active}
            onToggle={() => toggleModule({ id: module.id, kind: module.kind })}
          />
        ))}
      </div>
    </SectionCard>
  );
}
