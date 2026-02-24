import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  console.log('DATABASE_URL is missing');
}

export default defineConfig({
  schema: './src/database/schema.ts',
  out: './src/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
