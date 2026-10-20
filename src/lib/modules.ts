import { EXTRAS, GOALS, INTEGRATIONS, type Module } from "@/src/config/catalog";

export type UserType = "team" | "clients" | "suppliers";
export type Platform = "web" | "both";
export type ModuleKind = "core" | "integration" | "extra";

export interface ProposalAnswers {
  goals: string[];
  users: UserType[];
  platform: Platform;
  integrations: string[];
  // Integrations the visitor switched off in the proposal.
  disabledModules: Record<string, boolean>;
  // Suggested extras the visitor switched on in the proposal.
  enabledExtras: Record<string, boolean>;
}

export interface ProposalModule extends Module {
  kind: ModuleKind;
  active: boolean;
  optional: boolean;
}

type DraftModule = Omit<ProposalModule, "active" | "optional">;

export function buildModules(answers: ProposalAnswers): ProposalModule[] {
  const drafts: DraftModule[] = [];
  const add = (module: Module, kind: ModuleKind, id = module.id) => {
    if (!drafts.some((draft) => draft.id === id)) drafts.push({ ...module, id, kind });
  };

  for (const goal of GOALS) {
    if (answers.goals.includes(goal.id)) goal.modules.forEach((module) => add(module, "core"));
  }
  if (drafts.length === 0) return [];

  const hasGoal = (goalId: string) => answers.goals.includes(goalId);

  add({ id: "admin", name: "Panel administrativo", hours: 45, description: "Control de usuarios, catálogos y configuración del sistema." }, "core");
  if (answers.users.length > 1 || answers.users.includes("clients")) {
    add({ id: "roles", name: "Usuarios y permisos", hours: 20, description: "Accesos distintos según el tipo de usuario." }, "core");
  }
  if (answers.platform === "both" && !hasGoal("app")) {
    add({ id: "mobile", name: "Versión móvil", hours: 90, description: "Las funciones clave también en una app para celular." }, "core");
  }
  add({ id: "ux", name: "Diseño de interfaz", hours: 30, description: "Pantallas diseñadas a la medida de tu marca." }, "core");
  add({ id: "ops", name: "Puesta en marcha", hours: 15, description: "Publicación, dominio, hosting y capacitación." }, "core");

  for (const integration of INTEGRATIONS) {
    // Selling online already includes payments.
    if (integration.id === "pay" && hasGoal("vender")) continue;
    if (answers.integrations.includes(integration.id)) add(integration, "integration", `i_${integration.id}`);
  }
  for (const extra of EXTRAS) {
    // The dashboard goal already covers reports.
    if (extra.id === "rep" && hasGoal("datos")) continue;
    add(extra, "extra", `x_${extra.id}`);
  }

  return drafts.map((draft) => ({
    ...draft,
    active:
      draft.kind === "core"
        ? true
        : draft.kind === "integration"
          ? !answers.disabledModules[draft.id]
          : Boolean(answers.enabledExtras[draft.id]),
    optional: draft.kind !== "core",
  }));
}
