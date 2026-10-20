import Link from "next/link";
import { INDUSTRIES } from "@/src/config/industries";
import { Reveal } from "@/src/components/ui/Reveal";
import { SectionHeading } from "@/src/components/ui/SectionHeading";

export function Industries() {
  return (
    <section id="industrias" className="border-t border-border-subtle">
      <div className="mx-auto max-w-[1240px] px-6 py-[120px]">
        <Reveal>
          <SectionHeading
            className="mb-14 max-w-[620px]"
            title="Para cualquier giro"
            description="Elige tu industria y el configurador empieza con las preguntas que importan para tu negocio."
          />
        </Reveal>

        <Reveal>
          <div className="grid grid-cols-4 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 max-[1000px]:grid-cols-2">
            {INDUSTRIES.map((industry) => (
              <Link
                key={industry.name}
                href="/configurar"
                className="group flex min-h-[150px] flex-col justify-between gap-6 bg-black px-6 py-7 text-foreground no-underline transition-colors duration-250 hover:bg-[#0d0d0d]"
              >
                <svg
                  width={26}
                  height={26}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth={1.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="transition-[filter] duration-250 group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
                >
                  {industry.icon}
                </svg>
                <span className="flex flex-col gap-1">
                  <span className="semi text-[18px] font-semibold">{industry.name}</span>
                  <span className="text-sm text-label">{industry.description}</span>
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
