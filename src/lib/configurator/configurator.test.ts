import { describe, expect, it } from "vitest";
import { INITIAL_ANSWERS, sanitizePersistedAnswers, type ConfiguratorAnswers } from "@/src/lib/configurator/answers";
import { getProgressPercent, isStepValid } from "@/src/lib/configurator/validation";

const answers = (overrides: Partial<ConfiguratorAnswers>): ConfiguratorAnswers => ({ ...INITIAL_ANSWERS, ...overrides });

describe("isStepValid", () => {
  it("requires a description of at least 4 characters when the goal is 'otra'", () => {
    expect(isStepValid("goal", answers({ goals: ["otra"], otherGoal: "abc" }))).toBe(false);
    expect(isStepValid("goal", answers({ goals: ["otra"], otherGoal: "abcd" }))).toBe(true);
    expect(isStepValid("goal", answers({ goals: ["citas"] }))).toBe(true);
  });

  it("requires users, size and budget in details, but not urgency", () => {
    const base = answers({ users: ["team"], size: "s1", budget: "b0" });
    expect(isStepValid("details", base)).toBe(true);
    expect(isStepValid("details", { ...base, budget: null })).toBe(false);
  });

  it("requires name, a valid email and consent in contact", () => {
    const base = answers({ contactName: "Ana Ruiz", contactEmail: "ana@negocio.com", consent: true });
    expect(isStepValid("contact", base)).toBe(true);
    expect(isStepValid("contact", { ...base, contactEmail: "ana@negocio" })).toBe(false);
    expect(isStepValid("contact", { ...base, consent: false })).toBe(false);
  });
});

describe("getProgressPercent", () => {
  it("counts an unfinished step as 35% and a valid one as complete", () => {
    expect(getProgressPercent("goal", false)).toBe(9);
    expect(getProgressPercent("goal", true)).toBe(25);
    expect(getProgressPercent("contact", true)).toBe(100);
  });
});

describe("sanitizePersistedAnswers", () => {
  it("drops unknown ids and caps goals at three, keeping the newest", () => {
    const result = sanitizePersistedAnswers({ goals: ["vender", "nope", "citas", "operar", "app"], industry: "xyz" });
    expect(result.goals).toEqual(["citas", "operar", "app"]);
    expect(result.industry).toBeNull();
  });

  it("falls back to the furthest reachable step when the saved step is not valid", () => {
    expect(sanitizePersistedAnswers({ step: "details", goals: ["citas"] }).step).toBe("industry");
    expect(sanitizePersistedAnswers({ step: "industry", goals: ["citas"], industry: "salud" }).step).toBe("industry");
  });

  it("never restores contact data and tolerates garbage", () => {
    const result = sanitizePersistedAnswers({ contactEmail: "a@b.com", consent: true });
    expect(result.contactEmail).toBe("");
    expect(result.consent).toBe(false);
    expect(sanitizePersistedAnswers("garbage")).toEqual(INITIAL_ANSWERS);
  });
});
