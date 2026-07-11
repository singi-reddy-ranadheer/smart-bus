# Smart Bus AI — Architecture Document

> **Version:** 1.0  
> **Status:** Active  
> **Last Updated:** 2026-07-10

---

## 1. System Architecture Overview

```
                     Smart Bus AI

        ┌─────────────────────────────────────┐
        │       Next.js Applications          │
        │ Passenger | Driver | Admin          │
        └─────────────────────────────────────┘
                       │
             REST / WebSocket
                       │
        ┌─────────────────────────────────────┐
        │        Backend API (NestJS)         │
        │ Auth / RBAC / Routes / Stops        │
        │ Trips / Payments / Notifications    │
        │ IoT Gateway / WebSockets / Admin    │
        └─────────────────────────────────────┘
               │                    │
               │                    │
               ▼                    ▼
        Python AI Service      Supabase
          (FastAPI)        PostgreSQL + Auth + Realtime
```

---

## 2. Data Flows

### 2.1 Simulation Flow (v0.1)

```
Simulator Service (Node.js)
    │
    │ Generate GPS coordinates along predefined route
    │ Every 2-3 seconds per bus
    ▼
NestJS API (WebSocket / REST)
    │
    ├─► Validate GPS data
    ├─► Save TripEvent to Supabase (immutable log)
    ├─► Update bus current location
    └─► Broadcast via Supabase Realtime
    │
    ▼
Supabase PostgreSQL
    ├─► trip_events table (immutable)
    ├─► buses table (current_location updated)
    └─► Realtime channel → pushes to subscribers
    │
    ▼
Next.js Passenger App
    ├─► Subscribe to Realtime channel
    └─► Update Leaflet map with bus positions
```

### 2.2 Real GPS Flow (v1.0+)

```
ESP32 GPS Tracker (on bus)
    │
    │ GPS coordinates via MQTT
    ▼
MQTT Broker (Mosquitto/EMQX)
    │
    ▼
IoT Gateway Service (NestJS Module)
    │
    ├─► Parse MQTT messages
    ├─► Validate GPS data
    ├─► Save TripEvent to Supabase
    └─► Broadcast via Supabase Realtime
```

### 2.3 AI Prediction Flow (v0.4+)

```
Historical TripEvents (Supabase)
    │
    ▼
FastAPI AI Service
    ├─► Load features from database
    ├─► Run inference through ML model
    └─► Return predictions to NestJS
    │
    ▼
NestJS API
    ├─► Cache predictions in Redis (future)
    └─► Serve via REST endpoint
    │
    ▼
Next.js Apps
    └─► Display predictions in UI
```

---

## 3. Service Architecture

### 3.1 NestJS API (`services/api/`)

**Purpose:** Primary backend server handling all business logic.

**Module Structure:**

```
src/
├── main.ts
├── app.module.ts
├── common/
│   ├── guards/           # Auth guards (JWT, Roles)
│   ├── interceptors/     # Logging, transformation
│   ├── filters/          # Exception filters
│   ├── pipes/            # Validation pipes
│   └── constants/        # Enums, constants
├── modules/
│   ├── auth/             # Authentication (Supabase Auth)
│   ├── users/            # User CRUD
│   ├── buses/            # Bus fleet management
│   ├── routes/           # Route management
│   ├── stops/            # Stop management
│   ├── trips/            # Trip lifecycle
│   ├── trip-events/      # Immutable event logging
│   ├── payments/         # Payment processing
│   ├── notifications/    # Push/SMS/Email
│   └── analytics/        # Aggregated metrics
├── websocket/
│   └── tracking.gateway.ts  # WebSocket for GPS
└── database/
    ├── prisma/schema.prisma
    └── supabase/supabase.service.ts
```

**Key Design Decisions:**
- **Supabase Service Client** wraps all database operations
- **Supabase Realtime** handles live subscriptions (no custom WebSocket server for broadcasts)
- **WebSocket Gateway** is used for bidirectional communication (driver app sending GPS)
- **Prisma** (optional) for type-safe database queries if needed beyond Supabase JS client

