import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

async function LinkError({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  if (error !== "link") return null;
  return (
    <p role="alert" className="m-0 text-xs text-[#B91C1C]">
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
    <LoginForm
      notice={
        <Suspense>
          <LinkError searchParams={searchParams} />
        </Suspense>
      }
    />
  );
}
