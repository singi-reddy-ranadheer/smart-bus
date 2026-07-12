import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { NotificationPayload, NotificationChannel } from './interfaces/notification-channel.interface';
import { PushChannel } from './channels/push.channel';
import { EmailChannel } from './channels/email.channel';
import { SmsChannel } from './channels/sms.channel';

interface StoredNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  data: Record<string, any> | null;
  is_read: boolean;
  sent_at: string;
  delivered: boolean;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly store: StoredNotification[] = [];
  private channels: Record<string, NotificationChannel>;

  constructor(
    private readonly pushChannel: PushChannel,
    private readonly emailChannel: EmailChannel,
    private readonly smsChannel: SmsChannel,
  ) {
    this.channels = {
      push: pushChannel,
      email: emailChannel,
      sms: smsChannel,
      in_app: { send: async (p) => this.deliverInApp(p) },
    };
  }

  private async deliverInApp(payload: NotificationPayload): Promise<boolean> {
    this.logger.log(`[IN_APP] → ${payload.userId}: ${payload.title}`);
    return true;
  }

  private async sendWithRetry(
    channel: NotificationChannel,
    payload: NotificationPayload,
    maxRetries = 2,
  ): Promise<boolean> {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await channel.send(payload);
        if (result) return true;
      } catch (err: any) {
        this.logger.warn(`Attempt ${attempt + 1} failed: ${err.message}`);
      }
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 100 * Math.pow(2, attempt)));
      }
    }
    return false;
  }

  async send(dto: {
    user_id: string;
    type: string;
    title: string;
    body: string;
    data?: Record<string, any>;
  }): Promise<StoredNotification> {
    const payload: NotificationPayload = {
      userId: dto.user_id,
      type: dto.type as any,
      title: dto.title,
      body: dto.body,
      data: dto.data,
    };

    const channel = this.channels[dto.type] || this.channels.in_app;
    const delivered = await this.sendWithRetry(channel, payload);

    const record: StoredNotification = {
      id: uuidv4(),
      userId: dto.user_id,
      type: dto.type,
      title: dto.title,
      body: dto.body,
      data: dto.data || null,
      is_read: false,
      sent_at: new Date().toISOString(),
      delivered,
    };

    this.store.push(record);
    return record;
  }

  async broadcast(
    userIds: string[],
    dto: { type: string; title: string; body: string; data?: Record<string, any> },
  ): Promise<StoredNotification[]> {
    const results: StoredNotification[] = [];
    for (const userId of userIds) {
      results.push(
        await this.send({ user_id: userId, ...dto }),
      );
    }
    return results;
  }

  async listForUser(userId: string, page = 1, limit = 20) {
    const userNotifs = this.store.filter((n) => n.userId === userId);
    const from = (page - 1) * limit;
    const to = from + limit;
    return {
      data: userNotifs.slice(from, to),
      meta: {
        page,
        limit,
        total: userNotifs.length,
        totalPages: Math.ceil(userNotifs.length / limit),
      },
    };
  }
}