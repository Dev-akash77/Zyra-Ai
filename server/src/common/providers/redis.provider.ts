import { Provider } from '@nestjs/common';
import { injection_token } from '../constants/injection.token';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisConfigTypes } from '../types/redis.type';

export const RedisProvider: Provider = {
  provide: injection_token.REDIS_CONNECTION,

  useFactory: (configService: ConfigService) => {
    const redis = configService.get<RedisConfigTypes>('redis');

    const redisData  = new Redis({
      host: redis?.host,
      port: redis?.port,
      password: redis?.password,
    });
   // !connection established
    redisData.on('connect', () => {
      console.log('Redis connected');
    });

    //! ready to use
    redisData.on('ready', () => {
      console.log('Redis ready to use');
    });

    // ! error handling
    redisData.on('error', (err) => {
      console.error('Redis error:', err.message);
    });

    return redisData;
  },
  inject: [ConfigService], 
};
