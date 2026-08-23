export interface RetrievalSource {
  content: string;
  score: number;
  metadata: Record<string, unknown>;
}