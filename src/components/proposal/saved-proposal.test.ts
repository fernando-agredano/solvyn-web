import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { buildProposalFacts } from "@/src/lib/proposal";
import { buildTemplateCopy } from "@/src/lib/templates";
import { formatMXN } from "@/src/lib/pricing";
import type { StoredProposalPayload } from "@/src/lib/proposals/repository";
import { SavedProposalView } from "./SavedProposalView";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

const answers: StoredProposalPayload["answers"] = {
  goals: ["vender"],
  users: ["clients"],
  platform: "web",
  integrations: ["wa"],
  disabledModules: {},
  enabledExtras: {},
  size: "s1",
  industry: "otro",
  urgency: "q",
};
const facts = buildProposalFacts({ ...answers, business: "" })!;

describe("SavedProposalView", () => {
  it("renders the saved AI texts with prices and modules calculated from pricing.ts", () => {
    const copy = { ...buildTemplateCopy(facts), title: "Título guardado por la IA", summary: "Resumen guardado por la IA." };

    const html = renderToStaticMarkup(createElement(SavedProposalView, { proposal: { answers, copy, provider: "gemini" } }));

    expect(html).toContain("Título guardado por la IA");
    expect(html).toContain("Resumen guardado por la IA.");
    expect(html).toContain(formatMXN(facts.investment.min));
    for (const { name } of facts.modules.filter((item) => item.active)) expect(html).toContain(name);
    expect(html).toContain("Compartir enlace");
  });

  it("renders a proposal saved by the rules fallback", () => {
    const html = renderToStaticMarkup(
      createElement(SavedProposalView, { proposal: { answers, copy: buildTemplateCopy(facts), provider: "rules" } }),
    );
    expect(html).toContain(buildTemplateCopy(facts).title);
  });
});
