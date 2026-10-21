import { describe, expect, it } from "vitest";
import { describeChanges, toDraft } from "./changes";
import type { PublicSettings } from "./model";

const SAVED: PublicSettings = {
  hourlyRateMxn: 600,
  nextStartDate: null,
  availabilityMessage: null,
  whatsapp: "5512345678",
  email: "hola@solvyn.mx",
};

describe("describeChanges", () => {
  it("returns nothing when the form matches the saved settings", () => {
    expect(describeChanges(toDraft(SAVED), toDraft(SAVED))).toEqual([]);
  });

  it("describes each changed field with its old and new value", () => {
    const changes = describeChanges(toDraft(SAVED), {
      ...toDraft(SAVED),
      hourlyRateMxn: "700",
      nextStartDate: "2026-11-02",
    });
    expect(changes.map((change) => change.label)).toEqual([
      "Tarifa por hora",
      "Próximo inicio",
    ]);
    expect(changes[0].to).toContain("700");
    expect(changes[1]).toMatchObject({
      from: "Sin fecha",
      to: "2 de noviembre de 2026",
    });
  });

  it("ignores surrounding whitespace", () => {
    expect(
      describeChanges(toDraft(SAVED), {
        ...toDraft(SAVED),
        email: " hola@solvyn.mx ",
      }),
    ).toEqual([]);
  });
});
