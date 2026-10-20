import { describe, expect, it } from "vitest";
import { ARCH_NODES, TECHNOLOGIES } from "@/src/config/proposal";
import { INITIAL_ANSWERS } from "@/src/lib/configurator/answers";
import { buildProposalFacts, type ProposalFacts, type ProposalInput } from "@/src/lib/proposal";
import { buildTemplateCopy, resolveCopy } from "@/src/lib/templates";

const input = (overrides: Partial<ProposalInput>): ProposalInput => ({ ...INITIAL_ANSWERS, ...overrides });

const build = (overrides: Partial<ProposalInput>): ProposalFacts => {
  const facts = buildProposalFacts(input(overrides));
  if (!facts) throw new Error("expected facts");
  return facts;
};

describe("buildProposalFacts", () => {
  it("returns null without goals", () => {
    expect(buildProposalFacts(input({}))).toBeNull();
  });

  it("derives kind, price and phases for a single goal", () => {
    const facts = build({ goals: ["citas"], users: ["team"], size: "s1", business: "Clínica Vitalia", industry: "salud" });
    expect(facts.kind).toBe("agenda");
    expect(facts.businessName).toBe("Clínica Vitalia");
    expect(facts.industryLabel).toBe("Salud");
    expect(facts.totalHours).toBe(170);
    expect(facts.investment).toEqual({ min: 87000, max: 117000 });
    expect(facts.complexity).toBe("baja");
    expect(facts.complexityLevel).toBe(1);
    expect(facts.phases.map((phase) => phase.share)).toEqual([0.1, 0.2, 0.55, 0.15]);
    expect(facts.phases.map((phase) => phase.startShare.toFixed(2))).toEqual(["0.00", "0.10", "0.30", "0.85"]);
  });

  it("shows mobile and AI nodes only when they apply", () => {
    const plain = build({ goals: ["citas"] });
    expect(plain.architecture.columns[1].nodeIds).toEqual(["web"]);
    expect(plain.architecture.columns[2].nodeIds).toEqual(["api"]);
    expect(plain.technologies).toEqual(["nextjs", "supabase", "vercel"]);

    const full = build({ goals: ["ia", "app"], integrations: ["wa"] });
    expect(full.architecture.columns[1].nodeIds).toEqual(["web", "mobile"]);
    expect(full.architecture.columns[2].nodeIds).toEqual(["api", "ai"]);
    expect(full.architecture.externalNodeIds).toEqual(["e_wa"]);
    expect(full.technologies).toEqual(["nextjs", "supabase", "react-native", "ai-models", "whatsapp", "vercel"]);
  });

  it("adds payments when selling even without the integration", () => {
    const facts = build({ goals: ["vender"] });
    expect(facts.architecture.externalNodeIds).toEqual(["e_pay"]);
    expect(facts.technologies).toContain("payments");
  });

  it("recalculates when an optional module is toggled", () => {
    const base = build({ goals: ["citas"], size: "s1" });
    const withExtra = build({ goals: ["citas"], size: "s1", enabledExtras: { x_multi: true } });
    expect(withExtra.totalHours).toBe(base.totalHours + 40);
    expect(withExtra.activeModuleCount).toBe(base.activeModuleCount + 1);
  });
});

describe("copy", () => {
  const facts = build({ goals: ["vender", "citas"], integrations: ["wa"], business: "Tienda Sol", industry: "comercio" });
  const template = buildTemplateCopy(facts);

  it("covers every architecture node and technology of the facts", () => {
    const nodeIds = [...facts.architecture.columns.flatMap((column) => column.nodeIds), ...facts.architecture.externalNodeIds];
    nodeIds.forEach((id) => {
      expect(template.architectureNotes[id]).toBeTruthy();
      expect(ARCH_NODES[id]).toBeDefined();
    });
    facts.technologies.forEach((id) => {
      expect(template.technologyNotes[id]).toBeTruthy();
      expect(TECHNOLOGIES[id]).toBeDefined();
    });
  });

  it("writes the summary from the answers", () => {
    expect(template.title).toBe("Plataforma de ventas en línea");
    expect(template.summary).toContain("Tienda Sol, del giro comercio,");
    expect(template.summary).toContain("vender en línea y agendar citas o reservas");
    expect(template.summary).toContain("integración con WhatsApp");
  });

  it("uses the AI assistant title when it is the primary goal", () => {
    expect(buildTemplateCopy(build({ goals: ["ia"] })).title).toBe("Asistente inteligente para tu negocio");
  });

  it("falls back to the template for missing, empty or unknown overrides", () => {
    const resolved = resolveCopy(template, {
      title: "  Título de la IA  ",
      summary: "   ",
      architectureNotes: { db: "Nueva nota", api: "" },
      technologyNotes: { nope: "x" } as never,
    });
    expect(resolved.title).toBe("Título de la IA");
    expect(resolved.summary).toBe(template.summary);
    expect(resolved.architectureNotes.db).toBe("Nueva nota");
    expect(resolved.architectureNotes.api).toBe(template.architectureNotes.api);
    expect(Object.keys(resolved.technologyNotes)).toEqual(Object.keys(template.technologyNotes));
  });

  it("never changes price, hours or modules, whatever the copy says", () => {
    const before = JSON.stringify(facts);
    resolveCopy(template, { title: "$1", summary: "Cuesta $1 y tiene 99 módulos" });
    expect(JSON.stringify(facts)).toBe(before);
  });
});
