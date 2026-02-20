import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export const connectDatabase = (database_url: string) => {
  try {
    const pool = new Pool({
      connectionString: database_url,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    console.log(`POSTGRE Connected`);
    return drizzle(pool, { schema });
  } catch (error) {
    console.log(`POSTGRE SQL database connection failled ${error}`);
  }
};
