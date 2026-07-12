import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { SupabaseService } from '../../database/supabase.service';

@Injectable()
export class BusesService {
  private readonly logger = new Logger(BusesService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async list(page: number = 1, limit: number = 20, status?: string, routeId?: string) {
    let query = this.supabaseService.client
      .from('buses')
      .select('*, current_route:routes(id, name)', { count: 'exact' })
      .is('deleted_at', null);

    if (status) {
      query = query.eq('status', status);
    }
    if (routeId) {
      query = query.eq('current_route_id', routeId);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query.range(from, to).order('bus_number', { ascending: true });

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

  async getById(busId: string) {
    const { data, error } = await this.supabaseService.client
      .from('buses')
      .select('*, current_route:routes(id, name, color)')
      .eq('id', busId)
      .single();

    if (error || !data) {
      throw new NotFoundException({
        code: 'BUS_NOT_FOUND',
        message: 'Bus not found',
      });
    }

    return data;
  }

  async create(create: {
    plate_number: string;
    bus_number: string;
    capacity: number;
    model?: string;
    color?: string;
  }) {
    const { data, error } = await this.supabaseService.client
      .from('buses')
      .insert({
        plate_number: create.plate_number,
        bus_number: create.bus_number,
        capacity: create.capacity,
        model: create.model,
        color: create.color || '#3B82F6',
        status: 'inactive',
      })
      .select('*')
      .single();

    if (error) {
      throw new NotFoundException({
        code: 'CREATE_FAILED',
        message: error.message,
      });
    }

    return data;
  }

  async update(busId: string, update: Record<string, any>) {
    const { data, error } = await this.supabaseService.client
      .from('buses')
      .update({
        ...update,
        updated_at: new Date().toISOString(),
      })
      .eq('id', busId)
      .select('*')
      .single();

    if (error) {
      throw new NotFoundException({
        code: 'BUS_NOT_FOUND',
        message: 'Bus not found',
      });
    }

    return data;
  }

  async remove(busId: string) {
    const { error } = await this.supabaseService.client
      .from('buses')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', busId);

    if (error) {
      throw new NotFoundException({
        code: 'BUS_NOT_FOUND',
        message: 'Bus not found',
      });
    }

    return { message: 'Bus deleted successfully' };
  }
}