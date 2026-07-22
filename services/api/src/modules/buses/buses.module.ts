import { Module } from '@nestjs/common';
import { BusesController } from './buses.controller';
import { SupabaseService } from '../common/supabase.service';

@Module({
  controllers: [BusesController],
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class BusesModule {}
