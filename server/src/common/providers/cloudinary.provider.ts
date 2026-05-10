import { Provider } from '@nestjs/common';
import { injection_token } from '../constants/injection/injection.token';
import { ConfigService } from '@nestjs/config';
import { MyLoggerService } from '../services/logger/logger.service';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryConfigTypes } from '../types/cloudinary.type';

export const CloudnirayProvider: Provider = {
  provide: injection_token.CLOUDINARY_CONNECTION,
  inject: [ConfigService, MyLoggerService],

  useFactory: (configService: ConfigService, logger: MyLoggerService) => {
    const config = configService.get<CloudinaryConfigTypes>('cloudinary');

    if (!config) {
      logger.error('Cloudinary config missing', '', 'Cloudinary');
      throw new Error('Cloudinary config missing');
    }
    const cloudinaryData = cloudinary.config({
      cloud_name: config.cloud_name,
      api_key: config.api_key,
      api_secret: config.api_secret,
    });

    logger.log('Cloudinary configured successfully', 'Cloudinary');
    return cloudinaryData;
  },
};
