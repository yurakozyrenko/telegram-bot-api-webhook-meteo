import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        return errors;
      },
    }),
  );

  const configService = app.get(ConfigService);

  const API_PREFIX = configService.get('API_PREFIX');
  const API_VERSION = configService.get('API_VERSION');
  app.setGlobalPrefix(`${API_PREFIX}${API_VERSION}`);
  const HTTP_PORT = configService.get('HTTP_PORT');

  app.use(helmet());

  await app.listen(HTTP_PORT, () => {
    console.log(`🚀 Server listening ${HTTP_PORT} `);
  });
}
bootstrap();
