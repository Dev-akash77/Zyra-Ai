import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { CacheService } from '../../common/service/caching/cache.service';
import { RedisProvider } from '../../common/providers/redis.provider';
import { injection_token } from '../../common/constants/injection.token';


@Module({
  controllers: [ProfileController],
  providers: [ProfileService,CacheService, RedisProvider]
})
export class ProfileModule {
}
