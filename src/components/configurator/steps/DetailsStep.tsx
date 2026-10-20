import { INTEGRATIONS } from "@/src/config/catalog";
import { BUDGET_OPTIONS, PLATFORM_OPTIONS, URGENCY_OPTIONS, USER_OPTIONS } from "@/src/config/configurator-options";
import { TEAM_SIZES } from "@/src/config/pricing";
import { useConfiguratorStore } from "@/src/lib/configurator/store";
import { ChoicePill } from "../fields/ChoicePill";
import { FieldGroup } from "../fields/FieldGroup";
import { OptionRow } from "../fields/OptionRow";
import { SegmentedControl } from "../fields/SegmentedControl";
import { StepSection } from "./StepSection";

export function DetailsStep() {
  const users = useConfiguratorStore((state) => state.users);
  const size = useConfiguratorStore((state) => state.size);
  const platform = useConfiguratorStore((state) => state.platform);
  const integrations = useConfiguratorStore((state) => state.integrations);
  const urgency = useConfiguratorStore((state) => state.urgency);
  const budget = useConfiguratorStore((state) => state.budget);
  const toggleItem = useConfiguratorStore((state) => state.toggleItem);
  const setAnswer = useConfiguratorStore((state) => state.setAnswer);

  return (
    <StepSection step="details" title="Unos detalles más" description="Mira cómo tu propuesta se ajusta con cada respuesta.">
      <div className="flex flex-col gap-9">
        <FieldGroup legend="¿Quiénes lo usarán?">
          <div className="flex flex-wrap gap-2.5">
            {USER_OPTIONS.map((option) => (
              <ChoicePill key={option.id} label={option.label} selected={users.includes(option.id)} onSelect={() => toggleItem("users", option.id)} />
            ))}
          </div>
        </FieldGroup>

        <FieldGroup legend="¿Cuántas personas en total?">
          <SegmentedControl options={TEAM_SIZES} value={size} onChange={(id) => setAnswer("size", id)} />
        </FieldGroup>

        <FieldGroup legend="¿Dónde se usará?">
          <SegmentedControl options={PLATFORM_OPTIONS} value={platform} onChange={(id) => setAnswer("platform", id)} />
        </FieldGroup>

        <FieldGroup legend="¿Con qué debe conectarse?" hint="Opcional. Elige todo lo que aplique.">
          <div className="flex flex-wrap gap-2.5">
            {INTEGRATIONS.map((integration) => (
              <ChoicePill
                key={integration.id}
                label={integration.name}
                selected={integrations.includes(integration.id)}
                onSelect={() => toggleItem("integrations", integration.id)}
              />
            ))}
          </div>
        </FieldGroup>

        <div className="grid grid-cols-2 gap-6 max-[980px]:grid-cols-1">
          <FieldGroup legend="¿Para cuándo?">
            <div className="flex flex-col gap-2.5">
              {URGENCY_OPTIONS.map((option) => (
                <OptionRow key={option.id} label={option.label} selected={urgency === option.id} onSelect={() => setAnswer("urgency", option.id)} />
              ))}
            </div>
          </FieldGroup>
          <FieldGroup legend="Presupuesto aproximado">
            <div className="flex flex-col gap-2.5">
              {BUDGET_OPTIONS.map((option) => (
                <OptionRow key={option.id} label={option.label} selected={budget === option.id} onSelect={() => setAnswer("budget", option.id)} />
              ))}
            </div>
          </FieldGroup>
        </div>
      </div>
    </StepSection>
  );
}
