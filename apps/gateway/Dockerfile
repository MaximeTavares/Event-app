# syntax=docker/dockerfile:1.7

########################
# BASE
########################
FROM node:20-alpine AS base
WORKDIR /app

# dépendances système minimales
RUN apk add --no-cache \
    libc6-compat \
    ca-certificates \
  && update-ca-certificates

RUN corepack enable

RUN npm install -g turbo

########################
# PRUNE
########################
FROM base AS pruner
WORKDIR /app
ARG APP=gateway

COPY . .
RUN turbo prune --scope=${APP} --docker

########################
# BUILD
########################
FROM base AS builder
WORKDIR /app
ARG APP=gateway

COPY --from=pruner /app/out/json/ ./
COPY --from=pruner /app/out/pnpm-lock.yaml ./
COPY --from=pruner /app/out/pnpm-workspace.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .
COPY tsconfig.base.json ./tsconfig.base.json

# Build (inclut la compilation TS)
RUN turbo build --filter=${APP}...

########################
# DEPLOY
########################
FROM base AS deployer
WORKDIR /app
ARG APP=gateway

# 1. Récupère les manifests
COPY --from=pruner /app/out/json/ ./
COPY --from=pruner /app/out/pnpm-lock.yaml ./
COPY --from=pruner /app/out/pnpm-workspace.yaml ./

# 2. Install prod
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --prod --frozen-lockfile

# 3. Copie des artifacts buildés
COPY --from=builder /app/apps/${APP}/dist ./apps/${APP}/dist
COPY --from=builder /app/packages/contracts/dist ./packages/contracts/dist

# 4. Copie du schema et package.json pour génération finale
# COPY --from=builder /app/packages/database/generated ./packages/database/generated
COPY --from=builder /app/packages/database/dist ./packages/database/dist

# 5. pnpm deploy - Crée la structure légère dans /deploy
RUN pnpm --filter ${APP} deploy --prod /deploy


########################
# RUNNER
########################
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Copie UNIQUEMENT le contenu de /deploy
COPY --from=deployer --chown=nodejs:nodejs /deploy/ .

USER nodejs
EXPOSE 3000

CMD ["node", "dist/src/main.js"]