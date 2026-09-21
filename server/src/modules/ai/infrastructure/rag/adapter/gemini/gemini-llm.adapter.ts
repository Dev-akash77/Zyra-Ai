import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { LlmPort } from '../../../../application/rag/port/llm.port';
import { injection_token } from '../../../../../../common/constants/injection/injection.token';
import { MyLoggerService } from '../../../../../../common/services/logger/logger.service';

@Injectable()
export class GeminiLlmAdapter implements LlmPort {
  constructor(
    private readonly configService: ConfigService,
    @Inject(injection_token.LLM_TOKEN)
    private readonly llm: ChatGoogleGenerativeAI,
    private readonly logger: MyLoggerService
  ) {}

  async generate(prompt: string): Promise<string> {

    this.logger.log('Generating response using Gemini LLM...', 'GeminiLlmAdapter');
    const response = await this.llm.invoke(prompt);

    return response.content.toString();
  }
}

export const LLM_TOKEN = Symbol('LLM_TOKEN');
