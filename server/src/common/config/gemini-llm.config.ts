import { registerAs } from '@nestjs/config';


export const geminiLlmConfig = registerAs('gemini-llm', () => ({
    model: process.env.GEMINI_LLM_MODEL,
  api_key: process.env.GOOGLE_API_KEY,
  temperature: 0.3

}));