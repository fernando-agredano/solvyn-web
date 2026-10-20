import { Suspense } from "react";
import { Button } from "@/src/components/ui/Button";
import { ADMIN_LOGIN_PATH } from "@/src/lib/admin/auth";
import { AdminCard } from "../../AdminCard";
import { confirmLogin } from "./actions";

type ConfirmSearchParams = Promise<{ token_hash?: string; type?: string }>;

async function ConfirmContent({
  searchParams,
}: {
  searchParams: ConfirmSearchParams;
}) {
  const { token_hash: tokenHash, type } = await searchParams;

  if (!tokenHash || type !== "email") {
    return (
      <AdminCard
        title="Enlace no válido"
        description="Solicita un enlace nuevo desde la página de acceso."
      >
        <Button href={ADMIN_LOGIN_PATH} variant="secondary">
          Volver al acceso
        </Button>
      </AdminCard>
    );
  }

  return (
    <AdminCard
      title="Confirmar acceso"
      description="Pulsa el botón para entrar al panel."
    >
      <form action={confirmLogin}>
        <input type="hidden" name="token_hash" value={tokenHash} />
        <Button type="submit" className="w-full">
          Entrar
        </Button>
      </form>
    </AdminCard>
  );
}

export default function AdminConfirmPage({
  searchParams,
}: {
  searchParams: ConfirmSearchParams;
}) {
  return (
    <Suspense>
      <ConfirmContent searchParams={searchParams} />
    </Suspense>
  );
}
