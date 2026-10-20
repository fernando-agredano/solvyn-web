"use server";

import { after } from "next/server";
import { z } from "zod";
import { assertSameOrigin, isAdminEmail } from "@/src/lib/admin/auth";
import { normalizeEmail } from "@/src/lib/proposals/limits";
import { createAnonClient } from "@/src/lib/supabase/session";

export type LoginState = { status: "idle" | "sent" | "invalid" };

const emailSchema = z.email();

// The answer never depends on whether the address has access, and the email goes out after the response,
// so neither the content nor the timing reveals who the admin is.
export async function requestLoginLink(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  await assertSameOrigin();

  const parsed = emailSchema.safeParse(
    normalizeEmail(String(formData.get("email") ?? "")),
  );
  if (!parsed.success) return { status: "invalid" };

  const email = parsed.data;
  if (isAdminEmail(email)) {
    after(async () => {
      const { error } = await createAnonClient().auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false },
      });
      if (error)
        console.error(`[admin] login link failed: ${error.code ?? "unknown"}`);
    });
  }
  return { status: "sent" };
}
