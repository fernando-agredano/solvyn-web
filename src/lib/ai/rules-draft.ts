import type { ProposalFacts } from "@/src/lib/proposal";

const MEETING_QUESTIONS = [
  "¿Cómo manejas hoy este proceso y qué es lo que más tiempo te quita?",
  "¿Quiénes usarán el sistema todos los días y quiénes solo lo consultarán?",
  "¿Qué información ya tienes (hojas de cálculo, sistemas, archivos) que habría que migrar?",
];

// Generic by design: the rules-only proposal must never claim more than the facts say.
export function buildRulesQuestionsAndRisks(facts: ProposalFacts) {
  const meetingQuestions = [...MEETING_QUESTIONS];
  if (facts.integrationNames.length > 0) {
    meetingQuestions.push(`¿Ya cuentas con acceso a ${facts.integrationNames.join(", ")} o hay que contratarlos?`);
  }
  return {
    meetingQuestions,
    risks: [
      "Esta propuesta es preliminar: el alcance se confirma y se afina en la reunión de descubrimiento.",
      "Se asume que tendrás disponibilidad para revisar las entregas y dar retroalimentación a tiempo.",
    ],
  };
}
