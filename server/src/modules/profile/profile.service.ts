import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { profileTable } from '../../database/schema';
import Redis from 'ioredis';
import { injection_token } from '../../common/constants/injection.token';
import { AppException } from '../../common/exceptions/app.exception';
import { ErrorCode } from '../../common/enums/error.code';
import * as schema from '../../database/schema';
import { eq, or } from 'drizzle-orm';
import { CacheService } from '../../common/services/caching/cache.service';
import { MyLoggerService } from '../../common/services/logger/logger.service';
import { UpdateUserDto } from './dto/profileUpdate.dto';

@Injectable()
export class ProfileService {
  constructor(
    @Inject(injection_token.DB_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly logger: MyLoggerService,
    private cacheService: CacheService
  ) {}

  // ! GET THE USER PROFILE DATA (CACHING || DATABASE)
  async getUserData(id: string) {
    //! no user id
    if (!id || id === '') {
      // Log missing required fields (client error visibility)
      this.logger.warn(`Missing id for user profile`, 'ProfileService');

      throw new AppException(
        'id must for user profile',
        HttpStatus.BAD_REQUEST,
        ErrorCode.MISSING_REQUIRED_FIELD,
      );
    }

    //! get the cach data 
    const cachDataAvailable = await this.cacheService.get(id);
    
    //! when cache data is available then return the cache data 
    if(cachDataAvailable) {
        this.logger.log(`Data found in cache id:${id}`, 'ProfileService');
        return cachDataAvailable;
    }
     //! when cache data is not available then return the raw db data 
    const user = await this.db
        .select()
        .from(profileTable)
        .where(eq(profileTable.id,id));
    
    if (!user || user == null) {
      //! Log duplicate email attempt (business validation failure)
      this.logger.warn(`user not found id:${id}`, 'ProfileService');

      throw new AppException(
        'user not found',
        HttpStatus.NOT_FOUND,
        ErrorCode.USER_NOT_FOUND,
      );
    }

    //! set data in cache
    await this.cacheService.set(id,user);
    this.logger.log(`User found success: ${id}`,'ProfileService');


    return user;
  }


  // ! GET THE USER ID (MUST) AND UPDATED DATA (DELETE AND RESET CAHING)
  async update(id: string, userData: UpdateUserDto) {
    if (!id || id === '') {
      // Log missing required fields (client error visibility)
      this.logger.warn(`Missing id for user profile update`, 'ProfileService');

      throw new AppException(
        'id must for user profile update',
        HttpStatus.BAD_REQUEST,
        ErrorCode.MISSING_REQUIRED_FIELD,
      );
    }


    const existingUser = await this.db    
      .update(profileTable)
      .set(userData)
      .where(eq(profileTable.id, id))
      .returning();

    if (!existingUser || !existingUser.length) {
      // Log missing required fields (client error visibility)
      this.logger.warn(
        `User not found on id:${id} user profile update`,
        'ProfileService',
      );

      throw new AppException(
        'User not found',
        HttpStatus.BAD_REQUEST,
        ErrorCode.USER_NOT_FOUND,
      );
    }

    // delete the cache
    await this.cacheService.del(id);

    // update it
    await this.cacheService.set(id, existingUser);

    return existingUser;
  }
}
