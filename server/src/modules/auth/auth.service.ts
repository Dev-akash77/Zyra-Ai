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

@Injectable()
export class AuthService {
  constructor(
    @Inject(injection_token.DB_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,

    private readonly jwtService: JwtService,
  ) {}

  //! Hash the user's password
  async hashedPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  // ! GENERATE JWT TOKEN
  private async generateToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  // ! REGISTER USER
  async registerUser(dto: RegisterDto) {
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
      data:safeUser
    };
  }

  // ! LOGIN USER
  async loginUser(dto: LoginDto) {
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
