const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export interface Bus {
  id: string;
  plate_number: string;
  bus_number: string;
  capacity: number;
  model: string | null;
  color: string;
  status: string;
  current_location: { lat: number; lng: number } | null;
  current_speed: number;
  heading: number | null;
  current_route_id: string | null;
  current_route?: {
    id: string;
    name: string;
    color: string;
  } | null;
}

export interface Route {
  id: string;
  name: string;
  description: string | null;
  color: string;
  total_distance: number | null;
  estimated_duration: number | null;
  status: string;
  stops: Array<{
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    landmark: string | null;
    stop_order: number;
  }>;
}

export interface Stop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  landmark: string | null;
}

export interface Trip {
  id: string;
  bus_id: string;
  route_id: string;
  driver_id: string | null;
  status: string;
  start_time: string | null;
  end_time: string | null;
  passenger_count: number;
}

export class PassengerApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`API ${path} failed: ${response.status}`);
    }
    const json = await response.json();
    return json as T;
  }

  async getBuses(): Promise<Bus[]> {
    return this.request<Bus[]>('/buses?limit=100');
  }

  async getRoutes(): Promise<Route[]> {
    return this.request<Route[]>('/routes?limit=100');
  }

  async getStops(): Promise<Stop[]> {
    return this.request<Stop[]>('/stops?limit=1000');
  }

  async getTrips(): Promise<Trip[]> {
    return this.request<Trip[]>('/trips?limit=100');
  }
}

export const apiClient = new PassengerApiClient();