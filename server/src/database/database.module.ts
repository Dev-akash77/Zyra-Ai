import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { injection_token } from '../common/constants/injection.token';
import { connectDatabase } from './connect';
import { MyLoggerService } from '../modules/logger/logger.service';

@Global()
@Module({
  providers: [
    {
      provide: injection_token.DB_CONNECTION,
      inject: [ConfigService,MyLoggerService],
      useFactory: (configService: ConfigService, logger: MyLoggerService,) => {
        const db_url = configService.getOrThrow<string>('DATABASE_URL');
        return connectDatabase(db_url,logger);
      },
    },
  ],
  exports: [injection_token.DB_CONNECTION],
})
export class DatabaseModule {}
