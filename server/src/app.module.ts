import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { jwtConfig } from './common/config/jwt.config';
import { LoggerModule } from './logger/logger.module';
import { redisConfig } from './common/config/redis.config';
import { RateLimitModule } from './modules/rate-limit/rate-limit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [jwtConfig, redisConfig],
    }),
    DatabaseModule,
    AuthModule,
    ProfileModule,
    LoggerModule,
    RateLimitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
