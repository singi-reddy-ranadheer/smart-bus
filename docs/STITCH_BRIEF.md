# Smart Bus AI — Stitch UI Brief

This is the source brief for the **v0.1 Passenger App**. It is written for Google Stitch’s text canvas: attach/import the repository-root `DESIGN.md` first, then paste the prompt in the next section into Stitch.

The brief deliberately covers only features supported by the current product and API documentation. It does **not** ask Stitch to invent payments, occupancy, favourites, driver controls, or AI dashboards.

## Paste this into Stitch

```text
Create a connected, high-fidelity, mobile-first web app UI for “Smart Bus AI”, an intelligent public-transit product. The user is a passenger who wants to see active buses, understand a route, and track a selected bus in real time.

Business goal
Help a passenger answer three questions in seconds: Which buses are running near me? Which route does one serve? When will it reach the next stop?

User and platform
- Primary user: a student or daily commuter using a phone while walking or waiting outdoors.
- Product: responsive web app. Design mobile screens at 390px wide first, then show a desktop adaptation at 1440px wide for the main map view.
- Tone: calm, trustworthy, approachable, and efficient. It is public transit, not a ride-hailing clone or a fleet-admin dashboard.
- Use the attached DESIGN.md as the visual design system and follow it consistently.

Create these connected screens and states

1. Sign in
- Header: small bus mark plus “Smart Bus AI”.
- Welcome headline: “Welcome back”. Supporting text: “Track your bus in real time.”
- Email and password inputs with persistent labels, a password-visibility control, inline validation/error treatment, and a full-width “Sign in” button.
- A quiet link: “New here? Create an account”.
- Do not add social login, payments, or unsupported features.

2. Create account
- Same brand treatment and a clear back-to-sign-in link.
- Fields: full name, email, optional phone number, password, and confirm password.
- Brief password guidance and an accessible consent/terms note.
- Primary action: “Create account”.

3. Home — live bus map (the main screen)
- The map is the dominant, full-bleed surface.
- Top overlay: compact greeting, a route/stop search field with placeholder “Search a route or stop”, and a notification-free profile shortcut.
- Show a realistic map around a campus/city area. Add a user-location control and a “recenter” map control, both with text tooltips or accessible labels.
- Show three live bus markers with a directional bus icon. Give each marker a route colour and a selected state with a white halo.
- Show a horizontally scrollable row of route chips: “Campus Express” and “City Loop”. A chip includes a small colour dot and a selected/unselected state.
- Use a small status pill reading “3 buses live” with a live-dot icon and text.
- Bottom navigation with labelled tabs: Map, Routes, Profile. Map is active.

4. Selected-bus bottom sheet
- Open this when a bus marker is tapped; keep the selected bus visible behind it on the map.
- Use a mobile draggable sheet with a clear handle. For desktop, use a persistent right-side information panel.
- Example content: “BUS-001”, “Campus Express”, status “Live now”, “Next: Library”, “Arrives in 12 min”, and “35 km/h”.
- Include a mini ordered stop preview: Campus Gate, Library, Bus Stand, Railway Station, Airport. Clearly identify current and next stops with text and icons, not colour alone.
- Primary action: “Track this bus”. Secondary action: “View route”.
- Treat all example values as representative UI content, not a claim that live data is available in the design preview.

5. Route details
- Header with back navigation, route colour indicator, route name “Campus Express”, and summary: “5 stops · 12.5 km · about 35 min”.
- A compact map preview with the route polyline and active buses.
- A vertically ordered, accessible stop timeline: Campus Gate, Library, Bus Stand, Railway Station, Airport. The route’s current/next stop styling is clear in text.
- A “Buses on this route” section with compact cards for BUS-001 and BUS-002. Each card includes live status, next stop, ETA, and a “Track” action.
- Keep this information text-first enough that it still makes sense without seeing the map.

6. Routes list
- Search/filter field and cards for Campus Express and City Loop.
- Each card includes route colour, route name, total distance, estimated duration, number of stops, active-bus count, and a visible “View route” action.
- Include an elegant empty state for “No active routes” and a retry action.

7. Profile
- Simple account view showing the passenger’s name, email, and role label “Passenger”.
- Include settings/help rows as visual placeholders only; do not add wallet, payment methods, favourite routes, or admin controls.
- Include a low-emphasis “Sign out” action.

Required non-happy-path states
- Map loading: skeleton map controls and bus cards; do not use a generic spinner alone.
- No active buses: friendly illustration/icon, “No buses are active right now”, supporting text, and “Refresh map”.
- Location unavailable: explain that the passenger can still browse routes and include “Try again” plus a “Browse routes” action.
- Offline/banner state: “You’re offline. Showing the last available information.”
- Form field error states and disabled/loading button states.

Information model and realistic sample content
- A bus has: bus number, plate number, capacity, model, colour, active status, current latitude/longitude, current speed, heading, and current route.
- A route has: name, colour, total distance, estimated duration, status, and ordered stops.
- A stop has: name, latitude, longitude, landmark, and terminal status.
- Use only the two sample routes: Campus Express (Campus Gate → Library → Bus Stand → Railway Station → Airport) and City Loop (City Center → Market → Hospital → University → Tech Park → City Center).
- Live bus location is a real-time concept. The design must gracefully handle stale or unavailable data.

Visual and accessibility direction
- Follow DESIGN.md: primary blue, deep navy text, light neutral surfaces, calm transit-oriented visual language, soft card depth, simple stroke icons, and Plus Jakarta Sans/Inter-like typography.
- Use a minimum 44×44px touch target, high-contrast text, visible focus indicators, semantic labels, and text/icon reinforcement for every status colour.
- Keep the primary action singular on each screen. Use compact, scannable metadata; avoid information-dense dashboard cards.
- Design for keyboard navigation and screen readers. Map content must have a text alternative in the selected-bus and route views.
- Avoid gradients, glassmorphism, visual clutter, fake provider branding, invented user avatars, and unlabelled live claims.

Requested output
- Produce a connected clickable prototype for the mobile flow: Sign in → Home map → Selected bus sheet → Route details → Routes list → Profile.
- Show the responsive desktop map-plus-side-panel adaptation.
- Name reusable components clearly: AppHeader, BottomNavigation, RouteChip, BusMarker, BusInfoSheet, RouteCard, StopTimeline, StatusPill, EmptyState, and FormField.
- Generate visual UI only; do not generate backend logic, database schemas, or fake API integrations.
```

