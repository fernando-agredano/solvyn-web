-- Site settings edited from /admin/ajustes. One row only.
-- Every field here is shown on the public site (rate, availability, contact), so the public reads a view of the
-- table, not the table itself. A view runs with its owner's rights: anon gets these columns and nothing else.
create table public.settings (
  id smallint primary key default 1 check (id = 1),
  hourly_rate_mxn integer not null check (hourly_rate_mxn between 100 and 10000),
  next_start_date date,
  availability_message text check (char_length(availability_message) <= 140),
  whatsapp text not null,
  email text not null,
  updated_at timestamptz not null default now()
);

-- Placeholders until the real contact data is entered in the panel.
insert into public.settings (id, hourly_rate_mxn, whatsapp, email)
values (1, 600, '[TU WHATSAPP]', '[TU CORREO]');

alter table public.settings enable row level security;

-- Revoke first: Supabase grants every privilege on new tables by default.
revoke all on public.settings from anon, authenticated;
grant select, update (hourly_rate_mxn, next_start_date, availability_message, whatsapp, email, updated_at)
  on public.settings to authenticated;

create policy "admin reads settings" on public.settings
  for select to authenticated using ((select public.is_admin()));

create policy "admin updates settings" on public.settings
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create view public.public_settings as
  select hourly_rate_mxn, next_start_date, availability_message, whatsapp, email
  from public.settings;

grant select on public.public_settings to anon, authenticated;
