import { drizzle } from 'drizzle-orm/neon-http'; 
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';
import { MyLoggerService } from '../common/services/logger/logger.service';

export const connectDatabase = (
  database_url: string,
  logger: MyLoggerService,
) => {
  try {
    if (!database_url) {
      throw new Error("DATABASE_URL is missing!"); 
    }

    // TCP Pool ki jagah Neon ka HTTP driver use kar rahe hain
    const sql = neon(database_url);
    
    logger.log('PostgreSQL connected via Neon HTTP', 'Database');
    
    return drizzle(sql, { schema });   
  } catch (error) {
    logger.error(`POSTGRE SQL database connection failled ${error}`);
  }
};