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
var TripEventsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripEventsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../../database/supabase.service");
let TripEventsService = TripEventsService_1 = class TripEventsService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
        this.logger = new common_1.Logger(TripEventsService_1.name);
    }
    async create(event) {
        const { data, error } = await this.supabaseService.client
            .from('trip_events')
            .insert({
            trip_id: event.trip_id,
            event_type: event.event_type,
            latitude: event.latitude,
            longitude: event.longitude,
            speed: event.speed,
            heading: event.heading,
            passenger_count: event.passenger_count,
            metadata: event.metadata || {},
        })
            .select('*')
            .single();
        if (error) {
            throw new common_1.NotFoundException({
                code: 'EVENT_CREATE_FAILED',
                message: error.message,
            });
        }
        if (event.latitude !== undefined && event.longitude !== undefined) {
            const { data: trip } = await this.supabaseService.client
                .from('trips')
                .select('bus_id')
                .eq('id', event.trip_id)
                .single();
            if (trip) {
                await this.supabaseService.client
                    .from('buses')
                    .update({
                    current_location: `(${event.longitude},${event.latitude})`,
                    current_speed: event.speed || 0,
                    heading: event.heading,
                })
                    .eq('id', trip.bus_id);
            }
        }
        return data;
    }
    async list(page = 1, limit = 100, filters = {}) {
        let query = this.supabaseService.client
            .from('trip_events')
            .select('*', { count: 'exact' })
            .order('recorded_at', { ascending: false });
        if (filters.trip_id)
            query = query.eq('trip_id', filters.trip_id);
        if (filters.event_type)
            query = query.eq('event_type', filters.event_type);
        if (filters.from)
            query = query.gte('recorded_at', filters.from);
        if (filters.to)
            query = query.lte('recorded_at', filters.to);
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        const { data, error, count } = await query.range(from, to);
        if (error) {
            throw new common_1.NotFoundException({
                code: 'QUERY_FAILED',
                message: error.message,
            });
        }
        return {
            data: data || [],
            meta: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit),
            },
        };
    }
};
exports.TripEventsService = TripEventsService;
exports.TripEventsService = TripEventsService = TripEventsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], TripEventsService);
//# sourceMappingURL=trip-events.service.js.map