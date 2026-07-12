const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export interface ApiBus {
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
  current_route?: { id: string; name: string } | null;
}

export interface ApiRoute {
  id: string;
  name: string;
  description: string | null;
  color: string;
  total_distance: number | null;
  estimated_duration: number | null;
  status: string;
  stops?: Array<{
    stop_order: number;
    stop: { id: string; name: string; latitude: number; longitude: number };
  }>;
}

export interface ApiTrip {
  id: string;
  bus_id: string;
  route_id: string;
  driver_id: string | null;
  status: string;
  start_time: string | null;
  end_time: string | null;
  passenger_count: number;
  bus?: { id: string; bus_number: string };
  route?: { id: string; name: string; color: string };
}

class AdminApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`API ${method} ${path} failed: ${response.status}`);
    }

    const json = await response.json();
    return json.data as T;
  }

  // Buses
  async getBuses(): Promise<ApiBus[]> {
    return this.request<ApiBus[]>('GET', '/buses?limit=100');
  }

  async createBus(bus: {
    plate_number: string;
    bus_number: string;
    capacity: number;
    model?: string;
    color?: string;
  }): Promise<ApiBus> {
    return this.request<ApiBus>('POST', '/buses', bus);
  }

  async updateBus(id: string, update: Record<string, any>): Promise<ApiBus> {
    return this.request<ApiBus>('PATCH', `/buses/${id}`, update);
  }

  // Routes
  async getRoutes(): Promise<ApiRoute[]> {
    return this.request<ApiRoute[]>('GET', '/routes?limit=100');
  }

  // Trips
  async getTrips(status?: string): Promise<ApiTrip[]> {
    const query = status ? `?status=${status}&limit=100` : '?limit=100';
    return this.request<ApiTrip[]>('GET', `/trips${query}`);
  }

  async getTripsCount(): Promise<number> {
    try {
      const trips = await this.getTrips('active');
      return trips.length;
    } catch {
      return 0;
    }
  }
}

export const adminApi = new AdminApiClient();