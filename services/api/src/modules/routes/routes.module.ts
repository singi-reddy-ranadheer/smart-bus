import { Module } from '@nestjs/common';
import { RoutesController } from './routes.controller';
import { SupabaseService } from '../common/supabase.service';

@Module({
  controllers: [RoutesController],
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class RoutesModule {}
