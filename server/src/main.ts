import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global.exception.filter';
import { ResponseInterceptor } from './common/interceptors/response/response.interceptor';
import { MyLoggerService } from './logger/logger.service';
import { RateLimitGuard } from './modules/rate-limit/rate-limit.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // ! Global Guard (apply to nay routes)
  app.useGlobalGuards(app.get(RateLimitGuard));

  //! for logging
  app.useLogger(new MyLoggerService());

  //! for response handler
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ResponseInterceptor(reflector));

  //! for error handler
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
