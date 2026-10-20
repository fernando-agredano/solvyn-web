import { z } from "zod";

// Never put values in error messages: only variable names and the reason.
const serverEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  // Salt for hashing IPs and emails in generation_log.
  HASH_SALT: z.string().min(16, "must be at least 16 characters"),
  // AI providers are optional: a provider without key and model is skipped and the chain falls back to rules.
  GEMINI_API_KEY: z.string().min(1).optional(),
  GEMINI_MODEL: z.string().min(1).optional(),
  OPENROUTER_API_KEY: z.string().min(1).optional(),
  OPENROUTER_MODEL: z.string().min(1).optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cachedEnv: ServerEnv | null = null;

export function parseServerEnv(source: Record<string, string | undefined>): ServerEnv {
  const result = serverEnvSchema.safeParse(source);
  if (!result.success) {
    const problems = result.error.issues.map((issue) => {
      const name = issue.path.join(".");
      return source[name] === undefined || source[name] === "" ? `${name} is missing` : `${name} is invalid (${issue.message})`;
    });
    throw new Error(`Invalid environment variables:\n- ${problems.join("\n- ")}\nCheck .env.local (or the Vercel project settings).`);
  }
  return result.data;
}

export function getServerEnv(): ServerEnv {
  cachedEnv ??= parseServerEnv(process.env);
  return cachedEnv;
}

// Providers that are half configured would silently never run: say so at startup.
export function getAiConfigWarnings(env: ServerEnv): string[] {
  const warnings: string[] = [];
  if (!env.GEMINI_API_KEY || !env.GEMINI_MODEL) warnings.push("Gemini is disabled: set GEMINI_API_KEY and GEMINI_MODEL");
  if (!env.OPENROUTER_API_KEY || !env.OPENROUTER_MODEL) {
    warnings.push("OpenRouter is disabled: set OPENROUTER_API_KEY and OPENROUTER_MODEL");
  }
  return warnings;
}
