-- RLS tests for 003_admin_rls.sql. Run after auth_stub.sql and the migrations (see run-rls-tests.sh).
-- Each block switches to an API role with `set local role` and sets the JWT claims, like PostgREST does.
-- A failed assertion aborts the script with a non-zero exit code.

\set ON_ERROR_STOP on

-- Seed (as superuser, so RLS does not apply).
-- admin     = 00000000-0000-0000-0000-00000000000a, session ...0a01 (listed in admin_users)
-- stranger  = 00000000-0000-0000-0000-00000000000b, session ...0b01 (signed in, not an admin)
-- ...0a99 is a session id that no longer exists in auth.sessions (signed out / revoked)
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'admin@test.dev'),
  ('00000000-0000-0000-0000-00000000000b', 'stranger@test.dev');
insert into auth.sessions (id, user_id) values
  ('00000000-0000-0000-0000-000000000a01', '00000000-0000-0000-0000-00000000000a'),
  ('00000000-0000-0000-0000-000000000b01', '00000000-0000-0000-0000-00000000000b');
insert into public.admin_users (user_id) values ('00000000-0000-0000-0000-00000000000a');

insert into public.proposals (id, slug, payload, source)
  values ('00000000-0000-0000-0000-0000000000c1', 'slug-1', '{}', 'rules');
insert into public.generation_log (ip_hash, provider, ok) values ('hash', 'rules', true);
insert into public.leads (id, nombre, correo, proposal_id, puntaje, etiqueta, respuestas, consentimiento_at, consentimiento_version)
  values ('00000000-0000-0000-0000-0000000000d1', 'Client', 'client@test.dev', '00000000-0000-0000-0000-0000000000c1',
          50, 'tibio', '{}', now(), '2026-10');

-- 1. anon: the public key reaches nothing.
begin;
set local role anon;
do $$
declare
  table_name text;
begin
  foreach table_name in array array['leads', 'proposals', 'generation_log', 'admin_users'] loop
    begin
      execute format('select count(*) from public.%I', table_name);
      raise exception 'anon read % without error', table_name;
    exception when insufficient_privilege then null;
    end;
  end loop;
  begin
    perform public.is_admin();
    raise exception 'anon can call is_admin';
  exception when insufficient_privilege then null;
  end;
end $$;
rollback;

-- 2. A signed-in user who is NOT an admin sees nothing and changes nothing.
begin;
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-00000000000b","session_id":"00000000-0000-0000-0000-000000000b01"}', true);
do $$
declare
  affected integer;
begin
  assert not public.is_admin(), 'stranger must not be admin';
  assert (select count(*) from public.leads) = 0, 'stranger read leads';
  assert (select count(*) from public.proposals) = 0, 'stranger read proposals';
  assert (select count(*) from public.generation_log) = 0, 'stranger read generation_log';

  update public.leads set estado = 'cerrado';
  get diagnostics affected = row_count;
  assert affected = 0, 'stranger updated leads';

  begin
    perform count(*) from public.admin_users;
    raise exception 'stranger read admin_users';
  exception when insufficient_privilege then null;
  end;
end $$;
rollback;

-- 3. The same user with no session claim, or a session that no longer exists, is not an admin either.
begin;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-00000000000a"}', true);
do $$
begin
  assert not public.is_admin(), 'admin without session_id claim must not pass';
  assert (select count(*) from public.leads) = 0, 'sessionless admin read leads';
end $$;
select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-00000000000a","session_id":"00000000-0000-0000-0000-000000000a99"}', true);
do $$
begin
  assert not public.is_admin(), 'admin with revoked session must not pass';
  assert (select count(*) from public.leads) = 0, 'revoked admin session read leads';
  assert (select count(*) from public.proposals) = 0, 'revoked admin session read proposals';
end $$;
rollback;

-- 4. The admin with a live session reads everything and writes only what the panel needs.
begin;
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-00000000000a","session_id":"00000000-0000-0000-0000-000000000a01"}', true);
do $$
declare
  affected integer;
