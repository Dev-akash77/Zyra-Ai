import { Global, Module } from '@nestjs/common';
import { MyLoggerService } from '../services/logger/logger.service';
import { GlobalExceptionFilter } from '../filters/global.exception.filter';
import { RedisProvider } from '../providers/redis.provider';
import { CacheService } from '../services/caching/cache.service';

@Global()
@Module({
  providers: [MyLoggerService, GlobalExceptionFilter,RedisProvider,CacheService],
  exports: [MyLoggerService, GlobalExceptionFilter,CacheService,RedisProvider ],
})
export class commonModule {}
