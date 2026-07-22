import { SupabaseService } from '../../database/supabase.service';
export declare class RoutesService {
    private readonly supabaseService;
    private readonly logger;
    constructor(supabaseService: SupabaseService);
    list(page?: number, limit?: number, status?: string): Promise<{
        data: any[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getById(routeId: string): Promise<any>;
    create(create: {
        name: string;
        color: string;
        total_distance?: number;
        estimated_duration?: number;
        stops: {
            stop_id: string;
            order: number;
        }[];
    }): Promise<any>;
    update(routeId: string, update: Record<string, any>): Promise<any>;
    remove(routeId: string): Promise<{
        message: string;
    }>;
}
