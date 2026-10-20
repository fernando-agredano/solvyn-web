import { Suspense } from "react";
import { AdminCard } from "../AdminCard";
import { LoginForm } from "./LoginForm";

async function LinkError({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  if (error !== "link") return null;
  return (
    <p role="alert" className="text-[13px] text-error">
      El enlace no es válido o ya expiró. Solicita uno nuevo.
    </p>
  );
}

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <AdminCard
      title="Acceso al panel"
      description="Escribe tu correo y te enviaremos un enlace para entrar."
    >
      <Suspense>
        <LinkError searchParams={searchParams} />
      </Suspense>
      <LoginForm />
    </AdminCard>
  );
}
