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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../../database/supabase.service");
let AuthService = AuthService_1 = class AuthService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async register(email, password, name, phone) {
        const { data, error } = await this.supabaseService.client.auth.signUp({
            email,
            password,
            options: {
                data: { name, phone, role: 'passenger' },
            },
        });
        if (error) {
            throw new common_1.UnauthorizedException({
                code: 'REGISTRATION_FAILED',
                message: error.message,
            });
        }
        return this.formatResult(data);
    }
    async login(email, password) {
        const { data, error } = await this.supabaseService.client.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            throw new common_1.UnauthorizedException({
                code: 'INVALID_CREDENTIALS',
                message: 'Invalid email or password',
            });
        }
        return this.formatResult(data);
    }
    async logout(token) {
        const { error } = await this.supabaseService.client.auth.signOut();
        if (error) {
            this.logger.warn(`Logout error: ${error.message}`);
        }
    }
    async refreshToken(refreshToken) {
        const { data, error } = await this.supabaseService.client.auth.refreshSession({
            refresh_token: refreshToken,
        });
        if (error) {
            throw new common_1.UnauthorizedException({
                code: 'TOKEN_REFRESH_FAILED',
                message: error.message,
            });
        }
        return this.formatResult(data);
    }
    formatResult(data) {
        return {
            user: data.user,
            session: {
                access_token: data.session?.access_token || '',
                refresh_token: data.session?.refresh_token || '',
                expires_at: data.session?.expires_at
                    ? new Date(data.session.expires_at * 1000).toISOString()
                    : '',
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], AuthService);
//# sourceMappingURL=auth.service.js.map