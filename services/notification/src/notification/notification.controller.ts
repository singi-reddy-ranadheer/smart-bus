import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { SendNotificationDto, BroadcastNotificationDto } from './dto/send-notification.dto';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  @ApiOperation({ summary: 'Send a notification to a user' })
  async send(@Body() dto: SendNotificationDto) {
    return this.notificationService.send(dto);
  }

  @Post('broadcast')
  @ApiOperation({ summary: 'Broadcast notification to multiple users' })
  async broadcast(@Body() dto: BroadcastNotificationDto) {
    return this.notificationService.broadcast(dto.user_ids, dto);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get notifications for a user' })
  async listForUser(
    @Param('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.notificationService.listForUser(userId, page, limit);
  }
}