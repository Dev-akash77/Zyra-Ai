import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RateLimitService } from './rate-limit.service';
import { Reflector } from '@nestjs/core';
import { RATE_LIMIT_KEY } from './rate-limit.decorator';
import { RATE_LIMITS } from '../../common/constants/ratelimit.config';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly service: RateLimitService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const handler = context.getHandler();

    // ! User identifier
    const identifier = req.user?.id || req.ip;

    //! unique key
    const route = req.route?.path || req.url;
    const key = `rl:${identifier}:${route}`;

    //! decorator se config read karo
    const config =
      this.reflector.get<{ limit: number; ttl: number }>(
        RATE_LIMIT_KEY,
        handler,
      ) || RATE_LIMITS.DEFAULT; //? fallback default

    // ! Apply limit
    await this.service.limit(key, config.limit, config.ttl);
    return true;
  }
}
