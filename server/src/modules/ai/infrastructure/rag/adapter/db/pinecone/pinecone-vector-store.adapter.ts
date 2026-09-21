import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Pinecone } from '@pinecone-database/pinecone';

import { PineconeStore } from '@langchain/pinecone';

import {
  EMBEDDING_TOKEN,
  GeminiEmbeddingAdapter,
} from '../../gemini/gemini-embedding.adapter';
import { DocumentChunk } from '../../../../../domain/rag/document-chunk.entity';
import { VectorStorePort } from '../../../../../application/rag/port/vector-store.port';
import { RetrievalSource } from '../../../../../domain/rag/retrieval-source.entity';
import { PINECONE_PORT } from '../../../provider/pineconde.provider';
import { MyLoggerService } from '../../../../../../../common/services/logger/logger.service';

@Injectable()
export class PineconeVectorStoreAdapter implements VectorStorePort {
  private readonly pinecone: Pinecone;
  private readonly indexName: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(EMBEDDING_TOKEN)
    private readonly embeddingAdapter: GeminiEmbeddingAdapter,
    @Inject(PINECONE_PORT)
    private readonly pineconeProvider: { pinecone: Pinecone; indexName: string },
    private readonly logger: MyLoggerService
    
  ) {
    this.pinecone = pineconeProvider.pinecone;
    this.indexName = pineconeProvider.indexName;
  }

  async store(chunks: DocumentChunk[]): Promise<void> {

    try {

        this.logger.log(`Storing ${chunks.length} document chunks in Pinecone`, 'PineconeVectorStoreAdapter');
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
    } catch (error) {
      this.logger.error('Error storing document chunks in Pinecone:', 'PineconeVectorStoreAdapter');
      throw error;
    }
  }

  async search(query: string, limit: number): Promise<RetrievalSource[]> {

    try {

        this.logger.log(`Searching for documents in Pinecone`, 'PineconeVectorStoreAdapter');

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
} catch (error) {
    this.logger.error('Error searching for documents in Pinecone:', 'PineconeVectorStoreAdapter');
    throw error;
}
  }
}
