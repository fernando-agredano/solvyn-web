// Datos pendientes: reemplazar los placeholders antes de publicar.
export const SITE = {
  name: "Solvyn Solutions",
  title: "Solvyn Solutions — Software a medida para tu negocio",
  description:
    "Software a medida para negocios en México. Configura tu solución y recibe una propuesta con módulos, fases e inversión.",
  legalName: "Fernando Yael Agredano Parada",
  address: "Saul Rodriguez #135, C.P. 45404, colonia Educadores Jaliscienses, Tonalá, Jalisco, México",
  whatsappMessage: "Hola, vi Solvyn Solutions y quisiera platicar sobre mi proyecto.",
} as const;

// Contact data lives in the settings table (/admin/ajustes). These are the fallback when it can't be read.
export const CONTACT_PLACEHOLDERS = { email: "fernando.agredano.parada.dev@gmail.com", whatsapp: "3310061026" } as const;

// Set NEXT_PUBLIC_SITE_URL to the production domain in Vercel. It is inlined at build time, so redeploy after changing it.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Version of the privacy notice the visitor accepts. Bump it whenever the notice text changes.
export const PRIVACY_VERSION = "2026-10";
