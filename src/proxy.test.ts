import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const getClaims = vi.fn();

vi.mock("@supabase/ssr", () => ({
  createServerClient: () => ({ auth: { getClaims } }),
}));

const { proxy } = await import("./proxy");

const request = (path: string, headers: Record<string, string> = {}) =>
  new NextRequest(`http://localhost:3000${path}`, { headers });

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://supabase.test");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
  vi.stubEnv("ADMIN_EMAIL", "owner@solvyn.mx");
  getClaims.mockReset();
});

describe("proxy", () => {
  it("redirects a page request without session to the login", async () => {
    getClaims.mockResolvedValue({
      data: null,
      error: { message: "no session" },
    });
    const response = await proxy(request("/admin"));
    expect(response.status).toBe(307);
    expect(new URL(response.headers.get("location") ?? "").pathname).toBe(
      "/admin/login",
    );
  });

  it("answers 401 to data routes and Server Actions without session", async () => {
    getClaims.mockResolvedValue({
      data: null,
      error: { message: "no session" },
    });
    expect((await proxy(request("/admin/api/leads"))).status).toBe(401);
    expect(
      (await proxy(request("/admin/leads", { "next-action": "abc" }))).status,
    ).toBe(401);
  });

  it("rejects a valid session of another email", async () => {
    getClaims.mockResolvedValue({
      data: { claims: { email: "someone@else.com" } },
      error: null,
    });
    const response = await proxy(request("/admin"));
    expect(response.status).toBe(307);
    expect(new URL(response.headers.get("location") ?? "").pathname).toBe(
      "/admin/login",
    );
  });

  it("lets the admin through", async () => {
    getClaims.mockResolvedValue({
      data: { claims: { email: "owner@solvyn.mx" } },
      error: null,
    });
    const response = await proxy(request("/admin"));
    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });

  it("leaves the login and confirmation pages public without calling Supabase", async () => {
    expect((await proxy(request("/admin/login"))).status).toBe(200);
    expect((await proxy(request("/admin/auth/confirm"))).status).toBe(200);
    expect(getClaims).not.toHaveBeenCalled();
  });
});
