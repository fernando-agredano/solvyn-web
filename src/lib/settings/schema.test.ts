import { describe, expect, it } from "vitest";
import { settingsFormSchema, todayInMexico } from "./schema";

const VALID_FORM = {
  hourlyRateMxn: "650",
  nextStartDate: "",
  availabilityMessage: "  ",
  whatsapp: "55 1234 5678",
  email: " hola@solvyn.mx ",
};

describe("settingsFormSchema", () => {
  it("accepts a complete form and normalizes it", () => {
    expect(settingsFormSchema.parse(VALID_FORM)).toEqual({
      hourlyRateMxn: 650,
      nextStartDate: null,
      availabilityMessage: null,
      whatsapp: "5512345678",
      email: "hola@solvyn.mx",
    });
  });

  it("rejects rates outside the allowed range and non-integer rates", () => {
    expect(
      settingsFormSchema.safeParse({ ...VALID_FORM, hourlyRateMxn: "50" })
        .success,
    ).toBe(false);
    expect(
      settingsFormSchema.safeParse({ ...VALID_FORM, hourlyRateMxn: "650.5" })
        .success,
    ).toBe(false);
  });

  it("rejects a start date in the past and accepts today", () => {
    expect(
      settingsFormSchema.safeParse({
        ...VALID_FORM,
        nextStartDate: "2020-01-01",
      }).success,
    ).toBe(false);
    expect(
      settingsFormSchema.safeParse({
        ...VALID_FORM,
        nextStartDate: todayInMexico(),
      }).success,
    ).toBe(true);
  });

  it("requires a ten-digit WhatsApp number and a valid email", () => {
    expect(
      settingsFormSchema.safeParse({ ...VALID_FORM, whatsapp: "12345" })
        .success,
    ).toBe(false);
    expect(
      settingsFormSchema.safeParse({ ...VALID_FORM, email: "no-es-correo" })
        .success,
    ).toBe(false);
  });

  it("rejects availability messages over the limit", () => {
    expect(
      settingsFormSchema.safeParse({
        ...VALID_FORM,
        availabilityMessage: "x".repeat(141),
      }).success,
    ).toBe(false);
  });
});
