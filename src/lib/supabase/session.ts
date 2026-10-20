import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_OPTIONS, getSupabasePublicConfig } from "./public-config";

// Client bound to the signed-in user's cookies: queries run as that user, so RLS applies.
export async function createSessionClient() {
  const { url, anonKey } = getSupabasePublicConfig();
  const cookieStore = await cookies();
  return createServerClient(url, anonKey, {
    cookieOptions: ADMIN_COOKIE_OPTIONS,
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Components can't write cookies; the proxy already refreshed the session for this request.
        }
      },
    },
  });
}

// Stateless client for requests that must not touch cookies (no PKCE verifier is stored, so the emailed token_hash flow applies), such as asking Supabase to email a login link.
export function createAnonClient() {
  const { url, anonKey } = getSupabasePublicConfig();
  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
