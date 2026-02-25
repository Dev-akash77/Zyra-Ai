import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { jwtConfig } from '../../common/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
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
  providers: [AuthService],
})
export class AuthModule {}