### 3.2 FastAPI AI Service (`services/ai/`)

**Purpose:** Dedicated Python service for all AI/ML workloads.

```
src/
├── main.py
├── api/
│   ├── routes/
│   │   ├── eta.py         # ETA prediction
│   │   ├── demand.py      # Demand prediction
│   │   └── health.py      # Health check
│   └── dependencies.py
├── models/
│   ├── eta_model.py       # ETA regression model
│   ├── demand_model.py    # Time-series forecast
│   └── base.py            # Abstract base model
├── pipelines/
│   ├── training.py        # Training pipeline
│   └── inference.py       # Inference pipeline
├── data/
│   ├── loader.py          # Supabase data loader
│   ├── preprocessor.py    # Feature engineering
│   └── validator.py       # Data validation
├── schemas/
│   ├── request.py
│   └── response.py
└── core/
    ├── config.py
    └── monitoring.py
```

### 3.3 Simulator Service (`services/simulator/`)

**Purpose:** Generates simulated bus GPS data for development.

```
src/
├── index.ts               # Entry point
├── engine.ts              # Core simulation loop
├── route-follower.ts      # GPS interpolation between stops
├── bus-manager.ts         # Manages multiple simulated buses
├── routes/
│   ├── campus-route.ts    # Campus Gate → Library → Bus Stand → Railway Station → Airport
│   └── city-route.ts      # City Center → Market → Hospital → University
└── client/
    ├── api-client.ts      # REST API client
    └── websocket-client.ts
```

### 3.4 Next.js Applications (`apps/`)

All three apps follow the same structure:

```
passenger/ (or driver/ or admin/)
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   └── (routes)/
│   ├── components/
│   │   ├── map/
│   │   │   ├── BusMap.tsx         # Leaflet map wrapper
│   │   │   ├── BusMarker.tsx      # Custom bus icon
│   │   │   ├── RoutePolyline.tsx  # Route visualization
│   │   │   └── StopMarker.tsx     # Stop icon
│   │   ├── bus/
│   │   ├── trip/
│   │   ├── layout/
│   │   └── shared/
│   ├── hooks/
│   │   ├── useRealtimeBus.ts
│   │   ├── useAuth.ts
│   │   └── useLocation.ts
│   ├── lib/
│   │   ├── api.ts            # API client
│   │   ├── supabase.ts       # Supabase client
│   │   └── types.ts          # TypeScript types
│   └── styles/
│       └── globals.css
├── public/
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 4. Technology Stack — Justification

| Technology | Why Chosen | Tradeoffs |
|-----------|------------|-----------|
| **NestJS** | Modular architecture, DI, guards, WebSocket support, TypeScript-native | Heavier than Express; more boilerplate |
| **FastAPI** | Best Python async framework; native type validation; OpenAPI docs | Requires separate deployment from NestJS |
| **Supabase** | Free PostgreSQL, built-in auth, realtime, Storage; generous free tier | Vendor coupling; not self-hosted by default |
| **Leaflet + OSM** | Free, no API keys, open-source, works worldwide | Fewer features than Google Maps; no 3D |
| **Turborepo** | Optimized monorepo builds, shared packages, parallel tasks | Learning curve; overkill for small projects |
| **Prisma** | Type-safe queries, migrations, excellent DX | Extra dependency; another abstraction layer |
| **Tailwind CSS** | Utility-first, rapid UI development, consistent design | Large CSS bundles if not purged |

---

## 5. Communication Patterns

| Pattern | Protocol | Use Case |
|---------|----------|----------|
| REST | HTTP/HTTPS | CRUD operations, auth, payments |
| WebSocket | WS/WSS | GPS updates from driver app |
| Supabase Realtime | WebSocket (managed) | Broadcasting bus positions to passengers |
| MQTT (v1+) | MQTT | IoT device communication (ESP32) |
| HTTP (AI) | HTTP/HTTPS | NestJS ↔ FastAPI communication |

---

## 6. Authentication & Authorization

### Auth Flow

```
User → Supabase Auth → JWT Token
  │
  ├─► Token sent in Authorization header
  ├─► NestJS validates token via Supabase Admin SDK
  ├─► Roles checked via Guard
  └─► Request proceeds or rejected
