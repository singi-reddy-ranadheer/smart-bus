import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './common/filters';
import { LoggingInterceptor } from './common/interceptors';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get('PORT') || 3001;
  const allowedOrigins = [config.get('FRONTEND_URL'), config.get('ADMIN_URL'), config.get('DRIVER_URL')].filter(Boolean);

  app.use(helmet());
  app.use(cors({ origin: allowedOrigins, credentials: true }));
  app.use(compression());

  // Controllers already declare the 'api/v1' prefix, so no global prefix here.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(port);
  console.log(`🚍 Smart Bus API running on http://localhost:${port}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/docs`);
}
bootstrap();
