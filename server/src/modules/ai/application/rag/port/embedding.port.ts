export interface EmbeddingPort {
  generateEmbedding(text: string): Promise<number[]>;
}
