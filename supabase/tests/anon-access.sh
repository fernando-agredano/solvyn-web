#!/usr/bin/env bash
# Checks that the public anon key reads nothing from the private tables of a real Supabase project.
# Read-only (GET only). Needs NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in the environment.
set -euo pipefail

: "${NEXT_PUBLIC_SUPABASE_URL:?missing}" "${NEXT_PUBLIC_SUPABASE_ANON_KEY:?missing}"
failed=0

for table in leads proposals generation_log admin_users; do
  body="$(mktemp)"
  status="$(curl -s -o "$body" -w '%{http_code}' \
    -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
    "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/$table?select=*&limit=1")"
  # Safe outcomes: an empty list (RLS filtered everything) or a refusal (permission denied).
  # A 404 proves nothing: the table is missing (migrations not applied), so it must not count as a pass.
  if [ "$status" = "404" ]; then
    echo "FAIL  $table -> HTTP 404, table not found: apply the migrations, then run this again"
    failed=1
  elif [ "$(tr -d '[:space:]' < "$body")" = "[]" ] || [ "$status" = "401" ] || [ "$status" = "403" ]; then
    echo "PASS  $table -> HTTP $status, no rows"
  else
    echo "FAIL  $table -> HTTP $status, the anon key got data"
    failed=1
  fi
  rm -f "$body"
done

exit "$failed"
