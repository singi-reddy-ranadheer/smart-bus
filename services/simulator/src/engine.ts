import { SupabaseClient } from '@supabase/supabase-js';
import { Route } from './route-follower';

export interface Bus {
  id: string;
  registration_number: string;
  current_route_id?: string;
  current_latitude?: number;
  current_longitude?: number;
}

export class Engine {
  private bus: Bus;
  private route: Route;
  private supabase: SupabaseClient;
  private stopIndex = 0;
  private progress = 0;
  private intervalId?: NodeJS.Timeout;
  private speed = 0.01; // degrees per tick (very slow)

  constructor(bus: Bus, route: Route, supabase: SupabaseClient) {
    this.bus = bus;
    this.route = route;
    this.supabase = supabase;
  }

  start() {
    console.log(`  ▶ Starting engine for bus ${this.bus.registration_number}`);
    this.tick();
  }

  tick() {
    const stops = this.route.stops;
    if (stops.length === 0) return;

    const currentStop = stops[this.stopIndex];
    const nextStop = stops[(this.stopIndex + 1) % stops.length];

    const latDiff = nextStop.latitude - currentStop.latitude;
    const lngDiff = nextStop.longitude - currentStop.longitude;
    const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);

    if (distance < 0.0005) {
      this.stopIndex = (this.stopIndex + 1) % stops.length;
      this.progress = 0;
      return;
    }

    this.progress += this.speed;

    const newLat = currentStop.latitude + latDiff * this.progress;
    const newLng = currentStop.longitude + lngDiff * this.progress;

    this.bus.current_latitude = newLat;
    this.bus.current_longitude = newLng;

    this.updateBusPosition();
    this.logTripEvent(newLat, newLng);
  }

  stop() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  private async updateBusPosition() {
    await this.supabase
      .from('buses')
      .update({
        current_latitude: this.bus.current_latitude,
        current_longitude: this.bus.current_longitude,
        last_gps_update: new Date().toISOString(),
      })
      .eq('id', this.bus.id);
  }

  private async logTripEvent(lat: number, lng: number) {
    await this.supabase.from('trip_events').insert({
      trip_id: '00000000-0000-0000-0000-000000000000',
      event_type: 'gps_update',
      latitude: lat,
      longitude: lng,
      speed: 20 + Math.random() * 20,
      metadata: { bus_id: this.bus.id },
    });
  }
}