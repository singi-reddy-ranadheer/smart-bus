import { Module } from '@nestjs/common';
import { RoutesController } from './routes.controller';
import { RoutesService } from './routes.service';
import { SupabaseService } from '../../database/supabase.service';

@Module({
  controllers: [RoutesController],
  providers: [RoutesService, SupabaseService],
  exports: [RoutesService],
})
export class RoutesModule {}