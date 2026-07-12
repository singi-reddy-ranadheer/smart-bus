const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export interface DriverTrip {
  id: string;
  bus_id: string;
  route_id: string;
  driver_id: string | null;
  status: string;
  start_time: string | null;
  end_time: string | null;
  passenger_count: number;
  bus?: { id: string; bus_number: string; plate_number: string };
  route?: { id: string; name: string; color: string };
}

export class DriverApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
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

  async getTrips(driverId?: string): Promise<DriverTrip[]> {
    const query = driverId ? `?driver_id=${driverId}&limit=100` : '?limit=100';
    return this.request<DriverTrip[]>('GET', `/trips${query}`);
  }

  async createTrip(busId: string, routeId: string): Promise<DriverTrip> {
    return this.request<DriverTrip>('POST', '/trips', { bus_id: busId, route_id: routeId });
  }

  async updateTrip(tripId: string, update: { status?: string; passenger_count?: number; notes?: string }): Promise<DriverTrip> {
    return this.request<DriverTrip>('PATCH', `/trips/${tripId}`, update);
  }

  async recordTripEvent(event: {
    trip_id: string;
    event_type: string;
    latitude?: number;
    longitude?: number;
    speed?: number;
    heading?: number;
    passenger_count?: number;
    metadata?: Record<string, any>;
  }): Promise<void> {
    await this.request<void>('POST', '/trip-events', event);
  }
}

export const driverApi = new DriverApiClient();