# 📅 Event Management Platform

A full-stack event management platform designed to organize events, missions, and time slots while managing user availability and participation.

The application is currently deployed in staging state and accessible here:

👉 https://staging-mt-event-app.duckdns.org/

---

## 🚀 Project purpose

This project simulates a real-world coordination system for managing structured events.

It allows:

- Creating events and organizing them into missions
- Defining time-based slots for each mission
- Managing user availability
- Allowing users to register for slots
- Laying the foundation for an intelligent matching system

The goal is to solve real scheduling and coordination problems (volunteers, teams, event staff, etc.).

---

## 👥 Team-based / real-world simulation context

This project was not built as a simple personal side project.

It was developed in a **real-world simulation context**, following a **team-based and project management approach**, as if working inside a software company.

The goal was to reproduce professional conditions, including:

- Feature planning and task breakdown
- Structured development workflow
- Architectural decision-making under constraints
- Collaboration mindset (even in solo execution)
- Production-oriented thinking (scalability, deployment, maintainability)

This approach allowed me to work on the project as an **end-to-end product builder**, not just as a solo developer.

---

## 🧱 Architecture overview

### Backend
- Node.js
- NestJS (modular architecture)
- TypeScript
- REST API
- Clean Architecture principles

### Frontend
- React (TypeScript)
- FullCalendar (availability management)
- Modern hooks-based architecture

### Database
- **MySql**
- **MongoDB**
- Document-based modeling adapted for event-driven structures
- Designed for scalability and future microservices split

---

## 🚀 Deployment

The application is fully deployed in a staging environment:

- Frontend + Backend exposed via reverse proxy
- Production-like environment for testing real flows
- Accessible publicly via DuckDNS domain

### Infrastructure highlights

- Containerized services (Docker-based deployment)
- Reverse proxy routing (Nginx)
- Environment separation (dev / staging / future prod-ready setup)
- CI/CD-ready architecture

---

## 🧠 Architecture evolution

This project is intentionally designed to evolve toward a distributed system.

### Current state
- Modular monolith (NestJS modules well separated)
- Clear domain boundaries (User / Event / Slot / Participation)

### Next step: Microservices migration

Planned decomposition:

- **Auth Service**
- **Event Service**
- **Scheduling Service**
- **Matching Service (future AI/logic engine)**

Communication strategy:
- REST initially
- Evolution toward event-driven architecture (NATS / message broker)

---

## 🔮 Future features

### ⚡ Real-time communication
- WebSockets
- Server-Sent Events (SSE)

### 🤖 Intelligent matching system
- Matching user availability with slots
- Scoring system for optimal assignment
- Conflict detection (overlaps, capacity constraints)

### 🧩 MCP integration (Model Context Protocol)
- Expose internal system as structured tools
- Enable AI agents to interact with:
  - events
  - slots
  - availability
- Prepare system for AI-assisted scheduling

---

## 🧠 Design principles

- Clean modular architecture (NestJS best practices)
- Separation of domain logic
- Scalability-first approach
- Migration-ready toward microservices
- Future-proof communication patterns (REST → events → real-time)

---

## 🛠️ Tech stack

### Backend
- Node.js
- NestJS
- TypeScript
- MySql
- MongoDB

### Frontend
- React
- FullCalendar

### Infrastructure
- Docker
- Nginx reverse proxy
- CI/CD ready (GitHub Actions)

---

## 🎯 What this project demonstrates

This project highlights:

- Real-world system design thinking
- Ability to build a full-stack production-ready application
- Understanding of scalable backend architecture
- Transition mindset from monolith → microservices
- Deployment and infrastructure
- Modern TypeScript ecosystem

---

## 👨‍💻 Author

**Maxime Tavares**

Fullstack Developer (TypeScript / NestJS / React)

- Focus: scalable backend architectures
- Interest: system design, distributed systems, AI integration

---

## 📌 Status

🚧 Active development — core system stable, evolution toward real-time + microservices + AI integration in progress.
