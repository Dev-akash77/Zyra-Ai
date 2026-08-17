export interface QueryDocumentCommand {
  query: string;
  limit?: number;
}

export interface RetrievalSource {
  content: string;
  score: number;
  metadata: Record<string, unknown>;
}

export interface QueryDocumentResult {
  answer: string;
  sources: RetrievalSource[];
}