// TODO: Revisar con abogado antes de publicar
import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/src/components/legal/LegalPage";
import { PRIVACY_VERSION, SITE } from "@/src/config/site";
import { getSettings } from "@/src/lib/settings/settings";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description: `Aviso de privacidad de ${SITE.name}, conforme a la LFPDPPP.`,
};

export default async function PrivacidadPage() {
  const settings = await getSettings();
  return (
    <LegalPage
      title="Aviso de privacidad"
      meta={`Versión ${PRIVACY_VERSION} · Última actualización: octubre de 2026`}
    >
      <LegalSection title="Responsable">
        <p>
          {SITE.legalName}, con nombre comercial {SITE.name}, es responsable del
          tratamiento de tus datos personales. Nuestro domicilio es{" "}
          {SITE.address}. Puedes contactarnos en {settings.email}.
        </p>
      </LegalSection>

      <LegalSection title="Datos que recabamos">
        <p>
          Solo recabamos los datos que necesitamos para cumplir las finalidades
          de este aviso:
        </p>
        <ul className="list-disc pl-5">
          <li>Nombre y correo electrónico.</li>
          <li>Número de WhatsApp, si decides proporcionarlo.</li>
          <li>
            Respuestas del configurador de soluciones: objetivo, industria,
            tamaño del equipo, presupuesto, urgencia y descripción de tu
            proyecto.
          </li>
          <li>
            Fecha y versión de este aviso que aceptaste, como registro de tu
            consentimiento.
          </li>
          <li>Fecha y hora de la reunión, si agendas una.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Finalidades">
        <p>
          <strong className="text-foreground">Finalidades necesarias:</strong>{" "}
          generar y enviarte la propuesta preliminar de tu proyecto, contactarte
          sobre ella y agendar una reunión si lo solicitas.
        </p>
        <p>
          <strong className="text-foreground">Finalidades secundarias:</strong>{" "}
          mejorar nuestro servicio y el configurador a partir de las respuestas
          recabadas, de forma interna.
        </p>
        <p>
          Si no deseas que tus datos se usen para finalidades secundarias,
          escríbenos a {settings.email} indicándolo. Esto no afectará la propuesta
          ni la atención que recibas.
        </p>
      </LegalSection>

      <LegalSection title="Inteligencia artificial">
        <p>
          Para redactar la propuesta podemos usar modelos de inteligencia
          artificial. A estos modelos{" "}
          <strong className="text-foreground">
            no les enviamos tu nombre, correo ni WhatsApp
          </strong>
          . Solo se envía la descripción de tu proyecto, de la que eliminamos
          correos, teléfonos y enlaces antes de enviarla.
        </p>
      </LegalSection>

      <LegalSection title="Con quién compartimos tus datos">
        <p>
          No vendemos ni cedemos tus datos a terceros para fines comerciales.
          Solo los compartimos con proveedores que los procesan por nuestra
          cuenta, únicamente para prestar el servicio:
        </p>
        <ul className="list-disc pl-5">
          <li>
            Proveedores de infraestructura y base de datos, para almacenar la
            información y administrar el acceso.
          </li>
          <li>
            Proveedor de correo electrónico, para enviarte la propuesta y las
            confirmaciones.
          </li>
          <li>
            Proveedor de calendario de reuniones, para agendar la sesión que
            solicites.
          </li>
        </ul>
        <p>
          Estos proveedores pueden estar fuera de México. Nos aseguramos de que
          solo traten tus datos para estas finalidades.
        </p>
      </LegalSection>

      <LegalSection title="Derechos ARCO">
        <p>
          Tienes derecho a acceder a tus datos, rectificarlos, cancelarlos u
          oponerte a su tratamiento (derechos ARCO), y a revocar el
          consentimiento que nos diste. Para ejercerlos, envía un correo a{" "}
          {settings.email} con:
        </p>
        <ul className="list-disc pl-5">
          <li>Tu nombre y el correo con el que nos contactaste.</li>
          <li>La solicitud concreta y el derecho que quieres ejercer.</li>
          <li>Los documentos que acrediten tu identidad.</li>
        </ul>
        <p>
          Responderemos en un plazo máximo de 20 días hábiles desde la recepción
          de tu solicitud. Si la procede, la haremos efectiva dentro de los 15
          días hábiles siguientes.
        </p>
      </LegalSection>

      <LegalSection title="Conservación de los datos">
        <p>
          Conservamos tus datos mientras sean necesarios para las finalidades de
          este aviso. Si no hay contacto durante 24 meses, los eliminamos, salvo
          que solicites su cancelación antes.
        </p>
      </LegalSection>

      <LegalSection title="Cookies y analítica">
        <p>
          Actualmente el sitio no usa cookies de publicidad ni herramientas de
          analítica. Solo usamos cookies técnicas de sesión en el panel de
          administración, al que accede únicamente el equipo de Solvyn.
        </p>
      </LegalSection>

      <LegalSection title="Cambios a este aviso">
        <p>
          Podemos modificar este aviso. Cada cambio se publicará en esta página
          con una nueva versión y fecha. Si el cambio afecta tus datos de forma
          relevante, te lo notificaremos por correo.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
