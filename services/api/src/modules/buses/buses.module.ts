import { Module } from '@nestjs/common';
import { BusesController } from './buses.controller';
import { BusesService } from './buses.service';
import { SupabaseService } from '../../database/supabase.service';

@Module({
  controllers: [BusesController],
  providers: [BusesService, SupabaseService],
  exports: [BusesService],
})
export class BusesModule {}