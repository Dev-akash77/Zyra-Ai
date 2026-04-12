import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { injection_token } from '../../common/constants/injection.token';
import { registerTable } from '../../database/schema';
import { profileTable } from '../../database/schema';
import { AppException } from '../../common/exceptions/app.exception';
import { ErrorCode } from '../../common/enums/error.code';
import { eq, or } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../database/schema';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { LoginDto } from './dto/login.dto';
import { MyLoggerService } from '../logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(injection_token.DB_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,

    private readonly jwtService: JwtService,

    // Logger injected for structured logging across auth flows
    private readonly logger: MyLoggerService,
  ) {}

  async hashedPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  private async generateToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async registerUser(dto: RegisterDto) {
    // Log registration attempt (entry point tracking)
    this.logger.log(`Register attempt: ${dto.email}`, 'AuthService');

    if (!dto.name || !dto.email || !dto.password) {
      // Log missing required fields (client error visibility)
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
      // Log duplicate email attempt (business validation failure)
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
        // Log DB failure during registration (critical issue)
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

    // Log successful registration (audit trail)
    this.logger.log(`User registered: ${result.id}`, 'AuthService');

    return {
      token: token,
      user: safeUser,
    };
  }

  async loginUser(dto: LoginDto) {
    // Log login attempt (tracking access attempts)
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
}
