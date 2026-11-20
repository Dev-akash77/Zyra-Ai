import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import * as schema from './schema';
import { MyLoggerService } from '../common/services/logger/logger.service';

neonConfig.webSocketConstructor = ws;

export const connectDatabase = (
  database_url: string,
  logger: MyLoggerService,
) => {
  try {
    if (!database_url) {
      throw new Error('DATABASE_URL is missing!');
    }

    const pool = new Pool({ connectionString: database_url });

    logger.log('PostgreSQL connected via Neon Serverless Pool', 'Database');

    return drizzle(pool, { schema });  
  } catch (error) {
    logger.error(`PostgreSQL database connection failed: ${error}`, 'Database');
    throw error;
  }
};