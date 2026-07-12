import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { SupabaseService } from '../../database/supabase.service';

@Injectable()
export class StopsService {
  private readonly logger = new Logger(StopsService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async list(page: number = 1, limit: number = 50) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await this.supabaseService.client
      .from('stops')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .range(from, to)
      .order('name', { ascending: true });

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

  async getById(stopId: string) {
    const { data, error } = await this.supabaseService.client
      .from('stops')
      .select('*')
      .eq('id', stopId)
      .single();

    if (error || !data) {
      throw new NotFoundException({
        code: 'STOP_NOT_FOUND',
        message: 'Stop not found',
      });
    }

    return data;
  }

  async create(create: {
    name: string;
    latitude: number;
    longitude: number;
    landmark?: string;
    is_terminal?: boolean;
  }) {
    const { data, error } = await this.supabaseService.client
      .from('stops')
      .insert({
        name: create.name,
        latitude: create.latitude,
        longitude: create.longitude,
        landmark: create.landmark,
        is_terminal: create.is_terminal || false,
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

  async update(stopId: string, update: Record<string, any>) {
    const { data, error } = await this.supabaseService.client
      .from('stops')
      .update({ ...update, updated_at: new Date().toISOString() })
      .eq('id', stopId)
      .select('*')
      .single();

    if (error) {
      throw new NotFoundException({
        code: 'STOP_NOT_FOUND',
        message: 'Stop not found',
      });
    }

    return data;
  }

  async remove(stopId: string) {
    const { error } = await this.supabaseService.client
      .from('stops')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', stopId);

    if (error) {
      throw new NotFoundException({
        code: 'STOP_NOT_FOUND',
        message: 'Stop not found',
      });
    }

    return { message: 'Stop deleted successfully' };
  }
}