#!/bin/sh
set -e

echo "Starting Khanh Nguyen Docker entrypoint..."

echo "Generating Prisma client..."
npx prisma generate

if [ "$RUN_DB_PUSH" = "true" ]; then
  echo "Running Prisma db push..."
  npx prisma db push
fi

if [ "$RUN_DB_SEED" = "true" ]; then
  echo "Running database seed..."
  npm run db:seed || echo "Seed skipped or failed, continuing..."
fi

echo "Starting Next.js on 0.0.0.0:${PORT:-3000}..."
npm run start -- -H 0.0.0.0 -p ${PORT:-3000}
