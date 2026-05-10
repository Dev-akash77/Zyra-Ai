import { Inject, Injectable } from '@nestjs/common';
import { injection_token } from '../../constants/injection/injection.token';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
  constructor(
    @Inject(injection_token.REDIS_CONNECTION)
    private readonly redis: Redis,
  ) {}

  // ! SET REDIS KEY FOR REDIS CACHING
  async set(key: string, value: any, ttl = 300) {
    if (!key) return;

    await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
  }

  // ! GET THE DATA THAT STORE IN REDIS CACHE
  async get<T = any>(key: string): Promise<T | null> {
    if (!key) return null;

    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  // ! DELETE THE DATA THAT STORE IN REDIS CACHE
  async del(key: string) {
    if (!key) return;

    await this.redis.del(key);
  }
}
