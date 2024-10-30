import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './env/z-env';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(env.PORT || 3333);
}
bootstrap();
