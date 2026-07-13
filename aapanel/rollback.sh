#!/bin/sh
set -eu
cd "$(dirname "$0")"
ENV_FILE=.env.production
COMPOSE_FILE=docker-compose.production.yml
set -a; . "./$ENV_FILE"; set +a
TAG="${1:-$([ -f .previous-successful-image ] && cat .previous-successful-image || true)}"
[ -n "$TAG" ] || { echo "Không có tag rollback." >&2; exit 1; }
echo "Rollback app về ${APP_IMAGE:-ghcr.io/cuongdesignnb/khanhnguyen}:$TAG"
APP_IMAGE_TAG="$TAG" docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" pull app
APP_IMAGE_TAG="$TAG" docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d --no-deps --force-recreate app
i=0
while [ "$i" -lt 60 ]; do id=$(APP_IMAGE_TAG="$TAG" docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" ps -q app); status=$([ -n "$id" ] && docker inspect --format='{{.State.Health.Status}}' "$id" 2>/dev/null || true); [ "$status" = healthy ] && { printf '%s\n' "$TAG" > .last-successful-image; echo "Rollback thành công."; exit 0; }; i=$((i+1)); sleep 2; done
echo "Rollback không healthy." >&2; exit 1
