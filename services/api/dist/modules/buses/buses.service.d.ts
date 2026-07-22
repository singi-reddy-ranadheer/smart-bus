import { SupabaseService } from '../../database/supabase.service';
export declare class BusesService {
    private readonly supabaseService;
    private readonly logger;
    constructor(supabaseService: SupabaseService);
    list(page?: number, limit?: number, status?: string, routeId?: string): Promise<{
        data: any[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getById(busId: string): Promise<any>;
    create(create: {
        plate_number: string;
        bus_number: string;
        capacity: number;
        model?: string;
        color?: string;
    }): Promise<any>;
    update(busId: string, update: Record<string, any>): Promise<any>;
    remove(busId: string): Promise<{
        message: string;
    }>;
}
