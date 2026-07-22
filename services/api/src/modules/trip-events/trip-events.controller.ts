import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TripEventsService } from './trip-events.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../auth/role.enum';
import {
  IsUUID,
  IsString,
  IsOptional,
  IsNumber,
  IsObject,
  Min,
  Max,
} from 'class-validator';

export class CreateTripEventDto {
  @IsUUID()
  trip_id: string;

  @IsString()
  event_type: string;

  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  speed?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(360)
  heading?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  passenger_count?: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

@ApiTags('trip-events')
@Controller('api/v1/trip-events')
@UseGuards(JwtAuthGuard)
export class TripEventsController {
  constructor(private readonly tripEventsService: TripEventsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.DRIVER, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Record trip event (append-only)' })
  async create(@Body() dto: CreateTripEventDto) {
    return this.tripEventsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Query trip events' })
  async list(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 100,
    @Query('trip_id') tripId?: string,
    @Query('event_type') eventType?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.tripEventsService.list(page, limit, {
      trip_id: tripId,
      event_type: eventType,
      from,
      to,
    });
  }
}