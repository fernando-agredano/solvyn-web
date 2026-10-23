// Time between generation messages. The Phase 4 flow replaces this with the real duration of the AI call.
export const GENERATION_STEP_MS = 950;

export const GENERATION_STEPS = [
  "Analizando tus respuestas",
  "Definiendo módulos y alcance",
  "Diseñando la arquitectura",
  "Armando el diagrama de tu sistema",
] as const;

// Same order as PROJECT_PHASES, which holds the share of the project each phase takes.
export const PHASE_DETAILS = [
  { name: "Descubrimiento", deliverable: "requerimientos y plan de trabajo" },
  { name: "Diseño", deliverable: "prototipo navegable de las pantallas" },
  { name: "Desarrollo", deliverable: "entregas funcionales cada 1 a 2 semanas" },
  { name: "Pruebas y lanzamiento", deliverable: "sistema publicado, capacitación y manual" },
] as const;

export type ArchNodeId =
  | "users"
  | "web"
  | "mobile"
  | "api"
  | "ai"
  | "db"
  | "files"
  | "e_wa"
  | "e_pay"
  | "e_cfdi"
  | "e_mail"
  | "e_legacy";

// Names and technologies are facts of the proposal; only their explanations are copy.
export const ARCH_NODES: Record<ArchNodeId, { label: string; technology: string }> = {
  users: { label: "Usuarios", technology: "Inicio de sesión seguro con Supabase Auth" },
  web: { label: "Aplicación web", technology: "Next.js" },
  mobile: { label: "App móvil", technology: "React Native" },
  api: { label: "Servidor y API", technology: "Next.js API y funciones en la nube" },
  ai: { label: "Motor de IA", technology: "Modelos de lenguaje con capa intermedia" },
  db: { label: "Base de datos", technology: "PostgreSQL en Supabase" },
  files: { label: "Archivos", technology: "Supabase Storage" },
  e_wa: { label: "WhatsApp", technology: "WhatsApp Business API" },
  e_pay: { label: "Pagos", technology: "Stripe o Mercado Pago" },
  e_cfdi: { label: "Facturación CFDI", technology: "Proveedor autorizado de certificación" },
  e_mail: { label: "Correo", technology: "Resend" },
  e_legacy: { label: "Tu sistema actual", technology: "Integración por API o archivos" },
};

export const ARCH_COLUMN_TITLES = {
  users: "Quién lo usa",
  frontend: "Lo que ven",
  logic: "Lógica",
  data: "Información",
} as const;

export type TechId = "nextjs" | "supabase" | "react-native" | "ai-models" | "payments" | "whatsapp" | "vercel";

export const TECHNOLOGIES: Record<TechId, { name: string }> = {
  nextjs: { name: "Next.js" },
  supabase: { name: "Supabase" },
  "react-native": { name: "React Native" },
  "ai-models": { name: "Modelos de IA" },
  payments: { name: "Stripe o Mercado Pago" },
  whatsapp: { name: "WhatsApp Business API" },
  vercel: { name: "Vercel" },
};
