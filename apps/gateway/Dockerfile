# -------------------------
# BASE
# -------------------------
FROM node:20-slim AS base

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates \
  openssl \
  && update-ca-certificates \
  && rm -rf /var/lib/apt/lists/*


# -------------------------
# DEPENDENCIES
# -------------------------
FROM base AS deps

COPY package*.json ./
RUN npm ci --ignore-scripts


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
FROM base AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# app build
COPY --from=builder /app/dist ./dist

# prisma runtime
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000

CMD ["node", "dist/src/main.js"]