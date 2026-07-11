# Smart Bus AI — API Contract

> **Version:** 1.0  
> **Status:** Active  
> **Last Updated:** 2026-07-10

---

## 1. API Standards

| Convention | Standard |
|-----------|----------|
| Base URL | `/api/v1` |
| Protocol | HTTPS (REST) + WSS (WebSocket) |
| Resource naming | Plural: `/api/v1/buses`, `/api/v1/routes` |
| IDs | UUID v4 |
| Pagination | `?page=1&limit=20` + `X-Total-Count` header |
| Errors | `{ error: { code: string, message: string, details?: any } }` |
| Success | `{ data: T, meta?: PaginationMeta }` |
| Timestamps | ISO 8601 UTC |
| Auth | Bearer JWT in `Authorization` header |

### Pagination Meta

```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Error Format

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Bus with id abc-123 not found",
    "details": null
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Insufficient role permissions |
| `NOT_FOUND` | 404 | Resource doesn't exist |
| `VALIDATION_ERROR` | 422 | Request body validation failed |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `IMMUTABLE_RESOURCE` | 409 | Attempted to modify immutable resource |

---

## 2. Authentication

### `POST /api/v1/auth/register`

Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123!",
  "name": "John Doe",
  "phone": "+919876543210"
}
```

**Response (201):**
```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "passenger",
      "created_at": "2026-07-10T12:00:00Z"
    },
    "session": {
      "access_token": "jwt...",
      "refresh_token": "jwt...",
      "expires_at": "2026-07-17T12:00:00Z"
    }
  }
}
```

### `POST /api/v1/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123!"
}
```

**Response (200):** Same as register response.

### `POST /api/v1/auth/logout`

**Headers:** `Authorization: Bearer <token>`  
**Response (200):** `{ "data": { "message": "Logged out successfully" } }`

### `POST /api/v1/auth/refresh`

**Request:**
```json
{
  "refresh_token": "jwt..."
}
```

**Response (200):** New access + refresh tokens.

---

## 3. Users

### `GET /api/v1/users/me`

Get current user profile.

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+919876543210",
    "role": "passenger",
    "avatar_url": null,
    "created_at": "2026-07-10T12:00:00Z"
  }
}
```

### `PATCH /api/v1/users/me`

Update profile.

**Request:**
```json
{
  "name": "John Updated",
  "phone": "+919876543211",
  "avatar_url": "https://..."
}
```

### `GET /api/v1/users` (Admin only)

List all users.

**Query:** `?page=1&limit=20&role=driver&sort=-created_at`

---

## 4. Buses

### `GET /api/v1/buses`

List buses.

**Query:** `?status=active&route_id=uuid&page=1&limit=20`

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "plate_number": "KA-01-AB-1234",
      "bus_number": "BUS-001",
      "capacity": 50,
      "model": "Tata Starbus",
      "color": "#3B82F6",
      "status": "active",
      "current_location": { "lat": 12.9716, "lng": 77.5946 },
      "current_speed": 35.5,
      "heading": 180.0,
      "current_route_id": "uuid",
      "current_route": { "id": "uuid", "name": "Campus Express" },
      "created_at": "2026-07-10T12:00:00Z"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 5, "totalPages": 1 }
}
```

### `GET /api/v1/buses/:id`

Get single bus with current trip info.

### `POST /api/v1/buses` (Admin)

Create bus.

**Request:**
```json
{
  "plate_number": "KA-01-AB-1234",
  "bus_number": "BUS-001",
  "capacity": 50,
  "model": "Tata Starbus",
  "color": "#3B82F6"
}
```

### `PATCH /api/v1/buses/:id` (Admin)
### `DELETE /api/v1/buses/:id` (Admin)

---

## 5. Routes

### `GET /api/v1/routes`

List all routes with stops.

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Campus Express",
      "color": "#EF4444",
      "total_distance": 12.5,
      "estimated_duration": 35,
      "status": "active",
      "stops": [
        { "id": "uuid", "name": "Campus Gate", "order": 1, "lat": 12.9716, "lng": 77.5946 },
        { "id": "uuid", "name": "Library", "order": 2, "lat": 12.9720, "lng": 77.5950 },
        { "id": "uuid", "name": "Bus Stand", "order": 3, "lat": 12.9750, "lng": 77.6000 },
        { "id": "uuid", "name": "Railway Station", "order": 4, "lat": 12.9800, "lng": 77.6100 },
        { "id": "uuid", "name": "Airport", "order": 5, "lat": 13.0000, "lng": 77.6500 }
      ]
    }
  ]
}
```

### `GET /api/v1/routes/:id`

Get single route with full stop details.

### `POST /api/v1/routes` (Admin)

Create route with stop ordering.

**Request:**
```json
{
  "name": "Campus Express",
  "color": "#EF4444",
  "total_distance": 12.5,
  "estimated_duration": 35,
  "stops": [
    { "stop_id": "uuid", "order": 1 },
    { "stop_id": "uuid", "order": 2 }
  ]
}
```

### `PATCH /api/v1/routes/:id` (Admin)
### `DELETE /api/v1/routes/:id` (Admin)

---

## 6. Stops

### `GET /api/v1/stops`

**Query:** `?page=1&limit=50`

### `GET /api/v1/stops/:id`
### `POST /api/v1/stops` (Admin)
### `PATCH /api/v1/stops/:id` (Admin)
### `DELETE /api/v1/stops/:id` (Admin)

---

## 7. Trips

### `GET /api/v1/trips`

**Query:** `?status=active&bus_id=uuid&driver_id=uuid&route_id=uuid&page=1&limit=20&sort=-created_at`

### `GET /api/v1/trips/:id`

