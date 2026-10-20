import type { ArchNodeId, TechId } from "@/src/config/proposal";
import type { ProposalFacts, SolutionKind } from "@/src/lib/proposal";

// The only text of a proposal that can be rewritten (by the AI in Phase 4). Keys come from the facts, never the other way round.
export interface ProposalCopy {
  title: string;
  summary: string;
  architectureNotes: Record<ArchNodeId, string>;
  technologyNotes: Record<TechId, string>;
}

export type ProposalCopyOverride = {
  title?: string;
  summary?: string;
  architectureNotes?: Partial<Record<ArchNodeId, string>>;
  technologyNotes?: Partial<Record<TechId, string>>;
};

const TITLES: Record<SolutionKind, string> = {
  shop: "Plataforma de ventas en línea",
  agenda: "Sistema de citas y reservas",
  dash: "Tablero de inteligencia de negocio",
  ops: "Sistema de gestión a la medida",
};
const AI_ASSISTANT_TITLE = "Asistente inteligente para tu negocio";

const USER_TYPE_PHRASES = { team: "tu equipo", clients: "tus clientes", suppliers: "proveedores o socios" } as const;

const TECHNOLOGY_NOTES: Record<TechId, string> = {
  nextjs: "Aplicación rápida, segura y bien posicionada en buscadores.",
  supabase: "Base de datos, usuarios y archivos con respaldos automáticos.",
  "react-native": "Una sola base de código para iOS y Android.",
  "ai-models": "Integrados con una capa intermedia para cambiar de proveedor sin rehacer nada.",
  payments: "Cobros seguros con tarjeta, OXXO o transferencia.",
  whatsapp: "Mensajes automáticos desde el número de tu negocio.",
  vercel: "Publicación y hosting con alta disponibilidad.",
};

// "a, b y c"
export function joinList(items: readonly string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}

function buildSummary(facts: ProposalFacts): string {
  const platform = facts.includesMobile ? "web y móvil" : "web";
  const industry = facts.industryLabel ? `, del giro ${facts.industryLabel.toLowerCase()},` : "";
  const goals = joinList(facts.goalNames.map((name) => name.toLowerCase())) || "organizar tu operación";
  const integrations = facts.integrationNames.length
    ? `integración con ${joinList(facts.integrationNames)}`
    : "una base lista para crecer";
  return `Una plataforma ${platform} para ${facts.businessName}${industry} que te permite ${goals}. Incluye ${facts.activeModuleCount} módulos, ${integrations} y un panel para administrar todo desde un solo lugar.`;
}

function buildArchitectureNotes(facts: ProposalFacts): Record<ArchNodeId, string> {
  const usersPhrase = joinList(facts.userTypes.map((type) => USER_TYPE_PHRASES[type])) || USER_TYPE_PHRASES.team;
  return {
    users: `Las personas que usarán tu solución: ${usersPhrase}. Cada quien ve solo lo que le corresponde.`,
    web: "Lo que tus usuarios ven y usan desde cualquier navegador, en computadora o celular.",
    mobile: "Aplicación instalable para iOS y Android, conectada a la misma información.",
    api: "El cerebro del sistema: aplica las reglas de tu negocio y conecta todas las piezas.",
    ai: "Analiza preguntas o documentos y genera respuestas con la información de tu negocio.",
    db: "Aquí se guarda tu información de forma segura, con respaldos automáticos.",
    files: "Fotos, documentos y comprobantes guardados de forma privada.",
    e_wa: "Envía avisos y confirmaciones automáticas a tus clientes.",
    e_pay: "Procesa cobros con tarjeta, OXXO o transferencia.",
    e_cfdi: "Genera y timbra facturas electrónicas al momento.",
    e_mail: "Envía confirmaciones y notificaciones por correo.",
    e_legacy: "Intercambia datos con el sistema que ya usas para no duplicar trabajo.",
  };
}

// Rule-based copy: it is the default and also the fallback when the AI is unavailable.
export function buildTemplateCopy(facts: ProposalFacts): ProposalCopy {
  return {
    title: facts.kind === "ops" && facts.primaryGoalId === "ia" ? AI_ASSISTANT_TITLE : TITLES[facts.kind],
    summary: buildSummary(facts),
    architectureNotes: buildArchitectureNotes(facts),
    technologyNotes: TECHNOLOGY_NOTES,
  };
}

const cleanText = (value: string | undefined) => (value?.trim() ? value.trim() : undefined);

function mergeNotes<Id extends string>(base: Record<Id, string>, override: Partial<Record<Id, string>> | undefined) {
  const merged = { ...base };
  for (const id of Object.keys(base) as Id[]) {
    merged[id] = cleanText(override?.[id]) ?? base[id];
  }
  return merged;
}

// Field by field: a valid override wins, anything missing, empty or unknown falls back to the template.
export function resolveCopy(templateCopy: ProposalCopy, override?: ProposalCopyOverride): ProposalCopy {
  return {
    title: cleanText(override?.title) ?? templateCopy.title,
    summary: cleanText(override?.summary) ?? templateCopy.summary,
    architectureNotes: mergeNotes(templateCopy.architectureNotes, override?.architectureNotes),
    technologyNotes: mergeNotes(templateCopy.technologyNotes, override?.technologyNotes),
  };
}

// Rules-only texts mention the module count, so they follow the facts; AI texts stay as generated.
export function resolveProposalCopy(proposal: { provider: string; copy: ProposalCopy }, facts: ProposalFacts): ProposalCopy {
  return proposal.provider === "rules" ? buildTemplateCopy(facts) : proposal.copy;
}
