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
import { CloudinaryService } from '../../common/services/cloudinary/cloudinary.service';

@Injectable()
export class ProfileService {
  constructor(
    @Inject(injection_token.DB_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly logger: MyLoggerService,
    private cacheService: CacheService,
    private cloudinary:CloudinaryService,
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


  // !store the avatar to the db via cloudinary
  async updateAvatar(id:string,file:Express.Multer.File){
    if(!id){
      throw new AppException(
        'id is reequired',
        HttpStatus.BAD_REQUEST,
        ErrorCode.MISSING_REQUIRED_FIELD
      )
    }
    if(!file){
      new AppException(
        'No file provided',
        HttpStatus.BAD_REQUEST,
        ErrorCode.FILE_NOT_FOUND
      )
    }

    //upload to cloudinary
    const upload = await this.cloudinary.uploadFile(file);

    //save to db
    await this.db
      .update(profileTable)
      .set({avatarUrl:upload.secure_url})
      .where(eq(profileTable.id,id))

      //! get the cach data 
    const cachDataAvailable = await this.cacheService.del(id);

    this.logger.log(`Avatar updated for user: ${id}`, 'ProfileService');

    return {
      success:true,
      avatarUrl: upload.secure_url,
    }
  } 
}
