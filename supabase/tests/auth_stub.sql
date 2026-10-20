-- Minimal stand-in for what Supabase provides, so the migrations can run on a plain Postgres container.
-- Only used by run-rls-tests.sh. Never run this against a real Supabase project.

create role anon nologin;
create role authenticated nologin;
create role service_role nologin bypassrls;

create schema auth;
create table auth.users (id uuid primary key, email text);
create table auth.sessions (id uuid primary key, user_id uuid not null references auth.users (id) on delete cascade);

-- Same behavior as Supabase: both read the claims PostgREST puts in request.jwt.claims.
create function auth.jwt() returns jsonb language sql stable
as $$ select coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb $$;
create function auth.uid() returns uuid language sql stable
as $$ select nullif(auth.jwt() ->> 'sub', '')::uuid $$;

grant usage on schema auth, public to anon, authenticated, service_role;

-- Supabase grants everything on new public tables to the API roles and relies on RLS: reproduce that,
-- otherwise the revokes in the migrations would have nothing to revoke.
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
