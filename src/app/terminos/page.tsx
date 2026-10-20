// TODO: Revisar con abogado antes de publicar
import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/src/components/legal/LegalPage";
import { SITE } from "@/src/config/site";
import { getSettings } from "@/src/lib/settings/settings";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: `Términos y condiciones de uso de ${SITE.name} y de sus propuestas preliminares.`,
};

export default async function TerminosPage() {
  const settings = await getSettings();
  return (
    <LegalPage
      title="Términos y condiciones"
      meta="Última actualización: octubre de 2026"
    >
      <LegalSection title="Propuesta preliminar">
        <p>
          La propuesta que se genera en el configurador es una estimación
          preliminar, con fines informativos. No es una oferta vinculante, no
          constituye un contrato y no obliga a ninguna de las partes a
          contratar.
        </p>
        <p>
          Las horas, los precios, las fases y los tiempos son estimaciones
          basadas en las respuestas que diste. Se confirman en la reunión,
          después de conocer tu proyecto con más detalle, y pueden cambiar según
          el alcance final.
        </p>
      </LegalSection>

      <LegalSection title="Aceptación y reunión">
        <p>
          Aceptar una propuesta en el sitio solo indica tu interés en platicar
          sobre el proyecto. No implica compromiso de pago ni de contratación.
        </p>
      </LegalSection>

      <LegalSection title="Contratación">
        <p>
          La contratación se formaliza por escrito, con el alcance, el precio,
          el calendario y las condiciones de pago acordados entre Solvyn
          Solutions y tú.
        </p>
      </LegalSection>

      <LegalSection title="Propiedad del código">
        <p>
          El código fuente y los entregables del proyecto pasan a ser de tu
          propiedad una vez liquidado el pago total acordado. Hasta entonces,
          los derechos sobre el código permanecen con Solvyn Solutions. Las
          librerías y los servicios de terceros que usemos se rigen por sus
          propias licencias.
        </p>
      </LegalSection>

      <LegalSection title="Uso del sitio">
        <p>
          Puedes usar el sitio y el configurador para conocer nuestros
          servicios. No debes usarlos para fines ilegales ni para afectar su
          funcionamiento o la información de otras personas.
        </p>
      </LegalSection>

      <LegalSection title="Limitación de responsabilidad">
        <p>
          La propuesta y el contenido del sitio no constituyen asesoría legal,
          fiscal, financiera ni de otra naturaleza. Solvyn Solutions no
          garantiza que el sitio esté disponible sin interrupciones.
        </p>
        <p>
          En la medida que lo permita la ley, Solvyn Solutions no responde por
          daños indirectos o consecuentes. Su responsabilidad se limita al monto
          que hayas pagado por el servicio que dio origen a la reclamación. En
          los proyectos contratados, esta limitación se regirá por el contrato
          firmado.
        </p>
      </LegalSection>

      <LegalSection title="Ley aplicable">
        <p>
          Estos términos se rigen por las leyes federales de los Estados Unidos
          Mexicanos. Para cualquier controversia, las partes se someten a los
          tribunales competentes del domicilio de Solvyn Solutions.
        </p>
      </LegalSection>

      <LegalSection title="Cambios y contacto">
        <p>
          Podemos actualizar estos términos. La versión vigente es la publicada
          en esta página. Para dudas sobre estos términos, escríbenos a{" "}
          {settings.email} o por WhatsApp al {settings.whatsapp}.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
