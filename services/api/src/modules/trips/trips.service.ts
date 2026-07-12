import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { SupabaseService } from '../../database/supabase.service';

@Injectable()
export class TripsService {
  private readonly logger = new Logger(TripsService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async list(
    page: number = 1,
    limit: number = 20,
    filters: {
      status?: string;
      bus_id?: string;
      driver_id?: string;
      route_id?: string;
    } = {},
  ) {
    let query = this.supabaseService.client
      .from('trips')
      .select('*, bus:buses(id, bus_number, capacity), route:routes(id, name, color)', { count: 'exact' });

    if (filters.status) query = query.eq('status', filters.status);
    if (filters.bus_id) query = query.eq('bus_id', filters.bus_id);
    if (filters.driver_id) query = query.eq('driver_id', filters.driver_id);
    if (filters.route_id) query = query.eq('route_id', filters.route_id);

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .range(from, to)
      .order('created_at', { ascending: false });

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

  async getById(tripId: string) {
    const { data, error } = await this.supabaseService.client
      .from('trips')
      .select('*, bus:buses(id, bus_number), route:routes(id, name, color), driver:drivers(id), events:trip_events(*)')
      .eq('id', tripId)
      .single();

    if (error || !data) {
      throw new NotFoundException({
        code: 'TRIP_NOT_FOUND',
        message: 'Trip not found',
      });
    }

    return data;
  }

  async create(create: { bus_id: string; route_id: string }, driverId?: string) {
    // Verify bus exists and is active
    const { data: bus } = await this.supabaseService.client
      .from('buses')
      .select('id, current_route_id')
      .eq('id', create.bus_id)
      .single();

    if (!bus) {
      throw new NotFoundException({
        code: 'BUS_NOT_FOUND',
        message: 'Bus not found',
      });
    }

    const { data, error } = await this.supabaseService.client
      .from('trips')
      .insert({
        bus_id: create.bus_id,
        route_id: create.route_id,
        driver_id: driverId,
        status: 'active',
        start_time: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (error) {
      throw new NotFoundException({
        code: 'CREATE_FAILED',
        message: error.message,
      });
    }

    // Update bus status to active
    await this.supabaseService.client
      .from('buses')
      .update({ status: 'active' })
      .eq('id', create.bus_id);

    return data;
  }

  async update(tripId: string, update: { status?: string; passenger_count?: number; notes?: string }) {
    const patch: Record<string, any> = { ...update };

    if (update.status === 'completed') {
      patch.end_time = new Date().toISOString();
    }

    const { data, error } = await this.supabaseService.client
      .from('trips')
      .update(patch)
      .eq('id', tripId)
      .select('*')
      .single();

    if (error) {
      throw new NotFoundException({
        code: 'TRIP_NOT_FOUND',
        message: 'Trip not found',
      });
    }

    // If completed, set bus back to inactive
    if (update.status === 'completed') {
      const { data: trip } = await this.supabaseService.client
        .from('trips')
        .select('bus_id')
        .eq('id', tripId)
        .single();

      if (trip) {
        await this.supabaseService.client
          .from('buses')
          .update({ status: 'inactive' })
          .eq('id', trip.bus_id);
      }
    }

    return data;
  }
}