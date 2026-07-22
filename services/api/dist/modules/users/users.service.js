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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../../database/supabase.service");
let UsersService = UsersService_1 = class UsersService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
        this.logger = new common_1.Logger(UsersService_1.name);
    }
    async getById(userId) {
        const { data, error } = await this.supabaseService.client
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
        if (error || !data) {
            throw new common_1.NotFoundException({
                code: 'USER_NOT_FOUND',
                message: 'User not found',
            });
        }
        return data;
    }
    async update(userId, update) {
        const { data, error } = await this.supabaseService.client
            .from('users')
            .update({
            ...update,
            updated_at: new Date().toISOString(),
        })
            .eq('id', userId)
            .select('*')
            .single();
        if (error) {
            throw new common_1.NotFoundException({
                code: 'USER_NOT_FOUND',
                message: 'User not found',
            });
        }
        return data;
    }
    async list(page = 1, limit = 20, role) {
        let query = this.supabaseService.client
            .from('users')
            .select('*', { count: 'exact' })
            .is('deleted_at', null);
        if (role) {
            query = query.eq('role', role);
        }
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        const { data, error, count } = await query.range(from, to).order('created_at', { ascending: false });
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
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], UsersService);
//# sourceMappingURL=users.service.js.map