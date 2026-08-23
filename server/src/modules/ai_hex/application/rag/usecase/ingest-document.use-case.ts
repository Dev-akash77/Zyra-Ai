import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { type DocumentParserPort  } from '../port/outbound/document-parser.port';
import { VECTOR_STORE_TOKEN, type VectorStorePort } from '../port/outbound/vector-store.port';
import { IngestDocumentCommand, IngestDocumentResult } from '../contract/ingest-document.contract';
import { Document } from '../../../domain/rag/document.entity';
import { DOCUMENT_PARSER_TOKEN } from '../../../infrastructure/rag/service/pdf/pdf-parser.adapter';

@Injectable()
export class IngestDocumentUseCase
{
  constructor(
    @Inject(DOCUMENT_PARSER_TOKEN) private readonly documentParser: DocumentParserPort,
    @Inject(VECTOR_STORE_TOKEN) private readonly vectorStore: VectorStorePort,
  ) {}

  async execute(
    command: IngestDocumentCommand,
  ): Promise<IngestDocumentResult> {

    const document = new Document(
      randomUUID(),
      command.fileName,
      command.mimeType,
    );

    const chunks = await this.documentParser.parse(
      command.file,
      document.id,
    );

    await this.vectorStore.store(chunks);

    document.markCompleted();

    return {
      documentId: document.id,
      chunks: chunks.length,
      message: 'Document successfully processed and stored.',
    };
  }
}