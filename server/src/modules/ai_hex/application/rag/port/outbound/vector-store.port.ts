import { DocumentChunk } from "../../../../domain/rag/document-chunk.entity";
import { RetrievalSource } from "../../contract/query-document.contract";

export interface VectorStorePort {
  store(
    chunks: DocumentChunk[],
  ): Promise<void>;

  search(
    query: string,
    limit: number,
  ): Promise<RetrievalSource[]>;
}

export const VECTOR_STORE_TOKEN = Symbol('VECTOR_STORE_TOKEN');