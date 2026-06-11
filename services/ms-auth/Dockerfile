# -------------------------
# BASE
# -------------------------
FROM node:20-alpine AS base

WORKDIR /app

RUN corepack enable


# -------------------------
# DEPENDENCIES (MONOREPO ROOT)
# -------------------------
FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY services/ms-auth/package.json services/ms-auth/package.json
COPY packages/contracts/package.json packages/contracts/package.json

RUN pnpm install --frozen-lockfile


# -------------------------
# BUILDER
# -------------------------
FROM base AS builder

RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN pnpm --filter ms-auth build


# -------------------------
# PRODUCTION
# -------------------------
FROM base AS production

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/services/ms-auth/dist ./services/ms-auth/dist

EXPOSE 3000

CMD ["node", "services/ms-auth/dist/src/main.js"]