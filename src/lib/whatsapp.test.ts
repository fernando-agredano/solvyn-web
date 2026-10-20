import { describe, expect, it } from "vitest";
import { buildProposalWhatsAppMessage } from "./whatsapp";

describe("buildProposalWhatsAppMessage", () => {
  it("includes the name, the business and the proposal link", () => {
    const message = buildProposalWhatsAppMessage({ name: "Ana", business: " Pastelería Aldama ", proposalUrl: "https://solvyn.example/propuesta/abc" });
    expect(message).toContain("Ana, de Pastelería Aldama");
    expect(message).toContain("https://solvyn.example/propuesta/abc");
  });

  it("leaves out the business and the link when there are none", () => {
    const message = buildProposalWhatsAppMessage({ name: "Ana", business: "", proposalUrl: null });
    expect(message).toContain("soy Ana.");
    expect(message).not.toContain("http");
  });
});
