import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_LOGIN_PATH, isAdminEmail } from "@/src/lib/admin/auth";
import {
  ADMIN_COOKIE_OPTIONS,
  getSupabasePublicConfig,
} from "@/src/lib/supabase/public-config";

// Reachable without a session: they are how a session starts.
const PUBLIC_ADMIN_PATHS = new Set([ADMIN_LOGIN_PATH, "/admin/auth/confirm"]);

// Quick pre-filter and session refresh. Authorization is enforced again in every page, action and route.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (PUBLIC_ADMIN_PATHS.has(pathname)) return NextResponse.next();

  const { url, anonKey } = getSupabasePublicConfig();
  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, anonKey, {
    cookieOptions: ADMIN_COOKIE_OPTIONS,
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  if (isAdminEmail(data?.claims.email)) return response;

  const wantsData =
    pathname.startsWith("/admin/api/") || request.headers.has("next-action");
  if (wantsData)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
}

export const config = { matcher: ["/admin/:path*"] };
