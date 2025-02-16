import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { instance } from './logger/winston.logger';
import { setupSwagger } from './swagger-config';
import { HttpExceptionFilter } from './common/validation/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: instance,
    }),
  });
  app.enableCors({
    origin: true,
    credentials: true,
    preflightContinue: false,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  setupSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
  Logger.log(`Application is running on: ${await app.getUrl()}`);
}
void bootstrap();
