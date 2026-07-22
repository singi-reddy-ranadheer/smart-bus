import { Module } from '@nestjs/common';
import { StopsController } from './stops.controller';
import { SupabaseService } from '../common/supabase.service';

@Module({
  controllers: [StopsController],
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class StopsModule {}
