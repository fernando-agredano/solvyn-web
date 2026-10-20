import { createClient } from "@supabase/supabase-js";
import { getServerEnv } from "@/src/lib/env";

// Service-role client: bypasses RLS. Only import from server routes, never from client components.
export function createServiceClient() {
  const env = getServerEnv();
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
