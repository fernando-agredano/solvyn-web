import { describe, expect, it } from "vitest";
import { buildModules, type ProposalAnswers } from "@/src/lib/modules";
import {
  calculateTotalHours,
  estimateInvestmentRange,
  estimatePhases,
  estimateWeekRange,
  getComplexity,
} from "@/src/lib/pricing";

const baseAnswers: ProposalAnswers = {
  goals: [],
  users: [],
  platform: "web",
  integrations: [],
  disabledModules: {},
  enabledExtras: {},
};

const activeHours = (modules: ReturnType<typeof buildModules>) =>
  modules.filter((module) => module.active).map((module) => module.hours);

describe("single goal, small team", () => {
  const modules = buildModules({ ...baseAnswers, goals: ["citas"], users: ["team"] });
  const hours = calculateTotalHours(activeHours(modules), "s1");

  it("includes goal modules and the base modules, without roles or mobile", () => {
    expect(modules.map((module) => module.id)).toEqual(["agenda", "remind", "admin", "ux", "ops", "x_rep", "x_multi", "x_site"]);
  });

  it("keeps suggested extras off by default", () => {
    expect(modules.filter((module) => module.kind === "extra").every((module) => !module.active)).toBe(true);
  });

  it("computes hours, price, weeks and complexity", () => {
    expect(hours).toBe(170);
    expect(estimateInvestmentRange(hours, 600)).toEqual({ min: 87000, max: 117000 });
    expect(estimateWeekRange(hours)).toEqual({ min: 5, max: 7 });
    expect(getComplexity(hours)).toBe("baja");
  });
});

describe("three goals with integrations, large team", () => {
  const modules = buildModules({
    ...baseAnswers,
    goals: ["vender", "datos", "ia"],
    users: ["team", "clients"],
    platform: "both",
    integrations: ["pay", "wa", "cfdi"],
  });
  const ids = modules.map((module) => module.id);
  const hours = calculateTotalHours(activeHours(modules), "s4");

  it("does not duplicate payments when selling, nor reports with the dashboard goal", () => {
    expect(ids).not.toContain("i_pay");
    expect(ids).not.toContain("x_rep");
    expect(ids).toEqual(expect.arrayContaining(["i_wa", "i_cfdi", "roles", "mobile"]));
  });

  it("applies the size multiplier and rounds hours", () => {
    expect(hours).toBe(Math.round(545 * 1.3));
    expect(getComplexity(hours)).toBe("alta");
  });

  it("lets integrations be switched off", () => {
    const off = buildModules({ ...baseAnswers, goals: ["vender"], integrations: ["wa"], disabledModules: { i_wa: true } });
    expect(off.find((module) => module.id === "i_wa")?.active).toBe(false);
  });

  it("splits phases by the configured shares", () => {
    const phases = estimatePhases(hours);
    expect(phases.map((phase) => phase.share)).toEqual([0.1, 0.2, 0.55, 0.15]);
    expect(phases.every((phase) => phase.weeks >= 1)).toBe(true);
  });
});

describe("app goal with platform 'both'", () => {
  it("does not add the mobile version on top of the app module", () => {
    const ids = buildModules({ ...baseAnswers, goals: ["app"], platform: "both" }).map((module) => module.id);
    expect(ids).toContain("appm");
    expect(ids).not.toContain("mobile");
  });

  it("adds the mobile version for other goals", () => {
    const ids = buildModules({ ...baseAnswers, goals: ["citas"], platform: "both" }).map((module) => module.id);
    expect(ids).toContain("mobile");
  });
});

describe("no goals", () => {
  it("returns no modules", () => {
    expect(buildModules(baseAnswers)).toEqual([]);
  });
});
