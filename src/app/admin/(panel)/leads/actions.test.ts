import { beforeEach, describe, expect, it, vi } from "vitest";

const update = vi.fn();
const eq = vi.fn();
const select = vi.fn();
const requireAdmin = vi.fn();
const assertSameOrigin = vi.fn();

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/src/lib/admin/auth", () => ({
  requireAdmin: () => requireAdmin(),
  assertSameOrigin: () => assertSameOrigin(),
}));

const { updateLeadStatus, saveLeadNotes } = await import("./actions");

const LEAD_ID = "3f2b8a1e-6c4d-4e8f-9a1b-2c3d4e5f6a7b";
const idle = { status: "idle" } as const;

const formWith = (fields: Record<string, string>) => {
  const form = new FormData();
  Object.entries(fields).forEach(([name, value]) => form.set(name, value));
  return form;
};

beforeEach(() => {
  [update, eq, select, requireAdmin, assertSameOrigin].forEach((mock) =>
    mock.mockReset(),
  );
  // The builder chain: update(...).eq(...).select("id") resolves with the rows that changed.
  update.mockReturnValue({ eq });
  eq.mockReturnValue({ select });
  select.mockResolvedValue({ data: [{ id: LEAD_ID }], error: null });
  requireAdmin.mockResolvedValue({ supabase: { from: () => ({ update }) } });
});

describe("updateLeadStatus", () => {
  it("checks the session before writing", async () => {
    requireAdmin.mockRejectedValue(new Error("REDIRECT:/admin/login"));
    await expect(
      updateLeadStatus(idle, formWith({ id: LEAD_ID, estado: "contactado" })),
    ).rejects.toThrow("REDIRECT");
    expect(update).not.toHaveBeenCalled();
  });

  it("refuses a cross-origin request before anything else", async () => {
    assertSameOrigin.mockRejectedValue(
      new Error("Cross-origin request rejected"),
    );
    await expect(
      updateLeadStatus(idle, formWith({ id: LEAD_ID, estado: "contactado" })),
    ).rejects.toThrow("Cross-origin");
    expect(requireAdmin).not.toHaveBeenCalled();
  });

  it("rejects a status outside the list without writing", async () => {
    expect(
      await updateLeadStatus(idle, formWith({ id: LEAD_ID, estado: "pagado" })),
    ).toEqual({ status: "error" });
    expect(update).not.toHaveBeenCalled();
  });

  it("rejects a malformed id", async () => {
    expect(
      await updateLeadStatus(
        idle,
        formWith({ id: "../../etc", estado: "nuevo" }),
      ),
    ).toEqual({ status: "error" });
    expect(update).not.toHaveBeenCalled();
  });

  it("saves a valid status", async () => {
    expect(
      await updateLeadStatus(
        idle,
        formWith({ id: LEAD_ID, estado: "reunion" }),
      ),
    ).toEqual({ status: "saved" });
    expect(update).toHaveBeenCalledWith({ estado: "reunion" });
    expect(eq).toHaveBeenCalledWith("id", LEAD_ID);
  });

  it("reports an error when RLS changed zero rows", async () => {
    select.mockResolvedValue({ data: [], error: null });
    expect(
      await updateLeadStatus(
        idle,
        formWith({ id: LEAD_ID, estado: "cerrado" }),
      ),
    ).toEqual({ status: "error" });
  });
});

describe("saveLeadNotes", () => {
  it("trims notes and stores blank notes as null", async () => {
    await saveLeadNotes(idle, formWith({ id: LEAD_ID, notas: "   " }));
    expect(update).toHaveBeenCalledWith({ notas: null });
  });

  it("rejects notes longer than the limit", async () => {
    expect(
      await saveLeadNotes(
        idle,
        formWith({ id: LEAD_ID, notas: "a".repeat(2001) }),
      ),
    ).toEqual({ status: "error" });
    expect(update).not.toHaveBeenCalled();
  });
});
