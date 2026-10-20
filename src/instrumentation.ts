// Runs once when the server starts: fail fast in production, only complain in development so the landing keeps working.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { getAiConfigWarnings, getServerEnv } = await import("@/src/lib/env");
  try {
    getAiConfigWarnings(getServerEnv()).forEach((warning) => console.warn(`[env] ${warning}`));
  } catch (error) {
    if (process.env.NODE_ENV === "production") throw error;
    console.error(`[env] ${error instanceof Error ? error.message : "Invalid environment variables"}`);
  }
}
