# AI Context for smart-bus-ai

This file is the **single source of truth** for AI tools (Claude, Codex, etc.) to understand the Smart Bus AI project.

## Project Summary

Smart Bus AI is a **real-time public transit platform** that uses AI to optimize bus scheduling, routing, and passenger communication. It is a **monorepo** containing a web admin dashboard, a driver mobile app, a passenger mobile app, and multiple backend services.

## Monorepo Structure

```
smart-bus-ai/
├── apps/                    # Frontend applications
│   ├── admin/               # Admin dashboard (React web app)
│   ├── driver/              # Driver mobile app (React Native / Expo)
│   └── passenger/           # Passenger mobile app (React Native / Expo)
│
├── packages/                # Shared libraries and config
│   ├── config/              # Shared ESLint, TypeScript, Tailwind config
│   ├── shared/              # Shared TypeScript types, utils, hooks
│   └── ui/                  # Shared UI component library
│
├── services/                # Backend microservices
│   ├── ai/                  # AI/ML service - scheduling, predictions
│   ├── api/                 # Main API gateway (REST/GraphQL)
│   ├── notification/        # Push notification service
│   └── simulator/           # Bus simulator for testing AI logic
│
├── database/                # Database layer
│   ├── migrations/          # SQL migration files
│   └── seeds/               # Seed data for development
│
├── docs/                    # Technical documentation
│   ├── adr/                 # Architecture Decision Records
│   ├── AI_STUDIO_BUILD_PROMPT.md
│   └── STITCH_BRIEF.md
│
├── .obsidian/               # Obsidian vault configuration
│
├── PRD.md                   # Product Requirements Document
├── ARCHITECTURE.md          # System architecture and design decisions
├── DATA-MODEL.md            # Database schema and entity relationships
├── API-CONTRACT.md          # API specification (endpoints, requests/responses)
├── DESIGN.md                # UI/UX design guidelines
├── README.md                # Project overview and getting started
├── ENGINEERING-HANDBOOK.md  # Coding standards and best practices
├── CONTRIBUTING.md          # Contribution guidelines
├── CHANGELOG.md             # Version history
├── ROADMAP.md               # Product roadmap
├── SPRINT-1.md              # Sprint 1 plan and tasks
├── VISION.md                # Product vision and goals
├── AI-PROMPTS.md            # AI prompt templates and library
└── package.json             # Root package.json (monorepo setup)
```

## Documentation Guide

Read these files **in this order** to understand the full project:

| File | Purpose |
|------|---------|
| **VISION.md** | The "why" — business case, goals, and success metrics |
| **PRD.md** | The "what" — product features, user stories, epics |
| **ARCHITECTURE.md** | The "how" — system design, tech stack, architecture decisions |
| **DATA-MODEL.md** | Database schema — tables, relationships, migrations |
| **API-CONTRACT.md** | API endpoints — request/response formats, authentication |
| **DESIGN.md** | UI/UX — design system, Figma links, component guidelines |
| **ENGINEERING-HANDBOOK.md** | Coding standards, git flow, review process |
| **ROADMAP.md** | Timeline and milestones |
| **SPRINT-1.md** | Current sprint tasks and acceptance criteria |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend (Admin) | React, TypeScript, Tailwind CSS |
| Mobile (Driver) | React Native, Expo |
| Mobile (Passenger) | React Native, Expo |
| Backend (API) | Node.js, Express/GraphQL |
| AI Service | Python, scikit-learn/TensorFlow |
| Notifications | Firebase Cloud Messaging / OneSignal |
| Database | PostgreSQL |
| Monorepo | Turborepo, npm workspaces |

## Key Concepts

- **Real-time Updates**: WebSocket for live bus location tracking
- **AI Scheduling**: Predictive algorithms for route optimization and bus allocation
- **Offline-first**: Mobile apps must work offline with sync
- **Performance**: Target: < 4000ms TTFB on API, < 200ms on DB queries

## Entry Points for AI Analysis

When analyzing or generating code for this project:
1. Check `_AI_CONTEXT.md` (this file) first
2. Read the relevant domain file from the Documentation Guide table
3. Look at source code in the matching service/app folder
4. Follow references and cross-links in the docs

## Notes for AI Tools

- This is a **monorepo** — code is split across `apps/`, `packages/`, and `services/`
- Documentation is in **Markdown** at the project root
- Database migrations are in `database/migrations/`
- Environment variables are stored in `.env` files (not committed to git)