## Handoff requirements for the generated design

When the visual direction is approved, use the same component names in the implementation. The first frontend build should map those components to the documented v0.1 API:

| UI data | Source |
| --- | --- |
| Live bus markers and bus sheet | `GET /api/v1/buses` plus live-location updates |
| Route chips, route list, stop timeline | `GET /api/v1/routes`, `GET /api/v1/routes/:id` |
| Passenger profile | `GET /api/v1/users/me` |
| Sign in / account creation | `POST /api/v1/auth/login`, `POST /api/v1/auth/register` |

The UI must treat missing, delayed, and stale location data as normal states. It should never fabricate a successful API call or state that an example value is live.

## Suggested Stitch iteration prompts

Use these only after the first generation. They refine the design without expanding product scope.

1. `Refine the Home map screen. Make the selected bus sheet more scannable in bright outdoor conditions. Keep all content and components from the brief; do not introduce new features.`
2. `Create the 1440px desktop adaptation of the map screen. Keep the map dominant and move selected-bus details into a persistent right panel. Preserve the mobile visual language.`
3. `Audit the connected flow for WCAG AA contrast, 44px touch targets, visible focus states, and a text alternative for each map-based action. Show the corrected screens.`
4. `Make the empty, offline, and location-permission states as polished as the happy path. Do not add payment, occupancy, favourites, notifications, or AI dashboard features.`
