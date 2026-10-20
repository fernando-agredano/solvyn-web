import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const getUser = vi.fn();
const redirect = vi.fn((path: string) => {
  throw new Error(`REDIRECT:${path}`);
});

vi.mock("next/headers", () => ({ headers: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect }));
vi.mock("react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react")>()),
  cache: <T>(fn: T) => fn,
}));
vi.mock("@/src/lib/supabase/session", () => ({
  createSessionClient: async () => ({ auth: { getUser } }),
}));

const { getAdminSession, isAdminEmail, isSameOrigin, requireAdmin } =
  await import("./auth");

beforeEach(() => {
  vi.stubEnv("ADMIN_EMAIL", "owner@solvyn.mx");
  getUser.mockReset();
  redirect.mockClear();
});

afterEach(() => vi.unstubAllEnvs());

describe("isAdminEmail", () => {
  it("accepts the admin address ignoring case and spaces", () => {
    expect(isAdminEmail(" Owner@Solvyn.MX ")).toBe(true);
  });

  it.each([
    "owner@solvyn.mx.evil.com",
    "owner+1@solvyn.mx",
    "evil@solvyn.mx",
    "",
    null,
    undefined,
  ])("rejects %s", (email) => {
    expect(isAdminEmail(email)).toBe(false);
  });

  it("fails closed when ADMIN_EMAIL is not configured", () => {
    vi.stubEnv("ADMIN_EMAIL", "");
    expect(isAdminEmail("owner@solvyn.mx")).toBe(false);
    expect(isAdminEmail("")).toBe(false);
  });
});

describe("isSameOrigin", () => {
  const build = (headers: Record<string, string>) => new Headers(headers);

  it("accepts an origin that matches the host", () => {
    expect(
      isSameOrigin(
        build({
          origin: "https://solvyn.mx",
          host: "solvyn.mx",
          "sec-fetch-site": "same-origin",
        }),
      ),
    ).toBe(true);
  });

  it("prefers x-forwarded-host behind a proxy", () => {
    expect(
      isSameOrigin(
        build({
          origin: "https://solvyn.mx",
          host: "internal:3000",
          "x-forwarded-host": "solvyn.mx",
        }),
      ),
    ).toBe(true);
  });

  it("rejects a request without Origin", () => {
    expect(isSameOrigin(build({ host: "solvyn.mx" }))).toBe(false);
  });

  it("rejects another origin", () => {
    expect(
      isSameOrigin(build({ origin: "https://evil.com", host: "solvyn.mx" })),
    ).toBe(false);
  });

  it("rejects a malformed origin", () => {
    expect(
      isSameOrigin(build({ origin: "not a url", host: "solvyn.mx" })),
    ).toBe(false);
  });

  it("rejects a cross-site fetch even if Origin matches", () => {
    expect(
      isSameOrigin(
        build({
          origin: "https://solvyn.mx",
          host: "solvyn.mx",
          "sec-fetch-site": "cross-site",
        }),
      ),
    ).toBe(false);
  });
});

describe("requireAdmin", () => {
  it("redirects to the login when there is no session", async () => {
    getUser.mockResolvedValue({
      data: { user: null },
      error: { message: "no session" },
    });
    await expect(requireAdmin()).rejects.toThrow("REDIRECT:/admin/login");
  });

  it("rejects a signed-in user with a different email", async () => {
    getUser.mockResolvedValue({
      data: { user: { email: "someone@else.com" } },
      error: null,
    });
    await expect(requireAdmin()).rejects.toThrow("REDIRECT:/admin/login");
    expect(await getAdminSession()).toBeNull();
  });

  it("lets the admin through", async () => {
    getUser.mockResolvedValue({
      data: { user: { email: "owner@solvyn.mx" } },
      error: null,
    });
    const session = await requireAdmin();
    expect(session.user.email).toBe("owner@solvyn.mx");
    expect(redirect).not.toHaveBeenCalled();
  });
});
