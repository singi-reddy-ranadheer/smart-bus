export interface NotificationPayload {
  userId: string;
  type: 'push' | 'sms' | 'email' | 'in_app';
  title: string;
  body: string;
  data?: Record<string, any>;
}

export interface NotificationChannel {
  send(payload: NotificationPayload): Promise<boolean>;
}