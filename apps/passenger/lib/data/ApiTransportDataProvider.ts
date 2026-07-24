import { TransportDataProvider } from './TransportDataProvider';
import type { Bus, Route, Stop, User, LiveLocationUpdate } from './types';
import { apiClient } from '../api';
import { subscribeToBusLocations } from '../supabase-realtime';
import { supabase } from '../supabase';

export class ApiTransportDataProvider implements TransportDataProvider {
  private buses: Bus[] = [];
  private routes: Route[] = [];
  private stops: Stop[] = [];
  private listeners = new Set<(update: LiveLocationUpdate) => void>();
  private unsubscribers: Array<() => void> = [];

  async signIn(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('No user returned from sign in');
    return this.mapSupabaseUser(data.user);
  }

  async register(email: string, password: string, name: string, phone?: string): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone: phone || '',
          role: 'passenger',
        },
      },
    });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('No user returned from registration');
    return this.mapSupabaseUser(data.user);
  }

  async getCurrentUser(): Promise<User | null> {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;
    return this.mapSupabaseUser(data.user);
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  private mapSupabaseUser(supabaseUser: any): User {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
      phone: supabaseUser.user_metadata?.phone || '',
      role: supabaseUser.user_metadata?.role || 'passenger',
      avatar_url: supabaseUser.user_metadata?.avatar_url || undefined,
      created_at: supabaseUser.created_at || new Date().toISOString(),
    };
  }

  async getBuses(): Promise<Bus[]> {
    const buses = await apiClient.getBuses();
    this.buses = buses.map((bus) => ({
      ...bus,
      model: bus.model ?? 'Unknown',
      status: (bus.status === 'active' || bus.status === 'inactive' || bus.status === 'maintenance' ? bus.status : 'active') as Bus['status'],
      current_location: bus.current_location ?? undefined,
      current_speed: bus.current_speed ?? 0,
      heading: bus.heading ?? 0,
      current_route_id: bus.current_route_id ?? undefined,
      current_route: bus.current_route ?? undefined,
    }));
    return this.buses;
  }

  async getRoutes(): Promise<Route[]> {
    const routes = await apiClient.getRoutes();
    this.routes = routes.map((route) => ({
      ...route,
      total_distance: route.total_distance ?? 0,
      estimated_duration: route.estimated_duration ?? 0,
      status: (route.status as Route['status']) ?? 'active',
      stops: route.stops.map((stop) => ({
        id: stop.id,
        name: stop.name,
        order: stop.stop_order,
        lat: stop.latitude,
        lng: stop.longitude,
      })),
    }));
    return this.routes;
  }

  async getRouteById(id: string): Promise<Route | null> {
    return (await this.getRoutes()).find((route) => route.id === id) ?? null;
  }

  async getStops(): Promise<Stop[]> {
    const stops = await apiClient.getStops();
    this.stops = stops.map((stop) => ({
      id: stop.id,
      name: stop.name,
      order: 0,
      lat: stop.latitude,
      lng: stop.longitude,
    }));
    return this.stops;
  }

  async getTrips(): Promise<any[]> {
    return [];
  }

  subscribeToBusLocations(callback: (update: LiveLocationUpdate) => void): () => void {
    this.listeners.add(callback);
    const unsub = subscribeToBusLocations((update) => {
      this.listeners.forEach((cb) => cb({
        ...update,
        ts: Date.parse(update.timestamp || new Date().toISOString()),
      }));
    });
    this.unsubscribers.push(unsub);
    return () => {
      this.listeners.delete(callback);
    };
  }

  onLocationUpdate(update: LiveLocationUpdate): void {
    this.listeners.forEach((cb) => cb(update));
  }
}