import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { SupabaseService } from '../../database/supabase.service';

@Injectable()
export class RoutesService {
  private readonly logger = new Logger(RoutesService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async list(page: number = 1, limit: number = 20, status?: string) {
    let query = this.supabaseService.client
      .from('routes')
      .select('*, stops:route_stops(*, stop:stops(*))', { count: 'exact' })
      .is('deleted_at', null);

    if (status) {
      query = query.eq('status', status);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query.range(from, to).order('name', { ascending: true });

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

  async getById(routeId: string) {
    const { data, error } = await this.supabaseService.client
      .from('routes')
      .select('*, stops:route_stops(*, stop:stops(*))')
      .eq('id', routeId)
      .single();

    if (error || !data) {
      throw new NotFoundException({
        code: 'ROUTE_NOT_FOUND',
        message: 'Route not found',
      });
    }

    return data;
  }

  async create(create: {
    name: string;
    color: string;
    total_distance?: number;
    estimated_duration?: number;
    stops: { stop_id: string; order: number }[];
  }) {
    const { data: route, error } = await this.supabaseService.client
      .from('routes')
      .insert({
        name: create.name,
        color: create.color,
        total_distance: create.total_distance,
        estimated_duration: create.estimated_duration,
        status: 'active',
      })
      .select('*')
      .single();

    if (error) {
      throw new NotFoundException({
        code: 'CREATE_FAILED',
        message: error.message,
      });
    }

    // Insert route stops
    if (create.stops?.length) {
      const stopRows = create.stops.map((s) => ({
        route_id: route.id,
        stop_id: s.stop_id,
        stop_order: s.order,
      }));

      const { error: stopError } = await this.supabaseService.client
        .from('route_stops')
        .insert(stopRows);

      if (stopError) {
        this.logger.warn(`Failed to insert route stops: ${stopError.message}`);
      }
    }

    return this.getById(route.id);
  }

  async update(routeId: string, update: Record<string, any>) {
    const { data, error } = await this.supabaseService.client
      .from('routes')
      .update({
        ...update,
        updated_at: new Date().toISOString(),
      })
      .eq('id', routeId)
      .select('*')
      .single();

    if (error) {
      throw new NotFoundException({
        code: 'ROUTE_NOT_FOUND',
        message: 'Route not found',
      });
    }

    return data;
  }

  async remove(routeId: string) {
    const { error } = await this.supabaseService.client
      .from('routes')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', routeId);

    if (error) {
      throw new NotFoundException({
        code: 'ROUTE_NOT_FOUND',
        message: 'Route not found',
      });
    }

    return { message: 'Route deleted successfully' };
  }
}