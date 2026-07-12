import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { SupabaseService } from '../../database/supabase.service';

export interface AuthResult {
  user: any;
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: string;
  };
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async register(email: string, password: string, name: string, phone?: string) {
    const { data, error } = await this.supabaseService.client.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone, role: 'passenger' },
      },
    });

    if (error) {
      throw new UnauthorizedException({
        code: 'REGISTRATION_FAILED',
        message: error.message,
      });
    }

    return this.formatResult(data);
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const { data, error } = await this.supabaseService.client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new UnauthorizedException({
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
      });
    }

    return this.formatResult(data);
  }

  async logout(token: string): Promise<void> {
    const { error } = await this.supabaseService.client.auth.signOut();
    if (error) {
      this.logger.warn(`Logout error: ${error.message}`);
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResult> {
    const { data, error } = await this.supabaseService.client.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error) {
      throw new UnauthorizedException({
        code: 'TOKEN_REFRESH_FAILED',
        message: error.message,
      });
    }

    return this.formatResult(data);
  }

  private formatResult(data: any): AuthResult {
    return {
      user: data.user,
      session: {
        access_token: data.session?.access_token || '',
        refresh_token: data.session?.refresh_token || '',
        expires_at: data.session?.expires_at
          ? new Date(data.session.expires_at * 1000).toISOString()
          : '',
      },
    };
  }
}