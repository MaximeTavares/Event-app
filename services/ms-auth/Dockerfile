# -------------------------
# BASE
# -------------------------
FROM node:20-alpine AS base

RUN apk add --no-cache curl

WORKDIR /app


# -------------------------
# DEPENDENCIES
# -------------------------
FROM base AS deps

COPY package*.json ./

RUN npm ci


# -------------------------
# BUILDER
# -------------------------
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN npm run build


# -------------------------
# PRODUCTION
# -------------------------
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]