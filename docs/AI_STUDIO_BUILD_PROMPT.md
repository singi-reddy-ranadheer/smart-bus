# Smart Bus AI — Google AI Studio Build Prompt

Use this **after exporting the Passenger design from Stitch into Google AI Studio**. It turns the approved design into a functional frontend prototype without changing the project architecture or inventing backend features.

## How to use it

1. Open the project that Stitch exported in **Google AI Studio → Build**.
2. Keep the exported visual design and components in the project.
3. Paste the full prompt below into the AI Studio chat.
4. Review the live preview screen by screen before accepting broad follow-up changes.
5. Export the result as a ZIP or push it to a separate prototype repository. Do **not** overwrite this repository’s empty `apps/passenger` folder automatically; integrate reviewed code deliberately afterwards.

If AI Studio permits project context files, also add `DESIGN.md`, `docs/STITCH_BRIEF.md`, and `API-CONTRACT.md`.

## Paste this into Google AI Studio Build

```text
You are continuing a Smart Bus AI Passenger App project that was exported from Google Stitch.

Your job is to preserve the approved Stitch visual design and make it a functional, frontend-only v0.1 prototype. Do not redesign the UI, replace the design system, or broaden the product scope.

Project goal
Smart Bus AI helps a passenger find active buses, understand a route, and track a selected bus. The primary user is a student or daily commuter using a mobile device outdoors.

Source of truth and constraints
- Preserve the existing Stitch screen layouts, visual hierarchy, colours, typography, spacing, and components.
- Follow the provided DESIGN.md and STITCH_BRIEF.md when they are available.
- Use React + TypeScript in strict mode and retain the existing project structure where possible.
- This is a frontend prototype only. Do not create a database, server API, Firebase, Firestore, Supabase project, payment flow, Google sign-in, or Gemini feature.
- Do not request, create, expose, or embed API keys, credentials, or secrets.
- Use Leaflet + OpenStreetMap for a real map surface if the current environment supports it. Do not substitute Google Maps, because this project deliberately avoids paid map-key dependencies.
- Do not add payments, QR/RFID, favourites, occupancy, notifications, driver controls, admin pages, route optimisation, or AI dashboards.

Required user flow
1. Sign in
2. Create account
3. Home live-map view
4. Tap a bus marker → selected-bus information sheet
5. View route details
6. Browse routes
7. View profile

Required reusable components
- AppHeader
- BottomNavigation
- RouteChip
- BusMarker
- BusInfoSheet
- RouteCard
- StopTimeline
- StatusPill
- EmptyState
- FormField

Functional prototype requirements
- Make navigation, tabs, route filtering, marker selection, bottom-sheet opening/closing, form validation, loading state, disabled state, offline state, no-active-buses state, and location-unavailable state work in the preview.
- Use keyboard-accessible controls, visible focus states, semantic labels, and a minimum 44 × 44px touch target.
- Include text alternatives for map-based information: selected-bus and route views must show the same essential information in text.
- Keep the mobile-first 390px experience and the 1440px desktop map-plus-side-panel adaptation from Stitch.

Data architecture: prototype first, API-ready later
Create a small typed transport-data adapter layer rather than placing fixture data inside UI components.

- Define TypeScript types for User, Bus, Route, Stop, and LiveLocationUpdate.
- Define a `TransportDataProvider` interface with methods for signIn, register, getCurrentUser, getBuses, getRoutes, getRouteById, and subscribeToBusLocations.
- Create a `DemoTransportDataProvider` as the default implementation. All generated sample data must be clearly marked in code as `DEMO ONLY`; show a subtle, honest “Demo data” label in the prototype.
- Keep a separate `ApiTransportDataProvider` stub that maps to the real API later, but do not claim it is connected or make unauthenticated external calls in this prototype.
- Keep components independent of the provider implementation so the reviewed UI can later move into the Next.js Passenger app.

Real API shapes to honour later
- `POST /api/v1/auth/login`: email + password.
- `POST /api/v1/auth/register`: email, password, name, phone.
- `GET /api/v1/users/me`: id, email, name, phone, role, avatar_url, created_at.
- `GET /api/v1/buses`: each bus can include id, plate_number, bus_number, capacity, model, color, status, current_location { lat, lng }, current_speed, heading, current_route_id, and current_route { id, name }.
- `GET /api/v1/routes`: each route can include id, name, color, total_distance, estimated_duration, status, and ordered stops { id, name, order, lat, lng }.
- Realtime location messages can include `{ bus_id, lat, lng, speed, heading, ts }`.

Important data honesty rules
- Current v0.1 API documentation does not yet provide a live ETA or next-stop field for a bus. In API mode, show “ETA unavailable” unless verified data is supplied. The existing visual sample “Arrives in 12 min” is permitted only in the clearly labelled Demo mode.
- The route list has stop data but no route-polyline geometry. Draw a simple labelled demo polyline only in Demo mode; do not claim road-accurate routing.
- The current API has no proximity search query. Keep “near me” and stop search as client-side prototype interactions, clearly separate from a future server search feature.
- Current location, speed, heading, and route fields can be missing. Render useful fallback states instead of assuming data exists.
- Do not imply that a demo login, map marker, bus location, ETA, or route update is live.

Demo data
- Use only these project sample routes:
  - Campus Express: Campus Gate → Library → Bus Stand → Railway Station → Airport
  - City Loop: City Center → Market → Hospital → University → Tech Park → City Center
- Use three demo buses total: BUS-001 and BUS-002 on Campus Express, plus BUS-003 on City Loop.
- If simulating movement, do it entirely in the Demo provider and make it deterministic, local, and visibly labelled as demo data.

Implementation quality
- Keep components small and reusable. Avoid a single monolithic page component.
- Do not use `any`; handle loading, empty, error, stale, and null data explicitly.
- Use no hidden side effects and no automatic package changes beyond what is genuinely necessary for the frontend/map prototype.
- Add concise comments only where a future API replacement is intentionally required.
- Run the build or preview checks available in this environment and fix errors before you finish.

At completion, give me:
1. A short list of the files changed or created.
2. A list of demo-only behaviour that must be replaced during real API integration.
3. Confirmation that no secrets, backend services, database, Google Maps, Firebase, or out-of-scope features were added.
```

## Safe follow-up prompts

Use one at a time after the first implementation, so AI Studio changes stay reviewable.

1. `Compare the implementation to the existing Stitch screens. Fix only visual differences and preserve all working interactions and the demo-data honesty rules.`
2. `Audit the Passenger prototype for mobile responsiveness, keyboard navigation, visible focus, WCAG AA contrast, and 44px touch targets. Make only the necessary fixes.`
3. `Refactor repeated UI into the required reusable components without changing the visible design or product scope.`
4. `Add a polished desktop 1440px adaptation: keep the map dominant and show the selected bus in a persistent right-side panel. Do not add features.`
5. `Create an integration handoff document listing each component, its expected props, and the exact API or realtime field it will consume. Do not connect external services.`

## What happens after AI Studio

AI Studio’s generated app is a prototype and component reference. Bring the exported code back here for a review before it is moved into `apps/passenger`. We will then adapt it to the planned Next.js 14, Supabase-auth, NestJS/FastAPI architecture and replace only the explicitly marked demo provider.
