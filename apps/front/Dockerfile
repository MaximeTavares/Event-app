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

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

RUN npm run build


# -------------------------
# PRODUCTION
# -------------------------
FROM nginx:stable-alpine AS production

RUN apk add --no-cache wget

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]