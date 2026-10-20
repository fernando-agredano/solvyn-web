import { describe, expect, it } from "vitest";
import { acceptRequestSchema, meetingRequestSchema } from "./request";

const slug = "a".repeat(22);
const inDays = (days: number) => new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

describe("meetingRequestSchema", () => {
  it("accepts a slug and a near future instant", () => {
    const parsed = meetingRequestSchema.parse({ slug, startTime: inDays(2) });
    expect(parsed.startTime).toBeInstanceOf(Date);
  });

  it("rejects bad slugs, past instants, far away instants and non-dates", () => {
    expect(meetingRequestSchema.safeParse({ slug: "short", startTime: inDays(2) }).success).toBe(false);
    expect(meetingRequestSchema.safeParse({ slug, startTime: inDays(-30) }).success).toBe(false);
    expect(meetingRequestSchema.safeParse({ slug, startTime: inDays(800) }).success).toBe(false);
    expect(meetingRequestSchema.safeParse({ slug, startTime: "mañana" }).success).toBe(false);
  });
});

describe("acceptRequestSchema", () => {
  it("only accepts a well formed slug", () => {
    expect(acceptRequestSchema.safeParse({ slug }).success).toBe(true);
    expect(acceptRequestSchema.safeParse({ slug: "../etc" }).success).toBe(false);
  });
});
