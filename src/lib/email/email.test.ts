import { describe, expect, it, vi } from "vitest";
import type { LeadStorage } from "@/src/lib/leads/repository";
import { bookMeeting } from "@/src/lib/meetings/book-meeting";
import { createNotifier } from "./notifications";
import { buildClientProposalEmail, buildOwnerLeadEmail, buildOwnerMeetingEmail, type LeadEmailData } from "./templates";
import type { EmailMessage, EmailTransport } from "./transport";

const lead: LeadEmailData = {
  name: "Ana <script>alert(1)</script>",
  email: "ana@ejemplo.com",
  whatsapp: "55 1234 5678",
  score: 75,
  label: "caliente",
  goals: ["Vender en línea"],
  industry: "Comercio",
  budget: "b3",
  urgency: "asap",
  topModules: ["Catálogo", "Pagos"],
  investment: { min: 100000, max: 140000 },
  weeks: { min: 6, max: 9 },
  proposalUrl: "https://solvyn.example/propuesta/abc",
};

describe("email templates", () => {
  it("builds the owner lead email with the required subject, wa.me link and proposal link", () => {
    const { subject, html } = buildOwnerLeadEmail(lead);
    expect(subject).toBe(`Nuevo lead caliente: ${lead.name}`);
    expect(html).toContain("https://wa.me/525512345678");
    expect(html).toContain(lead.proposalUrl);
    expect(html).toContain("Catálogo");
    expect(html).toContain("75/100");
  });

  it("escapes visitor text so it cannot inject markup", () => {
    const { html } = buildOwnerLeadEmail(lead);
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("builds the client email with greeting, button and the preliminary note", () => {
    const { subject, html } = buildClientProposalEmail({ ...lead, name: "Ana" });
    expect(subject).toBe("Tu propuesta de Solvyn Solutions");
    expect(html).toContain("Hola, Ana");
    expect(html).toContain("Ver mi propuesta");
    expect(html).toContain("preliminar");
    expect(html).toContain("6 a 9 semanas");
  });

  it("builds the meeting email with the date and time", () => {
    const { subject, html } = buildOwnerMeetingEmail({
      name: "Ana",
      email: "ana@ejemplo.com",
      whatsapp: null,
      score: 40,
      label: "tibio",
      meetingDate: "2026-10-21",
      meetingTime: "10:00",
      proposalUrl: lead.proposalUrl,
    });
    expect(subject).toBe("Reunión agendada: Ana");
    expect(html).toContain("miércoles 21 de octubre a las 10:00");
  });
});

describe("notifier", () => {
  const transportWith = (send: EmailTransport["send"]): EmailTransport => ({ ownerEmail: "owner@solvyn.example", send });

  it("sends one email to the owner and one to the client", async () => {
    const sent: EmailMessage[] = [];
    await createNotifier(transportWith(async (message) => void sent.push(message))).leadCreated({ ...lead, name: "Ana" });
    expect(sent.map((message) => message.to).sort()).toEqual(["ana@ejemplo.com", "owner@solvyn.example"]);
  });

  it("does not throw when sending fails, and logs without addresses", async () => {
    const logged = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const notifier = createNotifier(transportWith(async () => Promise.reject(new Error("resend failed: rate_limit"))));
    await expect(notifier.leadCreated(lead)).resolves.toBeUndefined();
    expect(logged).toHaveBeenCalled();
    expect(JSON.stringify(logged.mock.calls)).not.toContain("ana@ejemplo.com");
  });

  it("does nothing when emails are not configured", async () => {
    await expect(createNotifier(null).leadCreated(lead)).resolves.toBeUndefined();
  });
});

describe("bookMeeting", () => {
  const request = { slug: "a".repeat(22), startTime: new Date("2026-10-21T16:00:00Z") };
  const scheduled = { name: "Ana", email: "ana@ejemplo.com", whatsapp: null, score: 40, label: "tibio" as const };

  it("notifies the owner when the lead had no meeting yet", async () => {
    const meetingBooked = vi.fn(async () => undefined);
    const leadStorage = { scheduleMeeting: vi.fn(async () => scheduled) } as unknown as LeadStorage;
    expect(await bookMeeting(request, { leadStorage, notifier: { leadCreated: vi.fn(), meetingBooked } })).toBe(true);
    expect(meetingBooked).toHaveBeenCalledWith(expect.objectContaining({ name: "Ana", meetingDate: "2026-10-21", meetingTime: "10:00" }));
  });

  it("does not notify twice for the same lead", async () => {
    const meetingBooked = vi.fn(async () => undefined);
    const leadStorage = { scheduleMeeting: vi.fn(async () => null) } as unknown as LeadStorage;
    expect(await bookMeeting(request, { leadStorage, notifier: { leadCreated: vi.fn(), meetingBooked } })).toBe(false);
    expect(meetingBooked).not.toHaveBeenCalled();
  });
});
