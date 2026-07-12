import axios, { AxiosInstance } from 'axios';
import { CONFIG } from '../config';

export interface CreateTripResponse {
  data: {
    id: string;
    bus_id: string;
    route_id: string;
    status: string;
  };
}

export class ApiClient {
  private client: AxiosInstance;

  constructor(baseUrl: string = CONFIG.apiUrl) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000,
    });
  }

  async createTrip(busId: string, routeId: string): Promise<string | null> {
    try {
      const response = await this.client.post<CreateTripResponse>('/trips', {
        bus_id: busId,
        route_id: routeId,
      });
      return response.data?.data?.id || null;
    } catch (err: any) {
      console.error(`[API] Failed to create trip for bus ${busId}: ${err.message}`);
      return null;
    }
  }

  async recordTripEvent(event: {
    trip_id: string;
    event_type: string;
    latitude?: number;
    longitude?: number;
    speed?: number;
    heading?: number;
    passenger_count?: number;
  }): Promise<boolean> {
    try {
      await this.client.post('/trip-events', event);
      return true;
    } catch (err: any) {
      console.error(`[API] Failed to record event: ${err.message}`);
      return false;
    }
  }
}