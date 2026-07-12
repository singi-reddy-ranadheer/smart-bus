import { TransportDataProvider } from './TransportDataProvider';
import type { Bus, Route, Stop, LiveLocationUpdate } from './types';
import { apiClient } from '../api';
import { subscribeToBusLocations } from '../supabase-realtime';

export class ApiTransportDataProvider implements TransportDataProvider {
  private buses: Bus[] = [];
  private routes: Route[] = [];
  private stops: Stop[] = [];
  private listeners = new Set<(update: LiveLocationUpdate) => void>();
  private unsubscribers: Array<() => void> = [];

  async getBuses(): Promise<Bus[]> {
    this.buses = await apiClient.getBuses();
    return this.buses;
  }

  async getRoutes(): Promise<Route[]> {
    this.routes = await apiClient.getRoutes();
    return this.routes;
  }

  async getStops(): Promise<Stop[]> {
    this.stops = await apiClient.getStops();
    return this.stops;
  }

  async getTrips(): Promise<any[]> {
    // Trip types not fully defined in this provider, return empty for now
    return [];
  }

  subscribeToBusLocations(callback: (update: LiveLocationUpdate) => void): () => void {
    this.listeners.add(callback);
    const unsub = subscribeToBusLocations((update) => {
      this.listeners.forEach((cb) => cb(update));
    });
    this.unsubscribers.push(unsub);
    return () => {
      this.listeners.delete(callback);
    };
  }

  // Maintain backward-compat signature if something used it
  onLocationUpdate(update: LiveLocationUpdate): void {
    this.listeners.forEach((cb) => cb(update));
  }
}