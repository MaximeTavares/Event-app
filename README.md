# H.E.L.P - Hub for Event Logistic & People

Event and volunteer management platform. Organize events, break them down into missions and time slots, manage user availability, and let people register for slots.

Staging: https://staging-mt-event-app.duckdns.org/ - this staging instance is a V1 prototype and won't evolve further, due to the constraints of the current AWS server.

## Architecture

Monorepo (pnpm + Turborepo) with two NestJS microservices communicating over NATS:

| Service | Role | Database | Port |
|---|---|---|---|
| `gateway` | Public API, business logic (events, missions, slots, participation) | MySQL (Prisma) | 3000 |
| `ms-auth` | Auth (JWT, refresh tokens, Google OAuth) | MongoDB (Mongoose) | 3001 |
| `frontend` | React + TypeScript SPA | - | 5173 |

`gateway` and `ms-auth` currently communicate over NATS (request/reply). Shared TypeScript/Zod contracts live in `packages/contracts`.

**In progress - `ms-auth` rewrite:** moving from NestJS/MongoDB to Java Spring Boot with MySQL (JPA/Hibernate), and switching the gateway ↔ ms-auth communication from NATS to Kafka. NATS is dropped for now, since that link is currently the only inter-service communication in the system. The existing Jest test suite is used as the behavioral spec for the rewrite.

A Java Spring Boot service (notifications + PDF generation, GraalVM native image) is also in progress. It may end up merged into the new `ms-auth` rather than staying a separate service - still being decided.

CI/CD: GitHub Actions, Docker images pushed to GHCR, atomic deploy on a single AWS EC2 instance.

## Run locally with Docker

**Requirements:** Docker, Docker Compose.

```bash
git clone <repo-url>
cd Event-app
```

Create a `.env` at the repo root (DB credentials, JWT secrets, NATS URL - see `.env.example`), and a `.env` in `apps/front` (see `apps/front/.env.example`).

```bash
docker compose up --build
```

This starts:

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Gateway API | http://localhost:3000 |
| ms-auth API | http://localhost:3001 |
| phpMyAdmin (MySQL gateway DB) | http://localhost:8083 |
| Mongo Express (auth DB) | http://localhost:8084 |
| NATS | localhost:4222 |

Stop everything:

```bash
docker compose down
```

Wipe volumes (reset DB state):

```bash
docker compose down -v
```

## Stack

- **Backend:** NestJS, TypeScript, Prisma, Mongoose, NATS
- **Java:** Spring Boot, JPA/Hibernate, Kafka, GraalVM native image
- **Frontend:** React, TypeScript, TanStack Query, shadcn/ui
- **Infra:** Docker, GitHub Actions, AWS EC2

## Status

Active development. Current focus: rewriting `ms-auth` in Java and deciding whether the notification system gets built into it. WebSocket chat is deprioritized for now.
