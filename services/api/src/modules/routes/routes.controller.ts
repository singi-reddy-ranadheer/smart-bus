import { Controller, Get } from '@nestjs/common';
import { SupabaseService } from '../common/supabase.service';

@Controller('api/v1')
export class RoutesController {
  constructor(private readonly supabase: SupabaseService) {}

  @Get('routes')
  async findAll() {
    const { data, error } = await this.supabase.client
      .from('routes')
      .select('id, name, code, color, distance_km, estimated_duration_minutes')
      .eq('is_active', true)
      .order('name');
    if (error) throw error;
    return data || [];
  }
}