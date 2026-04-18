
import { Inject, Injectable } from '@nestjs/common';
import { injection_token } from '../../constants/injection.token';
import Redis from 'ioredis';
import {RedisProvider} from "../../providers/redis.provider"
@Injectable()
export class CacheService {
  constructor(
    @Inject(injection_token.REDIS_CONNECTION)
    private readonly redis: Redis,
  ) {}

  async set(key: string, value: any, ttl = 300) {
    if (!key) return;

    await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
  }

  async get<T = any>(key: string): Promise<T | null> {
    if (!key) return null;

    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async del(key: string) {
    if (!key) return;

    await this.redis.del(key);
  }
}