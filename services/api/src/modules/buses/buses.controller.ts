import { Controller, Get } from '@nestjs/common';
import { SupabaseService } from '../common/supabase.service';

@Controller('api/v1')
export class BusesController {
  constructor(private readonly supabase: SupabaseService) {}

  @Get('buses')
  async findAll() {
    const { data, error } = await this.supabase.client
      .from('buses')
      .select('id, registration_number, model, capacity, status, current_route_id, current_latitude, current_longitude, current_speed, last_gps_update')
      .order('registration_number');
    if (error) throw error;
    return data || [];
  }
}