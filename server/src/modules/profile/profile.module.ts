import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { CacheService } from '../../common/services/caching/cache.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, CacheService],
})
export class ProfileModule {}
