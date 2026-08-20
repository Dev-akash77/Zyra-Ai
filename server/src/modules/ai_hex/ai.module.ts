import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RagController } from './presentation/rag/controller/rag.controller';
import { IngestDocumentUseCase } from './application/rag/usecase/ingest-document.use-case';
import { QueryDocumentUseCase } from './application/rag/usecase/query-document.use-case';
import {
  DOCUMENT_PARSER_TOKEN,
  PdfParserAdapter,
} from './infrastructure/rag/service/pdf/pdf-parser.adapter';
import {
  EMBEDDING_TOKEN,
  GeminiEmbeddingAdapter,
} from './infrastructure/rag/service/gemini/gemini-embedding.adapter';
import {
  PineconeVectorStoreAdapter
} from './infrastructure/rag/service/pinecone/pinecone-vector-store.adapter';
import {
  GeminiLlmAdapter,
  LLM_TOKEN,
} from './infrastructure/rag/service/gemini/gemini-llm.adapter';
import { VECTOR_STORE_TOKEN } from './application/rag/port/outbound/vector-store.port';
import { GeminiEmbeddingProvider } from './infrastructure/rag/provider/gemini-embedding.provider';
import { geminiEmbeddingConfig } from './infrastructure/rag/config/gemini-embedding-model.config';

@Module({
  imports: [
    ConfigModule.forFeature(geminiEmbeddingConfig),
  ],
  providers: [ 
    IngestDocumentUseCase,
    QueryDocumentUseCase,
    GeminiEmbeddingProvider,

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
