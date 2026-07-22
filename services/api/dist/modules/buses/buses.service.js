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
var BusesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusesService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../../database/supabase.service");
let BusesService = BusesService_1 = class BusesService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
        this.logger = new common_1.Logger(BusesService_1.name);
    }
    async list(page = 1, limit = 20, status, routeId) {
        let query = this.supabaseService.client
            .from('buses')
            .select('*, current_route:routes(id, name)', { count: 'exact' })
            .is('deleted_at', null);
        if (status) {
            query = query.eq('status', status);
        }
        if (routeId) {
            query = query.eq('current_route_id', routeId);
        }
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        const { data, error, count } = await query.range(from, to).order('bus_number', { ascending: true });
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
    async getById(busId) {
        const { data, error } = await this.supabaseService.client
            .from('buses')
            .select('*, current_route:routes(id, name, color)')
            .eq('id', busId)
            .single();
        if (error || !data) {
            throw new common_1.NotFoundException({
                code: 'BUS_NOT_FOUND',
                message: 'Bus not found',
            });
        }
        return data;
    }
    async create(create) {
        const { data, error } = await this.supabaseService.client
            .from('buses')
            .insert({
            plate_number: create.plate_number,
            bus_number: create.bus_number,
            capacity: create.capacity,
            model: create.model,
            color: create.color || '#3B82F6',
            status: 'inactive',
        })
            .select('*')
            .single();
        if (error) {
            throw new common_1.NotFoundException({
                code: 'CREATE_FAILED',
                message: error.message,
            });
        }
        return data;
    }
    async update(busId, update) {
        const { data, error } = await this.supabaseService.client
            .from('buses')
            .update({
            ...update,
            updated_at: new Date().toISOString(),
        })
            .eq('id', busId)
            .select('*')
            .single();
        if (error) {
            throw new common_1.NotFoundException({
                code: 'BUS_NOT_FOUND',
                message: 'Bus not found',
            });
        }
        return data;
    }
    async remove(busId) {
        const { error } = await this.supabaseService.client
            .from('buses')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', busId);
        if (error) {
            throw new common_1.NotFoundException({
                code: 'BUS_NOT_FOUND',
                message: 'Bus not found',
            });
        }
        return { message: 'Bus deleted successfully' };
    }
};
exports.BusesService = BusesService;
exports.BusesService = BusesService = BusesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], BusesService);
//# sourceMappingURL=buses.service.js.map