#!/bin/sh
set -eu

cd "$(dirname "$0")"
set -a
. ./.env.production
set +a

mkdir -p backups
timestamp="$(date +%Y%m%d-%H%M%S)"

docker compose --env-file .env.production -f docker-compose.production.yml exec -T postgres \
  pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --no-owner --no-privileges \
  | gzip > "backups/database-${timestamp}.sql.gz"

docker run --rm \
  -v khanhnguyen_prod_uploads:/source:ro \
  -v "$(pwd)/backups:/backup" \
  alpine:3.22 sh -c "tar -czf /backup/uploads-${timestamp}.tar.gz -C /source ."

find backups -type f -mtime +14 -delete
echo "Backup completed: ${timestamp}"
