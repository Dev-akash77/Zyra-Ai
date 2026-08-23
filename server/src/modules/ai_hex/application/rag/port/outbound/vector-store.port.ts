import { DocumentChunk } from "../../../../domain/rag/document-chunk.entity";
import { RetrievalSource } from "../../../../domain/rag/retrieval-source.entity";


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