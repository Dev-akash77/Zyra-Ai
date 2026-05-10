import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { injection_token } from '../../common/constants/injection/injection.token';
import Redis from 'ioredis';
import { AppException } from '../../common/exceptions/app.exception';
import { ErrorCode } from '../../common/enums/error.code';

@Injectable()
export class RateLimitService {
  constructor(
    @Inject(injection_token.REDIS_CONNECTION) private readonly redis: Redis,
  ) {}

  // ! Rate Limit
  async limit(key: string, limit: number, ttl: number) {
    const multi = this.redis.multi();
    multi.incr(key);
    multi.ttl(key);

    const result = await multi.exec();
    const count = result?.[0][1] as number;
    let timeLeft = result?.[1][1] as number;

    if (count === 1) {
      await this.redis.expire(key, ttl);
      timeLeft = ttl;
    }
 
    if (count > limit) {
      throw new AppException(
        'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS,
        ErrorCode.RATE_LIMIT_EXCEEDED,
      );
    }

    return { count, timeLeft };
  }
}
