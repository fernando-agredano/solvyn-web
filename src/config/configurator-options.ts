import type { Platform, UserType } from "@/src/lib/modules";

export const CONFIGURATOR_STEPS = ["goal", "industry", "details", "contact"] as const;
export type ConfiguratorStep = (typeof CONFIGURATOR_STEPS)[number];

export const STEP_LABELS: Record<ConfiguratorStep, string> = {
  goal: "Objetivo",
  industry: "Industria",
  details: "Detalles",
  contact: "Contacto",
};

export const MAX_GOALS = 3;

// The goal that asks for a free-text description instead of a catalog module set.
export const OTHER_GOAL_ID = "otra";

export const USER_OPTIONS: { id: UserType; label: string }[] = [
  { id: "team", label: "Mi equipo" },
  { id: "clients", label: "Mis clientes" },
  { id: "suppliers", label: "Proveedores o socios" },
];

export const PLATFORM_OPTIONS: { id: Platform; label: string }[] = [
  { id: "web", label: "Computadora y navegador" },
  { id: "both", label: "También en app móvil" },
];

export const URGENCY_OPTIONS = [
  { id: "asap", label: "Lo antes posible" },
  { id: "q", label: "En 1 a 3 meses" },
  { id: "flex", label: "Sin prisa" },
] as const;
export type Urgency = (typeof URGENCY_OPTIONS)[number]["id"];

export const BUDGET_OPTIONS = [
  { id: "b1", label: "Menos de $50,000" },
  { id: "b2", label: "$50,000 a $150,000" },
  { id: "b3", label: "$150,000 a $400,000" },
  { id: "b4", label: "Más de $400,000" },
  { id: "b0", label: "Aún no lo sé" },
] as const;
export type Budget = (typeof BUDGET_OPTIONS)[number]["id"];
