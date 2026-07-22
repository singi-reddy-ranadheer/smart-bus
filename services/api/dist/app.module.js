"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const health_module_1 = require("./modules/health/health.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const buses_module_1 = require("./modules/buses/buses.module");
const routes_module_1 = require("./modules/routes/routes.module");
const stops_module_1 = require("./modules/stops/stops.module");
const trips_module_1 = require("./modules/trips/trips.module");
const trip_events_module_1 = require("./modules/trip-events/trip-events.module");
const tracking_gateway_1 = require("./websocket/tracking.gateway");
const supabase_service_1 = require("./database/supabase.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            health_module_1.HealthModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            buses_module_1.BusesModule,
            routes_module_1.RoutesModule,
            stops_module_1.StopsModule,
            trips_module_1.TripsModule,
            trip_events_module_1.TripEventsModule,
        ],
        controllers: [],
        providers: [supabase_service_1.SupabaseService, tracking_gateway_1.TrackingGateway],
        exports: [supabase_service_1.SupabaseService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map