import { SupabaseService } from '../../database/supabase.service';
export declare class TripsService {
    private readonly supabaseService;
    private readonly logger;
    constructor(supabaseService: SupabaseService);
    list(page?: number, limit?: number, filters?: {
        status?: string;
        bus_id?: string;
        driver_id?: string;
        route_id?: string;
    }): Promise<{
        data: any[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getById(tripId: string): Promise<any>;
    create(create: {
        bus_id: string;
        route_id: string;
    }, driverId?: string): Promise<any>;
    update(tripId: string, update: {
        status?: string;
        passenger_count?: number;
        notes?: string;
    }): Promise<any>;
}
