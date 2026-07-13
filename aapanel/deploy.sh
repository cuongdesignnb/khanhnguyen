#!/bin/sh
set -eu
cd "$(dirname "$0")"

ENV_FILE=.env.production
COMPOSE_FILE=docker-compose.production.yml
[ -f "$ENV_FILE" ] || { echo "Thiếu $ENV_FILE" >&2; exit 1; }
set -a; . "./$ENV_FILE"; set +a
: "${DATABASE_URL:?Thiếu DATABASE_URL}"
: "${BETTER_AUTH_SECRET:?Thiếu BETTER_AUTH_SECRET}"
TAG="${1:-${APP_IMAGE_TAG:-master}}"
IMAGE="${APP_IMAGE:-ghcr.io/cuongdesignnb/khanhnguyen}:$TAG"
START=$(date +%s)

wait_healthy() {
  i=0
  while [ "$i" -lt 60 ]; do
    id=$(APP_IMAGE_TAG="$1" docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" ps -q app)
    status=$([ -n "$id" ] && docker inspect --format='{{.State.Health.Status}}' "$id" 2>/dev/null || true)
    [ "$status" = healthy ] && return 0
    i=$((i+1)); sleep 2
  done
  return 1
}

echo "Pulling immutable app image: $IMAGE"
APP_IMAGE_TAG="$TAG" docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" pull app
APP_IMAGE_TAG="$TAG" docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d --no-deps --force-recreate app
if ! wait_healthy "$TAG"; then
  echo "Image mới không healthy; bắt đầu rollback." >&2
  if [ -f .last-successful-image ]; then ./rollback.sh "$(cat .last-successful-image)"; fi
  exit 1
fi
[ -f .last-successful-image ] && cp .last-successful-image .previous-successful-image
printf '%s\n' "$TAG" > .last-successful-image
echo "Deploy thành công trong $(( $(date +%s) - START )) giây: $IMAGE"
