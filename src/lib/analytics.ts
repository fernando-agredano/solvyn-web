// The only place where funnel events leave the app. Local stub: it logs in development and sends nothing.
// TODO: at deploy, connect the analytics provider inside track() and keep this signature. Only the fields declared
// here may be sent, never personal data or free text.
interface EventProperties {
  configurator_started: undefined;
  step_completed: { step: number };
  proposal_generated: { source: "ai" | "rules" };
  module_toggled: { moduleId: string };
  proposal_shared: undefined;
  pdf_downloaded: undefined;
  meeting_booked: undefined;
  whatsapp_clicked: undefined;
}

export type AnalyticsEvent = keyof EventProperties;

export function track<E extends AnalyticsEvent>(
  event: E,
  properties?: EventProperties[E],
) {
  if (process.env.NODE_ENV !== "development") return;
  console.info(`[analytics] ${event}`, properties ?? {});
}
