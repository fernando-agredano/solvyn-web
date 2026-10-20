"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import {
  ADMIN_LOGIN_PATH,
  assertSameOrigin,
  isAdminEmail,
} from "@/src/lib/admin/auth";
import { createSessionClient } from "@/src/lib/supabase/session";

const tokenHashSchema = z.string().min(8).max(256);

const loginFailedPath = `${ADMIN_LOGIN_PATH}?error=link`;

// Runs from a button, not on page load: mail scanners that open links would otherwise burn the one-time token.
export async function confirmLogin(formData: FormData): Promise<void> {
  await assertSameOrigin();

  const tokenHash = tokenHashSchema.safeParse(formData.get("token_hash"));
  if (!tokenHash.success) redirect(loginFailedPath);

  const supabase = await createSessionClient();
  const { data, error } = await supabase.auth.verifyOtp({
    type: "email",
    token_hash: tokenHash.data,
  });

  // Two independent checks: the address matches ADMIN_EMAIL and the database lists the user as admin.
  const isAdmin =
    !error &&
    isAdminEmail(data.user?.email) &&
    (await supabase.rpc("is_admin")).data === true;
  if (!isAdmin) {
    await supabase.auth.signOut();
    redirect(loginFailedPath);
  }
  redirect("/admin");
}
