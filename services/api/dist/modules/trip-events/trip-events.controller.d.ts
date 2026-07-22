import { TripEventsService } from './trip-events.service';
export declare class CreateTripEventDto {
    trip_id: string;
    event_type: string;
    latitude?: number;
    longitude?: number;
    speed?: number;
    heading?: number;
    passenger_count?: number;
    metadata?: Record<string, any>;
}
export declare class TripEventsController {
    private readonly tripEventsService;
    constructor(tripEventsService: TripEventsService);
    create(dto: CreateTripEventDto): Promise<any>;
    list(page?: number, limit?: number, tripId?: string, eventType?: string, from?: string, to?: string): Promise<{
        data: any[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
