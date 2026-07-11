# 🚍 Smart Bus AI

> **AI-powered intelligent transportation ecosystem** — Real-time bus tracking, predictive ETAs, digital payments, and fleet management.

[![GitHub](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red)](https://nestjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-FREE-green)](https://supabase.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## 📋 Overview

Smart Bus AI transforms public, private, university, and enterprise buses into intelligent connected fleets. The platform provides:

- **Passenger App** — Real-time bus tracking, ETAs, route planning
- **Driver App** — Navigation, passenger logging, SOS alerts
- **Admin Dashboard** — Fleet management, analytics, revenue reports
- **AI Services** — ETA prediction, demand forecasting, route optimization
- **IoT Ready** — ESP32 GPS tracking, RFID boarding (v1.0+)

---

## 🏗 Architecture

```
┌─────────────────────────────────────┐
│  Next.js Apps (Passenger | Driver | Admin) │
└─────────────────────────────────────┘
              │ REST / WebSocket
┌─────────────────────────────────────┐
│        Backend API (NestJS)         │
└─────────────────────────────────────┘
         │                  │
         ▼                  ▼
  FastAPI (AI)        Supabase (DB + Auth + Realtime)
```

---

## 🛠 Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js 14, React, Tailwind, TypeScript | SSR, SEO, type safety |
| Maps | Leaflet + OpenStreetMap | Free, no API keys |
| Backend | NestJS | Modular, DI, WebSockets, TypeScript |
| AI | FastAPI (Python) | Model serving, async, native validation |
| Database | PostgreSQL (Supabase) | Managed, free tier, Row Level Security |
| Auth | Supabase Auth | Built-in, social login, JWT |
| Realtime | Supabase Realtime | Live bus tracking |
| Monorepo | Turborepo | Parallel builds, shared packages |
| Deploy | Vercel + Railway | Free hosting, auto-deploy from GitHub |

---

## 📁 Repository Structure

```
smart-bus-ai/
├── apps/
│   ├── passenger/      # Passenger Next.js app
│   ├── driver/         # Driver Next.js app
│   └── admin/          # Admin dashboard
├── services/
│   ├── api/            # NestJS backend
│   ├── ai/             # FastAPI AI service
│   ├── simulator/      # Bus simulation engine
│   └── notification/   # Notification delivery
├── packages/
│   ├── ui/             # Shared components
│   ├── shared/         # Types, schemas, utilities
│   └── config/         # Shared configuration
├── database/
│   ├── migrations/     # SQL migrations
│   └── seeds/          # Seed data
├── iot/                # ESP32 firmware (v1.0+)
└── docs/               # ADRs, diagrams, guides
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase account (free tier)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/smart-bus-ai.git
cd smart-bus-ai

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# 4. Run database migrations
# Run SQL files from database/migrations/ in Supabase SQL Editor

# 5. Start development servers
npm run dev
```

### Development

```bash
# Start everything in parallel
npm run dev

# Start specific service
npm run dev --filter=@smart-bus/api
npm run dev --filter=@smart-bus/passenger
npm run dev --filter=@smart-bus/simulator

# Lint
npm run lint

# Build
npm run build
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [VISION.md](VISION.md) | Project vision, mission, goals |
| [PRD.md](PRD.md) | Product Requirements Document |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System architecture, flows, decisions |
| [DATA-MODEL.md](DATA-MODEL.md) | Complete database schema |
| [API-CONTRACT.md](API-CONTRACT.md) | All REST + WebSocket endpoints |
| [ROADMAP.md](ROADMAP.md) | Version milestones and sprints |
| [ENGINEERING-HANDBOOK.md](ENGINEERING-HANDBOOK.md) | AI context for all tools |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guidelines |
| docs/adr/ | Architecture Decision Records |

---

## 🗺 Roadmap

| Version | Focus | Status |
|---------|-------|--------|
| v0.1 | Simulation MVP (live map, auth, bus tracking) | 🔜 Current |
| v0.2 | Admin Dashboard, CRUD, analytics | 📅 Planned |
| v0.3 | Wallet, QR boarding, notifications | 📅 Planned |
| v0.4 | AI: ETA Prediction | 📅 Planned |
| v0.5 | AI: Demand Prediction | 📅 Planned |
| v0.6 | AI: Route Optimization | 📅 Planned |
| v1.0 | IoT Integration (ESP32, RFID) | 🔮 Future |

See [ROADMAP.md](ROADMAP.md) for full details.

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit with conventional commits (`feat: add amazing feature`)
4. Push and open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

## 🌟 Acknowledgments

- Built as a long-term open-source engineering project
- Inspired by Transit App, Moovit, GTFS standard
- Powered by open-source technology (Leaflet, OSM, Supabase, Next.js, NestJS)

---

## 📬 Contact

- **Project Lead:** Your Name
- **LinkedIn:** [Your Profile]
- **GitHub:** [@yourusername](https://github.com/yourusername)

---

> **Smart Bus AI** — Making public transportation as reliable as ride-hailing. 🚍✨