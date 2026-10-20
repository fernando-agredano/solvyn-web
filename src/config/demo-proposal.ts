export type DemoModule = {
  id: string;
  name: string;
  description: string;
  hours: number;
  optional: boolean;
  // Only meaningful for optional modules: whether the switch starts on.
  startsEnabled?: boolean;
};

export const DEMO_PROJECT_NAME = "Clínica Vitalia";

export const DEMO_MODULES: readonly DemoModule[] = [
  {
    id: "agenda",
    name: "Agenda de citas",
    description: "Calendario por especialista, disponibilidad en tiempo real y reagendado en un clic.",
    hours: 60,
    optional: false,
  },
  {
    id: "exp",
    name: "Expediente de pacientes",
    description: "Historial, notas de consulta y archivos de cada paciente en un solo lugar.",
    hours: 50,
    optional: false,
  },
  {
    id: "panel",
    name: "Panel administrativo",
    description: "Control de consultorios, horarios, servicios y precios.",
    hours: 45,
    optional: false,
  },
  {
    id: "roles",
    name: "Usuarios y permisos",
    description: "Accesos distintos para recepción, médicos y administración.",
    hours: 20,
    optional: false,
  },
  {
    id: "wa",
    name: "Recordatorios por WhatsApp",
    description: "Avisos automáticos antes de cada cita para reducir inasistencias.",
    hours: 25,
    optional: true,
    startsEnabled: true,
  },
  {
    id: "pay",
    name: "Pagos en línea",
    description: "Anticipos o pago completo al reservar, con tarjeta o transferencia.",
    hours: 30,
    optional: true,
  },
  {
    id: "rep",
    name: "Reportes y estadísticas",
    description: "Ocupación, ingresos y pacientes nuevos por mes.",
    hours: 35,
    optional: true,
  },
  {
    id: "app",
    name: "App móvil para pacientes",
    description: "Reservar, pagar y recibir avisos desde el celular.",
    hours: 120,
    optional: true,
  },
];
