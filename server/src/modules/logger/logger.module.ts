import { Module, Global } from '@nestjs/common';
import { MyLoggerService } from './logger.service';
import { GlobalExceptionFilter } from '../../common/filters/global.exception.filter';

@Global()
@Module({
  providers: [MyLoggerService,GlobalExceptionFilter],
  exports: [MyLoggerService,GlobalExceptionFilter],
})
export class LoggerModule {}
