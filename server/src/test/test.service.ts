import { Inject, Injectable } from '@nestjs/common';
import { injection_token } from '../common/constants/injection.token';
import { registerTable } from '../database/schema';

@Injectable()
export class TestService {
  constructor(
    @Inject(injection_token.DB_CONNECTION)
    private readonly db: any,
  ) {}

  async insertUser() {
    const result = await this.db
      .insert(registerTable)
      .values({
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword123',
        phoneNumber: '+919876543210',
        role: 'user',
      })
      .returning();

    return result;
  }

  async getUsers() {
    return this.db.select().from(registerTable);
  }
}
