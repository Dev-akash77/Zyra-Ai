import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import * as streamifier from 'streamifier';
import { v2 as cloudinaryLib, UploadApiResponse } from 'cloudinary';

import { injection_token } from '../../constants/injection.token';
import { MyLoggerService } from '../logger/logger.service';
import { AppException } from '../../exceptions/app.exception';
import { ErrorCode } from '../../enums/error.code';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject(injection_token.CLOUDINARY_CONNECTION)
    private readonly cloudinary: typeof cloudinaryLib,
    private readonly logger: MyLoggerService,
  ) {}


  // ! upload
  async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = this.cloudinary.uploader.upload_stream(
        {
          folder: 'Zyra_AI_Avatar',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error || !result) {
            this.logger.error(
              error?.message || 'Upload failed',
              error?.stack,
              'Cloudinary',
            );

            return reject(
              new AppException(
                'File upload failed',
                HttpStatus.INTERNAL_SERVER_ERROR,
                ErrorCode.FILE_UPLOAD_FAILED,
              ),
            );
          }

          this.logger.log(`Uploaded: ${result.public_id}`, 'Cloudinary');
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(stream);
    });
  }


  // ! delete from cloudinary
  async deleteFile(publicId: string): Promise<void> {
    const result = await this.cloudinary.uploader.destroy(publicId);

    if (result.result !== 'ok' && result.result !== 'not found') {
      throw new AppException(
        'Delete failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
        ErrorCode.FILE_DELETE_FAILED,
      );
    }

    this.logger.log(`Deleted: ${publicId}`, 'Cloudinary');
  }
}