import { createHmac } from "node:crypto";
import { getServerEnv } from "@/src/lib/env";

export const MAX_GENERATIONS_PER_WINDOW = 3;
export const GENERATION_WINDOW_MS = 24 * 60 * 60 * 1000;

// Keyed hash: the raw IP or email is never stored, and the hashes can't be reversed with a lookup table without the salt.
export function hashIdentifier(value: string): string {
  return createHmac("sha256", getServerEnv().HASH_SALT).update(value).digest("hex");
}

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

// Behind Vercel the first x-forwarded-for entry is the client.
export function getClientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}

export const isOverLimit = (counts: { byIp: number; byEmail: number }) =>
  counts.byIp >= MAX_GENERATIONS_PER_WINDOW || counts.byEmail >= MAX_GENERATIONS_PER_WINDOW;
