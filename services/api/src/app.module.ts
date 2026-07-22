import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { BusesModule } from './modules/buses/buses.module';
import { StopsModule } from './modules/stops/stops.module';
import { RoutesModule } from './modules/routes/routes.module';
import { TripsModule } from './modules/trips/trips.module';
import { TripEventsModule } from './modules/trip-events/trip-events.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    BusesModule,
    StopsModule,
    RoutesModule,
    TripsModule,
    TripEventsModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}