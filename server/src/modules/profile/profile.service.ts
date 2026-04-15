import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { MyLoggerService } from '../logger/logger.service';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { profileTable } from '../../database/schema';
import { injection_token } from '../../common/constants/injection.token';
import { AppException } from '../../common/exceptions/app.exception';
import { ErrorCode } from '../../common/enums/error.code';
import * as schema from '../../database/schema';
import { eq, or } from 'drizzle-orm';
@Injectable()
export class ProfileService {
  constructor(
    @Inject(injection_token.DB_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,

    private readonly logger: MyLoggerService,
  ) {}

  async getUserData(id: string) {
    // console.log("hereerer werwer")

    // no user id
    if (!id || id === '') {
      // Log missing required fields (client error visibility)
      this.logger.warn(`Missing id for user profile`, 'ProfileService');

      throw new AppException(
        'id must for user profile',
        HttpStatus.BAD_REQUEST,
        ErrorCode.MISSING_REQUIRED_FIELD,
      );
    }

    const user = await this.db
        .select()
        .from(profileTable)
        .where(eq(profileTable.id,id));
    
    if (!user || user == null) {
      // Log duplicate email attempt (business validation failure)
      this.logger.warn(`user not found id:${id}`, 'ProfileService');

      throw new AppException(
        'user not found',
        HttpStatus.NOT_FOUND,
        ErrorCode.USER_NOT_FOUND,
      );
    }

    this.logger.log(`User found success: ${id}`,'ProfileService');


    return user;


  }
}
