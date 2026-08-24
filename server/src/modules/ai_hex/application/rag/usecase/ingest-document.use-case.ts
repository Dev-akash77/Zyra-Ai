import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { type DocumentParserPort } from '../port/document-parser.port';
import {
  VECTOR_STORE_TOKEN,
  type VectorStorePort,
} from '../port/vector-store.port';
import {
  IngestDocumentCommand,
  IngestDocumentResult,
} from '../contract/ingest-document.contract';
import { Document } from '../../../domain/rag/document.entity';
import { DOCUMENT_PARSER_TOKEN } from '../../../infrastructure/rag/adapter/pdf/pdf-parser.adapter';
import { MyLoggerService } from '../../../../../common/services/logger/logger.service';

@Injectable()
export class IngestDocumentUseCase {
  constructor(
    @Inject(DOCUMENT_PARSER_TOKEN)
    private readonly documentParser: DocumentParserPort,
    @Inject(VECTOR_STORE_TOKEN) private readonly vectorStore: VectorStorePort,
    private readonly logger: MyLoggerService,
  ) {}

  async execute(command: IngestDocumentCommand): Promise<IngestDocumentResult> {
    try {
      const document = new Document(
        randomUUID(),
        command.fileName,
        command.mimeType,
      );

      const chunks = await this.documentParser.parse(command.file, document.id);
      this.logger.log('document chunks parsed', 'IngestDocumentUseCase');

      await this.vectorStore.store(chunks);
      this.logger.log(
        'document chunks stored in vector store',
        'IngestDocumentUseCase',
      );

      document.markCompleted();
      this.logger.log(
        'Document ingestion completed successfully.',
        'IngestDocumentUseCase',
      );

      return {
        documentId: document.id,
        chunks: chunks.length,
        message: 'Document successfully processed and stored.',
      };
    } catch (error) {
      this.logger.error(
        'Error executing IngestDocumentUseCase:',
        'IngestDocumentUseCase',
      );
      throw error;
    }
  }
}
