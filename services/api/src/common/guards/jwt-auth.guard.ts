import { Injectable, ExecutionContext, UnauthorizedException, CanActivate } from '@nestjs/common';
import { SupabaseService } from '../../database/supabase.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Missing or invalid token',
      });
    }

    try {
      const { data, error } = await this.supabaseService.client.auth.getUser(token);
      if (error || !data.user) {
        throw new UnauthorizedException({
          code: 'UNAUTHORIZED',
          message: 'Invalid or expired token',
        });
      }
      request.user = {
        id: data.user.id,
        email: data.user.email,
        role: data.user.app_metadata?.role || 'passenger',
        user_metadata: data.user.user_metadata,
      };
      return true;
    } catch (err) {
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Token validation failed',
      });
    }
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers?.authorization;
    if (!authHeader) return null;
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}