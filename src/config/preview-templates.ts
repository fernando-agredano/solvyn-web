import type { SolutionKind } from "@/src/lib/proposal";

export type StatusTone = "ok" | "warn" | "neutral";

export interface PreviewRow {
  initials: string;
  primary: string;
  secondary: string;
  value: string;
  status: string;
  tone: StatusTone;
}

export interface PreviewTemplate {
  nav: string[];
  title: string;
  subtitle: string;
  action: string;
  stats: { label: string; value: string; delta: string }[];
  rows: PreviewRow[];
  heroLabel: string;
  heroValue: string;
}

const row = (
  initials: string,
  primary: string,
  secondary: string,
  value: string,
  status: string,
  tone: StatusTone,
): PreviewRow => ({ initials, primary, secondary, value, status, tone });

const stat = (label: string, value: string, delta: string) => ({ label, value, delta });

// Sample data for the solution preview, one template per kind of solution. Static: never generated.
export const PREVIEW_TEMPLATES: Record<SolutionKind, PreviewTemplate> = {
  shop: {
    nav: ["Inicio", "Pedidos", "Productos", "Clientes", "Reportes"],
    title: "Pedidos de hoy",
    subtitle: "Resumen de ventas en tiempo real",
    action: "Nuevo producto",
    stats: [
      stat("Ventas de hoy", "$18,450", "+12% vs. ayer"),
      stat("Pedidos", "42", "8 por enviar"),
      stat("Ticket promedio", "$439", "+5% esta semana"),
    ],
    rows: [
      row("MG", "María González", "Pedido #1042, 3 productos", "$1,280", "Pagado", "ok"),
      row("JR", "Jorge Ramírez", "Pedido #1041, 1 producto", "$459", "Por enviar", "warn"),
      row("AL", "Ana López", "Pedido #1040, 2 productos", "$918", "Pagado", "ok"),
      row("CP", "Carlos Pérez", "Pedido #1039, 5 productos", "$2,140", "Enviado", "neutral"),
      row("LH", "Laura Hernández", "Pedido #1038, 1 producto", "$329", "Pagado", "ok"),
    ],
    heroLabel: "Ventas de hoy",
    heroValue: "$18,450",
  },
  agenda: {
    nav: ["Inicio", "Agenda", "Clientes", "Servicios", "Reportes"],
    title: "Agenda de hoy",
    subtitle: "12 citas programadas",
    action: "Nueva cita",
    stats: [
      stat("Citas de hoy", "12", "3 confirmadas hoy"),
      stat("Ocupación", "86%", "+9% esta semana"),
      stat("Inasistencias", "2%", "-6% con recordatorios"),
    ],
    rows: [
      row("MG", "María González", "Consulta general", "09:00", "Confirmada", "ok"),
      row("JR", "Jorge Ramírez", "Seguimiento", "10:30", "Pendiente", "warn"),
      row("AL", "Ana López", "Primera visita", "11:15", "Confirmada", "ok"),
      row("CP", "Carlos Pérez", "Revisión", "12:00", "En espera", "neutral"),
      row("LH", "Laura Hernández", "Consulta general", "13:30", "Confirmada", "ok"),
    ],
    heroLabel: "Próxima cita",
    heroValue: "10:30 Jorge R.",
  },
  dash: {
    nav: ["Resumen", "Ventas", "Operación", "Equipo", "Ajustes"],
    title: "Resumen del mes",
    subtitle: "Actualizado hace 5 minutos",
    action: "Exportar",
    stats: [
      stat("Ingresos", "$412,800", "+18% vs. mes anterior"),
      stat("Clientes nuevos", "64", "+11 esta semana"),
      stat("Margen", "32%", "+2.4 puntos"),
    ],
    rows: [
      row("NO", "Sucursal Norte", "Meta: $150,000", "$162,300", "Arriba", "ok"),
      row("CE", "Sucursal Centro", "Meta: $140,000", "$131,900", "Cerca", "warn"),
      row("SU", "Sucursal Sur", "Meta: $110,000", "$118,600", "Arriba", "ok"),
      row("EC", "Tienda en línea", "Meta: $60,000", "$54,200", "Cerca", "warn"),
      row("MA", "Mayoreo", "Meta: $40,000", "$41,800", "Arriba", "ok"),
    ],
    heroLabel: "Ingresos del mes",
    heroValue: "$412,800",
  },
  ops: {
    nav: ["Inicio", "Pedidos", "Inventario", "Clientes", "Reportes"],
    title: "Operación de hoy",
    subtitle: "Todo lo pendiente en un vistazo",
    action: "Nuevo registro",
    stats: [
      stat("Pedidos activos", "27", "6 urgentes"),
      stat("Existencias bajas", "9", "Reordenar hoy"),
      stat("Tareas completadas", "84%", "+7% esta semana"),
    ],
    rows: [
      row("PE", "Pedido #318", "Distribuidora Molina", "$8,420", "En proceso", "warn"),
      row("PE", "Pedido #317", "Abarrotes La Luz", "$3,150", "Listo", "ok"),
      row("IN", "Inventario", "Tornillería 3/8, 40 pzs", "Bajo", "Reordenar", "warn"),
      row("PE", "Pedido #316", "Ferretería Ortiz", "$5,780", "Entregado", "neutral"),
      row("CL", "Cliente nuevo", "Constructora Sierra", "Hoy", "Activo", "ok"),
    ],
    heroLabel: "Pedidos activos",
    heroValue: "27",
  },
};

// The only brand colors on the site: the visitor tries them on the preview of their solution.
export const PREVIEW_ACCENTS = [
  { id: "blue", name: "Azul", color: "#2563EB", soft: "#DBEAFE" },
  { id: "green", name: "Verde", color: "#059669", soft: "#D1FAE5" },
  { id: "orange", name: "Naranja", color: "#EA580C", soft: "#FFEDD5" },
  { id: "violet", name: "Violeta", color: "#7C3AED", soft: "#EDE9FE" },
] as const;

export type PreviewAccent = (typeof PREVIEW_ACCENTS)[number];

export const PREVIEW_DEVICES = [
  { id: "desktop", label: "Escritorio" },
  { id: "mobile", label: "Móvil" },
] as const;

export type PreviewDevice = (typeof PREVIEW_DEVICES)[number]["id"];
