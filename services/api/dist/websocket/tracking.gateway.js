"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TrackingGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackingGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const supabase_service_1 = require("../database/supabase.service");
let TrackingGateway = TrackingGateway_1 = class TrackingGateway {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
        this.logger = new common_1.Logger(TrackingGateway_1.name);
        this.activeTrips = new Map();
    }
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    async handleGpsUpdate(client, payload) {
        try {
            if (!payload?.trip_id || payload.lat === undefined || payload.lng === undefined) {
                return { event: 'error', data: { message: 'Invalid GPS payload' } };
            }
            const { data: trip } = await this.supabaseService.client
                .from('trips')
                .select('bus_id')
                .eq('id', payload.trip_id)
                .single();
            if (!trip) {
                return { event: 'error', data: { message: 'Trip not found' } };
            }
            const { error } = await this.supabaseService.client.from('trip_events').insert({
                trip_id: payload.trip_id,
                event_type: 'GPS_UPDATE',
                latitude: payload.lat,
                longitude: payload.lng,
                speed: payload.speed,
                heading: payload.heading,
                recorded_at: new Date().toISOString(),
            });
            if (error) {
                this.logger.warn(`Failed to save GPS event: ${error.message}`);
            }
            await this.supabaseService.client
                .from('buses')
                .update({
                current_location: `(${payload.lng},${payload.lat})`,
                current_speed: payload.speed,
                heading: payload.heading,
            })
                .eq('id', trip.bus_id);
            const broadcast = {
                bus_id: trip.bus_id,
                lat: payload.lat,
                lng: payload.lng,
                speed: payload.speed,
                heading: payload.heading,
                ts: new Date().toISOString(),
            };
            this.server.emit(`bus:${trip.bus_id}:location`, broadcast);
            this.server.emit('bus:location', broadcast);
            return { event: 'gps:ack', data: { received: true } };
        }
        catch (err) {
            this.logger.error(`GPS update error: ${err instanceof Error ? err.message : String(err)}`);
            return { event: 'error', data: { message: 'Internal error' } };
        }
    }
    async handleTripStart(client, payload) {
        try {
            const { data: trip, error } = await this.supabaseService.client
                .from('trips')
                .insert({
                bus_id: payload.bus_id,
                route_id: payload.route_id,
                status: 'active',
                start_time: new Date().toISOString(),
            })
                .select('*')
                .single();
            if (error) {
                return { event: 'error', data: { message: error.message } };
            }
            this.activeTrips.set(client.id, { busId: payload.bus_id });
            await this.supabaseService.client
                .from('buses')
                .update({ status: 'active' })
                .eq('id', payload.bus_id);
            return { event: 'trip:started', data: { trip_id: trip.id } };
        }
        catch (err) {
            return { event: 'error', data: { message: 'Internal error' } };
        }
    }
    async handleTripEnd(client, payload) {
        try {
            const { data: trip } = await this.supabaseService.client
                .from('trips')
                .select('bus_id')
                .eq('id', payload.trip_id)
                .single();
            await this.supabaseService.client
                .from('trips')
                .update({ status: 'completed', end_time: new Date().toISOString() })
                .eq('id', payload.trip_id);
            if (trip) {
                await this.supabaseService.client
                    .from('buses')
                    .update({ status: 'inactive' })
                    .eq('id', trip.bus_id);
            }
            this.activeTrips.delete(client.id);
            return { event: 'trip:ended', data: { trip_id: payload.trip_id } };
        }
        catch (err) {
            return { event: 'error', data: { message: 'Internal error' } };
        }
    }
    async handleSos(client, payload) {
        try {
            await this.supabaseService.client.from('trip_events').insert({
                trip_id: payload.trip_id,
                event_type: 'SOS_ALERT',
                metadata: { message: payload.message },
                recorded_at: new Date().toISOString(),
            });
            this.server.emit('alert:sos', {
                trip_id: payload.trip_id,
                message: payload.message,
                ts: new Date().toISOString(),
            });
            return { event: 'sos:ack', data: { received: true } };
        }
        catch (err) {
            return { event: 'error', data: { message: 'Internal error' } };
        }
    }
};
exports.TrackingGateway = TrackingGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], TrackingGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('gps:update'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], TrackingGateway.prototype, "handleGpsUpdate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('trip:start'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], TrackingGateway.prototype, "handleTripStart", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('trip:end'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], TrackingGateway.prototype, "handleTripEnd", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sos:alert'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], TrackingGateway.prototype, "handleSos", null);
exports.TrackingGateway = TrackingGateway = TrackingGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
            credentials: true,
        },
        namespace: '/ws',
    }),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], TrackingGateway);
//# sourceMappingURL=tracking.gateway.js.map