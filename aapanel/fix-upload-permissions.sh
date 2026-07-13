#!/bin/sh
set -eu

cd "$(dirname "$0")"
ENV_FILE="${APP_ENV_FILE:-.env.production}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.production.yml}"

[ -f "$ENV_FILE" ] || { echo "Thiếu $ENV_FILE" >&2; exit 1; }
[ -f "$COMPOSE_FILE" ] || { echo "Thiếu $COMPOSE_FILE" >&2; exit 1; }

APP_ID=$(docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" ps -q app)
[ -n "$APP_ID" ] || { echo "Container app chưa chạy." >&2; exit 1; }

echo "Sửa owner volume uploads bằng root trong container app..."
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" exec -T -u root app \
  sh -lc 'mkdir -p /app/public/uploads && chown -R node:node /app/public/uploads'

echo "Kiểm tra quyền ghi bằng đúng user chạy ứng dụng..."
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" exec -T app \
  sh -lc 'id; test -w /app/public/uploads; touch /app/public/uploads/.write-test; rm /app/public/uploads/.write-test'

echo "Volume uploads đã ghi được. Không có file nào bị xóa và không dùng chmod 777."
