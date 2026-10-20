import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { normalizeEmail } from "@/src/lib/proposals/limits";
import { createSessionClient } from "@/src/lib/supabase/session";

export const ADMIN_LOGIN_PATH = "/admin/login";

// Reads process.env directly, not getServerEnv(): the proxy must not depend on unrelated variables being valid.
// Reads the variable on every call and fails closed: a missing ADMIN_EMAIL locks everybody out.
export function isAdminEmail(email: string | null | undefined): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || !email) return false;
  return normalizeEmail(email) === normalizeEmail(adminEmail);
}

// Next compares Origin with Host for Server Actions but lets requests without Origin through; the panel does not.
export function isSameOrigin(requestHeaders: Headers): boolean {
  const origin = requestHeaders.get("origin");
  if (!origin) return false;
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  try {
    if (new URL(origin).host !== host) return false;
  } catch {
    return false;
  }
  const fetchSite = requestHeaders.get("sec-fetch-site");
  return fetchSite === null || fetchSite === "same-origin";
}

// First line of every Server Action and mutating route handler of the panel.
export async function assertSameOrigin(): Promise<void> {
  if (!isSameOrigin(await headers()))
    throw new Error("Cross-origin request rejected");
}

// The user comes from the Auth server (not just the cookie), so a revoked session is detected here.
// Returns null for route handlers, which answer 401 themselves.
export const getAdminSession = cache(async () => {
  const supabase = await createSessionClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user || !isAdminEmail(data.user.email)) return null;
  return { supabase, user: data.user };
});

// For pages and Server Actions. Call it in every one of them: layouts don't guard the pages inside them.
export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect(ADMIN_LOGIN_PATH);
  return session;
}
