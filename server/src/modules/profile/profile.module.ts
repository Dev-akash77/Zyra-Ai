import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { CacheService } from '../../common/services/caching/cache.service';
import { CloudinaryService } from '../../common/services/cloudinary/cloudinary.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, CacheService,CloudinaryService],
})
export class ProfileModule {}
