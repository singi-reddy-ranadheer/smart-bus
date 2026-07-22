import { TripsService } from './trips.service';
export declare class CreateTripDto {
    bus_id: string;
    route_id: string;
}
export declare class UpdateTripDto {
    status?: string;
    passenger_count?: number;
    notes?: string;
}
export declare class TripsController {
    private readonly tripsService;
    constructor(tripsService: TripsService);
    list(page?: number, limit?: number, status?: string, busId?: string, driverId?: string, routeId?: string): Promise<{
        data: any[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getById(id: string): Promise<any>;
    create(dto: CreateTripDto, user: any): Promise<any>;
    update(id: string, dto: UpdateTripDto): Promise<any>;
}
