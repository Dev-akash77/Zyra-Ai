import { Global, Module } from '@nestjs/common';
import { MyLoggerService } from '../services/logger/logger.service';
import { GlobalExceptionFilter } from '../filters/global.exception.filter';
import { RedisProvider } from '../providers/redis.provider';
import { CacheService } from '../services/caching/cache.service';
import { CloudnirayProvider } from '../providers/cloudinary.provider';

@Global()
@Module({
  providers: [MyLoggerService, GlobalExceptionFilter,RedisProvider,CacheService,CloudnirayProvider],
  exports: [MyLoggerService, GlobalExceptionFilter,CacheService,RedisProvider,CloudnirayProvider],
})
export class commonModule {}
