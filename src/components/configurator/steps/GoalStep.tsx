import { GOALS } from "@/src/config/catalog";
import { OTHER_GOAL_ID } from "@/src/config/configurator-options";
import { useConfiguratorStore } from "@/src/lib/configurator/store";
import { OptionCard } from "../fields/OptionCard";
import { TextAreaField } from "../fields/TextField";
import { StepSection } from "./StepSection";

export function GoalStep() {
  const goals = useConfiguratorStore((state) => state.goals);
  const otherGoal = useConfiguratorStore((state) => state.otherGoal);
  const toggleItem = useConfiguratorStore((state) => state.toggleItem);
  const setAnswer = useConfiguratorStore((state) => state.setAnswer);

  return (
    <StepSection
      step="goal"
      title="¿Qué quieres lograr?"
      description="Elige hasta tres. No necesitas saber qué tecnología usar; eso lo resolvemos nosotros."
    >
      <div className="grid grid-cols-2 gap-3 max-[620px]:grid-cols-1">
        {GOALS.map((goal) => (
          <OptionCard
            key={goal.id}
            indicator="checkbox"
            label={goal.label}
            description={goal.description}
            selected={goals.includes(goal.id)}
            onSelect={() => toggleItem("goals", goal.id)}
          />
        ))}
      </div>
      {goals.includes(OTHER_GOAL_ID) && (
        <div className="step-in">
          <TextAreaField
            id="other-goal"
            label="Cuéntame tu idea con tus palabras"
            rows={4}
            required
            value={otherGoal}
            onChange={(event) => setAnswer("otherGoal", event.target.value)}
            placeholder="Ej. Quiero que mis vendedores registren visitas a clientes desde el celular y yo vea un resumen diario."
          />
        </div>
      )}
    </StepSection>
  );
}
