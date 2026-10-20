// Shared by the session client and the proxy. Only public values: the anon key is safe to expose, the service role never goes through here.
export function getSupabasePublicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey)
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  return { url, anonKey };
}

// @supabase/ssr defaults to httpOnly: false so the browser client can read the session. The panel never
// uses the browser client, so the session cookies are hidden from scripts.
export const ADMIN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
} as const;
