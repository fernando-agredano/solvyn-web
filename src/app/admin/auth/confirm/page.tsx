import { Suspense } from "react";
import { AdminButton } from "@/src/components/admin/AdminButton";
import { LockIcon } from "@/src/components/ui/icons";
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
        badge="Enlace no válido"
        icon={<LockIcon size={24} />}
        title="No pudimos validar el enlace"
        description="Solicita un enlace nuevo desde la página de acceso."
      >
        <AdminButton href={ADMIN_LOGIN_PATH} variant="secondary" className="w-full">
          Volver al acceso
        </AdminButton>
      </AdminCard>
    );
  }

  return (
    <AdminCard
      badge="Último paso"
      icon={<LockIcon size={24} />}
      title="Confirmar acceso"
      description="Pulsa el botón para entrar al panel."
      perks={["Enlace de un solo uso", "Solo para administrador"]}
    >
      <form action={confirmLogin} className="w-full">
        <input type="hidden" name="token_hash" value={tokenHash} />
        <AdminButton type="submit" className="min-h-11 w-full">
          Entrar al panel
        </AdminButton>
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
