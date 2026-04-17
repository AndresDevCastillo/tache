import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  const config = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Seguridad básica
  app.use(helmet());

  // Prefijo global de la API: todas las rutas viven bajo /api/*
  app.setGlobalPrefix('api');

  // CORS: lista blanca por env (CSV). Vacío = solo same-origin.
  const corsRaw = config.get<string>('CORS_ORIGINS', '');
  const corsOrigins = corsRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  app.enableCors({
    origin: corsOrigins.length > 0 ? corsOrigins : false,
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: false,
    maxAge: 86400,
  });

  // Validación global: rechaza propiedades no declaradas en los DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableShutdownHooks();

  const port = config.get<number>('PORT', 3001);
  await app.listen(port, '0.0.0.0');
  logger.log(`🚀 API lista en http://localhost:${port}/api`);
  logger.log(
    corsOrigins.length > 0
      ? `🌐 CORS habilitado para: ${corsOrigins.join(', ')}`
      : `🔒 CORS restringido a same-origin (define CORS_ORIGINS para abrir)`,
  );
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Fatal bootstrap error:', err);
  process.exit(1);
});
