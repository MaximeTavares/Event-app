# -------------------------
# BASE
# -------------------------
FROM node:20-alpine AS base

WORKDIR /app

RUN corepack enable


# -------------------------
# DEPENDENCIES
# -------------------------
FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json ./

COPY apps ./apps
COPY services ./services
COPY packages ./packages

RUN pnpm install --frozen-lockfile --ignore-scripts


# -------------------------
# BUILDER
# -------------------------
FROM base AS builder

WORKDIR /app

COPY --from=deps /app /app

RUN pnpm install --frozen-lockfile --ignore-scripts

RUN pnpm --filter ms-auth build


# -------------------------
# PRODUCTION
# -------------------------
FROM base AS production

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --prod --frozen-lockfile --ignore-scripts

# app build
COPY --from=builder /app/services/ms-auth/dist ./services/ms-auth/dist

EXPOSE 3000

CMD ["node", "services/ms-auth/dist/src/main.js"]