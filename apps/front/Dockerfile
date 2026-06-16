# syntax=docker/dockerfile:1.7

########################
# BASE
########################
FROM node:20-alpine AS base
WORKDIR /app

RUN corepack enable
RUN npm install -g turbo

########################
# PRUNE
########################
FROM base AS pruner
WORKDIR /app

ARG APP=front

COPY . .
RUN turbo prune --scope=${APP} --docker

########################
# BUILD
########################
FROM base AS builder
WORKDIR /app
ARG APP=front

# dépendances prunées
COPY --from=pruner /app/out/json/ ./
COPY --from=pruner /app/out/pnpm-lock.yaml ./
COPY --from=pruner /app/out/pnpm-workspace.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# full pruned repo
COPY --from=pruner /app/out/full/ ./
COPY tsconfig.base.json ./tsconfig.base.json

# env build Vite
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

ARG VITE_GEOAPIFY_API_KEY
ENV VITE_GEOAPIFY_API_KEY=$VITE_GEOAPIFY_API_KEY

# build turbo
RUN turbo build --filter=${APP}...

########################
# RUNNER (nginx)
########################
FROM nginx:stable-alpine AS runner

RUN apk add --no-cache ca-certificates

# copie build front uniquement
COPY --from=builder /app/apps/front/dist /usr/share/nginx/html

# nginx config
COPY apps/front/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]