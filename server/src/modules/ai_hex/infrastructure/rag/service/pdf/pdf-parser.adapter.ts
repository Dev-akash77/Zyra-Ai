import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { DocumentParserPort } from '../../../../application/rag/port/outbound/document-parser.port';
import { DocumentChunk } from '../../../../domain/rag/document-chunk.entity';

@Injectable()
export class PdfParserAdapter implements DocumentParserPort {
  async parse(file: Buffer, documentId: string): Promise<DocumentChunk[]> {
    try {
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
      console.error('PDF parsing error:', error);

      throw new InternalServerErrorException('PDF parsing failed.');
    }
  }
}

export const DOCUMENT_PARSER_TOKEN = Symbol('DOCUMENT_PARSER_TOKEN');
