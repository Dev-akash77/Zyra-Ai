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
import { commonModule } from './common/modules/common.module';
import { cloudinaryConfig } from './common/config/cloudinary.config';
import { mailConfig } from './common/config/mail.config';
import { NotificationModule } from './modules/notification/notification.module';
import { RmqService } from './common/services/rmq/rmq.service';
import { rmqConfig } from './common/config/rmq.config';
import { AiModule } from './modules/ai/ai.module';
import { AiService } from './modules/ai/ai.service';
import { AiModuleHex } from './modules/ai_hex/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [jwtConfig, redisConfig,cloudinaryConfig,mailConfig,rmqConfig],
    }),
    DatabaseModule,
    AuthModule,
    ProfileModule,
    commonModule,
    RateLimitModule,
    NotificationModule,
    AiModule,
    AiModuleHex
  ],
  controllers: [AppController],
  providers: [AppService, RmqService, AiService],
})
export class AppModule {}
