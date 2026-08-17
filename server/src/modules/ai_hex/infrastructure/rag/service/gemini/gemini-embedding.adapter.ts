import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { EmbeddingPort } from '../../../../application/rag/port/outbound/embedding.port';

@Injectable()
export class GeminiEmbeddingAdapter implements EmbeddingPort {
  private readonly embeddings: GoogleGenerativeAIEmbeddings;
  
  constructor(private readonly configService: ConfigService) {
    this.embeddings = new GoogleGenerativeAIEmbeddings({
      model: 'gemini-embedding-001',
      apiKey: this.configService.get<string>('GOOGLE_API_KEY'),
    });
  }

  async generateEmbedding(text: string): Promise<number[]> {
    return this.embeddings.embedQuery(text);
  }
}

export const EMBEDDING_TOKEN = Symbol('EMBEDDING_TOKEN');