import { Module } from '@nestjs/common';
import { RedisProvider } from '../common/providers/redis.provider';
import { CacheService } from '../common/service/caching/cache.service';

@Module({
  providers: [RedisProvider, CacheService],
  exports: [CacheService],
})
export class RedisModuleModule {}
