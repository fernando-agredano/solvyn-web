export interface Module {
  id: string;
  name: string;
  hours: number;
  description: string;
}

export type Integration = Module;
export type Extra = Module;

export interface Goal {
  id: string;
  label: string;
  description: string;
  modules: Module[];
}

export interface Industry {
  id: string;
  label: string;
}

export const GOALS: Goal[] = [
  {
    id: "vender",
    label: "Vender en línea",
    description: "Tienda, catálogo y cobros por internet.",
    modules: [
      { id: "cat", name: "Catálogo de productos", hours: 40, description: "Productos con fotos, precios, variantes y existencias." },
      { id: "cart", name: "Carrito y pagos en línea", hours: 45, description: "Compra en pocos pasos con tarjeta, OXXO o transferencia." },
      { id: "ship", name: "Envíos y seguimiento", hours: 25, description: "Guías, estados del pedido y avisos al cliente." },
    ],
  },
  {
    id: "citas",
    label: "Agendar citas o reservas",
    description: "Calendario, disponibilidad y recordatorios.",
    modules: [
      { id: "agenda", name: "Agenda y reservas", hours: 60, description: "Calendario por persona o recurso, con disponibilidad en tiempo real." },
      { id: "remind", name: "Recordatorios automáticos", hours: 20, description: "Avisos antes de cada cita para reducir inasistencias." },
    ],
  },
  {
    id: "operar",
    label: "Organizar mi operación",
    description: "Inventario, pedidos, clientes y procesos.",
    modules: [
      { id: "inv", name: "Inventario y pedidos", hours: 60, description: "Entradas, salidas, existencias y estado de cada pedido." },
      { id: "crm", name: "Clientes y seguimiento", hours: 35, description: "Historial de cada cliente, notas y próximos pasos." },
    ],
  },
  {
    id: "app",
    label: "Una app para mis clientes",
    description: "Que te encuentren y compren desde el celular.",
    modules: [
      { id: "appm", name: "App móvil para clientes", hours: 120, description: "App para iOS y Android con las funciones principales." },
      { id: "push", name: "Notificaciones push", hours: 20, description: "Mensajes directos al celular de tus clientes." },
    ],
  },
  {
    id: "datos",
    label: "Ver mis datos en un tablero",
    description: "Indicadores claros para decidir mejor.",
    modules: [
      { id: "dash", name: "Tablero de indicadores", hours: 50, description: "Ventas, operación y tendencias en gráficas claras." },
      { id: "etl", name: "Conexión con tus datos", hours: 35, description: "Unimos hojas de cálculo y sistemas en un solo lugar." },
    ],
  },
  {
    id: "auto",
    label: "Automatizar tareas",
    description: "Que lo repetitivo se haga solo.",
    modules: [
      { id: "flows", name: "Flujos automáticos", hours: 45, description: "Tareas que se ejecutan solas según reglas que tú defines." },
      { id: "sched", name: "Reportes programados", hours: 20, description: "Resúmenes diarios o semanales que llegan a tu correo." },
    ],
  },
  {
    id: "ia",
    label: "Integrar inteligencia artificial",
    description: "Asistentes, clasificación y respuestas automáticas.",
    modules: [
      { id: "bot", name: "Asistente con IA", hours: 60, description: "Responde preguntas de clientes o de tu equipo las 24 horas." },
      { id: "kb", name: "Base de conocimiento", hours: 30, description: "La información de tu negocio que la IA usa para responder." },
    ],
  },
  {
    id: "otra",
    label: "Otra cosa",
    description: "Descríbelo con tus palabras.",
    modules: [
      { id: "custom", name: "Módulo a la medida", hours: 80, description: "Funcionalidad diseñada para lo que describiste." },
    ],
  },
];

export const INDUSTRIES: Industry[] = [
  { id: "comercio", label: "Comercio" },
  { id: "salud", label: "Salud" },
  { id: "rest", label: "Restaurantes" },
  { id: "edu", label: "Educación" },
  { id: "serv", label: "Servicios profesionales" },
  { id: "log", label: "Logística" },
  { id: "inmo", label: "Inmobiliaria" },
  { id: "otro", label: "Otro giro" },
];

export const INTEGRATIONS: Integration[] = [
  { id: "wa", name: "WhatsApp", hours: 25, description: "Mensajes y avisos automáticos por WhatsApp." },
  { id: "pay", name: "Pagos en línea", hours: 30, description: "Cobros con tarjeta o transferencia." },
  { id: "cfdi", name: "Facturación CFDI", hours: 35, description: "Facturas electrónicas timbradas automáticamente." },
  { id: "mail", name: "Correo y avisos", hours: 10, description: "Correos de confirmación y notificaciones." },
  { id: "legacy", name: "Mi sistema actual", hours: 40, description: "Intercambio de datos con el sistema que ya usas." },
];

export const EXTRAS: Extra[] = [
  { id: "rep", name: "Reportes y estadísticas", hours: 35, description: "Ingresos, clientes y desempeño por periodo." },
  { id: "multi", name: "Varias sucursales", hours: 40, description: "Administra varias ubicaciones desde un solo panel." },
  { id: "site", name: "Sitio web informativo", hours: 25, description: "Página pública para que nuevos clientes te encuentren." },
];
