import { z } from "zod";

export const MIN_HOURLY_RATE_MXN = 100;
export const MAX_HOURLY_RATE_MXN = 10000;
export const MAX_AVAILABILITY_MESSAGE_LENGTH = 140;
const MEXICAN_PHONE_DIGITS = 10;

// Mexico City date, so "today" matches what the admin sees even when the server runs elsewhere.
export const todayInMexico = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/Mexico_City" }).format(
    new Date(),
  );

export const settingsFormSchema = z.object({
  hourlyRateMxn: z.coerce
    .number({ error: "Escribe la tarifa en pesos" })
    .int("La tarifa debe ser un número entero")
    .min(MIN_HOURLY_RATE_MXN, `La tarifa mínima es ${MIN_HOURLY_RATE_MXN} MXN`)
    .max(MAX_HOURLY_RATE_MXN, `La tarifa máxima es ${MAX_HOURLY_RATE_MXN} MXN`),
  nextStartDate: z
    .union([z.literal(""), z.iso.date("Usa una fecha válida")])
    .transform((value) => value || null)
    .refine(
      (date) => date === null || date >= todayInMexico(),
      "La fecha no puede estar en el pasado",
    ),
  availabilityMessage: z
    .string()
    .trim()
    .max(
      MAX_AVAILABILITY_MESSAGE_LENGTH,
      `Máximo ${MAX_AVAILABILITY_MESSAGE_LENGTH} caracteres`,
    )
    .transform((value) => value || null),
  whatsapp: z
    .string()
    .transform((value) => value.replace(/\D/g, ""))
    .pipe(
      z
        .string()
        .length(MEXICAN_PHONE_DIGITS, "El WhatsApp debe tener 10 dígitos"),
    ),
  email: z.string().trim().pipe(z.email("Revisa el correo")),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export const toSettingsRow = (values: SettingsFormValues) => ({
  hourly_rate_mxn: values.hourlyRateMxn,
  next_start_date: values.nextStartDate,
  availability_message: values.availabilityMessage,
  whatsapp: values.whatsapp,
  email: values.email,
});
