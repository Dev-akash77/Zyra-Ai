import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { profileTable } from '../../database/schema';
import { injection_token } from '../../common/constants/injection.token';
import { AppException } from '../../common/exceptions/app.exception';
import { ErrorCode } from '../../common/enums/error.code';
import * as schema from '../../database/schema';
import { eq } from 'drizzle-orm';
import { CacheService } from '../../common/services/caching/cache.service';
import { MyLoggerService } from '../../common/services/logger/logger.service';
import { CloudinaryService } from '../../common/services/cloudinary/cloudinary.service';
import { UpdateUserDto } from './dto/profileUpdate.dto';

@Injectable()
export class ProfileService {
  constructor(
    @Inject(injection_token.DB_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly logger: MyLoggerService,
    private readonly cacheService: CacheService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  // ! GET THE USER PROFILE DATA (CACHING || DATABASE)
  async getUserData(id: string) {
    //! no user id
    if (!id || id === '') {
      //! Log missing required fields (client error visibility)
      this.logger.warn(`Missing id for user profile`, 'ProfileService');

      throw new AppException(
        'id must for user profile',
        HttpStatus.BAD_REQUEST,
        ErrorCode.MISSING_REQUIRED_FIELD,
      );
    }

    //! get the cach data
    const cachDataAvailable = await this.cacheService.get(`profile:${id}`);

    //! when cache data is available then return the cache data
    if (cachDataAvailable) {
      this.logger.log(`Data found in cache id:${id}`, 'ProfileService');
      return cachDataAvailable;
    }
    //! when cache data is not available then return the raw db data
    const user = await this.db
      .select()
      .from(profileTable)
      .where(eq(profileTable.registerId, id));

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
    await this.cacheService.set(`profile:${id}`, user);
    this.logger.log(`User found success: ${id}`, 'ProfileService');

    return user;
  }

  // ! STORE THE IMAGE TO THE DB VIA CLOUDINARY
  async uploadAvatar(userId: string, file: Express.Multer.File) {
    if (!userId) {
      throw new AppException(
        'User id is reequired',
        HttpStatus.BAD_REQUEST,
        ErrorCode.MISSING_REQUIRED_FIELD,
      );
    }
    if (!file) {
      throw new AppException(
        'File is required',
        HttpStatus.BAD_REQUEST,
        ErrorCode.FILE_NOT_FOUND,
      );
    }

    const result = await this.db
      .select()
      .from(profileTable)
      .where(eq(profileTable.registerId, userId))
      .limit(1);
    const user = result[0];

    //! If User not Found
    if (!user) {
      throw new AppException(
        'User not found',
        HttpStatus.NOT_FOUND,
        ErrorCode.USER_NOT_FOUND,
      );
    }

    //! Delete old avatar (if exists)
    if (user.avatarPublicId) {
      try {
        await this.cloudinary.deleteFile(user.avatarPublicId);
        this.logger.log(
          `Old avatar deleted → ${user.avatarPublicId}`,
          'Cloudinary',
        );
      } catch (err) {
        //! Don't block flow if delete fails
        this.logger.warn(
          `Failed to delete old avatar → ${user.avatarPublicId}`,
          'Cloudinary',
        );
      }
    }

    // ! Upload the avatar in cloudinary
    const upload = await this.cloudinary.uploadFile(file);

    // ! Store In DB
    await this.db
      .update(profileTable)
      .set({
        avatarUrl: upload.secure_url,
        avatarPublicId: upload.public_id,
      })
      .where(eq(profileTable.registerId, userId));

    // ! Delete caching Service
    await this.cacheService.del(`profile:${userId}`);

    this.logger.log(`Avatar updated: ${userId}`, 'ProfileService');

    return {
      success: true,
      avatarUrl: upload.secure_url,
    };
  }
 
  //! UPDATE USER DATA
  async update(id: string, userData: UpdateUserDto) {
    if (!id) {
      this.logger.warn(`Missing id for user profile update`, 'ProfileService');

      throw new AppException(
        'id must for user profile update',
        HttpStatus.BAD_REQUEST,
        ErrorCode.MISSING_REQUIRED_FIELD,
      );
    }

    //! update DB
    const result = await this.db
      .update(profileTable)
      .set({
        ...userData,
        updatedAt: new Date(),
      })
      .where(eq(profileTable.registerId, id))
      .returning();

    const updatedUser = result[0];

    //! user not found
    if (!updatedUser) {
      this.logger.warn(
        `User not found on id:${id} profile update`,
        'ProfileService',
      );

      throw new AppException(
        'User not found',
        HttpStatus.NOT_FOUND,
        ErrorCode.USER_NOT_FOUND,
      );
    }

    // ! cache removed
    await this.cacheService.del(`profile:${id}`);
    //! update cache
    await this.cacheService.set(`profile:${id}`, updatedUser);

    this.logger.log(`Profile updated: ${id}`, 'ProfileService');

    //! return clean response
    return {
      data: updatedUser,
    };
  }
}
