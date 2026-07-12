import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { PushChannel } from './channels/push.channel';
import { EmailChannel } from './channels/email.channel';
import { SmsChannel } from './channels/sms.channel';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, PushChannel, EmailChannel, SmsChannel],
  exports: [NotificationService],
})
export class NotificationModule {}