import Image from "next/image";
import Link from "next/link";
import { CONFIGURATOR_STEPS, STEP_LABELS, type ConfiguratorStep } from "@/src/config/configurator-options";
import { SITE } from "@/src/config/site";

interface ConfiguratorHeaderProps {
  progress?: { step: ConfiguratorStep; percent: number };
}

function StepProgress({ step, percent }: { step: ConfiguratorStep; percent: number }) {
  const currentIndex = CONFIGURATOR_STEPS.indexOf(step);
  return (
    <div className="flex min-w-[200px] max-w-[520px] flex-1 flex-col gap-2.5">
      <ol className="m-0 grid list-none grid-cols-4 p-0 text-[13px] max-[980px]:hidden">
        {CONFIGURATOR_STEPS.map((id, index) => (
          <li key={id} aria-current={index === currentIndex ? "step" : undefined} className={index <= currentIndex ? "text-heading" : "text-muted"}>
            {STEP_LABELS[id]}
          </li>
        ))}
      </ol>
      <div
        role="progressbar"
        aria-label="Progreso del configurador"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="h-[3px] overflow-hidden rounded-full bg-white/10"
      >
        <div
          className="h-full bg-white shadow-[0_0_10px_#FFFFFF] transition-[width] duration-500 ease-[cubic-bezier(.2,.8,.2,1)]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export function ConfiguratorHeader({ progress }: ConfiguratorHeaderProps) {
  return (
    <header className="border-b border-border-subtle">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-6 px-6 py-[18px]">
        <Link href="/" aria-label={`Volver al inicio de ${SITE.name}`} className="flex min-h-11 items-center">
          <Image src="/brand/solvyn-logo.png" alt={SITE.name} width={1100} height={262} priority sizes="110px" className="block h-[26px] w-auto" />
        </Link>
        {progress && <StepProgress step={progress.step} percent={progress.percent} />}
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-[10px] border border-white/18 px-4 text-sm text-[#D4D4D4] no-underline transition duration-200 hover:border-white/50 hover:bg-white/[0.04]"
        >
          Salir
        </Link>
      </div>
    </header>
  );
}
