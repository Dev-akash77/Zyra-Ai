export const RATE_LIMITS = {
  DEFAULT: { limit: 100, ttl: 60 },
  LOGIN: { limit: 5, ttl: 60 },
  STRICT: { limit: 3, ttl: 60 },
  BURST: { limit: 10, ttl: 10 },
};
