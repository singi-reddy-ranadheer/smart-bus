import { Injectable, Logger } from '@nestjs/common';
import { NotificationChannel, NotificationPayload } from '../interfaces/notification-channel.interface';

@Injectable()
export class SmsChannel implements NotificationChannel {
  private readonly logger = new Logger(SmsChannel.name);

  async send(payload: NotificationPayload): Promise<boolean> {
    // v0.1: Stub for SMS (Twilio to be added)
    this.logger.log(`[SMS] → ${payload.userId}: ${payload.title}`);
    // TODO: Integrate Twilio for real SMS delivery in v0.3
    return true;
  }
}