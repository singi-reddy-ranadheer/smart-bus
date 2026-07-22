import { Injectable, NestInterceptor, ExecutionContext, CallHandler, StreamableFile } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    console.log(`${method} ${url}`);
    const start = Date.now();
    return next.handle().pipe(
      tap(() => console.log(`${method} ${url} - ${Date.now() - start}ms`)),
    );
  }
}