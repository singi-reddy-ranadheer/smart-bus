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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const supabase_service_1 = require("../../database/supabase.service");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(supabaseService) {
        super();
        this.supabaseService = supabaseService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractToken(request);
        if (!token) {
            throw new common_1.UnauthorizedException({
                code: 'UNAUTHORIZED',
                message: 'Missing or invalid token',
            });
        }
        try {
            const { data, error } = await this.supabaseService.client.auth.getUser(token);
            if (error || !data.user) {
                throw new common_1.UnauthorizedException({
                    code: 'UNAUTHORIZED',
                    message: 'Invalid or expired token',
                });
            }
            request.user = {
                ...data.user,
                id: data.user.id,
                email: data.user.email,
                role: data.user.app_metadata?.role || 'passenger',
            };
            return true;
        }
        catch (err) {
            throw new common_1.UnauthorizedException({
                code: 'UNAUTHORIZED',
                message: 'Token validation failed',
            });
        }
    }
    extractToken(request) {
        const authHeader = request.headers?.authorization;
        if (!authHeader)
            return null;
        const [type, token] = authHeader.split(' ');
        return type === 'Bearer' ? token : null;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map