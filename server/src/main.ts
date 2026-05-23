import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global.exception.filter';
import { ResponseInterceptor } from './common/interceptors/response/response.interceptor';
import { MyLoggerService } from './common/services/logger/logger.service';
import { RateLimitGuard } from './modules/rate-limit/rate-limit.guard';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

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
  const logger = app.get(MyLoggerService);
  app.useLogger(logger);

  //! for response handler
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ResponseInterceptor(reflector));

  //! for error handler
  app.useGlobalFilters(app.get(GlobalExceptionFilter));

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URI!],
      queue: 'mail_queue',
      queueOptions: {
        durable: true,
      },
      noAck: false, 
    },
  });

  await app.startAllMicroservices();

  logger.log('RabbitMQ consumer started', 'RMQ');
  await app.listen(process.env.PORT ?? 5000);
  logger.log(`Server running on port ${process.env.PORT ?? 5000}`, 'Bootstrap');
}
bootstrap();
