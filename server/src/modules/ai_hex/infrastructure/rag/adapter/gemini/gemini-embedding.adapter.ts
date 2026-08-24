import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { EmbeddingPort } from '../../../../application/rag/port/embedding.port';
import { EMBEDDING_PORT } from '../../provider/gemini-embedding.provider';
import { MyLoggerService } from '../../../../../../common/services/logger/logger.service';

@Injectable()
export class GeminiEmbeddingAdapter implements EmbeddingPort {
  
  constructor(private readonly configService: ConfigService,
    @Inject(EMBEDDING_PORT)
    private readonly embeddings: GoogleGenerativeAIEmbeddings,
    private readonly logger: MyLoggerService
  ) 

  {}

  async generateEmbedding(text: string): Promise<number[]> {
    this.logger.log(`Generating embedding for text `, 'GeminiEmbeddingAdapter');
    return this.embeddings.embedQuery(text);
  }
}

export const EMBEDDING_TOKEN = Symbol('EMBEDDING_TOKEN');