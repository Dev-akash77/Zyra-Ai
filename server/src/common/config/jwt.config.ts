import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('jwt', () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is missing');
  }
  return {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRE || '15m',
  };
});
