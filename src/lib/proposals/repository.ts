import { randomBytes } from "node:crypto";
import type { ProposalDraft } from "@/src/lib/ai/generate-proposal-draft";
import type { ProposalFacts } from "@/src/lib/proposal";
import type { ProposalCopy } from "@/src/lib/templates";
import { createServiceClient } from "@/src/lib/supabase/server";
import { GENERATION_WINDOW_MS } from "./limits";
import type { ProposalRequest } from "./request";

// What is saved in proposals.payload. No name, email, phone or business name: facts use the default business name.
export interface StoredProposalPayload {
  answers: ProposalRequest["answers"];
  description: string;
  facts: ProposalFacts;
  copy: ProposalCopy;
  suggestedModuleIds: string[];
  meetingQuestions: string[];
  risks: string[];
  provider: ProposalDraft["provider"];
}

export interface GenerationLogEntry {
  ipHash: string;
  emailHash: string;
  provider: ProposalDraft["provider"];
  ok: boolean;
}

export interface ProposalStorage {
  countRecentGenerations(hashes: { ipHash: string; emailHash: string }): Promise<{ byIp: number; byEmail: number }>;
  logGeneration(entry: GenerationLogEntry): Promise<void>;
  saveProposal(slug: string, payload: StoredProposalPayload, source: ProposalDraft["source"]): Promise<void>;
}

const SLUG_BYTES = 16;
// 16 random bytes in base64url are 22 characters (128 bits): impossible to guess.
export const SLUG_PATTERN = /^[A-Za-z0-9_-]{22}$/;

export const generateSlug = () => randomBytes(SLUG_BYTES).toString("base64url");

export function createSupabaseStorage(): ProposalStorage {
  const supabase = createServiceClient();

  const countBy = async (column: "ip_hash" | "email_hash", hash: string) => {
    const since = new Date(Date.now() - GENERATION_WINDOW_MS).toISOString();
    const { count, error } = await supabase
      .from("generation_log")
      .select("id", { count: "exact", head: true })
      .eq(column, hash)
      .gte("created_at", since);
    if (error) throw new Error(`generation_log count failed: ${error.code ?? "unknown"}`);
    return count ?? 0;
  };

  return {
    async countRecentGenerations({ ipHash, emailHash }) {
      const [byIp, byEmail] = await Promise.all([countBy("ip_hash", ipHash), countBy("email_hash", emailHash)]);
      return { byIp, byEmail };
    },
    async logGeneration({ ipHash, emailHash, provider, ok }) {
      const { error } = await supabase.from("generation_log").insert({ ip_hash: ipHash, email_hash: emailHash, provider, ok });
      if (error) throw new Error(`generation_log insert failed: ${error.code ?? "unknown"}`);
    },
    async saveProposal(slug, payload, source) {
      const { error } = await supabase.from("proposals").insert({ slug, payload, source });
      if (error) throw new Error(`proposals insert failed: ${error.code ?? "unknown"}`);
    },
  };
}

export async function getProposalBySlug(slug: string): Promise<StoredProposalPayload | null> {
  if (!SLUG_PATTERN.test(slug)) return null;
  const { data, error } = await createServiceClient().from("proposals").select("payload").eq("slug", slug).maybeSingle();
  if (error) throw new Error(`proposals read failed: ${error.code ?? "unknown"}`);
  return (data?.payload as StoredProposalPayload | undefined) ?? null;
}
