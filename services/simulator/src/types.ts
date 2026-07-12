export interface Waypoint {
  lat: number;
  lng: number;
}

export interface RouteDefinition {
  id: string;
  name: string;
  color: string;
  stops: Waypoint[];
  waypoints: Waypoint[];
  totalDistance: number;
}

export interface BusState {
  id: string;
  busNumber: string;
  plateNumber: string;
  routeId: string;
  routeName: string;
  position: Waypoint;
  progress: number;
  speed: number;
  heading: number;
  passengerCount: number;
  tripId: string | null;
  active: boolean;
}

export interface SimulatorConfig {
  apiUrl: string;
  wsUrl: string;
  tickIntervalMs: number;
}