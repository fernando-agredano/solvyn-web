// The signed-in admin: an avatar with the email's initial and a green "active" dot. From xl up the email shows next to it.
// Below that only the avatar stays, so the header's side columns keep the navigation at the center.
export function AdminUserChip({ email }: { email: string }) {
  return (
    <div
      title={email}
      className="flex h-10 items-center gap-2.5 rounded-full xl:border xl:border-[#E4E4E7] xl:bg-white xl:pr-4 xl:pl-1 xl:shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
    >
      <span
        aria-hidden="true"
        className="relative flex size-10 flex-none items-center justify-center rounded-full bg-[#18181B] text-sm font-semibold text-white xl:size-8 xl:text-xs"
      >
        {email.charAt(0).toUpperCase()}
        <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full bg-[#059669] ring-2 ring-white" />
      </span>
      <span className="sr-only">Sesión iniciada como {email}</span>
      <span
        aria-hidden="true"
        className="hidden min-w-0 flex-col gap-0.5 xl:flex"
      >
        <span className="text-[10px] leading-none font-medium tracking-wide text-[#71717A] uppercase">
          Administrador
        </span>
        <span className="max-w-56 truncate text-xs leading-none font-medium text-[#18181B]">
          {email}
        </span>
      </span>
    </div>
  );
}
