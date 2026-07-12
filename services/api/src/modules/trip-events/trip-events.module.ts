import { Module } from '@nestjs/common';
import { TripEventsController } from './trip-events.controller';
import { TripEventsService } from './trip-events.service';
import { SupabaseService } from '../../database/supabase.service';

@Module({
  controllers: [TripEventsController],
  providers: [TripEventsService, SupabaseService],
  exports: [TripEventsService],
})
export class TripEventsModule {}