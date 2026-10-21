import { describe, expect, it } from "vitest";
import { addDays, buildMonthGrid, monthLabel, shiftMonth } from "./calendar";

describe("buildMonthGrid", () => {
  it("starts each week on Sunday and pads the first week with empty cells", () => {
    // 1 October 2026 is a Thursday.
    const grid = buildMonthGrid({ year: 2026, month: 9 });
    expect(grid[0].slice(0, 4)).toEqual([null, null, null, null]);
    expect(grid[0][4]).toBe("2026-10-01");
    expect(grid.every((week) => week.length === 7)).toBe(true);
  });

  it("contains every day of the month exactly once", () => {
    // 1 November 2026 is a Sunday: five full-ish weeks.
    const grid = buildMonthGrid({ year: 2026, month: 10 });
    const days = grid.flat().filter((cell) => cell !== null);
    expect(grid).toHaveLength(5);
    expect(grid[0][0]).toBe("2026-11-01");
    expect(days).toHaveLength(30);
    expect(days.at(-1)).toBe("2026-11-30");
  });
});

describe("addDays", () => {
  it("crosses month and year boundaries", () => {
    expect(addDays("2026-10-31", 1)).toBe("2026-11-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
  });
});

describe("shiftMonth and monthLabel", () => {
  it("rolls the year over", () => {
    expect(shiftMonth({ year: 2026, month: 11 }, 1)).toEqual({
      year: 2027,
      month: 0,
    });
    expect(shiftMonth({ year: 2026, month: 0 }, -1)).toEqual({
      year: 2025,
      month: 11,
    });
  });

  it("names the month in Spanish with a capital letter", () => {
    expect(monthLabel({ year: 2026, month: 10 })).toBe("Noviembre 2026");
  });
});
