# Admin panel security

How `/admin` is protected, how to set it up, and how each guarantee is tested.

## Model

Two independent layers; both must allow the request.

| Layer                                                                   | Checks                                                                           | Source of truth      |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------- |
| App (`src/proxy.ts` + `requireAdmin()` in every page, action and route) | Valid session whose email equals `ADMIN_EMAIL`                                   | Environment variable |
| Database (RLS, `003_admin_rls.sql`)                                     | `auth.uid()` is in `admin_users` and the session still exists in `auth.sessions` | `admin_users` table  |

- The panel queries with the signed-in user's session (anon key + JWT), never with the service role. RLS is the real boundary: a bug in the app layer returns zero rows, not data.
- `src/lib/supabase/server.ts` (service role) is for public server routes only. ESLint (`no-restricted-imports`) fails the build if `src/app/admin/**`, `src/lib/admin/**` or `src/proxy.ts` import it.
- A missing `ADMIN_EMAIL` or an empty `admin_users` locks everybody out. It never opens access.
- The admin can read `leads`, `proposals` and `generation_log`, and update only `leads.estado`, `leads.notas` and `leads.meeting_at`. Consent columns are immutable from the panel. There is no delete policy yet (ARCO requests get their own change).

## Login flow

1. `/admin/login` posts the email to a Server Action. It answers "If this email has access, you will receive a link" for any valid address, and sends the link (`signInWithOtp`, `shouldCreateUser: false`) from `after()` only when the address is `ADMIN_EMAIL`. Same body and same timing for everyone.
2. The email link opens `/admin/auth/confirm?token_hash=…&type=email`. The page only renders a button, so mail scanners that open links do not consume the one-time token.
3. The button runs `verifyOtp`, then checks the address against `ADMIN_EMAIL` **and** calls `is_admin()`. Any failure signs out and shows a generic error.
4. Session cookies are set by the server with `httpOnly`, `sameSite=lax` and `secure` in production.
5. Sign out is a POST Server Action with `scope: "global"`: every session of the user is revoked.

CSRF: every Server Action of the panel calls `assertSameOrigin()`. Unlike Next's built-in check, it also rejects requests with no `Origin` header and cross-site `Sec-Fetch-Site`.

Headers on `/admin/*`: `X-Robots-Tag: noindex, nofollow`, `Cache-Control: private, no-store`, `Content-Security-Policy: frame-ancestors 'none'`, plus `<meta name="robots">`, `Disallow: /admin` in `robots.txt`, and no entry in `sitemap.xml`.

## One-time setup (Supabase)

1. Apply `supabase/migrations/001`, `002` and `003` to the project (SQL editor or `supabase db push`).
2. Authentication → Providers → Email: enable it, disable "Allow new users to sign up", set the OTP expiry to 900 seconds.
3. Authentication → Users: create your user (invite or "Add user").
4. SQL editor, once (not in a migration, so the id is not in the repo):
   `insert into public.admin_users (user_id) select id from auth.users where email = '<your email>';`
5. Authentication → URL Configuration: Site URL = production domain; Redirect URLs = production domain and `http://localhost:3000` only. No wildcards.
6. Authentication → Email Templates → Magic Link: link to
   `{{ .SiteURL }}/admin/auth/confirm?token_hash={{ .TokenHash }}&type=email`.
7. Environment (`.env.local` and Vercel): `ADMIN_EMAIL`, `HASH_SALT` (required by the server in production).

## Tests

| Guarantee                                                                                                                                 | How                                                                                          | Command                           |
| ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------- |
| Without session, `/admin` redirects to login; data routes and Server Actions answer 401                                                   | `src/proxy.test.ts` (unit) and curl against `next start`                                     | `npm test`                        |
| A session of another email is rejected (proxy, `requireAdmin`, confirm action)                                                            | `src/proxy.test.ts`, `src/lib/admin/auth.test.ts`, `src/app/admin/auth-actions.test.ts`      | `npm test`                        |
| The admin gets in                                                                                                                         | Same files, admin cases                                                                      | `npm test`                        |
| The login answer does not reveal who the admin is; links are sent only to `ADMIN_EMAIL`                                                   | `src/app/admin/auth-actions.test.ts`                                                         | `npm test`                        |
| Cross-origin and no-Origin requests are refused                                                                                           | `isSameOrigin` and `confirmLogin` tests                                                      | `npm test`                        |
| anon and non-admin users read nothing; revoked or missing sessions are not admin; consent columns are immutable; service role still works | `supabase/tests/admin_rls.sql` on a throwaway Postgres container (needs Docker)              | `supabase/tests/run-rls-tests.sh` |
| The anon key reads nothing from the real project                                                                                          | `supabase/tests/anon-access.sh` (GET only; fails with 404 if the migrations are not applied) | see below                         |
| No secret reaches the browser bundle                                                                                                      | Search `.next/static` for the values of the secret variables after `npm run build`           | manual                            |
| `/admin` is not in `sitemap.xml` and carries `noindex`                                                                                    | curl against `next start`                                                                    | manual                            |

Run the anon check against a project with the variables exported:

```bash
NEXT_PUBLIC_SUPABASE_URL=… NEXT_PUBLIC_SUPABASE_ANON_KEY=… supabase/tests/anon-access.sh
```

### Manual checks (need a real mailbox and Supabase)

Do these once after the setup above:

1. Request a link with your email: the email arrives, the button enters `/admin`.
2. Request a link with an invented address: same message on screen, no email, same response time in DevTools.
3. Sign out, then reuse the old cookie: `/admin` redirects to the login.
4. With a second Supabase user that is not in `admin_users`, get a token (`POST /auth/v1/token?grant_type=password`) and call `GET /rest/v1/leads`, `/proposals`, `/generation_log`: each must return `[]`. `POST /rest/v1/rpc/is_admin` must return `false`.

## Known risks

- Supabase Auth is reachable with the public anon key, so anyone can call `/auth/v1/otp` directly. With sign-ups disabled it answers differently for unknown users, which can confirm an address has an account. Mitigation not applied yet: Supabase Auth CAPTCHA (Turnstile).
- Your mailbox is the only key. Turn on 2FA there; later, TOTP MFA in Supabase and require `aal2` in `is_admin()`.
- The service role is still used by the public routes; a bug there bypasses RLS.
- `ADMIN_EMAIL` and `admin_users` can drift apart. The result is a lockout, never open access.
- Idle-session timeouts are a Supabase Pro feature; on the free plan lower the JWT expiry instead.
