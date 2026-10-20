import { beforeEach, describe, expect, it, vi } from "vitest";

const memory = new Map<string, string>();
const storage = {
  getItem: (key: string) => memory.get(key) ?? null,
  setItem: (key: string, value: string) => void memory.set(key, value),
  removeItem: (key: string) => void memory.delete(key),
};
// zustand only persists when it believes it runs in a browser.
vi.stubGlobal("window", { localStorage: storage });
vi.stubGlobal("localStorage", storage);

const { useConfiguratorStore } = await import("@/src/lib/configurator/store");

describe("store restore", () => {
  beforeEach(() => memory.clear());

  it("keeps contact data and the meeting in memory when the saved answers are restored", async () => {
    const { setAnswer } = useConfiguratorStore.getState();
    setAnswer("goals", ["citas"]);
    setAnswer("contactEmail", "ana@negocio.com");
    setAnswer("consent", true);
    setAnswer("meetingDate", "2026-10-21");

    await useConfiguratorStore.persist.rehydrate();

    const state = useConfiguratorStore.getState();
    expect(state.goals).toEqual(["citas"]);
    expect(state.contactEmail).toBe("ana@negocio.com");
    expect(state.consent).toBe(true);
    expect(state.meetingDate).toBe("2026-10-21");
  });

  it("never writes contact data or the meeting to storage", () => {
    useConfiguratorStore.getState().setAnswer("contactEmail", "ana@negocio.com");
    useConfiguratorStore.getState().setAnswer("meetingTime", "10:00");
    const saved = memory.get("solvyn:configurator") ?? "";
    expect(saved).not.toContain("ana@negocio.com");
    expect(saved).not.toContain("meetingTime");
  });
});
