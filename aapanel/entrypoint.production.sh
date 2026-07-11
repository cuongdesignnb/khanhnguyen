#!/bin/sh
set -eu

echo "Starting Khanh Nguyen production container..."

if [ "${RUN_DB_PUSH:-true}" = "true" ]; then
  echo "Synchronizing Prisma schema..."
  npx prisma db push --skip-generate
fi

if [ "${RUN_DB_SEED:-false}" = "true" ]; then
  echo "Running the optional database seed..."
  npm run db:seed
fi

echo "Starting Next.js on 0.0.0.0:${PORT:-3000}..."
exec npm run start -- -H 0.0.0.0 -p "${PORT:-3000}"
