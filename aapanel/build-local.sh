#!/bin/sh
set -eu
cd "$(dirname "$0")"
export DOCKER_BUILDKIT=1
docker compose --env-file .env.production -f docker-compose.production.yml -f docker-compose.production.build.yml build --progress=plain app
docker compose --env-file .env.production -f docker-compose.production.yml -f docker-compose.production.build.yml up -d --no-deps --force-recreate app
