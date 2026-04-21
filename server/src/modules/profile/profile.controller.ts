import { UpdateUserDto } from './dto/profileUpdate.dto';
import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
  UseInterceptors,
  Req,
  Body,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UploadedFile } from '@nestjs/common';
import { FileValidationPipe } from '../../common/interceptors/file-upload/uplode.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { success_message } from '../../common/decorators/success-message.decorators';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  //!     GET USER DATA
  @Get('')
  @UseGuards(JwtAuthGuard)
  async userData(@Req() req) {
    return this.profileService.getUserData(req.user.userId);
  }

  //!   UPDATE USER DATA
  @Patch('update')
  @UseGuards(JwtAuthGuard)
  @success_message('Profile Updated Successfully')
  updateUser(@Req() req, @Body() dto: UpdateUserDto) {
    return this.profileService.update(req.user.userId, dto);
  }

  //! UPDATE USER AVATAR
  @Patch('avatar')
  @UseGuards(JwtAuthGuard)
  @success_message('Avatar Update Successfully')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Req() req,
    @UploadedFile(FileValidationPipe) file: Express.Multer.File,
  ) {
    return this.profileService.uploadAvatar(req.user.userId, file);
  }
}
