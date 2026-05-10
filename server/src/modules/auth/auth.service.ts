import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { injection_token } from '../../common/constants/injection/injection.token';
import { registerTable } from '../../database/schema';
import { profileTable } from '../../database/schema';
import { AppException } from '../../common/exceptions/app.exception';
import { ErrorCode } from '../../common/enums/error.code';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../database/schema';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { LoginDto } from './dto/login.dto';
import { MyLoggerService } from '../../common/services/logger/logger.service';
import { NotificationService } from '../notification/notification.service';
import { ForgotPassword } from './dto/forgotPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { CacheService } from '../../common/services/caching/cache.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(injection_token.DB_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly jwtService: JwtService,
    private readonly notificationService: NotificationService,
    private readonly cacheService: CacheService,
    private readonly logger: MyLoggerService,
  ) {}

  //! HASHED THE PASSWORD (ENCRYPTION)
  async hashedPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  //! GENERATE JWT TOKEN FOR AUTHORIZATION
  private async generateToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  //! REGISTER USER
  async registerUser(dto: RegisterDto) {
    //! Log registration attempt (entry point tracking)
    this.logger.log(`Register attempt: ${dto.email}`, 'AuthService');

    if (!dto.name || !dto.email || !dto.password) {
      //! Log missing required fields (client error visibility)
      this.logger.warn(`Missing fields for: ${dto.email}`, 'AuthService');

      throw new AppException(
        'All required fields must be provided',
        HttpStatus.BAD_REQUEST,
        ErrorCode.MISSING_REQUIRED_FIELD,
      );
    }

    const existingByEmail = await this.db
      .select()
      .from(registerTable)
      .where(eq(registerTable.email, dto.email));

    if (existingByEmail.length > 0) {
      //! Log duplicate email attempt (business validation failure)
      this.logger.warn(`Duplicate email: ${dto.email}`, 'AuthService');

      throw new AppException(
        'Email already exists',
        HttpStatus.CONFLICT,
        ErrorCode.EMAIL_ALREADY_EXISTS,
      );
    }

    const hashedPassword = await this.hashedPassword(dto.password);

    const result = await this.db.transaction(async (tx: any) => {
      const [newUser] = await tx
        .insert(registerTable)
        .values({
          name: dto.name,
          email: dto.email,
          password: hashedPassword,
        })
        .returning();

      if (!newUser) {
        //! Log DB failure during registration (critical issue)
        this.logger.error(
          'Registration DB insert failed',
          undefined,
          'AuthService',
        );

        throw new AppException(
          'Registration failed',
          HttpStatus.BAD_REQUEST,
          ErrorCode.CONFLICT,
        );
      }

      await tx.insert(profileTable).values({
        registerId: newUser.id,
        name: dto.name,
        email: dto.email,
      });

      return newUser;
    });

    const { password, ...safeUser } = result;

    const payload = {
      sub: result.id,
      email: result.email,
      role: result.role,
    };

    const token = await this.generateToken(payload);

    //! Log successful registration (audit trail)
    this.logger.log(`User registered: ${result.id}`, 'AuthService');

    // ! SEND WELCOME EMAIL TO THE REGISTERD USER
    const info = await this.notificationService.sendWelcomeEmail(
      result.name,
      result.email,
    );

    this.logger.log(
      `Welcome email sent to ${safeUser.name} with email: ${safeUser.email} | MessageId: ${info.messageId}`,
      'AuthService',
    );

    return {
      token: token,
      user: safeUser,
    };
  }

  //! LOGIN USER
  async loginUser(dto: LoginDto) {
    //! Log login attempt (tracking access attempts)
    this.logger.log(`Login attempt: ${dto.email}`, 'AuthService');

    const users = await this.db
      .select()
      .from(registerTable)
      .where(eq(registerTable.email, dto.email));

    if (!users.length) {
      // Log invalid login (user not found)
      this.logger.warn(
        `Invalid login (user not found): ${dto.email}`,
        'AuthService',
      );

      throw new AppException(
        'Invalid credentials',
        HttpStatus.UNAUTHORIZED,
        ErrorCode.INVALID_CREDENTIALS,
      );
    }

    const user = users[0];

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      // Log invalid login (wrong password)
      this.logger.warn(
        `Invalid login (wrong password): ${dto.email}`,
        'AuthService',
      );

      throw new AppException(
        'Invalid credentials',
        HttpStatus.UNAUTHORIZED,
        ErrorCode.INVALID_CREDENTIALS,
      );
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const token = await this.generateToken(payload);

    // Log successful login (security + audit)
    this.logger.log(`Login success: ${user.id}`, 'AuthService');

    return { token };
  }

  //! FORGET PASSWORD
  async forgetPassword(dto: ForgotPassword) {
    //! Log forget password attempt
    this.logger.log(`Forget Password Attempt:${dto.email}`, 'AuthService');

    const users = await this.db
      .select()
      .from(registerTable)
      .where(eq(registerTable.email, dto.email));

    //!if email not found it means that particular user is not valid user
    if (!users.length) {
      this.logger.warn(
        `Invalid email(user not found):${dto.email}`,
        'AuthService',
      );

      throw new AppException(
        'Invalid credentials',
        HttpStatus.UNAUTHORIZED,
        ErrorCode.INVALID_CREDENTIALS,
      );
    }

    const user = users[0];
    //! generate otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    //! save the otp ot db
    await this.db
      .update(registerTable)
      .set({ otp })
      .where(eq(registerTable.email, dto.email));

    //! sent otp via email
    await this.notificationService.sendOtpEmail(otp, dto.email);

    //! log successful otp sent
    this.logger.log(`otp send successfully:${user.id}`, 'AuthService');

    return false;
  }

  //! RESET PASSWORD
  async resetPassword(dto: ResetPasswordDto) {
    //! log reset password attempt
    this.logger.log(`reset password attempt:${dto.email}`, `AuthService`);

    const users = await this.db
      .select()
      .from(registerTable)
      .where(eq(registerTable.email, dto.email));

    const user = users[0];

    //! if no account found
    if (!user) {
      this.logger.warn(`Account is ot found with this email`);

      throw new AppException(
        `No Account found with this email`,
        HttpStatus.NOT_FOUND,
        ErrorCode.NOT_FOUND,
      );
    }

    //! if otp is not found
    if (!user.otp) {
      this.logger.warn('No otp was requested for this email');

      throw new AppException(
        `No otp was requested for this email`,
        HttpStatus.NOT_FOUND,
        ErrorCode.NOT_FOUND,
      );
    }

    //! if otp is not matched
    if (user.otp !== dto.otp) {
      this.logger.error('otp is not matched');
      throw new AppException(
        `Invalid OTP`,
        HttpStatus.BAD_REQUEST,
        ErrorCode.INVALID_INPUT,
      );
    }

    //! if otp time is not available
    if (!user.updatedAt) {
      throw new AppException(
        `No otp was requested for this email`,
        HttpStatus.NOT_ACCEPTABLE,
        ErrorCode.ACCESS_DENIED,
      );
    }

    //! check otp is expired or not
    const otp_expire_time = 5 * 60 * 1000;
    const otp_age = Date.now() - user.updatedAt.getTime();

    //! if reach expirytime
    if (otp_age > otp_expire_time) {
      await this.db
        .update(registerTable)
        .set({ otp: null })
        .where(eq(registerTable.email, dto.email));

      throw new AppException(
        `OTP expired please request again`,
        HttpStatus.NOT_ACCEPTABLE,
        ErrorCode.ACCESS_DENIED,
      );
    }

    //!hash new password
    const hashedPassword = await this.hashedPassword(dto.password);

    //! update password
    await this.db
      .update(registerTable)
      .set({
        password: hashedPassword,
        otp: null,
      })
      .where(eq(registerTable.email, dto.email));

    this.logger.log(`Password reset for user: ${user.id}`, 'AuthService');

    return false;
  }
}
