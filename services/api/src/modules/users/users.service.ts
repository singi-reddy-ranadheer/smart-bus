import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { SupabaseService } from '../../database/supabase.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async getById(userId: string) {
    const { data, error } = await this.supabaseService.client
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    }

    return data;
  }

  async update(userId: string, update: { name?: string; phone?: string; avatar_url?: string }) {
    const { data, error } = await this.supabaseService.client
      .from('users')
      .update({
        ...update,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select('*')
      .single();

    if (error) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    }

    return data;
  }

  async list(page: number = 1, limit: number = 20, role?: string) {
    let query = this.supabaseService.client
      .from('users')
      .select('*', { count: 'exact' })
      .is('deleted_at', null);

    if (role) {
      query = query.eq('role', role);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query.range(from, to).order('created_at', { ascending: false });

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