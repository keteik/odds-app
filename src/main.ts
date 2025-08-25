import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvSchema } from './config/env.config';
import { ConsoleLogService } from './log/services/console-log.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      json: true,
      colors: true,
    }),
  });

  const configService = app.get(ConfigService<EnvSchema, true>);
  const consoleLogService = app.get(ConsoleLogService);
  const APP_PORT = configService.get('APP_PORT', { infer: true });

  await app.listen(APP_PORT);
  consoleLogService.log(`Application is running on: http://localhost:${APP_PORT}`);
}

void bootstrap();
