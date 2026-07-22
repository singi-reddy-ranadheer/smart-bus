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
var StopsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StopsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../../database/supabase.service");
let StopsService = StopsService_1 = class StopsService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
        this.logger = new common_1.Logger(StopsService_1.name);
    }
    async list(page = 1, limit = 50) {
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        const { data, error, count } = await this.supabaseService.client
            .from('stops')
            .select('*', { count: 'exact' })
            .is('deleted_at', null)
            .range(from, to)
            .order('name', { ascending: true });
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
    async getById(stopId) {
        const { data, error } = await this.supabaseService.client
            .from('stops')
            .select('*')
            .eq('id', stopId)
            .single();
        if (error || !data) {
            throw new common_1.NotFoundException({
                code: 'STOP_NOT_FOUND',
                message: 'Stop not found',
            });
        }
        return data;
    }
    async create(create) {
        const { data, error } = await this.supabaseService.client
            .from('stops')
            .insert({
            name: create.name,
            latitude: create.latitude,
            longitude: create.longitude,
            landmark: create.landmark,
            is_terminal: create.is_terminal || false,
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
    async update(stopId, update) {
        const { data, error } = await this.supabaseService.client
            .from('stops')
            .update({ ...update, updated_at: new Date().toISOString() })
            .eq('id', stopId)
            .select('*')
            .single();
        if (error) {
            throw new common_1.NotFoundException({
                code: 'STOP_NOT_FOUND',
                message: 'Stop not found',
            });
        }
        return data;
    }
    async remove(stopId) {
        const { error } = await this.supabaseService.client
            .from('stops')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', stopId);
        if (error) {
            throw new common_1.NotFoundException({
                code: 'STOP_NOT_FOUND',
                message: 'Stop not found',
            });
        }
        return { message: 'Stop deleted successfully' };
    }
};
exports.StopsService = StopsService;
exports.StopsService = StopsService = StopsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], StopsService);
//# sourceMappingURL=stops.service.js.map