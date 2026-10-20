import { NextResponse } from "next/server";
import { jsonError, parseJsonBody } from "@/src/lib/http";
import { createSupabaseLeadStorage } from "@/src/lib/leads/repository";
import { acceptRequestSchema, MAX_MEETING_BODY_BYTES } from "@/src/lib/meetings/request";

export async function POST(request: Request) {
  const body = await parseJsonBody(request, acceptRequestSchema, MAX_MEETING_BODY_BYTES);
  if ("response" in body) return body.response;

  try {
    await createSupabaseLeadStorage().markAccepted(body.data.slug);
    return NextResponse.json({ ok: true });
  } catch (cause) {
    console.error(`[lead] ${cause instanceof Error ? cause.message : "unexpected failure"}`);
    return jsonError("accept_failed", 500);
  }
}
