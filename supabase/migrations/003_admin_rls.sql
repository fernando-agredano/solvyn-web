-- Admin panel access. The app checks ADMIN_EMAIL; the database checks admin_users. Both must agree.
-- The panel reads and writes with the signed-in user's session (anon key + JWT), never with the service role,
-- so these policies are the real boundary. Public flows keep using the service role, which bypasses RLS.

-- The admin row is inserted by hand in the SQL editor (see docs/admin-security.md), so no email lives in the repo.
create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon, authenticated;

-- True only for an admin whose session still exists: after sign out, a copied JWT stops working before it expires.
create function public.is_admin() returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.admin_users a where a.user_id = auth.uid())
     and exists (select 1 from auth.sessions s where s.id = nullif(auth.jwt() ->> 'session_id', '')::uuid);
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- Defense in depth: no public flow reads these tables with the anon key.
revoke all on public.leads, public.proposals, public.generation_log from anon;

-- Leads: the admin reads everything but only updates workflow columns, so consent records stay immutable.
-- No delete policy yet: removing personal data (ARCO requests) gets its own reviewed change.
-- Revoke everything first: Supabase also grants TRUNCATE, which ignores RLS.
revoke all on public.leads, public.proposals, public.generation_log from authenticated;
grant select on public.leads, public.proposals, public.generation_log to authenticated;
grant update (estado, notas, meeting_at) on public.leads to authenticated;

create policy "admin reads leads" on public.leads
  for select to authenticated using ((select public.is_admin()));

create policy "admin updates leads" on public.leads
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Proposals and the generation log are read only from the panel.
create policy "admin reads proposals" on public.proposals
  for select to authenticated using ((select public.is_admin()));

create policy "admin reads generation log" on public.generation_log
  for select to authenticated using ((select public.is_admin()));
