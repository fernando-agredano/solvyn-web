import { describe, expect, it } from "vitest";
import { buildDailySeries } from "./series";

const NOW = new Date("2026-10-20T18:00:00Z"); // 12:00 in Mexico City

describe("buildDailySeries", () => {
  it("returns one entry per day, oldest first, ending today", () => {
    const series = buildDailySeries([], NOW, 3);
    expect(series.map((entry) => entry.date)).toEqual([
      "2026-10-18",
      "2026-10-19",
      "2026-10-20",
    ]);
    expect(series.every((entry) => entry.count === 0)).toBe(true);
  });

  it("counts leads on the day they were created in Mexico City time", () => {
    const series = buildDailySeries(
      [
        new Date("2026-10-20T05:30:00Z"), // 23:30 on the 19th in Mexico City
        new Date("2026-10-19T15:00:00Z"),
        new Date("2026-10-19T16:00:00Z"),
      ],
      NOW,
      3,
    );
    expect(series).toEqual([
      { date: "2026-10-18", count: 0 },
      { date: "2026-10-19", count: 3 },
      { date: "2026-10-20", count: 0 },
    ]);
  });

  it("ignores leads older than the window", () => {
    const series = buildDailySeries([new Date("2026-08-01T12:00:00Z")], NOW, 3);
    expect(series.reduce((total, entry) => total + entry.count, 0)).toBe(0);
  });
});
