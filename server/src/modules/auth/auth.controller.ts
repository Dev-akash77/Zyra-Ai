import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Registration } from './inerface/register.interface';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}
    @Post('register')
    userRegistration(@Body() UserData: Registration) {
        return this.authService.registerUser(UserData);
    }
    

}
