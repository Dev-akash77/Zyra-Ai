import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { MyLoggerService } from '../modules/logger/logger.service';

export const connectDatabase = (database_url: string, logger: MyLoggerService) => {
  try {
    const pool = new Pool({
      connectionString: database_url,
       ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
    });
     logger.log('PostgreSQL connected', 'Database');
    return drizzle(pool, { schema });
  } catch (error) {
    logger.error(`POSTGRE SQL database connection failled ${error}`);
  }
};
