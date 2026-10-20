import { INDUSTRIES } from "@/src/config/catalog";
import { useConfiguratorStore } from "@/src/lib/configurator/store";
import { OptionCard } from "../fields/OptionCard";
import { TextField } from "../fields/TextField";
import { StepSection } from "./StepSection";

export function IndustryStep() {
  const industry = useConfiguratorStore((state) => state.industry);
  const business = useConfiguratorStore((state) => state.business);
  const setAnswer = useConfiguratorStore((state) => state.setAnswer);

  return (
    <StepSection step="industry" title="¿De qué es tu negocio?" description="Con esto ajusto las preguntas y la propuesta a tu giro.">
      <div className="grid grid-cols-2 gap-3 max-[620px]:grid-cols-1">
        {INDUSTRIES.map((option) => (
          <OptionCard
            key={option.id}
            indicator="radio"
            label={option.label}
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
        placeholder="Ej. Clínica Vitalia"
        hint="Lo usamos para personalizar la vista previa."
        value={business}
        onChange={(event) => setAnswer("business", event.target.value)}
      />
    </StepSection>
  );
}
