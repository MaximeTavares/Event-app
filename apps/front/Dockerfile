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

# Copie uniquement les fichiers de résolution monorepo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# workspace packages nécessaires
COPY apps/front/package.json apps/front/package.json
COPY packages/contracts/package.json packages/contracts/package.json

RUN pnpm install --frozen-lockfile


# -------------------------
# BUILDER
# -------------------------
FROM base AS builder

RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules

# On copie tout le monorepo
COPY . .

RUN pnpm install --frozen-lockfile

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

ARG VITE_GEOAPIFY_API_KEY
ENV VITE_GEOAPIFY_API_KEY=$VITE_GEOAPIFY_API_KEY

RUN pnpm --filter front build


# -------------------------
# PRODUCTION
# -------------------------
FROM nginx:stable-alpine AS production

RUN apk add --no-cache wget

COPY --from=builder /app/apps/front/dist /usr/share/nginx/html

COPY apps/front/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]