```

### Roles

| Role | Permissions |
|------|------------|
| `passenger` | View buses, plan trips, make payments |
| `driver` | Start/end trips, send GPS, log passengers |
| `admin` | CRUD routes, buses, drivers; view analytics |
| `super_admin` | All permissions + user management |

---

## 7. Real-time Architecture

```
┌─────────────────────────────────────────────┐
│             Supabase Realtime               │
│                                              │
│  Channel: bus:{bus_id}:location             │
│  Event: GPS_UPDATE                          │
│  Payload: { bus_id, lat, lng, speed, ts }   │
│                                              │
│  Channel: trip:{trip_id}:events             │
│  Event: TRIP_EVENT                          │
│  Payload: { type, data, timestamp }         │
└─────────────────────────────────────────────┘
```

**Subscription Model:**
- Passenger app subscribes to `bus:*:location` — receives positions for all buses
- Driver app subscribes to `trip:{trip_id}:events` — receives events for their trip
- Admin dashboard subscribes to both

---

## 8. API Design Conventions

| Convention | Standard |
|-----------|----------|
| Base URL | `/api/v1` |
| Resource naming | Plural: `/api/v1/buses`, `/api/v1/routes` |
| IDs | UUID v4 |
| Pagination | `?page=1&limit=20` with `X-Total-Count` header |
| Errors | `{ error: { code, message, details } }` |
| Success | `{ data: {}, meta: {} }` |
| Filtering | `?status=active` or `?filter[status]=active` |
| Sorting | `?sort=-created_at` (descending) or `?sort=created_at` (ascending) |

---

## 9. Database Design Principles

1. **All entity IDs are UUID v4** — no auto-increment integers
2. **Timestamps are UTC** — stored as `timestamptz`
3. **TripEvent is IMMUTABLE** — enforced with database trigger/RLS
4. **Soft deletes** — entities have `deleted_at` timestamp
5. **Row Level Security (RLS)** — Supabase RLS policies for multi-tenant safety
6. **Indexes on foreign keys and query columns** — performance from day one

---

## 10. Security Architecture

| Layer | Measure |
|-------|---------|
| **Auth** | Supabase Auth with JWT; token rotation |
| **API** | Rate limiting (100 req/min/user) |
| **API** | CORS configured for known origins |
| **API** | Input validation (class-validator + Zod) |
| **API** | Role-based guards on all endpoints |
| **DB** | Supabase RLS policies |
| **DB** | Prepared queries (no SQL injection) |
| **Network** | HTTPS enforced |
| **Secrets** | Environment variables via Railway/Vercel |

---

## 11. Deployment Architecture

### v0.1 Deployment

| Component | Platform | Notes |
|-----------|----------|-------|
| Next.js Apps | Vercel | 3 apps under same domain |
| NestJS API | Railway | Node.js service |
| Simulator | Railway | Background worker |
| Supabase | Supabase SaaS | Managed PostgreSQL |
| FastAPI (v0.4+) | Railway | Python service |

### CI/CD Pipeline

```
Git Push → GitHub Actions
    │
    ├─► Lint & Type Check
    ├─► Run Tests
    ├─► Build
    ├─► Deploy to Vercel (apps)
    └─► Deploy to Railway (services)
```

---

## 12. Monitoring & Observability

| Tool | Purpose | When |
|------|---------|------|
| Supabase Dashboard | DB performance, auth logs | v0.1 |
| Railway Dashboard | Service logs, metrics | v0.1 |
| Vercel Analytics | Frontend performance | v0.1 |
| Sentry (future) | Error tracking | v0.2+ |
| Prometheus + Grafana (future) | Custom metrics | v0.4+ |