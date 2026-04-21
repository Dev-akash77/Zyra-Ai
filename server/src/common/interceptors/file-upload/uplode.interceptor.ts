import {
  PipeTransform,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {

  transform(file: Express.Multer.File) {
    // ! if there is no file then error
    if (!file) {
      throw new BadRequestException('File is required');
    }

    //! Defined Allowed MIME Types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    // ! Check File type validation
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only image files allowed');
    }

    //!  Max file size define (2MB)
    //! 1MB = 1024 * 1024 bytes
    const maxSize = 2 * 1024 * 1024;

    //! File size validation
    if (file.size > maxSize) {
      throw new BadRequestException('Max file size is 2MB');
    }

    return file;
  }
}
