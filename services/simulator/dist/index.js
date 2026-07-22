"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const campus_route_1 = require("./routes/campus-route");
const city_route_1 = require("./routes/city-route");
const bus_manager_1 = require("./engine/bus-manager");
const simulation_engine_1 = require("./engine/simulation-engine");
const api_client_1 = require("./client/api-client");
const websocket_client_1 = require("./client/websocket-client");
async function main() {
    console.log('=== Smart Bus AI Simulator ===');
    console.log(`API: ${config_1.CONFIG.apiUrl}`);
    console.log(`WS: ${config_1.CONFIG.wsUrl}`);
    const routes = {
        [campus_route_1.campusRoute.id]: campus_route_1.campusRoute,
        [city_route_1.cityRoute.id]: city_route_1.cityRoute,
    };
    const busManager = new bus_manager_1.BusManager(routes);
    const apiClient = new api_client_1.ApiClient();
    const wsClient = new websocket_client_1.WebSocketClient();
    wsClient.connect();
    // Initialize trips for all buses
    console.log('[INIT] Creating trips for all buses...');
    for (const bus of busManager.getBuses()) {
        const tripId = await apiClient.createTrip(bus.id, bus.routeId);
        if (tripId) {
            busManager.setTripId(bus.id, tripId);
            console.log(`[INIT] Bus ${bus.busNumber} → trip ${tripId}`);
        }
        else {
            console.warn(`[INIT] Failed to create trip for ${bus.busNumber}`);
        }
    }
    const engine = new simulation_engine_1.SimulationEngine(busManager, async (buses) => {
        for (const bus of buses) {
            if (!bus.tripId)
                continue;
            console.log(`[SIM] ${bus.busNumber} (${bus.routeName}) @ (${bus.position.lat.toFixed(4)}, ${bus.position.lng.toFixed(4)}) spd=${bus.speed} hdg=${bus.heading.toFixed(0)} pax=${bus.passengerCount}`);
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
    }, config_1.CONFIG.tickIntervalMs);
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
