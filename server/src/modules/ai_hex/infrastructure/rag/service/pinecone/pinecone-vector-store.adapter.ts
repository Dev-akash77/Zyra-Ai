import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Pinecone } from '@pinecone-database/pinecone';

import { PineconeStore } from '@langchain/pinecone';

import {
  EMBEDDING_TOKEN,
  GeminiEmbeddingAdapter,
} from '../gemini/gemini-embedding.adapter';
import { DocumentChunk } from '../../../../domain/rag/document-chunk.entity';
import { VectorStorePort } from '../../../../application/rag/port/outbound/vector-store.port';
import { RetrievalSource } from '../../../../domain/rag/retrieval-source.entity';

@Injectable()
export class PineconeVectorStoreAdapter implements VectorStorePort {
  private readonly pinecone: Pinecone;
  private readonly indexName: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(EMBEDDING_TOKEN)
    private readonly embeddingAdapter: GeminiEmbeddingAdapter,
  ) {
    this.pinecone = new Pinecone({
      apiKey: this.configService.get<string>('PINECONE_API_KEY') ?? '',
    });

    this.indexName = this.configService.get<string>('PINECONE_INDEX_NAME')!;
  }

  async store(chunks: DocumentChunk[]): Promise<void> {
    const index = this.pinecone.Index(this.indexName);

    const documents = chunks.map((chunk) => ({
      pageContent: chunk.content,
      metadata: {
        ...chunk.metadata,
        chunkId: chunk.id,
        documentId: chunk.documentId,
        chunkIndex: chunk.chunkIndex,
      },
    }));

    await PineconeStore.fromDocuments(
      documents,
      this.embeddingAdapter['embeddings'],
      {
        pineconeIndex: index,
        maxConcurrency: 5,
      },
    );
  }

  async search(query: string, limit: number): Promise<RetrievalSource[]> {
    const index = this.pinecone.Index(this.indexName);

    const vectorStore = await PineconeStore.fromExistingIndex(
      this.embeddingAdapter['embeddings'],
      {
        pineconeIndex: index,
        textKey: 'text',
      },
    );

    const documents = await vectorStore.similaritySearchWithScore(query, limit);

    return documents.map(([document, score]) => ({
      content: document.pageContent,
      score,
      metadata: document.metadata ?? {},
    }));
  }
}
