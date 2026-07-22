import { SupabaseService } from '../../database/supabase.service';
export interface AuthResult {
    user: any;
    session: {
        access_token: string;
        refresh_token: string;
        expires_at: string;
    };
}
export declare class AuthService {
    private readonly supabaseService;
    private readonly logger;
    constructor(supabaseService: SupabaseService);
    register(email: string, password: string, name: string, phone?: string): Promise<AuthResult>;
    login(email: string, password: string): Promise<AuthResult>;
    logout(token: string): Promise<void>;
    refreshToken(refreshToken: string): Promise<AuthResult>;
    private formatResult;
}
