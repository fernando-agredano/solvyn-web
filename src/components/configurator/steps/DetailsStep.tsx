import { INTEGRATIONS } from "@/src/config/catalog";
import { BUDGET_OPTIONS, PLATFORM_OPTIONS, URGENCY_OPTIONS, USER_OPTIONS } from "@/src/config/configurator-options";
import { TEAM_SIZES } from "@/src/config/pricing";
import { CalendarIcon, LayersIcon, MonitorIcon, UsersIcon, WalletIcon, ZapIcon } from "@/src/components/ui/icons";
import { useConfiguratorStore } from "@/src/lib/configurator/store";
import { ChoicePill } from "../fields/ChoicePill";
import { GroupCard } from "../fields/GroupCard";
import { SegmentedControl } from "../fields/SegmentedControl";
import { StepSection } from "./StepSection";

const PILLS_CLASSES = "flex flex-wrap justify-center gap-1.5";

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
      <div className="grid content-start gap-2.5 min-[860px]:grid-cols-2 min-[1200px]:grid-cols-6">
          <GroupCard title="¿Quiénes lo usarán?" icon={<UsersIcon size={16} />} className="min-[1200px]:col-span-2">
            <div className={PILLS_CLASSES}>
              {USER_OPTIONS.map((option) => (
                <ChoicePill key={option.id} label={option.label} selected={users.includes(option.id)} onSelect={() => toggleItem("users", option.id)} />
              ))}
            </div>
          </GroupCard>
          <GroupCard title="¿Cuántas personas en total?" icon={<LayersIcon size={16} />} className="min-[1200px]:col-span-2">
            <SegmentedControl options={TEAM_SIZES} value={size} onChange={(id) => setAnswer("size", id)} label="Cuántas personas en total" compact />
          </GroupCard>
          <GroupCard title="¿Dónde se usará?" icon={<MonitorIcon size={16} />} className="min-[1200px]:col-span-2">
            <div className={PILLS_CLASSES}>
              {PLATFORM_OPTIONS.map((option) => (
                <ChoicePill key={option.id} label={option.label} selected={platform === option.id} onSelect={() => setAnswer("platform", option.id)} />
              ))}
            </div>
          </GroupCard>
          <GroupCard title="Presupuesto aproximado" icon={<WalletIcon size={16} />} className="min-[1200px]:col-span-3">
            <div className={PILLS_CLASSES}>
              {BUDGET_OPTIONS.map((option) => (
                <ChoicePill key={option.id} label={option.label} selected={budget === option.id} onSelect={() => setAnswer("budget", option.id)} />
              ))}
            </div>
          </GroupCard>
          <GroupCard title="¿Con qué debe conectarse?" icon={<ZapIcon size={16} />} className="min-[1200px]:col-span-3">
            <div className={PILLS_CLASSES}>
              {INTEGRATIONS.map((integration) => (
                <ChoicePill
                  key={integration.id}
                  label={integration.name}
                  selected={integrations.includes(integration.id)}
                  onSelect={() => toggleItem("integrations", integration.id)}
                />
              ))}
            </div>
          </GroupCard>
          <GroupCard title="¿Para cuándo?" icon={<CalendarIcon size={16} />} className="min-[860px]:max-[1199px]:col-span-2 min-[1200px]:col-span-4 min-[1200px]:col-start-2">
            <div className={PILLS_CLASSES}>
              {URGENCY_OPTIONS.map((option) => (
                <ChoicePill key={option.id} label={option.label} selected={urgency === option.id} onSelect={() => setAnswer("urgency", option.id)} />
              ))}
            </div>
          </GroupCard>
      </div>
    </StepSection>
  );
}
