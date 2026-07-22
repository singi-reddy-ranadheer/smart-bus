import { OnGatewayConnection, OnGatewayDisconnect, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SupabaseService } from '../database/supabase.service';
interface GpsUpdatePayload {
    trip_id: string;
    lat: number;
    lng: number;
    speed: number;
    heading: number;
}
interface TripStartPayload {
    bus_id: string;
    route_id: string;
}
export declare class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly supabaseService;
    server: Server;
    private readonly logger;
    private activeTrips;
    constructor(supabaseService: SupabaseService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleGpsUpdate(client: Socket, payload: GpsUpdatePayload): Promise<WsResponse<any>>;
    handleTripStart(client: Socket, payload: TripStartPayload): Promise<WsResponse<any>>;
    handleTripEnd(client: Socket, payload: {
        trip_id: string;
    }): Promise<WsResponse<any>>;
    handleSos(client: Socket, payload: {
        trip_id: string;
        message: string;
    }): Promise<WsResponse<any>>;
}
export {};
