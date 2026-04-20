import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateUserDto } from './dto/profileUpdate.dto';

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {
        
    }

    @Get('user')
    userData(@Query('id') id: string) {
        return this.profileService.getUserData(id);
    }
    
    @Patch('update/:id')
    updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    ) {
        return this.profileService.update(id, dto);
    }
}
 