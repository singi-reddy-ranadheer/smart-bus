import { Injectable, Logger } from '@nestjs/common';
import { NotificationChannel, NotificationPayload } from '../interfaces/notification-channel.interface';

@Injectable()
export class PushChannel implements NotificationChannel {
  private readonly logger = new Logger(PushChannel.name);

  async send(payload: NotificationPayload): Promise<boolean> {
    // v0.1: Stub for push notifications (Firebase Admin SDK to be added)
    this.logger.log(`[PUSH] → ${payload.userId}: ${payload.title}`);
    // TODO: Integrate firebase-admin for real push delivery in v0.3
    return true;
  }
}