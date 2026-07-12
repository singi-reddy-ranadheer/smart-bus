// Smart Bus AI — Shared Enums
// Mirrors the PostgreSQL enum types

export enum UserRole {
  PASSENGER = 'passenger',
  DRIVER = 'driver',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export enum BusStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
  RETIRED = 'retired',
}

export enum DriverStatus {
  AVAILABLE = 'available',
  ON_TRIP = 'on_trip',
  OFFLINE = 'offline',
  OFF_DUTY = 'off_duty',
}

export enum RouteStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

export enum TripStatus {
  SCHEDULED = 'scheduled',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum TripEventType {
  GPS_UPDATE = 'GPS_UPDATE',
  BOARDING = 'BOARDING',
  ALIGHTING = 'ALIGHTING',
  TRIP_START = 'TRIP_START',
  TRIP_END = 'TRIP_END',
  SOS_ALERT = 'SOS_ALERT',
  DELAY_REPORT = 'DELAY_REPORT',
  MAINTENANCE_REPORT = 'MAINTENANCE_REPORT',
  ROUTE_DEVIATION = 'ROUTE_DEVIATION',
}

export enum NotificationType {
  PUSH = 'push',
  SMS = 'sms',
  EMAIL = 'email',
  IN_APP = 'in_app',
}

export enum PaymentMethod {
  WALLET = 'wallet',
  QR = 'qr',
  RFID = 'rfid',
  CASH = 'cash',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PredictionType {
  ETA = 'eta',
  DEMAND = 'demand',
  OCCUPANCY = 'occupancy',
}