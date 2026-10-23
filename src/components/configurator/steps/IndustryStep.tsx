import { INDUSTRIES } from "@/src/config/catalog";
import { useConfiguratorStore } from "@/src/lib/configurator/store";
import { BriefcaseIcon } from "@/src/components/ui/icons";
import { OptionTile } from "../fields/OptionTile";
import { TextField } from "../fields/TextField";
import { IndustryIcon } from "../option-icons";
import { StepSection } from "./StepSection";

export function IndustryStep() {
  const industry = useConfiguratorStore((state) => state.industry);
  const business = useConfiguratorStore((state) => state.business);
  const setAnswer = useConfiguratorStore((state) => state.setAnswer);

  return (
    <StepSection
      step="industry"
      title="¿De qué es tu negocio?"
      description="Con esto ajusto las preguntas y la propuesta a tu giro."
    >
      <div className="grid grid-cols-4 gap-3 max-[860px]:grid-cols-3 max-[620px]:grid-cols-2">
        {INDUSTRIES.map((option) => (
          <OptionTile
            key={option.id}
            label={option.label}
            icon={<IndustryIcon label={option.label} />}
            selected={industry === option.id}
            onSelect={() => setAnswer("industry", option.id)}
          />
        ))}
      </div>
      <TextField
        id="business-name"
        label="Nombre de tu negocio"
        type="text"
        autoComplete="organization"
        icon={<BriefcaseIcon size={16} />}
        placeholder="Ej. Clínica Vitalia"
        hint="Lo usamos para personalizar tu propuesta."
        value={business}
        onChange={(event) => setAnswer("business", event.target.value)}
      />
    </StepSection>
  );
}
