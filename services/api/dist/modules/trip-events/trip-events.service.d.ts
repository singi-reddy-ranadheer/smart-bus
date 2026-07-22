import { SupabaseService } from '../../database/supabase.service';
export declare class TripEventsService {
    private readonly supabaseService;
    private readonly logger;
    constructor(supabaseService: SupabaseService);
    create(event: {
        trip_id: string;
        event_type: string;
        latitude?: number;
        longitude?: number;
        speed?: number;
        heading?: number;
        passenger_count?: number;
        metadata?: Record<string, any>;
    }): Promise<any>;
    list(page?: number, limit?: number, filters?: {
        trip_id?: string;
        event_type?: string;
        from?: string;
        to?: string;
    }): Promise<{
        data: any[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
