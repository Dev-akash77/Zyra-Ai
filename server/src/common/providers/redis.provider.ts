import { Provider } from '@nestjs/common';
import { injection_token } from '../constants/injection.token';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisConfigTypes } from '../types/redis.type';
import { MyLoggerService } from '../services/logger/logger.service';

export const RedisProvider: Provider = {
  provide: injection_token.REDIS_CONNECTION,
  inject: [ConfigService, MyLoggerService],

  useFactory: (configService: ConfigService, logger: MyLoggerService) => {
    const redis = configService.get<RedisConfigTypes>('redis');

    const redisData = new Redis({
      host: redis?.host,
      port: redis?.port,
      password: redis?.password,
    });
    // !connection established
    redisData.on('connect', () => {
      logger.log('Redis connected', 'redis');
    });

    //! ready to use
    redisData.on('ready', () => {
      logger.log('Redis ready to use', 'redis');
    });

    // ! error handling
    redisData.on('error', (err) => {
      logger.error(`Redis error: ${err.message}`, err.stack, 'Redis');
    });

    return redisData;
  },
};
