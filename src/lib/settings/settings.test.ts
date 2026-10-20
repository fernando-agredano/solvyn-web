import { describe, expect, it, vi } from "vitest";
import {
  DEFAULT_SETTINGS,
  formatStartDate,
  type PublicSettings,
} from "./model";
import { getSettings } from "./settings";

const STORED: PublicSettings = {
  hourlyRateMxn: 750,
  nextStartDate: "2026-11-02",
  availabilityMessage: "Cupo limitado",
  whatsapp: "5512345678",
  email: "hola@solvyn.mx",
};

describe("getSettings", () => {
  it("returns the stored settings when the read works", async () => {
    await expect(getSettings(async () => STORED)).resolves.toEqual(STORED);
  });

  it("falls back to the defaults when the read fails, without throwing", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    await expect(
      getSettings(async () => {
        throw new Error("database is down");
      }),
    ).resolves.toEqual(DEFAULT_SETTINGS);
    warn.mockRestore();
  });
});

describe("formatStartDate", () => {
  it("writes the date in Spanish for Mexico without shifting the day", () => {
    expect(formatStartDate("2026-11-02")).toBe("2 de noviembre de 2026");
  });
});
