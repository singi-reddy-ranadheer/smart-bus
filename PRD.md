# Smart Bus AI — Product Requirements Document

> **Version:** 1.0  
> **Status:** Active  
> **Last Updated:** 2026-07-10

---

## 1. Product Overview

Smart Bus AI is an intelligent transportation ecosystem that provides real-time bus tracking, AI-powered predictions, digital payments, and fleet management through three primary applications (Passenger, Driver, Admin) and an AI services layer.

---

## 2. Personas

### 2.1 Passenger
- **Demographic:** Students, commuters, daily transit users
- **Tech Level:** General smartphone user
- **Pain Points:** Unknown wait times, missing buses, no route info, cash payments
- **Goals:** Know when bus arrives, track it live, pay digitally, plan routes

### 2.2 Driver
- **Demographic:** Bus drivers, transport staff
- **Tech Level:** Basic smartphone user
- **Pain Points:** No route guidance, manual passenger counting, no SOS
- **Goals:** Follow route, log passengers, report issues, stay safe

### 2.3 Fleet Admin
- **Demographic:** Transport managers, operations staff
- **Tech Level:** Desktop user, data literate
- **Pain Points:** No fleet visibility, manual reporting, revenue leaks
- **Goals:** Monitor fleet, analyze metrics, manage routes, generate reports

### 2.4 Super Admin
- **Demographic:** System owner, technical lead
- **Tech Level:** Advanced
- **Pain Points:** No control over system configuration
- **Goals:** Manage users, configure system, view all data

---

## 3. User Stories

### 3.1 Passenger Stories

| ID | Story | Priority | Version |
|----|-------|----------|---------|
| P-01 | As a passenger, I want to see buses near me on a map so I know what's available | P0 | v0.1 |
| P-02 | As a passenger, I want to tap a bus to see its route and ETA | P0 | v0.1 |
| P-03 | As a passenger, I want to see live bus movement on the map | P0 | v0.1 |
| P-04 | As a passenger, I want to search for a route by stop name | P1 | v0.1 |
| P-05 | As a passenger, I want to sign up/login with my phone or email | P0 | v0.1 |
| P-06 | As a passenger, I want to save favorite routes | P2 | v0.2 |
| P-07 | As a passenger, I want to see bus occupancy before boarding | P1 | v0.3 |
| P-08 | As a passenger, I want to pay for my trip via QR code | P1 | v0.3 |
| P-09 | As a passenger, I want to get notified when my bus is approaching | P2 | v0.3 |
| P-10 | As a passenger, I want to see AI-predicted arrival times | P1 | v0.4 |

### 3.2 Driver Stories

| ID | Story | Priority | Version |
|----|-------|----------|---------|
| D-01 | As a driver, I want to log in and see my assigned route | P0 | v0.1 |
| D-02 | As a driver, I want to start/end a trip | P0 | v0.1 |
| D-03 | As a driver, I want to see turn-by-turn navigation | P1 | v0.2 |
| D-04 | As a driver, I want to log passenger count at each stop | P1 | v0.2 |
| D-05 | As a driver, I want to trigger an SOS alert in emergency | P1 | v0.2 |
| D-06 | As a driver, I want to report vehicle issues | P2 | v0.3 |

### 3.3 Admin Stories

| ID | Story | Priority | Version |
|----|-------|----------|---------|
| A-01 | As an admin, I want a dashboard showing all active buses | P0 | v0.2 |
| A-02 | As an admin, I want to manage routes (CRUD) | P0 | v0.2 |
| A-03 | As an admin, I want to manage bus fleet (CRUD) | P0 | v0.2 |
| A-04 | As an admin, I want to view trip history | P0 | v0.2 |
| A-05 | As an admin, I want to see revenue analytics | P1 | v0.2 |
| A-06 | As an admin, I want to manage driver assignments | P1 | v0.2 |
| A-07 | As an admin, I want to see AI prediction dashboards | P1 | v0.4 |

### 3.4 System Stories

