import { HttpStatus, Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary'
import { AppException } from '../../exceptions/app.exception';
import * as streamifier from 'streamifier';
import { ErrorCode } from '../../enums/error.code';
import { MyLoggerService } from '../logger/logger.service';


@Injectable()
export class CloudinaryService {
    constructor(private readonly logger:MyLoggerService){}
    uploadFile(file: Express.Multer.File): Promise<UploadApiErrorResponse | UploadApiResponse> {
        return new Promise<UploadApiErrorResponse | UploadApiResponse>((resolve, reject) => {
            const uploadStrem = cloudinary.uploader.upload_stream(
                { folder: 'uploads' },
                (error, result) => {
                    if (error) {
                        return reject(
                            new AppException(
                                'File Upload Failed',
                                HttpStatus.INTERNAL_SERVER_ERROR,
                                ErrorCode.FILE_UPLOAD_FAILED,
                            )
                        )
                    }
                    if (!result) {
                        return reject(
                            new AppException(
                                'Upload returned empty response',
                                HttpStatus.INTERNAL_SERVER_ERROR,
                                ErrorCode.FILE_UPLOAD_FAILED
                            )
                        )
                    }
                    resolve(result)
                },
            );
            streamifier.createReadStream(file.buffer).pipe(uploadStrem);
        })
    }
    async deleteFile(id: string,): Promise<void> {
        try {
            if(!id) this.logger.warn('id not present!!');
            
            await cloudinary.uploader.destroy(id);
        } catch (e) {
            throw new AppException(
                'File Deletion failed',
                HttpStatus.INTERNAL_SERVER_ERROR,
                ErrorCode.FILE_UPLOAD_FAILED,
            )
        }
    }
}
