import { RoutesService } from './routes.service';
declare class RouteStopDto {
    stop_id: string;
    order: number;
}
export declare class CreateRouteDto {
    name: string;
    color: string;
    total_distance?: number;
    estimated_duration?: number;
    stops: RouteStopDto[];
}
export declare class UpdateRouteDto {
    name?: string;
    color?: string;
    total_distance?: number;
    estimated_duration?: number;
    status?: string;
}
export declare class RoutesController {
    private readonly routesService;
    constructor(routesService: RoutesService);
    list(page?: number, limit?: number, status?: string): Promise<{
        data: any[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getById(id: string): Promise<any>;
    create(dto: CreateRouteDto): Promise<any>;
    update(id: string, dto: UpdateRouteDto): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
export {};
