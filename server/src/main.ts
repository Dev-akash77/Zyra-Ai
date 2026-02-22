import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config'
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 5000);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,
      forbidNonWhitelisted:true,
      transform:true
    })
  );

  app.useGlobalFilters(new GlobalExceptionFilter());





}
bootstrap();
 