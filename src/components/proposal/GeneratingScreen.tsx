import { Button } from "@/src/components/ui/Button";
import { GENERATION_STEPS } from "@/src/config/proposal";

interface GeneratingScreenProps {
  completedSteps: number;
  hasFailed: boolean;
  onRetry: () => void;
}

export function GeneratingScreen({ completedSteps, hasFailed, onRetry }: GeneratingScreenProps) {
  return (
    <main id="contenido" className="step-in mx-auto flex max-w-[1080px] flex-col gap-10 px-6 pt-[72px] pb-[120px]">
      {hasFailed ? (
        <div role="alert" className="flex flex-col items-center gap-4 text-center">
          <h1 className="wide m-0 text-[clamp(1.7rem,3vw,2.4rem)] font-semibold tracking-[-0.02em]">Esto está tardando más de lo normal</h1>
          <p className="m-0 max-w-[520px] text-base leading-[1.6] text-text-secondary">
            No pudimos terminar tu propuesta a tiempo. Tus respuestas siguen guardadas: intenta de nuevo y en unos segundos la tendrás lista.
          </p>
          <Button onClick={onRetry}>Reintentar</Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3.5 text-center">
          <svg className="animate-spin" width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h1 className="wide m-0 text-[clamp(1.7rem,3vw,2.4rem)] font-semibold tracking-[-0.02em]">Preparando tu propuesta</h1>
          <ul role="status" className="m-0 flex list-none flex-col items-start gap-2.5 p-0 pt-1.5">
            {GENERATION_STEPS.map((label, index) => {
              const isDone = index < completedSteps;
              return (
                <li
                  key={label}
                  className={`flex items-center gap-2.5 text-[15px] transition-colors duration-300 ${
                    isDone ? "text-heading" : index === completedSteps ? "text-[#D4D4D4]" : "text-[#525252]"
                  }`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className={`text-signal ${isDone ? "opacity-100" : "opacity-0"}`}
                  >
                    <path d="M5 12l5 5 9-10" />
                  </svg>
                  {label}
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <div className="grid grid-cols-4 gap-3.5 max-[980px]:grid-cols-2" aria-hidden="true">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="shimmer h-[104px] rounded-[14px]" />
        ))}
      </div>
      <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-3.5 max-[980px]:grid-cols-1" aria-hidden="true">
        <div className="shimmer h-[280px] rounded-[14px]" />
        <div className="shimmer h-[280px] rounded-[14px]" />
      </div>
    </main>
  );
}
