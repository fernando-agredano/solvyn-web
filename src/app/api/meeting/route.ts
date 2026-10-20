import { NextResponse } from "next/server";
import { jsonError, parseJsonBody } from "@/src/lib/http";
import { bookMeeting, defaultBookMeetingDeps } from "@/src/lib/meetings/book-meeting";
import { MAX_MEETING_BODY_BYTES, meetingRequestSchema } from "@/src/lib/meetings/request";

export async function POST(request: Request) {
  const body = await parseJsonBody(request, meetingRequestSchema, MAX_MEETING_BODY_BYTES);
  if ("response" in body) return body.response;

  try {
    await bookMeeting(body.data, defaultBookMeetingDeps());
    return NextResponse.json({ ok: true });
  } catch (cause) {
    console.error(`[meeting] ${cause instanceof Error ? cause.message : "unexpected failure"}`);
    return jsonError("meeting_failed", 500);
  }
}
