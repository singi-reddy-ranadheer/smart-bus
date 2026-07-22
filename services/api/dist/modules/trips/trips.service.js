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
var TripsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../../database/supabase.service");
let TripsService = TripsService_1 = class TripsService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
        this.logger = new common_1.Logger(TripsService_1.name);
    }
    async list(page = 1, limit = 20, filters = {}) {
        let query = this.supabaseService.client
            .from('trips')
            .select('*, bus:buses(id, bus_number, capacity), route:routes(id, name, color)', { count: 'exact' });
        if (filters.status)
            query = query.eq('status', filters.status);
        if (filters.bus_id)
            query = query.eq('bus_id', filters.bus_id);
        if (filters.driver_id)
            query = query.eq('driver_id', filters.driver_id);
        if (filters.route_id)
            query = query.eq('route_id', filters.route_id);
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        const { data, error, count } = await query
            .range(from, to)
            .order('created_at', { ascending: false });
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
    async getById(tripId) {
        const { data, error } = await this.supabaseService.client
            .from('trips')
            .select('*, bus:buses(id, bus_number), route:routes(id, name, color), driver:drivers(id), events:trip_events(*)')
            .eq('id', tripId)
            .single();
        if (error || !data) {
            throw new common_1.NotFoundException({
                code: 'TRIP_NOT_FOUND',
                message: 'Trip not found',
            });
        }
        return data;
    }
    async create(create, driverId) {
        const { data: bus } = await this.supabaseService.client
            .from('buses')
            .select('id, current_route_id')
            .eq('id', create.bus_id)
            .single();
        if (!bus) {
            throw new common_1.NotFoundException({
                code: 'BUS_NOT_FOUND',
                message: 'Bus not found',
            });
        }
        const { data, error } = await this.supabaseService.client
            .from('trips')
            .insert({
            bus_id: create.bus_id,
            route_id: create.route_id,
            driver_id: driverId,
            status: 'active',
            start_time: new Date().toISOString(),
        })
            .select('*')
            .single();
        if (error) {
            throw new common_1.NotFoundException({
                code: 'CREATE_FAILED',
                message: error.message,
            });
        }
        await this.supabaseService.client
            .from('buses')
            .update({ status: 'active' })
            .eq('id', create.bus_id);
        return data;
    }
    async update(tripId, update) {
        const patch = { ...update };
        if (update.status === 'completed') {
            patch.end_time = new Date().toISOString();
        }
        const { data, error } = await this.supabaseService.client
            .from('trips')
            .update(patch)
            .eq('id', tripId)
            .select('*')
            .single();
        if (error) {
            throw new common_1.NotFoundException({
                code: 'TRIP_NOT_FOUND',
                message: 'Trip not found',
            });
        }
        if (update.status === 'completed') {
            const { data: trip } = await this.supabaseService.client
                .from('trips')
                .select('bus_id')
                .eq('id', tripId)
                .single();
            if (trip) {
                await this.supabaseService.client
                    .from('buses')
                    .update({ status: 'inactive' })
                    .eq('id', trip.bus_id);
            }
        }
        return data;
    }
};
exports.TripsService = TripsService;
exports.TripsService = TripsService = TripsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], TripsService);
//# sourceMappingURL=trips.service.js.map