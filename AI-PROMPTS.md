# AI Prompt Templates — Smart Bus AI

> Use these exact prompts to give each AI full project context.

---

## 1. For ANY AI — Universal Context (Start Here)

Paste this first into every AI conversation:

```
I'm working on Smart Bus AI — an open-source intelligent transportation platform.

Read and follow the file at the path: smart-bus-ai/ENGINEERING-HANDBOOK.md

This is the canonical engineering handbook. Follow its rules strictly:
- Architecture decisions must be documented
- No fake APIs, no fabricated data
- TypeScript strict mode everywhere
- Conventional commits for all changes
- API First design at /api/v1/
- TripEvent table is IMMUTABLE (no updates, no deletes)
```

---

## 2. For Passenger App (Frontend Developer AI)

```
Build the passenger Next.js application for Smart Bus AI.

Reference these files:
1. smart-bus-ai/ARCHITECTURE.md — Section 3.4 (app structure, component tree)
2. smart-bus-ai/API-CONTRACT.md — All REST endpoints and WebSocket events
3. smart-bus-ai/DATA-MODEL.md — TypeScript types to create
4. smart-bus-ai/SPRINT-1.md — Task 1.6 (exact file list)

What to build:
- Next.js 14 app with App Router
- Leaflet + OpenStreetMap with bus markers, route polylines, stop markers
- Supabase Realtime subscription for live bus positions
- Auth pages (login, register) using Supabase Auth
- API client library in src/lib/api.ts
- All components from the component tree in ARCHITECTURE.md
- Tailwind CSS, mobile-first responsive design
- TypeScript strict mode

Tech stack: Next.js 14, React, TypeScript, Tailwind, Leaflet, Supabase JS client
```

---

## 3. For NestJS Backend API AI

```
Build the NestJS backend API for Smart Bus AI.

Reference these files:

1. smart-bus-ai/ARCHITECTURE.md — Section 3.1 (module structure, architecture)
2. smart-bus-ai/API-CONTRACT.md — Every endpoint with request/response shapes
3. smart-bus-ai/DATA-MODEL.md — Complete database schema, enums, relations
4. smart-bus-ai/SPRINT-1.md — Task 1.2 (scaffold instructions)

What to build:
- Complete NestJS project with the module structure from ARCHITECTURE.md
- All modules: auth, users, buses, routes, stops, trips, trip-events
- WebSocket Gateway for bidirectional GPS communication
- JWT auth guards + role-based access control
- class-validator DTOs for all request bodies
- Supabase client service for database access
- CORS, rate limiting, validation pipe
- Health check endpoint at GET /api/v1/health

Tech stack: NestJS 10, TypeScript, Supabase JS client, class-validator, WebSocket
```

---

## 4. For Simulator Service AI

```
Build the bus simulation engine for Smart Bus AI.

Reference these files:
1. smart-bus-ai/ARCHITECTURE.md — Section 3.3 (simulator structure)
2. smart-bus-ai/API-CONTRACT.md — Sections 8-9 (trip events, WebSocket)
3. smart-bus-ai/DATA-MODEL.md — Tables: trips, trip_events, routes, stops, buses
4. smart-bus-ai/SPRINT-1.md — Task 1.5 (simulator parameters)

What to build:
- Node.js TypeScript service
- Engine that moves buses along predefined routes
- GPS coordinate interpolation between stops (generates realistic lat/lng every 2-3 sec)
- Each bus sends: { trip_id, lat, lng, speed, heading, passenger_count }
- Connects to NestJS API via REST (POST /api/v1/trip-events) or WebSocket
- Configurable: number of buses, speed range, route selection
- 2 routes to simulate:
  Route 1 "Campus Express": Campus Gate → Library → Bus Stand → Railway Station → Airport
  Route 2 "City Loop": City Center → Market → Hospital → University → Tech Park
- 3 simulated buses total (2 on Route 1, 1 on Route 2)

Tech stack: Node.js, TypeScript, WebSocket client, node-cron for timing
```

---

## 5. For Database/AI (SQL Schema)

```
Create the Supabase/PostgreSQL database for Smart Bus AI.

Reference: smart-bus-ai/DATA-MODEL.md (complete schema)

What to create:
- 16 SQL migration files in database/migrations/ (001-016)
- All 12 tables with correct columns, types, defaults, constraints
- All 9 enum types
- Indexes on foreign keys and query columns
- TripEvent immutable trigger (rejects UPDATE and DELETE)
- Row Level Security policies for each table
- 4 seed files in database/seeds/
- Enable Supabase Realtime on buses and trip_events tables

The data model is fully documented in DATA-MODEL.md — follow it exactly.
```

---

## 6. For Driver App (Future Sprint)

```
Build the driver Next.js application for Smart Bus AI.

Reference: smart-bus-ai/ARCHITECTURE.md + smart-bus-ai/API-CONTRACT.md

What to build:
- Login page (driver role)
- Dashboard showing assigned route and bus
- Start/End trip button
- GPS broadcasting to WebSocket (navigator.geolocation)
- Passenger count logging at each stop
- SOS emergency button
- Trip history view

Tech stack: Next.js 14, TypeScript, Tailwind, Leaflet, WebSocket client
```

---

## 7. For AI/ML Engineer (You — for v0.4+)

```
Build the FastAPI AI service for Smart Bus AI.

Reference:
- smart-bus-ai/ARCHITECTURE.md — Section 3.2 (AI service structure)
- smart-bus-ai/DATA-MODEL.md — trip_events, predictions tables
- smart-bus-ai/API-CONTRACT.md — Section 11 (AI endpoints)

What to build:
- FastAPI project with the structure from ARCHITECTURE.md
- ETA prediction model pipeline:
  - Features: time_of_day, day_of_week, stop_distance, current_speed, historical_duration
  - Model: Random Forest Regressor or XGBoost
  - Evaluation: MAE, RMSE
- POST /api/v1/ai/eta/predict endpoint
- POST /api/v1/ai/health endpoint
- Data loader from Supabase PostgreSQL
- Model versioning

Tech stack: FastAPI, Python 3.11+, scikit-learn, pandas, Supabase Python client
```

---

## How to Distribute

| AI Tool | Assign This Track |
|---------|------------------|
| **Codex** | #2 Passenger App (frontend) |
| **Gemini** | #2 Passenger App (frontend) OR #4 Simulator |
| **Blackbox** | #3 NestJS Backend OR #4 Simulator |
| **Claude (Me)** | I handle architecture, integration, any backend work, code review |
| **You** | #7 AI/ML models (your AI/ML expertise area) |

## Always do this:

1. Start every AI conversation with the **Universal Context** (section 1)
2. Then paste the **specific prompt** for what you want them to build
3. If they ask about something not in their prompt, tell them to read the referenced files

This guarantees all AIs produce code that fits together without conflicts.