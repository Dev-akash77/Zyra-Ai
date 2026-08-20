import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { EmbeddingPort } from '../../../../application/rag/port/outbound/embedding.port';
import { EMBEDDING_PORT } from '../../provider/gemini-embedding.provider';

@Injectable()
export class GeminiEmbeddingAdapter implements EmbeddingPort {
  
  constructor(private readonly configService: ConfigService,
    @Inject(EMBEDDING_PORT)
    private readonly embeddings: GoogleGenerativeAIEmbeddings
  ) 

  {}

  async generateEmbedding(text: string): Promise<number[]> {
    return this.embeddings.embedQuery(text);
  }
}

export const EMBEDDING_TOKEN = Symbol('EMBEDDING_TOKEN');