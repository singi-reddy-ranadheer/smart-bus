import { Module } from '@nestjs/common';
import { StopsController } from './stops.controller';
import { StopsService } from './stops.service';
import { SupabaseService } from '../../database/supabase.service';

@Module({
  controllers: [StopsController],
  providers: [StopsService, SupabaseService],
  exports: [StopsService],
})
export class StopsModule {}