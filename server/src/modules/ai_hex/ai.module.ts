import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RagController } from './presentation/rag/controller/rag.controller';
import { IngestDocumentUseCase } from './application/rag/usecase/ingest-document.use-case';
import { QueryDocumentUseCase } from './application/rag/usecase/query-document.use-case';
import {
  DOCUMENT_PARSER_TOKEN,
  PdfParserAdapter,
} from './infrastructure/rag/adapter/pdf/pdf-parser.adapter';
import {
  EMBEDDING_TOKEN,
  GeminiEmbeddingAdapter,
} from './infrastructure/rag/adapter/gemini/gemini-embedding.adapter';
import { PineconeVectorStoreAdapter } from './infrastructure/rag/adapter/db/pinecone/pinecone-vector-store.adapter';
import {
  GeminiLlmAdapter,
  LLM_TOKEN,
} from './infrastructure/rag/adapter/gemini/gemini-llm.adapter';
import { VECTOR_STORE_TOKEN } from './application/rag/port/vector-store.port';
import { GeminiEmbeddingProvider } from './infrastructure/rag/provider/gemini-embedding.provider';
import { geminiEmbeddingConfig } from './infrastructure/rag/config/gemini-embedding-model.config';
import { PineconeProvider } from './infrastructure/rag/provider/pineconde.provider';
import { pineconeDatabaseConfig } from './infrastructure/rag/config/pinecone-database.config';

@Module({
  imports: [
    ConfigModule.forFeature(geminiEmbeddingConfig),
    ConfigModule.forFeature(pineconeDatabaseConfig),
  ],
  providers: [
    IngestDocumentUseCase,
    QueryDocumentUseCase,
    GeminiEmbeddingProvider,
    PineconeProvider,

    {
      provide: DOCUMENT_PARSER_TOKEN,
      useClass: PdfParserAdapter,
    },

    {
      provide: EMBEDDING_TOKEN,
      useClass: GeminiEmbeddingAdapter,
    },

    {
      provide: VECTOR_STORE_TOKEN,
      useClass: PineconeVectorStoreAdapter,
    },

    {
      provide: LLM_TOKEN,
      useClass: GeminiLlmAdapter,
    },
  ],
  controllers: [RagController],
})
export class AiModuleHex {}
