#!/bin/sh
set -eu

if [ "$#" -ne 1 ]; then
  echo "Usage: ./restore-database.sh backups/database-YYYYMMDD-HHMMSS.sql.gz"
  exit 1
fi

cd "$(dirname "$0")"
set -a
. ./.env.production
set +a

gzip -dc "$1" | docker compose --env-file .env.production -f docker-compose.production.yml exec -T postgres \
  psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"

echo "Database restore completed."
