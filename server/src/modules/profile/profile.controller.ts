import { Controller, Get, Patch,Param, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {

    }

    @Get('user')
    userData(@Query('id') id: string) {
        return this.profileService.getUserData(id);
    }

    

    @Patch('user/:id/avatar')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FileInterceptor('file', {
            limits: { fileSize: 5 * 1024 * 1024 },
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
                    return cb(new Error('Only image files are allowed'), false);
                }
                cb(null, true);
            },
        }),
    )
    async uploadAvatar(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.profileService.updateAvatar(id, file);
    }


}
