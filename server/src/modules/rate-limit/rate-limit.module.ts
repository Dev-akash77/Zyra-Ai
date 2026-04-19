import { Module } from '@nestjs/common';
import { RateLimitService } from './rate-limit.service';
import { ConfigModule } from '@nestjs/config';
import { RateLimitGuard } from './rate-limit.guard';

@Module({
  imports: [ConfigModule],
  providers: [RateLimitService, RateLimitGuard],
  exports: [RateLimitService],
})
export class RateLimitModule {}
