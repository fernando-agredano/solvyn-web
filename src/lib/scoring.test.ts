import { describe, expect, it } from "vitest";
import { calculateLeadScore, getLeadLabel, type ScoringInput } from "./scoring";

const base: ScoringInput = { budget: null, urgency: null, users: ["team"], activeModuleCount: 3, activeIntegrationCount: 0 };

describe("calculateLeadScore", () => {
  it("scores each budget tier", () => {
    const scores = (["b4", "b3", "b2", "b1", "b0"] as const).map((budget) => calculateLeadScore({ ...base, budget }));
    expect(scores).toEqual([40, 30, 20, 10, 5]);
  });

  it("scores each urgency", () => {
    const scores = (["asap", "q", "flex"] as const).map((urgency) => calculateLeadScore({ ...base, urgency }));
    expect(scores).toEqual([25, 15, 5]);
  });

  it("adds points only for client users", () => {
    expect(calculateLeadScore({ ...base, users: ["clients", "team"] })).toBe(10);
    expect(calculateLeadScore({ ...base, users: ["suppliers"] })).toBe(0);
  });

  it("adds points from 8 modules", () => {
    expect(calculateLeadScore({ ...base, activeModuleCount: 7 })).toBe(0);
    expect(calculateLeadScore({ ...base, activeModuleCount: 8 })).toBe(10);
  });

  it("adds 5 per integration up to 15", () => {
    expect(calculateLeadScore({ ...base, activeIntegrationCount: 2 })).toBe(10);
    expect(calculateLeadScore({ ...base, activeIntegrationCount: 6 })).toBe(15);
  });

  it("caps at 100", () => {
    const score = calculateLeadScore({ budget: "b4", urgency: "asap", users: ["clients"], activeModuleCount: 12, activeIntegrationCount: 5 });
    expect(score).toBe(100);
  });

  it("treats a missing budget or urgency as zero points", () => {
    expect(calculateLeadScore(base)).toBe(0);
  });
});

describe("getLeadLabel", () => {
  it("uses the 70 and 40 boundaries", () => {
    expect(
      [100, 70, 69, 40, 39, 0].map(getLeadLabel),
    ).toEqual(["caliente", "caliente", "tibio", "tibio", "frio", "frio"]);
  });
});
