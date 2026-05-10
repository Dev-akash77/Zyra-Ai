import { Global, Module } from '@nestjs/common';
import { MyLoggerService } from '../services/logger/logger.service';
import { GlobalExceptionFilter } from '../filters/global.exception.filter';
import { RedisProvider } from '../providers/redis.provider';
import { CacheService } from '../services/caching/cache.service';
import { CloudnirayProvider } from '../providers/cloudinary.provider';
import { RmqProvider } from '../providers/rmq.provider';
import { RmqService } from '../services/rmq/rmq.service';

@Global()
@Module({
  providers: [
    MyLoggerService,
    GlobalExceptionFilter,
    RedisProvider,
    CacheService,
    CloudnirayProvider,
    RmqProvider,
    RmqService,
  ],
  exports: [
    MyLoggerService,
    GlobalExceptionFilter,
    CacheService,
    RedisProvider,
    CloudnirayProvider,
    RmqProvider,
    RmqService,
  ],
})
export class commonModule {}
