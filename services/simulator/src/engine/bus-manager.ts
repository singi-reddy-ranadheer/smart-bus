import { BusState } from '../types';
import { RouteDefinition } from '../types';
import { RouteFollower } from './route-follower';
import { SEED_UUIDS } from '../config';

interface ManagedBus extends BusState {
  follower: RouteFollower;
}

export class BusManager {
  private buses: ManagedBus[] = [];

  constructor(routes: Record<string, RouteDefinition>) {
    // Bus 1: Campus Express
    this.buses.push(
      this.createBus(
        SEED_UUIDS.bus001,
        'BUS-001',
        'KA-01-AB-1234',
        routes[SEED_UUIDS.campusRoute],
        12.9716,
        77.5946,
        35,
      ),
    );
    // Bus 2: Campus Express
    this.buses.push(
      this.createBus(
        SEED_UUIDS.bus002,
        'BUS-002',
        'KA-01-CD-5678',
        routes[SEED_UUIDS.campusRoute],
        12.9716,
        77.5946,
        28,
      ),
    );
    // Bus 3: City Loop
    this.buses.push(
      this.createBus(
        SEED_UUIDS.bus003,
        'BUS-003',
        'KA-01-EF-9012',
        routes[SEED_UUIDS.cityRoute],
        12.965,
        77.59,
        22,
      ),
    );
  }

  private createBus(
    id: string,
    busNumber: string,
    plateNumber: string,
    route: RouteDefinition,
    lat: number,
    lng: number,
    speed: number,
  ): ManagedBus {
    return {
      id,
      busNumber,
      plateNumber,
      routeId: route.id,
      routeName: route.name,
      position: { lat, lng },
      progress: 0,
      speed,
      heading: 0,
      passengerCount: Math.floor(Math.random() * 30) + 10,
      tripId: null,
      active: false,
      follower: new RouteFollower(route),
    };
  }

  getBuses(): BusState[] {
    return this.buses.map((b) => ({
      id: b.id,
      busNumber: b.busNumber,
      plateNumber: b.plateNumber,
      routeId: b.routeId,
      routeName: b.routeName,
      position: b.position,
      progress: b.progress,
      speed: b.speed,
      heading: b.heading,
      passengerCount: b.passengerCount,
      tripId: b.tripId,
      active: b.active,
    }));
  }

  tick(): BusState[] {
    for (const bus of this.buses) {
      if (!bus.active) continue;

      // Vary speed 20-40
      bus.speed = Math.floor(Math.random() * 21) + 20;

      // Adjust passenger count randomly at each tick (+/- 1)
      const delta = Math.floor(Math.random() * 3) - 1;
      bus.passengerCount = Math.max(0, Math.min(50, bus.passengerCount + delta));

      const progressDelta = (bus.speed / 3600) * (2 / 1000); // 2 seconds, km per tick
      const { position, heading } = bus.follower.advance(progressDelta * 50);
      bus.position = position;
      bus.heading = heading;
      bus.progress = bus.follower.getProgress();
    }

    return this.getBuses();
  }

  setTripId(busId: string, tripId: string): void {
    const bus = this.buses.find((b) => b.id === busId);
    if (bus) {
      bus.tripId = tripId;
      bus.active = true;
    }
  }

  endTrip(busId: string): void {
    const bus = this.buses.find((b) => b.id === busId);
    if (bus) {
      bus.tripId = null;
      bus.active = false;
    }
  }
}