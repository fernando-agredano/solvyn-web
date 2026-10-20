import type { ReactNode } from "react";

export type Industry = {
  name: string;
  description: string;
  // SVG children (paths, circles) drawn on a 24x24 line-icon grid.
  icon: ReactNode;
};

export const INDUSTRIES: readonly Industry[] = [
  {
    name: "Comercio",
    description: "Ventas, inventario y tienda en línea",
    icon: (
      <>
        <path d="M4 9h16l-1.5 10h-13z" />
        <path d="M8 9V6a4 4 0 0 1 8 0v3" />
      </>
    ),
  },
  {
    name: "Salud",
    description: "Citas, expedientes y recordatorios",
    icon: (
      <>
        <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" />
        <path d="M9 12h2l1-2 1 4 1-2h1" />
      </>
    ),
  },
  {
    name: "Restaurantes",
    description: "Pedidos, menú digital y reservas",
    icon: (
      <>
        <path d="M7 3v8a2 2 0 0 0 2 2v8" />
        <path d="M11 3v8a2 2 0 0 1-2 2" />
        <path d="M17 21V3c-2 1.5-3 4-3 7h3" />
      </>
    ),
  },
  {
    name: "Educación",
    description: "Inscripciones, cursos y pagos",
    icon: (
      <>
        <path d="M2 9l10-5 10 5-10 5z" />
        <path d="M6 11v5c3 2 9 2 12 0v-5" />
      </>
    ),
  },
  {
    name: "Servicios profesionales",
    description: "Clientes, cotizaciones y proyectos",
    icon: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        <path d="M3 13h18" />
      </>
    ),
  },
  {
    name: "Logística",
    description: "Rutas, entregas y seguimiento",
    icon: (
      <>
        <path d="M3 6h11v10H3z" />
        <path d="M14 10h4l3 3v3h-7" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
      </>
    ),
  },
  {
    name: "Inmobiliaria",
    description: "Propiedades, prospectos y visitas",
    icon: (
      <>
        <path d="M3 11l9-7 9 7" />
        <path d="M5 10v10h14V10" />
        <path d="M10 20v-6h4v6" />
      </>
    ),
  },
  {
    name: "Otro giro",
    description: "Cuéntame de tu negocio",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8M8 12h8" />
      </>
    ),
  },
];
