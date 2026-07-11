# Sprint 1 — Foundation Setup

> **Version:** 1.0  
> **Goal:** Initialize monorepo, scaffold all services, create database schema, seed data  
> **Duration:** 1 week  
> **Status:** 🔜 Ready to start

---

## Sprint Goal

Set up the complete development foundation so that Sprint 2 can focus purely on feature implementation. By the end of Sprint 1, we have:

- A working monorepo with Turborepo
- NestJS API server that starts and responds to health checks
- Supabase project with all tables, indexes, RLS policies
- Seed data: 2 routes, 10 stops, 3 buses, 2 drivers
- Simulator service that can connect to the API
- Passenger Next.js app that renders a Leaflet map
- All documentation files in place

---

## Task Breakdown

### Task 1.1: Initialize Monorepo

**Files to create:**
- `smart-bus-ai/package.json` — Root workspace config
- `smart-bus-ai/turbo.json` — Turborepo pipeline config
- `smart-bus-ai/tsconfig.base.json` — Shared TypeScript config
- `smart-bus-ai/.eslintrc.js` — Shared ESLint config
- `smart-bus-ai/.prettierrc` — Prettier config
- `smart-bus-ai/.gitignore` — Git ignore rules
- `smart-bus-ai/.env.example` — Environment variable template

**Key decisions:**
- Package manager: npm (or pnpm if preferred)
- Turborepo for build caching and parallel task execution
- All packages use TypeScript strict mode

### Task 1.2: Create NestJS API Scaffold

**Files to create:**
- `services/api/package.json`
- `services/api/tsconfig.json`
- `services/api/nest-cli.json`
- `services/api/src/main.ts` — Entry point with CORS, validation, Swagger
- `services/api/src/app.module.ts` — Root module
- `services/api/src/common/` — Guards, interceptors, filters, pipes
- `services/api/src/modules/health/` — Health check endpoint

**Health endpoint:** `GET /api/v1/health` → `{ status: "ok", timestamp: "..." }`

### Task 1.3: Create Supabase Project

**Steps:**
1. Create Supabase project at supabase.com (free tier)
2. Run all migration files in order
3. Run seed data
4. Enable Realtime on `trip_events` and `buses` tables
5. Configure Auth settings (email + phone auth)

**Migration files:**
- `database/migrations/001_create_enums.sql`
- `database/migrations/002_create_users.sql`
- `database/migrations/003_create_buses.sql`
- `database/migrations/004_create_drivers.sql`
- `database/migrations/005_create_routes.sql`
- `database/migrations/006_create_stops.sql`
- `database/migrations/007_create_route_stops.sql`
- `database/migrations/008_create_trips.sql`
- `database/migrations/009_create_trip_events.sql`
- `database/migrations/010_create_trip_event_immutable_trigger.sql`
- `database/migrations/011_create_notifications.sql`
- `database/migrations/012_create_payments.sql`
- `database/migrations/013_create_predictions.sql`
- `database/migrations/014_create_analytics.sql`
- `database/migrations/015_create_indexes.sql`
- `database/migrations/016_create_rls_policies.sql`

### Task 1.4: Create Seed Data

**Files:**
- `database/seeds/001_sample_routes.sql` — 2 routes
- `database/seeds/002_sample_stops.sql` — 10 stops
- `database/seeds/003_sample_buses.sql` — 3 buses
- `database/seeds/004_sample_drivers.sql` — 2 drivers

**Sample Route 1 — Campus Express:**
```
Campus Gate → Library → Bus Stand → Railway Station → Airport
(5 stops, ~12 km, ~35 min)
```

**Sample Route 2 — City Loop:**
```
City Center → Market → Hospital → University → Tech Park → City Center
(6 stops, ~15 km, ~45 min)
```

### Task 1.5: Create Simulator Service

**Files:**
- `services/simulator/package.json`
- `services/simulator/tsconfig.json`
- `services/simulator/src/index.ts` — Entry point
- `services/simulator/src/engine.ts` — Core simulation loop
- `services/simulator/src/route-follower.ts` — GPS interpolation
- `services/simulator/src/bus-manager.ts` — Multi-bus management
- `services/simulator/src/routes/campus-route.ts` — Route 1 definition
- `services/simulator/src/routes/city-route.ts` — Route 2 definition
- `services/simulator/src/client/api-client.ts` — REST client
- `services/simulator/src/client/websocket-client.ts` — WebSocket client

**Simulation parameters:**
- GPS update interval: 2-3 seconds per bus
- Speed: 20-40 km/h (varies between stops)
- Buses start at first stop, move to last, then loop
- 3 simulated buses: 2 on Campus Express, 1 on City Loop

### Task 1.6: Create Passenger App

**Files:**
- `apps/passenger/package.json`
- `apps/passenger/next.config.js`
- `apps/passenger/tailwind.config.ts`
- `apps/passenger/tsconfig.json`
- `apps/passenger/src/app/layout.tsx` — Root layout with providers
- `apps/passenger/src/app/page.tsx` — Main map page
- `apps/passenger/src/app/auth/login/page.tsx` — Login page
- `apps/passenger/src/app/auth/register/page.tsx` — Register page
- `apps/passenger/src/components/map/BusMap.tsx` — Leaflet map
- `apps/passenger/src/components/map/BusMarker.tsx` — Bus icon
- `apps/passenger/src/components/map/RoutePolyline.tsx` — Route line
- `apps/passenger/src/components/map/StopMarker.tsx` — Stop icon
- `apps/passenger/src/components/bus/BusCard.tsx` — Bus info card
- `apps/passenger/src/hooks/useRealtimeBus.ts` — Realtime subscription
- `apps/passenger/src/hooks/useAuth.ts` — Auth hook
- `apps/passenger/src/lib/api.ts` — API client
- `apps/passenger/src/lib/supabase.ts` — Supabase client
- `apps/passenger/src/lib/types.ts` — TypeScript types
- `apps/passenger/src/styles/globals.css` — Tailwind imports

### Task 1.7: Documentation

**Files to create/update:**
- `README.md` — Project overview, badges, quick start
- `CONTRIBUTING.md` — How to contribute
- `docs/adr/ADR-001-monorepo-structure.md` — First ADR
- `CHANGELOG.md` — Initial entry

---

## Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|-------------|
| 1 | `npm run dev` starts all services in parallel | Turborepo runs API + Simulator + Passenger app |
| 2 | `GET /api/v1/health` returns 200 | API is running |
| 3 | Supabase has all 12 tables with correct schema | Run `SELECT * FROM information_schema.tables` |
| 4 | Seed data exists: 2 routes, 10 stops, 3 buses, 2 drivers | Query each table |
| 5 | Simulator connects to API and sends GPS updates | Check trip_events table for data |
| 6 | Passenger app renders Leaflet map | Open browser to localhost:3000 |
| 7 | Map shows bus markers | Buses visible on map |
| 8 | Auth flow works: register → login → see profile | Manual test |
| 9 | All documentation files exist | File check |
| 10 | `npm run lint` passes with no errors | Lint check |

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Code committed with conventional commit messages
- [ ] Pull request created and reviewed
- [ ] Documentation updated
- [ ] Screenshots taken for portfolio
- [ ] No TODOs in production code
- [ ] All tests pass (if tests exist)