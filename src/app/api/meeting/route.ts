import { NextResponse } from "next/server";
import { bookMeeting, defaultBookMeetingDeps } from "@/src/lib/meetings/book-meeting";
import { MAX_MEETING_BODY_BYTES, meetingRequestSchema } from "@/src/lib/meetings/request";

const error = (code: string, status: number) => NextResponse.json({ error: code }, { status });

export async function POST(request: Request) {
  const rawBody = await request.text();
  if (Buffer.byteLength(rawBody) > MAX_MEETING_BODY_BYTES) return error("payload_too_large", 413);

  let json: unknown;
  try {
    json = JSON.parse(rawBody);
  } catch {
    return error("invalid_json", 400);
  }

  const parsed = meetingRequestSchema.safeParse(json);
  if (!parsed.success) return error("invalid_request", 400);

  try {
    await bookMeeting(parsed.data, defaultBookMeetingDeps());
    return NextResponse.json({ ok: true });
  } catch (cause) {
    console.error(`[meeting] ${cause instanceof Error ? cause.message : "unexpected failure"}`);
    return error("meeting_failed", 500);
  }
}
