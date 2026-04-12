import { RateLimitGuard } from './rate-limit.guard';

describe('RateLimitGuard', () => {
  it('should be defined', () => {
    expect(new RateLimitGuard()).toBeDefined();
  });
});
