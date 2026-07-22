import { SupabaseService } from '../../database/supabase.service';
export declare class UsersService {
    private readonly supabaseService;
    private readonly logger;
    constructor(supabaseService: SupabaseService);
    getById(userId: string): Promise<any>;
    update(userId: string, update: {
        name?: string;
        phone?: string;
        avatar_url?: string;
    }): Promise<any>;
    list(page?: number, limit?: number, role?: string): Promise<{
        data: any[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
