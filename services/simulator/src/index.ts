import { CONFIG, SEED_UUIDS } from './config';
import { campusRoute } from './routes/campus-route';
import { cityRoute } from './routes/city-route';
import { RouteDefinition } from './types';
import { BusManager } from './engine/bus-manager';
import { SimulationEngine } from './engine/simulation-engine';
import { ApiClient } from './client/api-client';
import { WebSocketClient } from './client/websocket-client';

async function main() {
  console.log('=== Smart Bus AI Simulator ===');
  console.log(`API: ${CONFIG.apiUrl}`);
  console.log(`WS: ${CONFIG.wsUrl}`);

  const routes: Record<string, RouteDefinition> = {
    [campusRoute.id]: campusRoute,
    [cityRoute.id]: cityRoute,
  };

  const busManager = new BusManager(routes);
  const apiClient = new ApiClient();
  const wsClient = new WebSocketClient();
  wsClient.connect();

  // Initialize trips for all buses
  console.log('[INIT] Creating trips for all buses...');
  for (const bus of busManager.getBuses()) {
    const tripId = await apiClient.createTrip(bus.id, bus.routeId);
    if (tripId) {
      busManager.setTripId(bus.id, tripId);
      console.log(`[INIT] Bus ${bus.busNumber} → trip ${tripId}`);
    } else {
      console.warn(`[INIT] Failed to create trip for ${bus.busNumber}`);
    }
  }

  const engine = new SimulationEngine(
    busManager,
    async (buses) => {
      for (const bus of buses) {
        if (!bus.tripId) continue;

        console.log(
          `[SIM] ${bus.busNumber} (${bus.routeName}) @ (${bus.position.lat.toFixed(4)}, ${bus.position.lng.toFixed(4)}) spd=${bus.speed} hdg=${bus.heading.toFixed(0)} pax=${bus.passengerCount}`,
        );

        // Send via WebSocket for real-time
        wsClient.sendGpsUpdate({
          trip_id: bus.tripId,
          lat: bus.position.lat,
          lng: bus.position.lng,
          speed: bus.speed,
          heading: bus.heading,
        });

        // Record to immutable trip_events log via REST
        await apiClient.recordTripEvent({
          trip_id: bus.tripId,
          event_type: 'GPS_UPDATE',
          latitude: bus.position.lat,
          longitude: bus.position.lng,
          speed: bus.speed,
          heading: bus.heading,
          passenger_count: bus.passengerCount,
        });
      }
    },
    CONFIG.tickIntervalMs,
  );

  engine.start();

  const shutdown = () => {
    console.log('\n[SHUTDOWN] Stopping simulator...');
    engine.stop();
    wsClient.disconnect();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});