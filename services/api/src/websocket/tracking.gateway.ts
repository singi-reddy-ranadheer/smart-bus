import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  WsResponse,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
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

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    credentials: true,
  },
  namespace: '/ws',
})
export class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(TrackingGateway.name);
  private activeTrips = new Map<string, { busId: string }>();

  constructor(private readonly supabaseService: SupabaseService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('gps:update')
  async handleGpsUpdate(
    client: Socket,
    payload: GpsUpdatePayload,
  ): Promise<WsResponse<any>> {
    try {
      if (!payload?.trip_id || payload.lat === undefined || payload.lng === undefined) {
        return { event: 'error', data: { message: 'Invalid GPS payload' } };
      }

      // Get trip to find bus_id
      const { data: trip } = await this.supabaseService.client
        .from('trips')
        .select('bus_id')
        .eq('id', payload.trip_id)
        .single();

      if (!trip) {
        return { event: 'error', data: { message: 'Trip not found' } };
      }

      // Save GPS event to immutable log
      const { error } = await this.supabaseService.client.from('trip_events').insert({
        trip_id: payload.trip_id,
        event_type: 'GPS_UPDATE',
        latitude: payload.lat,
        longitude: payload.lng,
        speed: payload.speed,
        heading: payload.heading,
        recorded_at: new Date().toISOString(),
      });

      if (error) {
        this.logger.warn(`Failed to save GPS event: ${error.message}`);
      }

      // Update bus current location
      await this.supabaseService.client
        .from('buses')
        .update({
          current_location: `(${payload.lng},${payload.lat})`,
          current_speed: payload.speed,
          heading: payload.heading,
        })
        .eq('id', trip.bus_id);

      // Broadcast to passengers watching this bus
      const broadcast = {
        bus_id: trip.bus_id,
        lat: payload.lat,
        lng: payload.lng,
        speed: payload.speed,
        heading: payload.heading,
        ts: new Date().toISOString(),
      };

      this.server.emit(`bus:${trip.bus_id}:location`, broadcast);
      this.server.emit('bus:location', broadcast);

      return { event: 'gps:ack', data: { received: true } };
    } catch (err) {
      this.logger.error(`GPS update error: ${err instanceof Error ? err.message : String(err)}`);
      return { event: 'error', data: { message: 'Internal error' } };
    }
  }

  @SubscribeMessage('trip:start')
  async handleTripStart(
    client: Socket,
    payload: TripStartPayload,
  ): Promise<WsResponse<any>> {
    try {
      const { data: trip, error } = await this.supabaseService.client
        .from('trips')
        .insert({
          bus_id: payload.bus_id,
          route_id: payload.route_id,
          status: 'active',
          start_time: new Date().toISOString(),
        })
        .select('*')
        .single();

      if (error) {
        return { event: 'error', data: { message: error.message } };
      }

      this.activeTrips.set(client.id, { busId: payload.bus_id });

      await this.supabaseService.client
        .from('buses')
        .update({ status: 'active' })
        .eq('id', payload.bus_id);

      return { event: 'trip:started', data: { trip_id: trip.id } };
    } catch (err) {
      return { event: 'error', data: { message: 'Internal error' } };
    }
  }

  @SubscribeMessage('trip:end')
  async handleTripEnd(
    client: Socket,
    payload: { trip_id: string },
  ): Promise<WsResponse<any>> {
    try {
      const { data: trip } = await this.supabaseService.client
        .from('trips')
        .select('bus_id')
        .eq('id', payload.trip_id)
        .single();

      await this.supabaseService.client
        .from('trips')
        .update({ status: 'completed', end_time: new Date().toISOString() })
        .eq('id', payload.trip_id);

      if (trip) {
        await this.supabaseService.client
          .from('buses')
          .update({ status: 'inactive' })
          .eq('id', trip.bus_id);
      }

      this.activeTrips.delete(client.id);

      return { event: 'trip:ended', data: { trip_id: payload.trip_id } };
    } catch (err) {
      return { event: 'error', data: { message: 'Internal error' } };
    }
  }

  @SubscribeMessage('sos:alert')
  async handleSos(
    client: Socket,
    payload: { trip_id: string; message: string },
  ): Promise<WsResponse<any>> {
    try {
      await this.supabaseService.client.from('trip_events').insert({
        trip_id: payload.trip_id,
        event_type: 'SOS_ALERT',
        metadata: { message: payload.message },
        recorded_at: new Date().toISOString(),
      });

      this.server.emit('alert:sos', {
        trip_id: payload.trip_id,
        message: payload.message,
        ts: new Date().toISOString(),
      });

      return { event: 'sos:ack', data: { received: true } };
    } catch (err) {
      return { event: 'error', data: { message: 'Internal error' } };
    }
  }
}
