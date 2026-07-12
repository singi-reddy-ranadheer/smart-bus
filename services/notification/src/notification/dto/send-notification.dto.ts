import { IsString, IsOptional, IsObject, IsIn } from 'class-validator';

export class SendNotificationDto {
  @IsString()
  user_id: string;

  @IsIn(['push', 'sms', 'email', 'in_app'])
  type: 'push' | 'sms' | 'email' | 'in_app';

  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsOptional()
  @IsObject()
  data?: Record<string, any>;
}

export class BroadcastNotificationDto {
  @IsString({ each: true })
  user_ids: string[];

  @IsIn(['push', 'sms', 'email', 'in_app'])
  type: 'push' | 'sms' | 'email' | 'in_app';

  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsOptional()
  @IsObject()
  data?: Record<string, any>;
}