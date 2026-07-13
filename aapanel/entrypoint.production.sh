#!/bin/sh
set -eu

: "${DATABASE_URL:?Thiếu DATABASE_URL}"
: "${BETTER_AUTH_SECRET:?Thiếu BETTER_AUTH_SECRET}"

if [ "${RUN_DB_PUSH:-false}" = "true" ] || [ "${RUN_DB_SEED:-false}" = "true" ]; then
  echo "RUN_DB_PUSH và RUN_DB_SEED không được chạy tự động trong production." >&2
  exit 1
fi

echo "Starting Next.js standalone on 0.0.0.0:${PORT:-3000}..."
exec node server.js
