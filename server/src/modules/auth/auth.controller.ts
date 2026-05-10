import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPassword } from './dto/forgotPassword.dto';
import { success_message } from '../../common/decorators/success-message.decorators';
import { RateLimit } from '../rate-limit/rate-limit.decorator';
import { RATE_LIMITS } from '../../common/constants/rate_limit/ratelimit.config';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

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


  //! Forget Password Port
  @Patch('forget/password')
  @UseGuards(JwtAuthGuard)
  @RateLimit(RATE_LIMITS.STRICT)
  @success_message('OTP Send Successfully')
  forgetPassword(@Body() dto: ForgotPassword) {
    return this.authService.forgetPassword(dto);
  }

  @Patch('reset/password')
  @UseGuards(JwtAuthGuard)
  @RateLimit(RATE_LIMITS.STRICT)
  @success_message('Passwor Reset Successfully')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
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