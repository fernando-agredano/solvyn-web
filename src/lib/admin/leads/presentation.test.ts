import { describe, expect, it } from "vitest";
import { describeAnswers } from "./answers";
import { getMailtoHref, getWhatsAppHref } from "./contact";
import { parseStoredProposal, type StoredProposal } from "./records";

const storedProposal: StoredProposal = {
  description: "Quiero vender en línea.",
  facts: {
    industryLabel: "Restaurantes",
    investment: { min: 100000, max: 150000 },
  },
  answers: {
    goals: ["vender", "otra"],
    otherGoal: "Reservaciones",
    industry: "rest",
    users: ["clients"],
    size: "s1",
    platform: "web",
    integrations: ["wa"],
    urgency: "asap",
    budget: "b2",
  },
};

describe("describeAnswers", () => {
  it("writes the free-text goal in place of the catalog label", () => {
    const goals = describeAnswers(storedProposal).find(
      (row) => row.label === "Metas",
    );
    expect(goals?.value).toBe("Vender en línea, Reservaciones");
  });

  it("uses catalog labels and keeps unknown ids visible", () => {
    const rows = describeAnswers({
      ...storedProposal,
      answers: { ...storedProposal.answers, industry: "desconocida" },
    });
    expect(rows.find((row) => row.label === "Industria")?.value).toBe(
      "desconocida",
    );
    expect(rows.find((row) => row.label === "Integraciones")?.value).toBe(
      "WhatsApp",
    );
  });

  it("leaves out empty answers and the description when it is blank", () => {
    const rows = describeAnswers({
      ...storedProposal,
      description: "   ",
      answers: { ...storedProposal.answers, integrations: [], urgency: null },
    });
    expect(rows.map((row) => row.label)).not.toContain("Descripción");
    expect(rows.map((row) => row.label)).not.toContain("Urgencia");
    expect(rows.map((row) => row.label)).not.toContain("Integraciones");
  });
});

describe("parseStoredProposal", () => {
  it("returns null for a payload that doesn't match, so the page shows 'no data' instead of crashing", () => {
    expect(parseStoredProposal({ facts: { industryLabel: null } })).toBeNull();
    expect(parseStoredProposal(null)).toBeNull();
  });

  it("accepts a stored proposal", () => {
    expect(parseStoredProposal(storedProposal)).toEqual(storedProposal);
  });
});

describe("getWhatsAppHref", () => {
  it("adds the Mexico country code to ten-digit numbers", () => {
    expect(getWhatsAppHref("55 1234 5678")).toBe("https://wa.me/525512345678");
  });

  it("keeps numbers that already include the country code", () => {
    expect(getWhatsAppHref("+52 55 1234 5678")).toBe(
      "https://wa.me/525512345678",
    );
  });

  it("returns null when there is no usable number", () => {
    expect(getWhatsAppHref(null)).toBeNull();
    expect(getWhatsAppHref("")).toBeNull();
    expect(getWhatsAppHref("12345")).toBeNull();
  });
});

describe("getMailtoHref", () => {
  it("builds a mailto link", () => {
    expect(getMailtoHref("ana@mail.mx")).toBe("mailto:ana@mail.mx");
  });
});