| ID | Story | Priority | Version |
|----|-------|----------|---------|
| S-01 | As a system, I want to simulate bus movement for testing | P0 | v0.1 |
| S-02 | As a system, I want to log all events immutably | P0 | v0.1 |
| S-03 | As a system, I want to broadcast GPS updates in real-time | P0 | v0.1 |
| S-04 | As a system, I want to predict ETAs using historical data | P1 | v0.4 |
| S-05 | As a system, I want to predict demand patterns | P2 | v0.5 |
| S-06 | As a system, I want to optimize routes based on demand | P2 | v0.6 |

---

## 4. Feature Catalog

### v0.1 — Simulation MVP

| Feature | Description |
|---------|-------------|
| User Authentication | Email/phone signup, login, password reset via Supabase Auth |
| Role-Based Access | Passenger, Driver, Admin roles with permission guards |
| Live Bus Map | Leaflet + OSM map showing all active buses with real-time position |
| Bus Details | Tap on bus to see route, speed, next stop |
| Route Display | Polylines on map showing bus routes with color coding |
| Driver App | Start/end trip, see route, basic GPS broadcasting |
| Simulator Engine | Server-side bus movement along predefined routes |
| Trip Event Logging | Immutable log of all bus events (position, boarding, etc.) |

### v0.2 — Admin & Operations

| Feature | Description |
|---------|-------------|
| Admin Dashboard | Fleet overview, active trips, system health |
| Route Management | CRUD for routes and stops |
| Bus Management | CRUD for bus fleet |
| Driver Management | CRUD for driver profiles, assignments |
| Trip History | Searchable, filterable trip logs |
| Basic Analytics | Passenger count trends, trip completion rates |
| Driver Navigation | Turn-by-turn route guidance |

### v0.3 — Payments & Boarding

| Feature | Description |
|---------|-------------|
| Digital Wallet | Top-up, balance, transaction history |
| QR Boarding | Generate/scan QR codes for fare payment |
| RFID Simulation | Simulated RFID card tap for boarding |
| Notifications | Push notifications for bus arrival, alerts |
| Occupancy Tracking | Real-time passenger count per bus |

### v0.4 — AI: ETA Prediction

| Feature | Description |
|---------|-------------|
| ETA Model | ML model trained on historical trip data |
| Prediction API | REST endpoint for predicted arrival times |
| Dashboard Integration | Show AI predictions alongside real-time data |
| Model Monitoring | Track prediction accuracy, drift detection |

### v0.5 — AI: Demand Prediction

| Feature | Description |
|---------|-------------|
| Demand Model | Time-series forecast of passenger demand |
| Capacity Planning | Recommended bus frequency based on demand |
| Heatmaps | Demand density visualization on map |

### v0.6 — AI: Route Optimization

| Feature | Description |
|---------|-------------|
| Optimization Engine | Suggest route adjustments based on demand patterns |
| What-If Analysis | Simulate route changes before deploying |
| Efficiency Reports | Fuel savings, time savings, coverage analysis |

### v1.0 — IoT Integration

| Feature | Description |
|---------|-------------|
| ESP32 GPS Tracker | Real hardware GPS device on buses |
| RFID Boarding | Physical RFID card readers |
| MQTT Gateway | IoT message broker for device communication |
| ESP32-CAM | Optional camera for driver monitoring |

---

## 5. Non-Functional Requirements

| Category | Requirement | Target |
|----------|-------------|--------|
| Performance | GPS update latency | < 2 seconds |
| Performance | Map load time | < 3 seconds |
| Reliability | System uptime | 99.5% |
| Security | Auth token expiry | 7 days (refresh) |
| Security | Rate limiting | 100 req/min per user |
| Data | Event retention | 90 days hot, 1 year cold |
| Data | TripEvent immutability | Enforced at DB level |
| UX | Mobile-first design | All apps responsive |
| UX | Offline support | Graceful degradation |
| Deployment | Zero-downtime deploys | Rolling updates |

---

## 6. Constraints

1. **Free-tier first** — All services must work within free tiers (Supabase free plan: 500MB DB, 50,000 rows, 2GB bandwidth)
2. **Open source** — MIT License
3. **No API key dependencies** — Leaflet + OSM for maps (no Google Maps API cost)
4. **Mobile-first responsive** — All apps work on phone screens
5. **TypeScript everywhere** — Frontend and backend in TypeScript