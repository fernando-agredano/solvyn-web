import Link from "next/link";
import {
  ICON_BOX_CLASSES,
  LANDING_CARD_CLASSES,
} from "@/src/components/ui/card-styles";
import {
  ArrowUpRightIcon,
  CartIcon,
  ChartIcon,
  LayersIcon,
  MobileIcon,
  SparklesIcon,
  ZapIcon,
} from "@/src/components/ui/icons";
import { Reveal } from "@/src/components/ui/Reveal";
import { SectionHeading } from "@/src/components/ui/SectionHeading";

const SOLUTIONS = [
  {
    title: "Sistemas a la medida",
    description:
      "Inventarios, citas, pedidos y la operación diaria en un solo lugar.",
    icon: <LayersIcon />,
    tags: ["Citas", "Inventario", "Pedidos"],
  },
  {
    title: "Apps móviles",
    description: "Para tus clientes o tu equipo, en iOS y Android.",
    icon: <MobileIcon />,
    tags: ["iOS", "Android", "Notificaciones"],
  },
  {
    title: "Tiendas en línea",
    description: "Catálogo, pagos y envíos, conectados con tu inventario.",
    icon: <CartIcon />,
    tags: ["Catálogo", "Pagos", "Envíos"],
  },
  {
    title: "Automatizaciones",
    description:
      "Tareas repetitivas que se hacen solas: reportes, avisos, facturas.",
    icon: <ZapIcon />,
    tags: ["Reportes", "Avisos", "Facturas"],
  },
  {
    title: "Tableros de datos",
    description: "Tus ventas y operación en tiempo real, para decidir mejor.",
    icon: <ChartIcon />,
    tags: ["Ventas", "Operación", "Tiempo real"],
  },
  {
    title: "Soluciones con IA",
    description:
      "Asistentes, clasificación de documentos y atención automatizada.",
    icon: <SparklesIcon />,
    tags: ["Asistentes", "Documentos", "Atención"],
  },
];

export function Solutions() {
  return (
    <section
      id="soluciones"
      className="mx-auto max-w-[1680px] px-4 py-20 sm:px-8 lg:px-12 lg:py-24"
    >
      <Reveal>
        <SectionHeading
          className="mb-12"
          title="Lo que tu negocio necesite"
          description="Cada solución se diseña a la medida. Elige un punto de partida y el configurador hace el resto."
        />
      </Reveal>

      <ul className="mx-auto grid max-w-[1280px] list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {SOLUTIONS.map((solution) => (
          <li key={solution.title}>
            <Reveal className="h-full">
              <Link
                href="/configurar"
                className={`group flex h-full flex-col gap-5 p-6 text-foreground no-underline hover:bg-white/[0.05] ${LANDING_CARD_CLASSES}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`${ICON_BOX_CLASSES} size-11`}>
                    {solution.icon}
                  </span>
                  <span className="text-white/35 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white">
                    <ArrowUpRightIcon size={20} />
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="m-0 text-lg font-semibold">
                    {solution.title}
                  </h3>
                  <p className="m-0 text-[15px] leading-[1.55] text-text-secondary">
                    {solution.description}
                  </p>
                </div>
                <div className="mt-auto flex flex-wrap gap-2 pt-1">
                  {solution.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-label"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
