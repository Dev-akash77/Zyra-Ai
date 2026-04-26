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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [jwtConfig, redisConfig,cloudinaryConfig,mailConfig],
    }),
    DatabaseModule,
    AuthModule,
    ProfileModule,
    commonModule,
    RateLimitModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
