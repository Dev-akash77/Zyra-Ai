import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { injection_token } from '../../common/constants/injection.token';
import { registerTable } from '../../database/schema';
import { profileTable } from '../../database/schema';
import {
  LoignInterface,
  Registration as RegisterInterface,
} from './inerface/register.interface';
import { AppException } from '../../common/exceptions/app.exception';
import { ErrorCode } from '../../common/enums/error.code';
import { eq, or } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../database/schema';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './inerface/token.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(injection_token.DB_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>, // TODO: Replace with proper DB type

    private readonly jwtService: JwtService,
  ) {}

  // ! Hashed Password
  async hashedPassword(password: string) {
    //! Hash the user's password
    return await bcrypt.hash(password, 10);
  }

  // ! GENERATE TOKEN
  private async generateToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload);
  }

  // ! Register User Service
  async registerUser(dto: RegisterInterface) {
    //! Validate required fields
    if (!dto.name || !dto.email || !dto.password) {
      throw new AppException(
        'All required fields must be provided',
        HttpStatus.BAD_REQUEST,
        ErrorCode.MISSING_REQUIRED_FIELD,
      );
    }

    //! Check if email already exists
    const existingByEmail = await this.db
      .select()
      .from(registerTable)
      .where(eq(registerTable.email, dto.email));

    //! Throw error if email is already registered
    if (existingByEmail.length > 0) {
      throw new AppException(
        'Email already exists',
        HttpStatus.CONFLICT,
        ErrorCode.EMAIL_ALREADY_EXISTS,
      );
    }

    //! Check if phone number already exists
    const existingByPhone = await this.db
      .select()
      .from(registerTable)
      .where(eq(registerTable.phoneNumber, dto.phoneNumber));

    //! Throw error if phone number is already registered
    if (existingByPhone.length > 0) {
      throw new AppException(
        'Phone number already exists',
        HttpStatus.CONFLICT,
        ErrorCode.DUPLICATE_RESOURCE,
      );
    }

    //! Hash the user's password before storing
    const hashedPassword = await this.hashedPassword(dto.password);

    //! Execute registration inside a transaction
    const result = await this.db.transaction(async (tx: any) => {
      //! Insert user into register table
      const [newUser] = await tx
        .insert(registerTable)
        .values({
          name: dto.name,
          email: dto.email,
          password: hashedPassword,
          role: dto.role ?? 'user',
          otp: dto.otp,
          phoneNumber: dto.phoneNumber,
        })
        .returning();

      //! Ensure user was successfully created
      if (!newUser) {
        throw new AppException(
          'Registration failed',
          HttpStatus.BAD_REQUEST,
          ErrorCode.CONFLICT,
        );
      }

      //! Create related profile entry
      await tx.insert(profileTable).values({
        registerId: newUser.id,
        name: dto.name,
        email: dto.email,
      });

      return newUser;
    });

    //! Remove password before returning response
    const { password, ...safeUser } = result;

    const payload = {
      sub: result.id,
      email: result.email,
      role: result.role,
    };

    // ! generate jwt token
    const token = await this.generateToken(payload);

    return {
      success: true,
      message: 'User registered successfully',
      token: token,
    };
  }

  // ! Login User
  async loginUser(dto: LoignInterface) {
    // ! find user by email
    const users = await this.db
      .select()
      .from(registerTable)
      .where(eq(registerTable.email, dto.email));

    if (!users.length) {
      throw new AppException(
        'Invalid credentials',
        HttpStatus.UNAUTHORIZED,
        ErrorCode.INVALID_CREDENTIALS,
      );
    }

    // ! user
    const user = users[0];

    // ! Compare password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
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

     return {
      success: true,
      message: 'login successfully',
      token: token,
    };
  }
}
