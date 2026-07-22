import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService implements OnModuleInit, OnModuleDestroy {
  public client: SupabaseClient;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const url = this.configService.get<string>('SUPABASE_URL');
    const key = this.configService.get<string>('SUPABASE_ANON_KEY');
    if (!url || !key) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
    }
    this.client = createClient(url, key);
  }

  onModuleDestroy() {
    // Supabase client does not require explicit cleanup
  }
}