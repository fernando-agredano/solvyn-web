import Link from "next/link";
import { AgendaPreview } from "@/src/components/demos/AgendaPreview";
import { DashboardPreview } from "@/src/components/demos/DashboardPreview";
import { StorePreview } from "@/src/components/demos/StorePreview";
import { Reveal } from "@/src/components/ui/Reveal";
import { SectionHeading } from "@/src/components/ui/SectionHeading";

const DEMOS = [
  {
    title: "Agenda para consultorios",
    description: "Citas por especialista, expedientes y recordatorios automáticos.",
    Preview: AgendaPreview,
  },
  {
    title: "Tienda en línea",
    description: "Catálogo, carrito, pagos y seguimiento de pedidos.",
    Preview: StorePreview,
  },
  {
    title: "Tablero de ventas",
    description: "Ingresos, productos y sucursales en tiempo real.",
    Preview: DashboardPreview,
  },
];

export function Demos() {
  return (
    <section id="demos" className="mx-auto max-w-[1680px] px-4 sm:px-8 lg:px-12 py-20 lg:py-24">
      <Reveal>
        <SectionHeading
          className="mb-12"
          title="Demos para explorar"
          description="Ejemplos funcionales de lo que puede llegar a ser tu proyecto. Ábrelos, navega y toma ideas."
        />
      </Reveal>

      <Reveal>
        <div className="grid grid-cols-3 gap-5 max-[1000px]:grid-cols-1">
          {DEMOS.map(({ title, description, Preview }) => (
            <Link
              key={title}
              href="/configurar"
              className="group flex flex-col gap-[18px] text-foreground no-underline"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-[14px] border border-white/[0.12] bg-[linear-gradient(180deg,#141414,#070707)] p-4 transition-[border-color,transform] duration-300 group-hover:-translate-y-[3px] group-hover:border-white/35">
                <Preview />
              </div>
              <span className="flex flex-col gap-1.5">
                <span className="semi text-[19px] font-semibold">{title}</span>
                <span className="text-[15px] text-text-secondary">{description}</span>
              </span>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
