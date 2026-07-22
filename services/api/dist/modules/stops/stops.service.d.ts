import { SupabaseService } from '../../database/supabase.service';
export declare class StopsService {
    private readonly supabaseService;
    private readonly logger;
    constructor(supabaseService: SupabaseService);
    list(page?: number, limit?: number): Promise<{
        data: any[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getById(stopId: string): Promise<any>;
    create(create: {
        name: string;
        latitude: number;
        longitude: number;
        landmark?: string;
        is_terminal?: boolean;
    }): Promise<any>;
    update(stopId: string, update: Record<string, any>): Promise<any>;
    remove(stopId: string): Promise<{
        message: string;
    }>;
}
