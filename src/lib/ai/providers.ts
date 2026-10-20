import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import type { LanguageModel } from "ai";
import { getServerEnv } from "@/src/lib/env";

export type AiProviderId = "gemini" | "openrouter";

export interface DraftProvider {
  id: AiProviderId;
  model: LanguageModel;
}

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

// The only place that talks to a provider SDK. Order matters: the chain tries them first to last.
export function getDefaultProviders(): DraftProvider[] {
  const env = getServerEnv();
  const providers: DraftProvider[] = [];

  if (env.GEMINI_API_KEY && env.GEMINI_MODEL) {
    providers.push({ id: "gemini", model: createGoogleGenerativeAI({ apiKey: env.GEMINI_API_KEY })(env.GEMINI_MODEL) });
  }
  if (env.OPENROUTER_API_KEY && env.OPENROUTER_MODEL) {
    const openRouter = createOpenAICompatible({ name: "openrouter", baseURL: OPENROUTER_BASE_URL, apiKey: env.OPENROUTER_API_KEY });
    providers.push({ id: "openrouter", model: openRouter(env.OPENROUTER_MODEL) });
  }
  return providers;
}
