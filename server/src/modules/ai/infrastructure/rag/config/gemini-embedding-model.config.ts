import { registerAs } from '@nestjs/config';

export const geminiEmbeddingConfig = registerAs('gemini-embedding', () => ({
  model: process.env.GEMINI_EMBED_MODEL || 'gemini-embedding-001',
  api_key: process.env.GOOGLE_API_KEY as string,
}));