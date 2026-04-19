import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { jwtConfig } from './common/config/jwt.config';
import { redisConfig } from './common/config/redis.config';
import { RateLimitModule } from './modules/rate-limit/rate-limit.module';
import { RedisModuleModule } from './redis-module/redis-module.module';
import { commonModule } from './common/common.module';

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
    commonModule,
    RateLimitModule,
    RedisModuleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
