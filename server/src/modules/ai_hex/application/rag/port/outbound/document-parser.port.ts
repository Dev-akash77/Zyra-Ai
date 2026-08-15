import { DocumentChunk } from "../../../../domain/rag/document-chunk.entity";

export interface DocumentParserPort {
  parse(
    file: Buffer,
    documentId: string,
  ): Promise<DocumentChunk[]>;
}