import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { jwtConfig } from '../../common/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RoleGuard } from '../../common/guards/role.guard';
import { NotificationModule } from '../notification/notification.module';

 
@Module({
  imports: [
    PassportModule,
    NotificationModule,
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfig)],
inject: [jwtConfig.KEY],
      useFactory: (config: ConfigType<typeof jwtConfig>) => ({
        secret: config.secret,
        signOptions: { expiresIn: config.expiresIn as any },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RoleGuard],
})
export class AuthModule {}
