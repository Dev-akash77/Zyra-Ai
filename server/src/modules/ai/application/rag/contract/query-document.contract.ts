import { RetrievalSource } from "../../../domain/rag/retrieval-source.entity";

export interface QueryDocumentCommand {
  query: string;
  limit?: number;
}



export interface QueryDocumentResult {
  answer: string;
  sources: RetrievalSource[];
}
