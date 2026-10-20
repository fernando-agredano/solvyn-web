import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ProposalDraft } from "@/src/lib/ai/generate-proposal-draft";
import { parseServerEnv } from "@/src/lib/env";
import { createProposal, type CreateProposalDeps } from "./create-proposal";
import { generateSlug, SLUG_PATTERN, type GenerationLogEntry, type ProposalStorage, type StoredProposalPayload } from "./repository";
import { MAX_DESCRIPTION_LENGTH, proposalRequestSchema } from "./request";

const ENV = {
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon",
  SUPABASE_SERVICE_ROLE_KEY: "service",
  HASH_SALT: "a-long-enough-test-salt",
};

const validBody = {
  answers: {
    goals: ["vender"],
    users: ["clients"],
    platform: "web",
    integrations: ["wa"],
    disabledModules: {},
    enabledExtras: {},
    size: "s2",
    industry: "otro",
    urgency: "q",
  },
  description: "Vendo pasteles",
  contact: { email: "ana@ejemplo.com", name: "Ana", phone: "5512345678" },
};

describe("request validation", () => {
  it("accepts a valid body and drops personal data other than the email", () => {
    const parsed = proposalRequestSchema.parse(validBody);
    expect(parsed.contact).toEqual({ email: "ana@ejemplo.com" });
    expect(JSON.stringify(parsed.answers)).not.toContain("Ana");
  });

  it("cleans control characters from the description", () => {
    const parsed = proposalRequestSchema.parse({ ...validBody, description: "  hola\u0000\u0007\n\n  mundo\t! " });
    expect(parsed.description).toBe("hola mundo !");
  });

  it("rejects descriptions over the limit and unknown catalog ids", () => {
    expect(proposalRequestSchema.safeParse({ ...validBody, description: "a".repeat(MAX_DESCRIPTION_LENGTH + 1) }).success).toBe(false);
    expect(proposalRequestSchema.safeParse({ ...validBody, answers: { ...validBody.answers, goals: ["nope"] } }).success).toBe(false);
    expect(proposalRequestSchema.safeParse({ ...validBody, contact: { email: "not-an-email" } }).success).toBe(false);
  });

  it("drops unknown module flags", () => {
    const parsed = proposalRequestSchema.parse({ ...validBody, answers: { ...validBody.answers, enabledExtras: { x_rep: true, hacked: true } } });
    expect(parsed.answers.enabledExtras).toEqual({ x_rep: true });
  });
});

describe("environment validation", () => {
  it("names every missing variable without printing values", () => {
    expect(() => parseServerEnv({ HASH_SALT: "short" })).toThrow(/NEXT_PUBLIC_SUPABASE_URL is missing[\s\S]*HASH_SALT is invalid/);
    expect(() => parseServerEnv({ ...ENV, SUPABASE_SERVICE_ROLE_KEY: "" })).toThrow(/SUPABASE_SERVICE_ROLE_KEY is missing/);
  });

  it("accepts a configuration without AI providers", () => {
    expect(parseServerEnv(ENV).GEMINI_API_KEY).toBeUndefined();
  });
});

describe("slugs", () => {
  it("are at least 16 characters, url-safe and unique", () => {
    const slugs = new Set(Array.from({ length: 50 }, generateSlug));
    expect(slugs.size).toBe(50);
    slugs.forEach((slug) => {
      expect(slug.length).toBeGreaterThanOrEqual(16);
      expect(SLUG_PATTERN.test(slug)).toBe(true);
    });
  });
});

describe("createProposal", () => {
  const aiDraft = (overrides: Partial<ProposalDraft> = {}): ProposalDraft => ({
    copy: { title: "Título IA", summary: "Resumen", architectureNotes: {} as never, technologyNotes: {} as never },
    suggestedModuleIds: [],
    meetingQuestions: ["a", "b", "c"],
    risks: ["a", "b"],
    provider: "gemini",
    source: "ai",
    ...overrides,
  });

  let saved: { slug: string; payload: StoredProposalPayload; source: string }[];
  let logged: GenerationLogEntry[];
  let counts: { byIp: number; byEmail: number } | Error;
  let generateDraft: ReturnType<typeof vi.fn>;
  let deps: CreateProposalDeps;

  beforeEach(() => {
    vi.stubEnv("HASH_SALT", ENV.HASH_SALT);
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", ENV.NEXT_PUBLIC_SUPABASE_URL);
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", ENV.SUPABASE_SERVICE_ROLE_KEY);
    saved = [];
    logged = [];
    counts = { byIp: 0, byEmail: 0 };
    generateDraft = vi.fn(async ({ allowAi }: { allowAi?: boolean }) =>
      allowAi === false ? aiDraft({ provider: "rules", source: "rules" }) : aiDraft(),
    );
    const storage: ProposalStorage = {
      countRecentGenerations: async () => (counts instanceof Error ? Promise.reject(counts) : counts),
      logGeneration: async (entry) => void logged.push(entry),
      saveProposal: async (slug, payload, source) => void saved.push({ slug, payload, source }),
    };
    deps = { storage, generateDraft: generateDraft as unknown as CreateProposalDeps["generateDraft"], newSlug: () => "fixed-slug" };
  });

  const create = () => createProposal(proposalRequestSchema.parse(validBody), "203.0.113.7", deps);

  it("saves an anonymized payload and logs hashes, never raw identifiers", async () => {
    const result = await create();

    expect(result).toEqual({ slug: "fixed-slug", source: "ai" });
    const everything = JSON.stringify({ saved, logged });
    for (const secret of ["ana@ejemplo.com", "203.0.113.7", "Ana", "5512345678"]) expect(everything).not.toContain(secret);
    expect(logged).toEqual([{ ipHash: expect.stringMatching(/^[0-9a-f]{64}$/), emailHash: expect.stringMatching(/^[0-9a-f]{64}$/), provider: "gemini", ok: true }]);
    expect(saved[0].payload.facts.investment.min).toBeGreaterThan(0);
  });

  it("uses the rules draft without calling the AI when the IP limit is reached", async () => {
    counts = { byIp: 3, byEmail: 0 };
    const result = await create();

    expect(generateDraft).toHaveBeenCalledWith(expect.objectContaining({ allowAi: false }));
    expect(result.source).toBe("rules");
    expect(logged).toHaveLength(0);
  });

  it("uses the rules draft when the email limit is reached", async () => {
    counts = { byIp: 0, byEmail: 3 };
    expect((await create()).source).toBe("rules");
  });

  it("still answers with a proposal when the limit check fails", async () => {
    counts = new Error("db down");
    expect((await create()).source).toBe("rules");
  });

  it("logs a failed generation when the chain fell back to rules", async () => {
    generateDraft.mockResolvedValueOnce(aiDraft({ provider: "rules", source: "rules" }));
    await create();
    expect(logged[0]).toMatchObject({ provider: "rules", ok: false });
  });
});
