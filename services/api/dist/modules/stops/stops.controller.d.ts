import { StopsService } from './stops.service';
export declare class CreateStopDto {
    name: string;
    latitude: number;
    longitude: number;
    landmark?: string;
    is_terminal?: boolean;
}
export declare class UpdateStopDto {
    name?: string;
    latitude?: number;
    longitude?: number;
    landmark?: string;
    is_terminal?: boolean;
}
export declare class StopsController {
    private readonly stopsService;
    constructor(stopsService: StopsService);
    list(page?: number, limit?: number): Promise<{
        data: any[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getById(id: string): Promise<any>;
    create(dto: CreateStopDto): Promise<any>;
    update(id: string, dto: UpdateStopDto): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
