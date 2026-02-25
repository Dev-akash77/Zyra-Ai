import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import type {
  LoignInterface,
  Registration,
} from './inerface/register.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ! Register Port
  @Post('register')
  userRegistration(@Body() UserData: Registration) {
    return this.authService.registerUser(UserData);
  }

  // ! Login Port
  @Post('login')
  userLogin(@Body() UserData: LoignInterface) {
    return this.authService.loginUser(UserData);
  }
}
