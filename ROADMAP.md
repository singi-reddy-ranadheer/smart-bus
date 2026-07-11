# Smart Bus AI — Roadmap

> **Version:** 1.0  
> **Status:** Active  
> **Last Updated:** 2026-07-10

---

## Version Overview

| Version | Focus | Timeline | Status |
|---------|-------|----------|--------|
| v0.1 | Simulation MVP | Sprint 1-2 | 🔜 Current |
| v0.2 | Admin & Operations | Sprint 3-4 | 📅 Planned |
| v0.3 | Payments & Boarding | Sprint 5-6 | 📅 Planned |
| v0.4 | AI: ETA Prediction | Sprint 7-8 | 📅 Planned |
| v0.5 | AI: Demand Prediction | Sprint 9-10 | 📅 Planned |
| v0.6 | AI: Route Optimization | Sprint 11-12 | 📅 Planned |
| v1.0 | IoT Integration | Sprint 13-16 | 🔮 Future |
| v2.0 | Production Hardening | Sprint 17-20 | 🔮 Future |
| v3.0 | Smart City Platform | Sprint 21+ | 🔮 Future |

---

## v0.1 — Simulation MVP (Current)

**Goal:** One bus moving on a map with real-time position updates. End-to-end data flow working.

### Sprint 1 — Foundation

| Task | Assignee | Dependencies |
|------|----------|-------------|
| Initialize Turborepo monorepo | Cline | None |
| Configure TypeScript, ESLint, Prettier | Cline | Monorepo |
| Create NestJS API scaffold | Cline | Monorepo |
| Create Supabase project + database schema | Cline | API scaffold |
| Create simulator service scaffold | Cline | Monorepo |
| Create passenger app scaffold (Next.js) | Cline | Monorepo |
| Database migrations (enums, tables, indexes) | Cline | Supabase project |
| Database seed data (routes, stops, buses) | Cline | Migrations |

### Sprint 2 — Core Features

| Task | Assignee | Dependencies |
|------|----------|-------------|
| Implement simulator engine (route following, GPS generation) | AI | Sprint 1 |
| Implement NestJS trip-events module (POST + GET) | AI | Sprint 1 |
| Implement NestJS WebSocket gateway | AI | Sprint 1 |
| Implement buses module (GET endpoints) | AI | Sprint 1 |
| Implement routes module (GET endpoints) | AI | Sprint 1 |
| Build Leaflet map with bus markers | AI | Sprint 1 |
| Subscribe to Supabase Realtime for bus positions | AI | Sprint 1 |
| Implement auth (register/login/logout) | AI | Sprint 1 |
| Wire end-to-end: Simulator → API → Supabase → Map | Cline | All above |
| Documentation: README, screenshots, demo | Cline | Working MVP |

**Deliverable:** Live demo: one bus moving along a route on an interactive map.

---

## v0.2 — Admin & Operations

**Goal:** Admin dashboard with fleet management, CRUD operations, and basic analytics.

| Feature | Details |
|---------|---------|
| Admin Dashboard | Fleet overview, active trips map, system status |
| Route Management UI | Create/edit/delete routes and stops |
| Bus Management UI | Create/edit/delete buses |
| Driver Management UI | Create/edit/delete driver profiles |
| Trip History | Searchable, filterable, paginated trip logs |
| Basic Analytics | Passenger count trends, trip completion rates, bus utilization |
| Driver App v2 | Turn-by-turn navigation, passenger count logging, SOS button |

---

## v0.3 — Payments & Boarding

**Goal:** Digital payments and automated boarding.

| Feature | Details |
|---------|---------|
| Digital Wallet | Top-up via simulated payment, balance, transaction history |
| QR Code Boarding | Generate QR for trip, scan to board, deduct fare |
| RFID Simulation | Simulated RFID card tap, tap-to-board experience |
| Push Notifications | Bus arrival alerts, trip reminders, payment confirmations |
| Occupancy Tracking | Real-time passenger count, color-coded bus markers (green/yellow/red) |

---

## v0.4 — AI: ETA Prediction

**Goal:** Machine learning model predicts bus arrival times.

| Feature | Details |
|---------|---------|
| FastAPI Service | Deploy Python AI service on Railway |
| Data Pipeline | Extract historical TripEvents, engineer features |
| ETA Model | Train regression model (Random Forest/XGBoost) |
| Prediction API | REST endpoint: `POST /api/v1/ai/eta/predict` |
| Dashboard Integration | Show AI predictions alongside real-time data |
| Model Monitoring | Track prediction accuracy, drift detection, automated retraining |

---

## v0.5 — AI: Demand Prediction

**Goal:** Forecast passenger demand to optimize scheduling.

| Feature | Details |
|---------|---------|
| Demand Model | Time-series forecasting (Prophet/LSTM) |
| Capacity Planning | Recommend bus frequency based on predicted demand |
| Heatmaps | Demand density visualization on admin map |
| Scheduling Reports | Daily/weekly demand patterns with recommendations |

---

## v0.6 — AI: Route Optimization

**Goal:** Suggest optimal route adjustments based on data.

| Feature | Details |
|---------|---------|
| Optimization Engine | Genetic algorithm / reinforcement learning for route suggestions |
| What-If Analysis | Simulate route changes, compare metrics |
| Efficiency Reports | Fuel savings, time savings, coverage analysis |
| Admin UI | Review and approve/reject suggested route changes |

---

## v1.0 — IoT Integration

**Goal:** Real hardware on buses.

| Feature | Details |
|---------|---------|
| ESP32 GPS Tracker | Real GPS device, MQTT communication, firmware in C++ |
| MQTT Broker | Mosquitto/EMQX for IoT message routing |
| IoT Gateway Service | Parse MQTT → validate → store → broadcast |
| RFID Boarding | Physical RFID reader, card association with user accounts |
| ESP32-CAM (Optional) | Driver-facing camera for safety monitoring |

---

## v2.0 — Production Hardening

**Goal:** Enterprise-grade reliability and security.

| Feature | Details |
|---------|---------|
| Load Testing | 1000+ concurrent users, 100+ buses |
| Performance Optimization | DB indexing review, query optimization, caching |
| Security Audit | Penetration testing, dependency review, secrets management |
| Monitoring | Sentry error tracking, Prometheus metrics, Grafana dashboards |
| CI/CD Polish | Automated testing, staging environment, blue-green deployment |
| Documentation | Complete API docs, deployment guide, user manuals |

---

## v3.0 — Smart City Platform

**Goal:** Multi-tenant platform serving multiple cities/operators.

| Feature | Details |
|---------|---------|
| Multi-Tenant | Separate organizations, white-label options |
| GTFS Compliance | Import/export GTFS feed format |
| Public API | Rate-limited public API for third-party developers |
| Mobile Apps | React Native / Flutter native mobile apps |
| Real Fleet Pilot | Partner with a real transit operator |
| Research Publication | Paper on AI-driven transit optimization |

---

## Tracking

- GitHub Milestones track each version
- GitHub Projects board for sprint tasks
- CHANGELOG.md for version history
- ADRs in `docs/adr/` for architectural decisions