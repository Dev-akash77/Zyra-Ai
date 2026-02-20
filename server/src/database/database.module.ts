import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { injection_token } from '../common/constants/injection.token';
import { connectDatabase } from './connect';

@Global()
@Module({
  providers: [
    {
      provide: injection_token.DB_CONNECTION,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const db_url = configService.getOrThrow<string>('DATABASE_URL');
        return connectDatabase(db_url);
      },
    },
  ],
  exports: [injection_token.DB_CONNECTION],
})
export class DatabaseModule {}
