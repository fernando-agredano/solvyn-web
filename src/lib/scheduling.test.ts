import { describe, expect, it } from "vitest";
import { formatMeetingLabel, getMeetingParts } from "@/src/lib/scheduling";

describe("getMeetingParts", () => {
  it("converts an instant to the date and time in Mexico", () => {
    expect(getMeetingParts(new Date("2026-10-21T16:00:00Z"))).toEqual({ date: "2026-10-21", time: "10:00" });
  });

  it("uses the Mexico date, not the UTC one", () => {
    // 03:30 UTC on Oct 22 is still Oct 21 at 21:30 in Mexico City.
    expect(getMeetingParts(new Date("2026-10-22T03:30:00Z"))).toEqual({ date: "2026-10-21", time: "21:30" });
  });
});

describe("formatMeetingLabel", () => {
  it("writes the date in long Spanish form", () => {
    expect(formatMeetingLabel("2026-10-21", "10:00")).toBe("miércoles 21 de octubre a las 10:00");
  });
});
