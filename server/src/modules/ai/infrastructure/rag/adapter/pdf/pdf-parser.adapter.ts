import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { DocumentParserPort } from '../../../../application/rag/port/document-parser.port';
import { DocumentChunk } from '../../../../domain/rag/document-chunk.entity';
import { MyLoggerService } from '../../../../../../common/services/logger/logger.service';

@Injectable()
export class PdfParserAdapter implements DocumentParserPort {
    constructor(private readonly logger: MyLoggerService) {}
  async parse(file: Buffer, documentId: string): Promise<DocumentChunk[]> {
    try {

        this.logger.log(`Parsing PDF document with ID: ${documentId}`, 'PdfParserAdapter');
      const blob = new Blob([new Uint8Array(file)], {
        type: 'application/pdf',
      });

      const loader = new PDFLoader(blob);

      const documents = await loader.load();

      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });

      const chunks = await splitter.splitDocuments(documents);

      return chunks.map(
        (chunk, index) =>
          new DocumentChunk(
            `${documentId}-${index}`,
            documentId,
            chunk.pageContent,
            index,
            chunk.metadata ?? {},
          ),
      );
    } catch (error) {
      this.logger.error('PDF parsing error:', 'PdfParserAdapter');

      throw new InternalServerErrorException('PDF parsing failed.');
    }
  }
}

export const DOCUMENT_PARSER_TOKEN = Symbol('DOCUMENT_PARSER_TOKEN');
