-- Contacts captured by the configurator, linked to the proposal they generated.
-- All access goes through server routes using the service role key; RLS is enabled with no public policies.
-- The admin panel (a later phase) will add a policy for the authenticated owner.

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  correo text not null,
  whatsapp text,
  proposal_id uuid not null references public.proposals (id) on delete cascade,
  estado text not null default 'nuevo'
    check (estado in ('nuevo', 'contactado', 'reunion', 'propuesta_enviada', 'cerrado', 'descartado')),
  puntaje integer not null check (puntaje between 0 and 100),
  etiqueta text not null check (etiqueta in ('caliente', 'tibio', 'frio')),
  -- presupuesto, urgencia, tamano, usuarios
  respuestas jsonb not null,
  consentimiento_at timestamptz not null,
  consentimiento_version text not null,
  meeting_at timestamptz,
  notas text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- A reload or retry must not create the same lead twice. The email is stored lowercase.
  unique (correo, proposal_id)
);

alter table public.leads enable row level security;

create index leads_estado_created_at_idx on public.leads (estado, created_at desc);

create function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();
