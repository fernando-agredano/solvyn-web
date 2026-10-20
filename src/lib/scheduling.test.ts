import { describe, expect, it } from "vitest";
import { formatMeetingLabel, getNextBusinessDays } from "@/src/lib/scheduling";

const isoDates = (now: string) => getNextBusinessDays(new Date(now)).map((day) => day.iso);

describe("getNextBusinessDays", () => {
  it("returns the next five weekdays, starting tomorrow", () => {
    expect(isoDates("2026-10-19T18:00:00Z")).toEqual(["2026-10-20", "2026-10-21", "2026-10-22", "2026-10-23", "2026-10-26"]);
  });

  it("skips the weekend", () => {
    expect(isoDates("2026-10-23T18:00:00Z")).toEqual(["2026-10-26", "2026-10-27", "2026-10-28", "2026-10-29", "2026-10-30"]);
    expect(isoDates("2026-10-24T18:00:00Z")[0]).toBe("2026-10-26");
  });

  it("uses the date in Mexico, not in UTC", () => {
    // 03:00 UTC on Oct 20 is still Monday night, Oct 19, in Mexico City.
    expect(isoDates("2026-10-20T03:00:00Z")[0]).toBe("2026-10-20");
  });

  it("labels each day with weekday, number and month", () => {
    expect(getNextBusinessDays(new Date("2026-10-19T18:00:00Z"))[1]).toEqual({
      iso: "2026-10-21",
      weekday: "Mié",
      day: 21,
      month: "oct",
    });
  });
});

describe("formatMeetingLabel", () => {
  it("writes the date in long Spanish form", () => {
    expect(formatMeetingLabel("2026-10-21", "10:00")).toBe("miércoles 21 de octubre a las 10:00");
  });
});
