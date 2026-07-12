// Smart Bus AI — Shared TypeScript Types
// Mirrors the database schema for type-safe frontend and backend code

import {
  UserRole,
  BusStatus,
  DriverStatus,
  RouteStatus,
  TripStatus,
  TripEventType,
  NotificationType,
  PaymentMethod,
  PaymentStatus,
  PredictionType,
} from './enums';

// ─── Geo Types ───────────────────────────────────────────

export interface GeoPoint {
  lat: number;
  lng: number;
}

// ─── User ────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  phone: string | null;
  name: string;
  avatar_url: string | null;
  role: UserRole;
  is_active: boolean;
  last_seen_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface UpdateUserRequest {
  name?: string;
  phone?: string;
  avatar_url?: string;
}

// ─── Bus ─────────────────────────────────────────────────

export interface Bus {
  id: string;
  plate_number: string;
  bus_number: string;
  capacity: number;
  model: string | null;
  year: number | null;
  color: string;
  status: BusStatus;
  current_location: GeoPoint | null;
  current_speed: number;
  heading: number | null;
  current_route_id: string | null;
  current_route?: Route | null;
  gps_device_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateBusRequest {
  plate_number: string;
  bus_number: string;
  capacity: number;
  model?: string;
  color?: string;
}

// ─── Driver ──────────────────────────────────────────────

export interface Driver {
  id: string;
  user_id: string;
  license_number: string;
  license_expiry: string | null;
  assigned_bus_id: string | null;
  status: DriverStatus;
  total_trips: number;
  rating: number | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// ─── Route ───────────────────────────────────────────────

export interface Route {
  id: string;
  name: string;
  description: string | null;
  color: string;
  total_distance: number | null;
  estimated_duration: number | null;
  status: RouteStatus;
  stops: RouteStop[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateRouteRequest {
  name: string;
  color: string;
  total_distance?: number;
  estimated_duration?: number;
  stops: { stop_id: string; order: number }[];
}

// ─── Stop ────────────────────────────────────────────────

export interface Stop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  landmark: string | null;
  is_terminal: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// ─── Route Stop ──────────────────────────────────────────

export interface RouteStop {
  id: string;
  route_id: string;
  stop_id: string;
  stop_order: number;
  distance_from_prev: number | null;
  time_from_prev: number | null;
  stop?: Stop;
}

// ─── Trip ────────────────────────────────────────────────

export interface Trip {
  id: string;
  bus_id: string;
  route_id: string;
  driver_id: string | null;
  status: TripStatus;
  start_time: string | null;
  end_time: string | null;
  scheduled_start: string | null;
  scheduled_end: string | null;
  passenger_count: number;
  total_passengers: number;
  revenue: number;
  notes: string | null;
  bus?: Bus;
  route?: Route;
  driver?: Driver;
  events?: TripEvent[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CreateTripRequest {
  bus_id: string;
  route_id: string;
}

export interface UpdateTripRequest {
  status?: TripStatus;
  passenger_count?: number;
  notes?: string;
}

// ─── Trip Event ──────────────────────────────────────────

export interface TripEvent {
  id: string;
  trip_id: string;
  event_type: TripEventType;
  latitude: number | null;
  longitude: number | null;
  speed: number | null;
  heading: number | null;
  passenger_count: number | null;
  metadata: Record<string, unknown>;
  recorded_at: string;
}

export interface CreateTripEventRequest {
  trip_id: string;
  event_type: TripEventType;
  latitude?: number;
  longitude?: number;
  speed?: number;
  heading?: number;
  passenger_count?: number;
  metadata?: Record<string, unknown>;
}

// ─── Live Location Update (WebSocket) ────────────────────

export interface LiveLocationUpdate {
  bus_id: string;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  timestamp: string;
}

// ─── Notification ────────────────────────────────────────

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  data: Record<string, unknown> | null;
  is_read: boolean;
  read_at: string | null;
  sent_at: string;
  delivered_at: string | null;
}

// ─── Payment ─────────────────────────────────────────────

export interface Payment {
  id: string;
  user_id: string;
  trip_id: string | null;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  reference_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// ─── Prediction ──────────────────────────────────────────

export interface Prediction {
  id: string;
  trip_id: string | null;
  route_id: string | null;
  stop_id: string | null;
  prediction_type: PredictionType;
  value: number;
  confidence: number | null;
  model_version: string;
  features_hash: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

// ─── Analytics ───────────────────────────────────────────

export interface Analytics {
  id: string;
  metric_name: string;
  period: string;
  period_start: string;
  period_end: string;
  value: number;
  dimensions: Record<string, unknown>;
  created_at: string;
}

// ─── Auth ────────────────────────────────────────────────

export interface AuthResponse {
  user: User;
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

// ─── API Response Wrappers ───────────────────────────────

export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ─── WebSocket Events ────────────────────────────────────

export interface WsGpsUpdate {
  trip_id: string;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
}

export interface WsTripStart {
  bus_id: string;
  route_id: string;
}

export interface WsTripEnd {
  trip_id: string;
}

export interface WsBoardingScan {
  trip_id: string;
  stop_id: string;
  passenger_delta: number;
}

export interface WsSosAlert {
  trip_id: string;
  message: string;
}

// ─── AI Service Types ────────────────────────────────────

export interface EtaPredictionRequest {
  route_id: string;
  stop_id: string;
  current_lat: number;
  current_lng: number;
  current_speed: number;
  time_of_day: string;
  day_of_week: number;
  weather?: string;
}

export interface EtaPredictionResponse {
  predicted_eta_minutes: number;
  confidence: number;
  model_version: string;
}

export interface DemandPredictionRequest {
  route_id: string;
  date: string;
  time_slot: string;
}

export interface DemandPredictionResponse {
  predicted_demand: number;
  confidence: number;
  model_version: string;
}

export interface TrainingRequest {
  from_date: string;
  to_date: string;
  model_version: string;
}