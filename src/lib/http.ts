import { NextResponse } from "next/server";
import type { z } from "zod";

export const jsonError = (code: string, status: number) => NextResponse.json({ error: code }, { status });

// Reads a small JSON body and validates it. The size is checked on the real text because content-length can be absent or false.
export async function parseJsonBody<Schema extends z.ZodType>(
  request: Request,
  schema: Schema,
  maxBytes: number,
): Promise<{ data: z.output<Schema> } | { response: NextResponse }> {
  const rawBody = await request.text();
  if (Buffer.byteLength(rawBody) > maxBytes) return { response: jsonError("payload_too_large", 413) };

  let json: unknown;
  try {
    json = JSON.parse(rawBody);
  } catch {
    return { response: jsonError("invalid_json", 400) };
  }

  const parsed = schema.safeParse(json);
  return parsed.success ? { data: parsed.data } : { response: jsonError("invalid_request", 400) };
}
