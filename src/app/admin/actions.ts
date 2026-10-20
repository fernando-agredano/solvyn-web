"use server";

import { redirect } from "next/navigation";
import { ADMIN_LOGIN_PATH, assertSameOrigin } from "@/src/lib/admin/auth";
import { createSessionClient } from "@/src/lib/supabase/session";

// Global scope revokes every session of the admin, so a copied token stops working immediately.
export async function signOut(): Promise<void> {
  await assertSameOrigin();
  const supabase = await createSessionClient();
  await supabase.auth.signOut({ scope: "global" });
  redirect(ADMIN_LOGIN_PATH);
}
