import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../guards/roles/roles.guard';
import { Roles } from '../guards/roles/role.decorator';
import { Role } from '../guards/roles/role.enum';

@Controller('user-role')
export class UserRoleController {
    @Get('admin-data')
    @UseGuards(RolesGuard)  //"Security guard checking ID 🧑‍✈️"
    @Roles(Role.User) //Rule written on the door 🚪
    getAdminData() {
        return {message: 'only admin can access'}
    }
    @Get('user-data')
    getUserData() {
        return {message: 'anyone can access'}
    }
}
