import { beforeEach, describe, expect, it, vi } from "vitest";

const sameOriginHeaders = new Headers({
  origin: "https://solvyn.mx",
  host: "solvyn.mx",
});
const afterCallbacks: Array<() => Promise<void>> = [];
const signInWithOtp = vi.fn();
const verifyOtp = vi.fn();
const signOut = vi.fn();
const rpc = vi.fn();

vi.mock("next/headers", () => ({ headers: async () => sameOriginHeaders }));
vi.mock("next/navigation", () => ({
  redirect: (path: string) => {
    throw new Error(`REDIRECT:${path}`);
  },
}));
vi.mock("next/server", () => ({
  after: (callback: () => Promise<void>) => afterCallbacks.push(callback),
}));
vi.mock("react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react")>()),
  cache: <T>(fn: T) => fn,
}));
vi.mock("@/src/lib/supabase/session", () => ({
  createAnonClient: () => ({ auth: { signInWithOtp } }),
  createSessionClient: async () => ({ auth: { verifyOtp, signOut }, rpc }),
}));

const { requestLoginLink } = await import("./login/actions");
const { confirmLogin } = await import("./auth/confirm/actions");
const { signOut: signOutAction } = await import("./actions");

const formWith = (fields: Record<string, string>) => {
  const form = new FormData();
  Object.entries(fields).forEach(([name, value]) => form.set(name, value));
  return form;
};

beforeEach(() => {
  vi.stubEnv("ADMIN_EMAIL", "owner@solvyn.mx");
  afterCallbacks.length = 0;
  [signInWithOtp, verifyOtp, signOut, rpc].forEach((mock) => mock.mockReset());
  signInWithOtp.mockResolvedValue({ error: null });
  signOut.mockResolvedValue({ error: null });
});

const idle = { status: "idle" } as const;

describe("requestLoginLink", () => {
  it("answers the same for the admin and for any other address", async () => {
    const forAdmin = await requestLoginLink(
      idle,
      formWith({ email: "owner@solvyn.mx" }),
    );
    const forStranger = await requestLoginLink(
      idle,
      formWith({ email: "stranger@else.com" }),
    );
    expect(forAdmin).toEqual(forStranger);
  });

  it("sends the link only to the admin, never creating users, and only after responding", async () => {
    await requestLoginLink(idle, formWith({ email: "stranger@else.com" }));
    expect(afterCallbacks).toHaveLength(0);

    await requestLoginLink(idle, formWith({ email: " Owner@Solvyn.mx " }));
    expect(signInWithOtp).not.toHaveBeenCalled();
    await Promise.all(afterCallbacks.map((callback) => callback()));
    expect(signInWithOtp).toHaveBeenCalledWith({
      email: "owner@solvyn.mx",
      options: { shouldCreateUser: false },
    });
  });

  it("asks for a valid email without calling Supabase", async () => {
    expect(await requestLoginLink(idle, formWith({ email: "nope" }))).toEqual({
      status: "invalid",
    });
    expect(afterCallbacks).toHaveLength(0);
  });
});

describe("confirmLogin", () => {
  const token = formWith({ token_hash: "a-valid-token-hash" });

  it("signs the admin in", async () => {
    verifyOtp.mockResolvedValue({
      data: { user: { email: "owner@solvyn.mx" } },
      error: null,
    });
    rpc.mockResolvedValue({ data: true });
    await expect(confirmLogin(token)).rejects.toThrow("REDIRECT:/admin");
    expect(signOut).not.toHaveBeenCalled();
  });

  it("signs out a valid session of another email", async () => {
    verifyOtp.mockResolvedValue({
      data: { user: { email: "stranger@else.com" } },
      error: null,
    });
    await expect(confirmLogin(token)).rejects.toThrow(
      "REDIRECT:/admin/login?error=link",
    );
    expect(signOut).toHaveBeenCalled();
  });

  it("signs out the right email when the database does not list it as admin", async () => {
    verifyOtp.mockResolvedValue({
      data: { user: { email: "owner@solvyn.mx" } },
      error: null,
    });
    rpc.mockResolvedValue({ data: false });
    await expect(confirmLogin(token)).rejects.toThrow(
      "REDIRECT:/admin/login?error=link",
    );
    expect(signOut).toHaveBeenCalled();
  });

  it("rejects an invalid or expired token", async () => {
    verifyOtp.mockResolvedValue({
      data: { user: null },
      error: { message: "expired" },
    });
    await expect(confirmLogin(token)).rejects.toThrow(
      "REDIRECT:/admin/login?error=link",
    );
    await expect(confirmLogin(formWith({ token_hash: "x" }))).rejects.toThrow(
      "REDIRECT:/admin/login?error=link",
    );
  });

  it("refuses a cross-origin request before touching Supabase", async () => {
    sameOriginHeaders.set("origin", "https://evil.com");
    await expect(confirmLogin(token)).rejects.toThrow(
      "Cross-origin request rejected",
    );
    expect(verifyOtp).not.toHaveBeenCalled();
    sameOriginHeaders.set("origin", "https://solvyn.mx");
  });
});

describe("signOut", () => {
  it("revokes every session and goes back to the login", async () => {
    await expect(signOutAction()).rejects.toThrow("REDIRECT:/admin/login");
    expect(signOut).toHaveBeenCalledWith({ scope: "global" });
  });
});
