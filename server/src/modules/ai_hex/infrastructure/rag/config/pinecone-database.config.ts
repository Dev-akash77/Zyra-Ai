import { registerAs } from '@nestjs/config';

export const pineconeDatabaseConfig = registerAs('pinecone-database', () => ({
  api_key: process.env.PINECONE_API_KEY as string
}));