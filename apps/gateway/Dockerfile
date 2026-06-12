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
# DEPS
# -------------------------
FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY apps ./apps
COPY packages ./packages

RUN pnpm install --frozen-lockfile


# -------------------------
# BUILDER
# -------------------------
FROM base AS builder

WORKDIR /app

COPY --from=deps /app ./

RUN pnpm --filter gateway prisma:generate

RUN pnpm --filter gateway build


# -------------------------
# PRODUCTION
# -------------------------
FROM base AS production

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --prod --frozen-lockfile

# app build
COPY --from=builder /app/apps/gateway/dist ./apps/gateway/dist

# prisma runtime
COPY --from=builder /app/apps/gateway/prisma ./apps/gateway/prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000

CMD ["node", "apps/gateway/dist/src/main.js"]