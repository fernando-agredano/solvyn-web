import Link from "next/link";
import { Reveal } from "@/src/components/ui/Reveal";
import { SectionHeading } from "@/src/components/ui/SectionHeading";

const SOLUTIONS = [
  {
    title: "Sistemas a la medida",
    description: "Inventarios, citas, pedidos y la operación diaria en un solo lugar.",
  },
  {
    title: "Apps móviles",
    description: "Para tus clientes o tu equipo, en iOS y Android.",
  },
  {
    title: "Tiendas en línea",
    description: "Catálogo, pagos y envíos, conectados con tu inventario.",
  },
  {
    title: "Automatizaciones",
    description: "Tareas repetitivas que se hacen solas: reportes, avisos, facturas.",
  },
  {
    title: "Tableros de datos",
    description: "Tus ventas y operación en tiempo real, para decidir mejor.",
  },
  {
    title: "Soluciones con IA",
    description: "Asistentes, clasificación de documentos y atención automatizada.",
  },
];

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-[22px] flex-none opacity-50 transition-[transform,opacity] duration-250 group-hover:translate-x-1 group-hover:opacity-100"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function Solutions() {
  return (
    <section id="soluciones" className="mx-auto max-w-[1240px] px-6 py-[120px]">
      <Reveal>
        <SectionHeading
          className="mb-14 max-w-[640px]"
          title="Lo que tu negocio necesite"
          description="Cada solución se diseña a la medida. Elige un punto de partida y el configurador hace el resto."
        />
      </Reveal>

      <Reveal>
        <ul className="grid grid-cols-1 gap-x-10 border-t border-white/10 min-[861px]:grid-cols-2">
          {SOLUTIONS.map((solution) => (
            <li key={solution.title}>
              <Link
                href="/configurar"
                className="group flex items-center justify-between gap-5 border-b border-white/10 px-2 py-[26px] text-foreground no-underline transition-colors duration-250 hover:bg-white/[0.035]"
              >
                <span className="flex flex-col gap-1.5">
                  <span className="semi text-xl font-semibold">{solution.title}</span>
                  <span className="text-[15px] text-text-secondary">{solution.description}</span>
                </span>
                <ArrowIcon />
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
