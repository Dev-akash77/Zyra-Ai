import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { injection_token } from '../../common/constants/injection.token';
import { registerTable } from '../../database/schema';
import { profileTable } from '../../database/schema';
import { Registration as RegisterInterface } from './inerface/register.interface';
import { AppException } from '../../common/exceptions/app.exception';
import { ErrorCode } from '../../common/enums/error.code';
import { eq, or } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @Inject(injection_token.DB_CONNECTION)
        private readonly db: any, // we will improve type later
    ) {}


    async registerUser(dto: RegisterInterface) {
        if (!dto.name || !dto.email || !dto.password) {
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
            throw new AppException(
                'Email already exists',
                HttpStatus.CONFLICT,
                ErrorCode.EMAIL_ALREADY_EXISTS,
            );
        }

        const existingByPhone = await this.db
            .select()
            .from(registerTable)
            .where(eq(registerTable.phoneNumber, dto.phoneNumber));

        if (existingByPhone.length > 0) {
            throw new AppException(
                'Phone number already exists',
                HttpStatus.CONFLICT,
                ErrorCode.DUPLICATE_RESOURCE,
            );
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const result = await this.db.transaction(async (tx: any) => {
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

            if (!newUser) {
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

        return {
            success: true,
            message: 'User registered successfully',
            data: safeUser,
        };
    }
}
