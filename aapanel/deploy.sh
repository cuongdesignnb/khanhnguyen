#!/bin/sh
set -eu

cd "$(dirname "$0")"

if [ ! -f .env.production ]; then
  echo "Missing aapanel/.env.production"
  echo "Run: cp env.production.example .env.production"
  exit 1
fi

if grep -q 'CHANGE_ME' .env.production; then
  echo "Replace every CHANGE_ME value in .env.production before deploying."
  exit 1
fi

set -a
. ./.env.production
set +a

docker compose --env-file .env.production -f docker-compose.production.yml config >/dev/null
docker compose --env-file .env.production -f docker-compose.production.yml up -d --build

echo "Waiting for application health check..."
i=0
until [ "$(container_id="$(docker compose --env-file .env.production -f docker-compose.production.yml ps -q app)"; [ -n "$container_id" ] && docker inspect --format='{{.State.Health.Status}}' "$container_id" 2>/dev/null || true)" = "healthy" ]; do
  i=$((i + 1))
  if [ "$i" -ge 60 ]; then
    echo "Application did not become healthy. Recent logs:"
    docker compose --env-file .env.production -f docker-compose.production.yml logs --tail=100 app
    exit 1
  fi
  sleep 3
done

echo "Deployment is healthy at http://127.0.0.1:${APP_PORT:-4317}"
docker compose --env-file .env.production -f docker-compose.production.yml ps
