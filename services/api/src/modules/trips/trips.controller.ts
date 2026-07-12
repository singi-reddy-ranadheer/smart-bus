import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TripsService } from './trips.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../auth/role.enum';
import { IsUUID, IsOptional, IsString } from 'class-validator';

export class CreateTripDto {
  @IsUUID()
  bus_id: string;

  @IsUUID()
  route_id: string;
}

export class UpdateTripDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  passenger_count?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

@ApiTags('trips')
@Controller('trips')
@UseGuards(JwtAuthGuard)
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get()
  @ApiOperation({ summary: 'List trips' })
  async list(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('status') status?: string,
    @Query('bus_id') busId?: string,
    @Query('driver_id') driverId?: string,
    @Query('route_id') routeId?: string,
  ) {
    return this.tripsService.list(page, limit, { status, bus_id: busId, driver_id: driverId, route_id: routeId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get trip by ID' })
  async getById(@Param('id') id: string) {
    return this.tripsService.getById(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.DRIVER, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Start trip (Driver)' })
  async create(@Body() dto: CreateTripDto, @CurrentUser() user: any) {
    return this.tripsService.create(dto, user?.id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.DRIVER, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update trip status (Driver)' })
  async update(@Param('id') id: string, @Body() dto: UpdateTripDto) {
    return this.tripsService.update(id, dto);
  }
}