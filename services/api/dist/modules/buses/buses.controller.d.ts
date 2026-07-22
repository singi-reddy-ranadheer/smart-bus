import { BusesService } from './buses.service';
export declare class CreateBusDto {
    plate_number: string;
    bus_number: string;
    capacity: number;
    model?: string;
    color?: string;
}
export declare class UpdateBusDto {
    plate_number?: string;
    bus_number?: string;
    capacity?: number;
    model?: string;
    color?: string;
    status?: string;
    current_route_id?: string;
}
export declare class BusesController {
    private readonly busesService;
    constructor(busesService: BusesService);
    list(page?: number, limit?: number, status?: string, routeId?: string): Promise<{
        data: any[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getById(id: string): Promise<any>;
    create(dto: CreateBusDto): Promise<any>;
    update(id: string, dto: UpdateBusDto): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
