import { Global, Module } from '@nestjs/common';
import { MyLoggerService } from './services/logger/logger.service';
import { GlobalExceptionFilter } from './filters/global.exception.filter';

@Global()
@Module({
  providers: [MyLoggerService, GlobalExceptionFilter],
  exports: [MyLoggerService, GlobalExceptionFilter],
})
export class commonModule {}
