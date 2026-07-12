FROM node:24-bookworm-slim AS base

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Stage 1: Install all dependencies (development + production)
FROM base AS all-deps

ENV NODE_ENV=development

COPY package.json package-lock.json* ./

RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Stage 2: Prune the already-resolved dependency tree for production.
# Extending all-deps keeps Docker from running two expensive npm ci jobs in parallel.
FROM all-deps AS prod-deps

ENV NODE_ENV=production

RUN npm prune --omit=dev

# Stage 3: Build the application
FROM base AS builder

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=all-deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build -- --webpack

# Stage 4: Run the application
FROM base AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

WORKDIR /app

COPY --from=builder /app/package.json ./package.json
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/data ./data
COPY --from=builder /app/types ./types
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/tsconfig.json ./tsconfig.json

RUN chmod +x /app/scripts/docker-entrypoint.sh

EXPOSE 3000

CMD ["/app/scripts/docker-entrypoint.sh"]
