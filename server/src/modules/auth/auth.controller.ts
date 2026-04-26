import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { success_message } from '../../common/decorators/success-message.decorators';
import { RateLimit } from '../rate-limit/rate-limit.decorator';
import { RATE_LIMITS } from './../../common/constants/ratelimit.config';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ! Register Port
  @Post('register')
  @success_message('User registered successfully')
  userRegistration(@Body() dto: RegisterDto) {
    return this.authService.registerUser(dto);
  }

  // ! Login Port
  @Post('login')
  @RateLimit(RATE_LIMITS.LOGIN)
  @success_message('login successfully')
  userLogin(@Body() dto: LoginDto) {
    return this.authService.loginUser(dto);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(@Req() req) {
  //   return req.user;
  // }

  // @Get('admin')
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Roles(Role.ADMIN)
  // createUser() {
  //   return 'Admin';
  // }
}