Get single trip with events.

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "bus": { "id": "uuid", "bus_number": "BUS-001" },
    "route": { "id": "uuid", "name": "Campus Express" },
    "driver": { "id": "uuid", "name": "Driver Name" },
    "status": "active",
    "start_time": "2026-07-10T08:00:00Z",
    "end_time": null,
    "passenger_count": 23,
    "events": [
      {
        "id": "uuid",
        "event_type": "GPS_UPDATE",
        "latitude": 12.9716,
        "longitude": 77.5946,
        "speed": 35.0,
        "recorded_at": "2026-07-10T08:05:00Z"
      }
    ]
  }
}
```

### `POST /api/v1/trips`

Start a new trip (Driver).

**Request:**
```json
{
  "bus_id": "uuid",
  "route_id": "uuid"
}
```

### `PATCH /api/v1/trips/:id`

Update trip status.

**Request:**
```json
{
  "status": "completed"
}
```

---

## 8. Trip Events

### `POST /api/v1/trip-events`

Record a trip event (Driver app or Simulator).

**Request:**
```json
{
  "trip_id": "uuid",
  "event_type": "GPS_UPDATE",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "speed": 35.5,
  "heading": 180.0,
  "passenger_count": 23,
  "metadata": {}
}
```

**Response (201):**
```json
{
  "data": {
    "id": "uuid",
    "event_type": "GPS_UPDATE",
    "recorded_at": "2026-07-10T08:05:00Z"
  }
}
```

**Note:** This endpoint enforces immutability. No UPDATE or DELETE is possible.

### `GET /api/v1/trip-events?trip_id=uuid`

Get events for a trip.

**Query:** `?trip_id=uuid&event_type=GPS_UPDATE&from=2026-07-10T00:00:00Z&to=2026-07-10T23:59:59Z&page=1&limit=100&sort=recorded_at`

---

## 9. WebSocket Events

### Connection

```
wss://api.smartbusai.com/ws?token=<jwt>
```

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `gps:update` | `{ trip_id, lat, lng, speed, heading }` | Driver sends GPS update |
| `trip:start` | `{ bus_id, route_id }` | Driver starts trip |
| `trip:end` | `{ trip_id }` | Driver ends trip |
| `boarding:scan` | `{ trip_id, stop_id, passenger_delta }` | QR/RFID scan event |
| `sos:alert` | `{ trip_id, message }` | Emergency alert |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `bus:location` | `{ bus_id, lat, lng, speed, heading, ts }` | Live bus position |
| `trip:status` | `{ trip_id, status }` | Trip status change |
| `notification` | `{ title, body, data }` | Push notification |
| `alert:sos` | `{ trip_id, bus_id, location }` | SOS broadcast to admins |

---

## 10. Supabase Realtime Channels

| Channel | Event | Payload | Subscribers |
|---------|-------|---------|-------------|
| `bus:{bus_id}:location` | `GPS_UPDATE` | `{ bus_id, lat, lng, speed, heading, ts }` | All passenger apps watching this bus |
| `route:{route_id}:buses` | `BUS_ADDED`, `BUS_REMOVED` | `{ bus_id, status }` | Passenger apps watching a route |
| `trip:{trip_id}:events` | `TRIP_EVENT` | `{ type, data, ts }` | Driver app + Admin |

---

## 11. AI Service Endpoints (FastAPI)

### `GET /api/v1/ai/health`

Health check.

### `POST /api/v1/ai/eta/predict`

Predict ETA for a stop.

**Request:**
```json
{
  "route_id": "uuid",
  "stop_id": "uuid",
  "current_lat": 12.9716,
  "current_lng": 77.5946,
  "current_speed": 35.0,
  "time_of_day": "08:30",
  "day_of_week": 3,
  "weather": "clear"
}
```

**Response (200):**
```json
{
  "data": {
    "predicted_eta_minutes": 12.5,
    "confidence": 0.87,
    "model_version": "eta-v1.0"
  }
}
```

### `POST /api/v1/ai/demand/predict`

Predict passenger demand.

**Request:**
```json
{
  "route_id": "uuid",
  "date": "2026-07-10",
  "time_slot": "08:00-09:00"
}
```

### `POST /api/v1/ai/train/eta`

Trigger model training (Admin).

**Request:**
```json
{
  "from_date": "2026-06-01",
  "to_date": "2026-07-01",
  "model_version": "eta-v2.0"
}
```

---

## 12. Endpoint Summary (v0.1)

| Method | Path | Auth | Role | v0.1 |
|--------|------|------|------|------|
| POST | /api/v1/auth/register | No | - | ✅ |
| POST | /api/v1/auth/login | No | - | ✅ |
| POST | /api/v1/auth/logout | Yes | Any | ✅ |
| GET | /api/v1/users/me | Yes | Any | ✅ |
| PATCH | /api/v1/users/me | Yes | Any | ✅ |
| GET | /api/v1/buses | Yes | Any | ✅ |
| GET | /api/v1/buses/:id | Yes | Any | ✅ |
| GET | /api/v1/routes | Yes | Any | ✅ |
| GET | /api/v1/routes/:id | Yes | Any | ✅ |
| GET | /api/v1/stops | Yes | Any | ✅ |
| GET | /api/v1/trips | Yes | Any | ✅ |
| GET | /api/v1/trips/:id | Yes | Any | ✅ |
| POST | /api/v1/trips | Yes | Driver | ✅ |
| PATCH | /api/v1/trips/:id | Yes | Driver | ✅ |
| POST | /api/v1/trip-events | Yes | Driver/Simulator | ✅ |
| GET | /api/v1/trip-events | Yes | Any | ✅ |
| WS | /ws | Yes | Any | ✅ |

**Key:** ✅ = Included in v0.1, 🟡 = Planned for later version