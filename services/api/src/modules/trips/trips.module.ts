import { Module } from '@nestjs/common';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { SupabaseService } from '../../database/supabase.service';

@Module({
  controllers: [TripsController],
  providers: [TripsService, SupabaseService],
  exports: [TripsService],
})
export class TripsModule {}