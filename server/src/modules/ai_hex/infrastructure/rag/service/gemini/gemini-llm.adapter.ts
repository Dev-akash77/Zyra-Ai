import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { LlmPort } from '../../../../application/rag/port/outbound/llm.port';


@Injectable()
export class GeminiLlmAdapter
  implements LlmPort
{
  private readonly llm: ChatGoogleGenerativeAI;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.llm = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-flash',
      apiKey:
        this.configService.get<string>(
          'GOOGLE_API_KEY',
        ),
      temperature: 0.3,
    });
  }

  async generate(
    prompt: string,
  ): Promise<string> {

    const response =
      await this.llm.invoke(prompt);

    return response.content.toString();
  }
}

export const LLM_TOKEN = Symbol('LLM_TOKEN');