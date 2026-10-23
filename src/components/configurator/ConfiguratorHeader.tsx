import Image from "next/image";
import Link from "next/link";
import { Button } from "@/src/components/ui/Button";
import { LogOutIcon } from "@/src/components/ui/icons";
import type { ConfiguratorStep } from "@/src/config/configurator-options";
import { SITE } from "@/src/config/site";
import { ConfiguratorStepper } from "./ConfiguratorStepper";

interface ConfiguratorHeaderProps {
  progress?: { step: ConfiguratorStep; percent: number };
}

// Fixed, with the same dark blurred layer as the landing header and the same logo size. The line along its bottom
// edge fills with the progress; the stepper in the middle is hidden on phones, where the step badge says it all.
export function ConfiguratorHeader({ progress }: ConfiguratorHeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-black/60 backdrop-blur-md">
      <div className="grid h-16 grid-cols-[auto_1fr] items-center gap-4 px-4 sm:px-8 md:grid-cols-[1fr_auto_1fr] lg:px-12">
        <Link
          href="/"
          aria-label={`Volver al inicio de ${SITE.name}`}
          className="flex min-h-11 items-center justify-self-start"
        >
          <Image
            src="/brand/solvyn-logo.png"
            alt={SITE.name}
            width={1100}
            height={262}
            priority
            sizes="126px"
            className="block h-[30px] w-auto"
          />
        </Link>
        <div className="hidden justify-self-center md:block">
          {progress && <ConfiguratorStepper step={progress.step} />}
        </div>
        <div className="justify-self-end">
          <Button href="/" variant="secondary" size="md">
            <LogOutIcon size={16} />
            Salir
          </Button>
        </div>
      </div>
      {progress && (
        <div
          role="progressbar"
          aria-label="Progreso del configurador"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress.percent}
          className="absolute inset-x-0 -bottom-px h-px bg-white/10"
        >
          <div
            className="h-full bg-white transition-[width] duration-500 ease-[cubic-bezier(.2,.8,.2,1)]"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      )}
    </header>
  );
}
