import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { LlmPort } from '../../../../application/rag/port/outbound/llm.port';
import { injection_token } from '../../../../../../common/constants/injection/injection.token';


@Injectable()
export class GeminiLlmAdapter
  implements LlmPort
{

  constructor(
    private readonly configService: ConfigService,
    @Inject(injection_token.LLM_TOKEN) 
    private readonly llm: ChatGoogleGenerativeAI,
  ) {}

  async generate(
    prompt: string,
  ): Promise<string> {

    const response =
      await this.llm.invoke(prompt);

    return response.content.toString();
  }
}

export const LLM_TOKEN = Symbol('LLM_TOKEN');