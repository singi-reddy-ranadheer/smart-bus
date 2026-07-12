import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { NotificationChannel, NotificationPayload } from '../interfaces/notification-channel.interface';

@Injectable()
export class EmailChannel implements NotificationChannel {
  private readonly logger = new Logger(EmailChannel.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });
  }

  async send(payload: NotificationPayload): Promise<boolean> {
    // v0.1: Log to console (no real SMTP send)
    this.logger.log(`[EMAIL] → ${payload.userId}: ${payload.title} | ${payload.body}`);

    if (!process.env.SMTP_HOST) {
      return true; // No SMTP configured, treat as success for dev
    }

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@smartbus.ai',
        to: payload.userId, // In production, map userId → email
        subject: payload.title,
        text: payload.body,
      });
      return true;
    } catch (err: any) {
      this.logger.error(`Email send failed: ${err.message}`);
      return false;
    }
  }
}