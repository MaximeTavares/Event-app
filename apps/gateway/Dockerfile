# -------------------------
# BASE
# -------------------------
FROM node:20-alpine AS base

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

COPY prisma ./prisma

RUN npx prisma generate

COPY . .

RUN npm run build


# -------------------------
# PRODUCTION
# -------------------------
FROM node:20-alpine AS production

RUN apk add --no-cache wget

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000

CMD ["node", "dist/src/main.js"]