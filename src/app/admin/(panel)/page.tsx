import { Suspense } from "react";
import { requireAdmin } from "@/src/lib/admin/auth";

async function PanelHome() {
  await requireAdmin();
  return (
    <main id="contenido" className="mx-auto max-w-[1280px] px-6 py-12">
      <h1 className="wide m-0 text-[clamp(28px,4vw,40px)] font-bold text-heading">
        Panel
      </h1>
      <p className="mt-3 text-[15px] text-text-secondary">
        La sesión está activa. Las pantallas de leads llegan en la siguiente
        fase.
      </p>
    </main>
  );
}

export default function AdminHomePage() {
  return (
    <Suspense>
      <PanelHome />
    </Suspense>
  );
}
