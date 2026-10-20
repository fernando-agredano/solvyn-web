import { NextResponse } from "next/server";
import { createProposal, defaultCreateProposalDeps } from "@/src/lib/proposals/create-proposal";
import { getClientIp } from "@/src/lib/proposals/limits";
import { createSupabaseStorage } from "@/src/lib/proposals/repository";
import { MAX_BODY_BYTES, proposalRequestSchema } from "@/src/lib/proposals/request";

const error = (code: string, status: number) => NextResponse.json({ error: code }, { status });

export async function POST(request: Request) {
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) return error("payload_too_large", 413);

  // content-length can be absent or false, so the real size is checked too.
  const rawBody = await request.text();
  if (Buffer.byteLength(rawBody) > MAX_BODY_BYTES) return error("payload_too_large", 413);

  let json: unknown;
  try {
    json = JSON.parse(rawBody);
  } catch {
    return error("invalid_json", 400);
  }

  const parsed = proposalRequestSchema.safeParse(json);
  if (!parsed.success) return error("invalid_request", 400);

  try {
    const { slug, source } = await createProposal(
      parsed.data,
      getClientIp(request.headers),
      defaultCreateProposalDeps(createSupabaseStorage()),
    );
    return NextResponse.json({ slug, source });
  } catch (cause) {
    // Never log the request or the environment: only the kind of failure.
    console.error(`[proposal] ${cause instanceof Error ? cause.message : "unexpected failure"}`);
    return error("proposal_failed", 500);
  }
}