begin
  assert public.is_admin(), 'admin must pass';
  assert (select count(*) from public.leads) = 1, 'admin cannot read leads';
  assert (select count(*) from public.proposals) = 1, 'admin cannot read proposals';
  assert (select count(*) from public.generation_log) = 1, 'admin cannot read generation_log';

  update public.leads set estado = 'contactado', notas = 'called';
  get diagnostics affected = row_count;
  assert affected = 1, 'admin cannot update workflow columns';

  begin
    update public.leads set consentimiento_at = now();
    raise exception 'admin changed the consent record';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.leads set correo = 'other@test.dev';
    raise exception 'admin changed the lead email';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.leads (nombre, correo, proposal_id, puntaje, etiqueta, respuestas, consentimiento_at, consentimiento_version)
      values ('X', 'x@test.dev', '00000000-0000-0000-0000-0000000000c1', 1, 'frio', '{}', now(), 'v');
    raise exception 'admin inserted a lead';
  exception when insufficient_privilege then null;
  end;
  begin
    delete from public.leads;
    raise exception 'admin deleted leads';
  exception when insufficient_privilege then null;
  end;
  begin
    truncate public.leads, public.proposals, public.generation_log cascade;
    raise exception 'admin truncated tables';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.proposals set slug = 'changed';
    raise exception 'admin updated a proposal';
  exception when insufficient_privilege then null;
  end;
  begin
    perform count(*) from public.admin_users;
    raise exception 'admin read admin_users through the API';
  exception when insufficient_privilege then null;
  end;
end $$;
rollback;

-- 5. The service role (public flows) keeps working: it bypasses RLS.
begin;
set local role service_role;
do $$
begin
  assert (select count(*) from public.leads) = 1, 'service role cannot read leads';
  insert into public.generation_log (ip_hash, provider, ok) values ('hash2', 'rules', true);
end $$;
rollback;

-- 6. 004_settings.sql: the public reads only the view, the table is admin-only, and the admin changes only the granted columns.
begin;
set local role anon;
do $$
begin
  assert (select count(*) from public.public_settings) = 1, 'anon cannot read the public settings view';
  assert (select count(*) from information_schema.columns
            where table_schema = 'public' and table_name = 'public_settings') = 5,
         'public settings view exposes unexpected columns';
  begin
    perform count(*) from public.settings;
    raise exception 'anon read the settings table';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.settings set hourly_rate_mxn = 1;
    raise exception 'anon updated settings';
  exception when insufficient_privilege then null;
  end;
end $$;
rollback;

begin;
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-00000000000b","session_id":"00000000-0000-0000-0000-000000000b01"}', true);
do $$
declare
  affected integer;
begin
  assert (select count(*) from public.settings) = 0, 'stranger read the settings table';
  update public.settings set hourly_rate_mxn = 1;
  get diagnostics affected = row_count;
  assert affected = 0, 'stranger updated settings';
end $$;
rollback;

begin;
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-00000000000a","session_id":"00000000-0000-0000-0000-000000000a01"}', true);
do $$
declare
  affected integer;
begin
  assert (select count(*) from public.settings) = 1, 'admin cannot read the settings row';
  update public.settings set hourly_rate_mxn = 700, whatsapp = '5512345678', email = 'hola@test.dev', updated_at = now();
  get diagnostics affected = row_count;
  assert affected = 1, 'admin cannot update the settings row';
  begin
    update public.settings set id = 2;
    raise exception 'admin changed the settings id';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.settings (id, hourly_rate_mxn, whatsapp, email) values (2, 600, '1', 'x@test.dev');
    raise exception 'admin inserted a settings row';
  exception when insufficient_privilege then null;
  end;
  begin
    delete from public.settings;
    raise exception 'admin deleted the settings row';
  exception when insufficient_privilege then null;
  end;
end $$;
rollback;

select 'all RLS tests passed' as result;
