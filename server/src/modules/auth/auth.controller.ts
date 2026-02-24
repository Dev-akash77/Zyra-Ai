import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}
    @Post('register')
    userRegistration(@Body() UserData: RegisterDto) {
        return this.authService.registerUser(UserData);
    }
    

}
