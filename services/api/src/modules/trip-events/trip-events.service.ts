import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { SupabaseService } from '../../database/supabase.service';

@Injectable()
export class TripEventsService {
  private readonly logger = new Logger(TripEventsService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async create(event: {
    trip_id: string;
    event_type: string;
    latitude?: number;
    longitude?: number;
    speed?: number;
    heading?: number;
    passenger_count?: number;
    metadata?: Record<string, any>;
  }) {
    const { data, error } = await this.supabaseService.client
      .from('trip_events')
      .insert({
        trip_id: event.trip_id,
        event_type: event.event_type,
        latitude: event.latitude,
        longitude: event.longitude,
        speed: event.speed,
        heading: event.heading,
        passenger_count: event.passenger_count,
        metadata: event.metadata || {},
      })
      .select('*')
      .single();

    if (error) {
      throw new NotFoundException({
        code: 'EVENT_CREATE_FAILED',
        message: error.message,
      });
    }

    // Update bus current location if GPS event
    if (event.latitude !== undefined && event.longitude !== undefined) {
      const { data: trip } = await this.supabaseService.client
        .from('trips')
        .select('bus_id')
        .eq('id', event.trip_id)
        .single();

      if (trip) {
        await this.supabaseService.client
          .from('buses')
          .update({
            current_location: `(${event.longitude},${event.latitude})`,
            current_speed: event.speed || 0,
            heading: event.heading,
          })
          .eq('id', trip.bus_id);
      }
    }

    return data;
  }

  async list(
    page: number = 1,
    limit: number = 100,
    filters: {
      trip_id?: string;
      event_type?: string;
      from?: string;
      to?: string;
    } = {},
  ) {
    let query = this.supabaseService.client
      .from('trip_events')
      .select('*', { count: 'exact' })
      .order('recorded_at', { ascending: false });

    if (filters.trip_id) query = query.eq('trip_id', filters.trip_id);
    if (filters.event_type) query = query.eq('event_type', filters.event_type);
    if (filters.from) query = query.gte('recorded_at', filters.from);
    if (filters.to) query = query.lte('recorded_at', filters.to);

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query.range(from, to);

    if (error) {
      throw new NotFoundException({
        code: 'QUERY_FAILED',
        message: error.message,
      });
    }

    return {
      data: data || [],
      meta: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  }
}