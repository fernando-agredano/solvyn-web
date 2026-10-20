import { describe, expect, it } from "vitest";
import { INITIAL_ANSWERS, type ConfiguratorAnswers } from "@/src/lib/configurator/answers";
import { parseServerEnv } from "@/src/lib/env";
import { toggleModuleFlags } from "@/src/lib/modules";
import { buildProposalRequest, getRequestSignature } from "./client";
import { proposalRequestSchema } from "./request";

const answers: ConfiguratorAnswers = {
  ...INITIAL_ANSWERS,
  goals: ["vender", "otra"],
  otherGoal: "Quiero vender pasteles y llevar mis pedidos",
  industry: "otro",
  business: "Pastelería Los Aldama",
  users: ["clients"],
  size: "s1",
  contactName: "Ana Pérez",
  contactEmail: " ana@ejemplo.com ",
  contactPhone: "5512345678",
  budget: "b3",
  consent: true,
};

describe("buildProposalRequest", () => {
  it("produces a body the API accepts, keeping personal data in contact and the business name out", () => {
    const body = buildProposalRequest(answers);

    expect(proposalRequestSchema.safeParse(body).success).toBe(true);
    expect(body?.contact).toEqual({ name: "Ana Pérez", email: "ana@ejemplo.com", phone: "5512345678", consent: true });
    expect(JSON.stringify(body?.answers)).not.toMatch(/Ana|5512345678/);
    expect(JSON.stringify(body)).not.toContain("Pastelería");
  });

  it("sends the free description only when the visitor chose the other goal", () => {
    expect(buildProposalRequest(answers)?.description).toContain("pasteles");
    expect(buildProposalRequest({ ...answers, goals: ["vender"] })?.description).toBe("");
  });

  it("returns null without a team size or without consent", () => {
    expect(buildProposalRequest({ ...answers, size: null })).toBeNull();
    expect(buildProposalRequest({ ...answers, consent: false })).toBeNull();
  });

  it("ignores the email in the signature so the same answers reuse the generated proposal", () => {
    const first = buildProposalRequest(answers)!;
    const second = buildProposalRequest({ ...answers, contactEmail: "otro@ejemplo.com" })!;
    expect(getRequestSignature(first)).toBe(getRequestSignature(second));
    expect(getRequestSignature(first)).not.toBe(getRequestSignature(buildProposalRequest({ ...answers, size: "s3" })!));
  });
});

describe("toggleModuleFlags", () => {
  const flags = { disabledModules: {}, enabledExtras: {} };

  it("switches integrations off and extras on, and back", () => {
    const off = toggleModuleFlags(flags, { id: "i_wa", kind: "integration" });
    expect(off).toEqual({ disabledModules: { i_wa: true } });
    expect(toggleModuleFlags({ ...flags, ...off }, { id: "i_wa", kind: "integration" })).toEqual({ disabledModules: { i_wa: false } });
    expect(toggleModuleFlags(flags, { id: "x_rep", kind: "extra" })).toEqual({ enabledExtras: { x_rep: true } });
  });
});

describe("blank environment variables", () => {
  it("count as not set instead of invalid", () => {
    const env = parseServerEnv({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon",
      SUPABASE_SERVICE_ROLE_KEY: "service",
      HASH_SALT: "a-long-enough-test-salt",
      GEMINI_API_KEY: "",
    });
    expect(env.GEMINI_API_KEY).toBeUndefined();
  });
});
