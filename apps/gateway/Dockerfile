# -------------------------
# BASE
# -------------------------
FROM node:20-slim AS base

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates \
  openssl \
  && update-ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && corepack enable


# -------------------------
# DEPENDENCIES (MONOREPO ROOT)
# -------------------------
FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# workspace packages nécessaires
COPY apps/gateway/package.json apps/gateway/package.json
COPY packages/contracts/package.json packages/contracts/package.json

RUN pnpm install --frozen-lockfile


# -------------------------
# BUILDER
# -------------------------
FROM base AS builder

RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules

COPY . .

# Prisma generate (workspace-safe)
RUN pnpm --filter gateway prisma generate

# Build gateway uniquement
RUN pnpm --filter gateway build


# -------------------------
# PRODUCTION
# -------------------------
FROM base AS production

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# install prod deps workspace-aware
RUN pnpm install --prod --frozen-lockfile

# app build
COPY --from=builder /app/apps/gateway/dist ./apps/gateway/dist

# prisma runtime
COPY --from=builder /app/apps/gateway/prisma ./apps/gateway/prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000

CMD ["node", "apps/gateway/dist/src/main.js"]