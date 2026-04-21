import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateUserDto } from './dto/profileUpdate.dto';
import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UploadedFile } from '@nestjs/common';
import { FileValidationPipe } from '../../common/interceptors/file-upload/uplode.interceptor';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
//     GET USER DATA
    @Get('')
  @UseGuards(JwtAuthGuard)
  async userData(@Req() req) {
    return this.profileService.getUserData(req.user.userId);
  }
  
//   UPDATE USER DATA
    @Patch('update/:id')
    updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    ) {
        return this.profileService.update(id, dto);
    }
  
// UPDATE USER AVATAR 
  @Patch('avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Req() req,
    @UploadedFile(FileValidationPipe) file: Express.Multer.File,
  ) {
    return this.profileService.uploadAvatar(req.user.userId, file);
  }
}
