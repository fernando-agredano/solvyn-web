import { createClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";
import { getSupabasePublicConfig } from "@/src/lib/supabase/public-config";
import {
  DEFAULT_SETTINGS,
  toPublicSettings,
  type PublicSettings,
  type SettingsRow,
} from "./model";

export const SETTINGS_TAG = "settings";

export const SETTINGS_COLUMNS =
  "hourly_rate_mxn, next_start_date, availability_message, whatsapp, email";

// Returns null instead of throwing: a cache fill that rejects is reported as a build error on whatever page
// triggered it. A failed read is cached like a good one, so the placeholders can last up to a few minutes after a
// transient outage; a shorter profile for failures breaks static prerendering of the layout.
async function readPublicSettings(): Promise<PublicSettings | null> {
  "use cache";
  cacheTag(SETTINGS_TAG);
  cacheLife("minutes");
  try {
    const { url, anonKey } = getSupabasePublicConfig();
    const supabase = createClient(url, anonKey, {
      auth: { persistSession: false },
    });
    const { data, error } = await supabase
      .from("public_settings")
      .select(SETTINGS_COLUMNS)
      .single();
    if (error || !data) throw new Error(error?.code ?? "no row");
    return toPublicSettings(data as SettingsRow);
  } catch (error) {
    console.warn(
      `[settings] read failed, using defaults: ${error instanceof Error ? error.message : "unknown error"}`,
    );
    return null;
  }
}

// The site must never fail because settings can't be read: the placeholders and the default rate are used instead.
export async function getSettings(
  read: () => Promise<PublicSettings | null> = readPublicSettings,
): Promise<PublicSettings> {
  const settings = await read().catch(() => null);
  return settings ?? DEFAULT_SETTINGS;
}
