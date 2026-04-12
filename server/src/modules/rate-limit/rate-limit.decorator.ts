import { SetMetadata } from '@nestjs/common';

//! metadata key
export const RATE_LIMIT_KEY = 'rate_limit';

// ! decorator
export const RateLimit = (config: { limit: number; ttl: number }) =>
  SetMetadata(RATE_LIMIT_KEY, config);
