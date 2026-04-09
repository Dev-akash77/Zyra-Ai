import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { success_message } from '../../common/decorators/success-message.decorators';
import { AuthGuard } from '../../guards/auth/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ! Register Port
  @Post('register')
  @UseGuards(AuthGuard) // use guard for authorization jsut for testing it work or not 
  @success_message('User registered successfully')
  userRegistration(@Body() dto: RegisterDto) {
    return this.authService.registerUser(dto);
  }

  // ! Login Port
  @Post('login')
  @success_message('login successfully')
  userLogin(@Body() dto: LoginDto) {
    return this.authService.loginUser(dto);  
  }
}
