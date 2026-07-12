import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BusesModule } from './modules/buses/buses.module';
import { RoutesModule } from './modules/routes/routes.module';
import { StopsModule } from './modules/stops/stops.module';
import { TripsModule } from './modules/trips/trips.module';
import { TripEventsModule } from './modules/trip-events/trip-events.module';
import { TrackingGateway } from './websocket/tracking.gateway';
import { SupabaseService } from './database/supabase.service';

@Module({
  imports: [
    HealthModule,
    AuthModule,
    UsersModule,
    BusesModule,
    RoutesModule,
    StopsModule,
    TripsModule,
    TripEventsModule,
  ],
  controllers: [],
  providers: [SupabaseService, TrackingGateway],
  exports: [SupabaseService],
})
export class AppModule {}