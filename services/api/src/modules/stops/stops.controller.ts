import { Controller, Get } from '@nestjs/common';
import { SupabaseService } from '../common/supabase.service';

@Controller('api/v1')
export class StopsController {
  constructor(private readonly supabase: SupabaseService) {}

  @Get('stops')
  async findAll() {
    const { data, error } = await this.supabase.client
      .from('stops')
      .select('id, name, latitude, longitude, code');
    if (error) throw error;
    return data || [];
  }
}