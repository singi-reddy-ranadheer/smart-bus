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
var RoutesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutesService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../../database/supabase.service");
let RoutesService = RoutesService_1 = class RoutesService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
        this.logger = new common_1.Logger(RoutesService_1.name);
    }
    async list(page = 1, limit = 20, status) {
        let query = this.supabaseService.client
            .from('routes')
            .select('*, stops:route_stops(*, stop:stops(*))', { count: 'exact' })
            .is('deleted_at', null);
        if (status) {
            query = query.eq('status', status);
        }
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        const { data, error, count } = await query.range(from, to).order('name', { ascending: true });
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
    async getById(routeId) {
        const { data, error } = await this.supabaseService.client
            .from('routes')
            .select('*, stops:route_stops(*, stop:stops(*))')
            .eq('id', routeId)
            .single();
        if (error || !data) {
            throw new common_1.NotFoundException({
                code: 'ROUTE_NOT_FOUND',
                message: 'Route not found',
            });
        }
        return data;
    }
    async create(create) {
        const { data: route, error } = await this.supabaseService.client
            .from('routes')
            .insert({
            name: create.name,
            color: create.color,
            total_distance: create.total_distance,
            estimated_duration: create.estimated_duration,
            status: 'active',
        })
            .select('*')
            .single();
        if (error) {
            throw new common_1.NotFoundException({
                code: 'CREATE_FAILED',
                message: error.message,
            });
        }
        if (create.stops?.length) {
            const stopRows = create.stops.map((s) => ({
                route_id: route.id,
                stop_id: s.stop_id,
                stop_order: s.order,
            }));
            const { error: stopError } = await this.supabaseService.client
                .from('route_stops')
                .insert(stopRows);
            if (stopError) {
                this.logger.warn(`Failed to insert route stops: ${stopError.message}`);
            }
        }
        return this.getById(route.id);
    }
    async update(routeId, update) {
        const { data, error } = await this.supabaseService.client
            .from('routes')
            .update({
            ...update,
            updated_at: new Date().toISOString(),
        })
            .eq('id', routeId)
            .select('*')
            .single();
        if (error) {
            throw new common_1.NotFoundException({
                code: 'ROUTE_NOT_FOUND',
                message: 'Route not found',
            });
        }
        return data;
    }
    async remove(routeId) {
        const { error } = await this.supabaseService.client
            .from('routes')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', routeId);
        if (error) {
            throw new common_1.NotFoundException({
                code: 'ROUTE_NOT_FOUND',
                message: 'Route not found',
            });
        }
        return { message: 'Route deleted successfully' };
    }
};
exports.RoutesService = RoutesService;
exports.RoutesService = RoutesService = RoutesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], RoutesService);
//# sourceMappingURL=routes.service.js.map