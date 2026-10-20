import { GOALS, INDUSTRIES, INTEGRATIONS } from "@/src/config/catalog";
import { DEFAULT_HOURLY_RATE_MXN } from "@/src/config/pricing";
import {
  ARCH_COLUMN_TITLES,
  PHASE_DETAILS,
  type ArchNodeId,
  type TechId,
} from "@/src/config/proposal";
import type { ConfiguratorAnswers } from "@/src/lib/configurator/answers";
import { buildModules, type ModuleKind } from "@/src/lib/modules";
import {
  COMPLEXITY_LEVELS,
  calculateTotalHours,
  estimateInvestmentRange,
  estimatePhases,
  estimateWeekRange,
  getComplexity,
  getSizeMultiplier,
} from "@/src/lib/pricing";

export type SolutionKind = "shop" | "agenda" | "dash" | "ops";

export interface ProposalFactsModule {
  id: string;
  name: string;
  description: string;
  kind: ModuleKind;
  active: boolean;
  optional: boolean;
  // Hours already scaled by the team size.
  hours: number;
}

export interface ProposalPhase {
  name: string;
  deliverable: string;
  weeks: number;
  startShare: number;
  share: number;
}

export interface ArchitectureColumn {
  id: keyof typeof ARCH_COLUMN_TITLES;
  title: string;
  nodeIds: ArchNodeId[];
}

// Everything that defines scope and price. Nothing here is ever written by the AI.
export interface ProposalFacts {
  kind: SolutionKind;
  primaryGoalId: string;
  businessName: string;
  industryLabel: string | null;
  goalNames: string[];
  userTypes: ConfiguratorAnswers["users"];
  integrationNames: string[];
  includesMobile: boolean;
  urgency: ConfiguratorAnswers["urgency"];
  modules: ProposalFactsModule[];
  activeModuleCount: number;
  totalHours: number;
  investment: { min: number; max: number };
  weeks: { min: number; max: number };
  complexity: ReturnType<typeof getComplexity>;
  complexityLevel: 1 | 2 | 3;
  phases: ProposalPhase[];
  architecture: { columns: ArchitectureColumn[]; externalNodeIds: ArchNodeId[] };
  technologies: TechId[];
}

export type ProposalInput = Pick<
  ConfiguratorAnswers,
  | "goals"
  | "users"
  | "platform"
  | "integrations"
  | "disabledModules"
  | "enabledExtras"
  | "size"
  | "industry"
  | "business"
  | "urgency"
>;

export const DEFAULT_BUSINESS_NAME = "Tu negocio";
const FALLBACK_GOAL_ID = "operar";
const OTHER_INDUSTRY_ID = "otro";

export function getSolutionKind(primaryGoalId: string): SolutionKind {
  if (primaryGoalId === "vender" || primaryGoalId === "app") return "shop";
  if (primaryGoalId === "citas") return "agenda";
  if (primaryGoalId === "datos") return "dash";
  return "ops";
}

function buildArchitecture(input: ProposalInput, includesMobile: boolean): ProposalFacts["architecture"] {
  const column = (id: ArchitectureColumn["id"], nodeIds: ArchNodeId[]): ArchitectureColumn => ({
    id,
    title: ARCH_COLUMN_TITLES[id],
    nodeIds,
  });
  const columns = [
    column("users", ["users"]),
    column("frontend", includesMobile ? ["web", "mobile"] : ["web"]),
    column("logic", input.goals.includes("ia") ? ["api", "ai"] : ["api"]),
    column("data", ["db", "files"]),
  ];

  // Selling online always involves payments, even if the visitor didn't tick the integration.
  const externalNodeIds = INTEGRATIONS.filter(
    (integration) => input.integrations.includes(integration.id) || (integration.id === "pay" && input.goals.includes("vender")),
  ).map((integration) => `e_${integration.id}` as ArchNodeId);

  return { columns, externalNodeIds };
}

function buildTechnologies(input: ProposalInput, includesMobile: boolean): TechId[] {
  const technologies: TechId[] = ["nextjs", "supabase"];
  if (includesMobile) technologies.push("react-native");
  if (input.goals.includes("ia")) technologies.push("ai-models");
  if (input.integrations.includes("pay") || input.goals.includes("vender")) technologies.push("payments");
  if (input.integrations.includes("wa")) technologies.push("whatsapp");
  technologies.push("vercel");
  return technologies;
}

export function buildProposalFacts(input: ProposalInput): ProposalFacts | null {
  const modules = buildModules(input);
  if (modules.length === 0) return null;

  const activeModules = modules.filter((module) => module.active);
  const totalHours = calculateTotalHours(
    activeModules.map((module) => module.hours),
    input.size,
  );
  const multiplier = getSizeMultiplier(input.size);
  const primaryGoalId = input.goals[0] ?? FALLBACK_GOAL_ID;
  const includesMobile = input.platform === "both" || input.goals.includes("app");
  const industry = INDUSTRIES.find((option) => option.id === input.industry);
  const complexity = getComplexity(totalHours);

  return {
    kind: getSolutionKind(primaryGoalId),
    primaryGoalId,
    businessName: input.business.trim() || DEFAULT_BUSINESS_NAME,
    industryLabel: industry && industry.id !== OTHER_INDUSTRY_ID ? industry.label : null,
    goalNames: GOALS.filter((goal) => input.goals.includes(goal.id)).map((goal) => goal.label),
    userTypes: input.users,
    integrationNames: INTEGRATIONS.filter((integration) => input.integrations.includes(integration.id)).map(
      (integration) => integration.name,
    ),
    includesMobile,
    urgency: input.urgency,
    modules: modules.map((module) => ({
      id: module.id,
      name: module.name,
      description: module.description,
      kind: module.kind,
      active: module.active,
      optional: module.optional,
      hours: Math.round(module.hours * multiplier),
    })),
    activeModuleCount: activeModules.length,
    totalHours,
    investment: estimateInvestmentRange(totalHours, DEFAULT_HOURLY_RATE_MXN),
    weeks: estimateWeekRange(totalHours),
    complexity,
    complexityLevel: COMPLEXITY_LEVELS[complexity],
    phases: estimatePhases(totalHours).map((phase, index) => ({
      name: PHASE_DETAILS[index].name,
      deliverable: PHASE_DETAILS[index].deliverable,
      weeks: phase.weeks,
      startShare: phase.startShare,
      share: phase.share,
    })),
    architecture: buildArchitecture(input, includesMobile),
    technologies: buildTechnologies(input, includesMobile),
  };
}
