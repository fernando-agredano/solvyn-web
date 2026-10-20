import { z } from "zod";
import { EXTRAS, GOALS, INDUSTRIES, INTEGRATIONS } from "@/src/config/catalog";
import { BUDGET_OPTIONS, MAX_GOALS, PLATFORM_OPTIONS, URGENCY_OPTIONS, USER_OPTIONS } from "@/src/config/configurator-options";
import { TEAM_SIZES } from "@/src/config/pricing";

export const MAX_BODY_BYTES = 8 * 1024;
export const MAX_DESCRIPTION_LENGTH = 600;

const CONTROL_CHARACTERS = /[\u0000-\u001F\u007F-\u009F]/g;

// Control characters (including line breaks and tabs) become spaces, then whitespace collapses.
export const cleanText = (text: string) => text.replace(CONTROL_CHARACTERS, " ").replace(/\s+/g, " ").trim();

const ids = <const Id extends string>(options: readonly { id: Id }[]) => options.map((option) => option.id) as [Id, ...Id[]];

// Unknown module ids are dropped, as when restoring saved answers.
const flags = (validIds: string[]) =>
  z.record(z.string(), z.boolean()).transform((value) => Object.fromEntries(Object.entries(value).filter(([id]) => validIds.includes(id))));

// Everything here comes from the catalog or fixed options: free text is limited to `description`.
export const proposalRequestSchema = z.object({
  answers: z.object({
    goals: z.array(z.enum(ids(GOALS))).min(1).max(MAX_GOALS),
    users: z.array(z.enum(ids(USER_OPTIONS))).min(1),
    platform: z.enum(ids(PLATFORM_OPTIONS)),
    integrations: z.array(z.enum(ids(INTEGRATIONS))),
    disabledModules: flags(INTEGRATIONS.map((integration) => `i_${integration.id}`)),
    enabledExtras: flags(EXTRAS.map((extra) => `x_${extra.id}`)),
    size: z.enum(ids(TEAM_SIZES)),
    industry: z.enum(ids(INDUSTRIES)).nullable(),
    urgency: z.enum(ids(URGENCY_OPTIONS)).nullable(),
    budget: z.enum(ids(BUDGET_OPTIONS)).nullable(),
  }),
  description: z.string().transform(cleanText).pipe(z.string().max(MAX_DESCRIPTION_LENGTH)).default(""),
  // Personal data lives apart from the answers: it only goes to the lead and never to the proposal or the AI.
  // Consent is required before anything personal is saved.
  contact: z.object({
    name: z.string().transform(cleanText).pipe(z.string().min(2).max(100)),
    email: z.email().max(254),
    phone: z.string().transform(cleanText).pipe(z.string().max(20)).default(""),
    consent: z.literal(true),
  }),
});

export type ProposalRequest = z.infer<typeof proposalRequestSchema>;
