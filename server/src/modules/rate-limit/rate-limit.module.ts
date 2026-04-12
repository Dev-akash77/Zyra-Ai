import { Module } from '@nestjs/common';
import { RateLimitService } from './rate-limit.service';
import { RedisProvider } from '../../common/providers/redis.provider';
import { ConfigModule } from '@nestjs/config';
import { RateLimitGuard } from './rate-limit.guard';

@Module({
  imports: [ConfigModule],
  providers: [RateLimitService, RedisProvider, RateLimitGuard],
  exports: [RateLimitService],
})
export class RateLimitModule {}
