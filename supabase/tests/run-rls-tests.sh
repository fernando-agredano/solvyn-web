#!/usr/bin/env bash
# Applies the migrations to a throwaway Postgres container and runs admin_rls.sql against it.
# Needs Docker. Touches nothing outside the container.
set -euo pipefail

cd "$(dirname "$0")/.."
container="solvyn-rls-test-$$"
trap 'docker rm -f "$container" >/dev/null 2>&1 || true' EXIT

docker run -d --name "$container" -e POSTGRES_PASSWORD=test postgres:17-alpine >/dev/null
until docker exec "$container" pg_isready -U postgres -q 2>/dev/null; do sleep 0.5; done
# The image restarts once after init, so wait until it stays up.
sleep 2
until docker exec "$container" pg_isready -U postgres -q 2>/dev/null; do sleep 0.5; done

run_sql() { docker exec -i "$container" psql -U postgres -v ON_ERROR_STOP=1 -q "$@"; }

run_sql < tests/auth_stub.sql
for migration in migrations/*.sql; do
  echo "applying $migration"
  run_sql < "$migration"
done
run_sql -t < tests/admin_rls.sql
