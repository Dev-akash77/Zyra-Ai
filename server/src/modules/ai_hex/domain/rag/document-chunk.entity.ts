export interface DocumentChunkMetadata {
  pageNumber?: number;
  source?: string;
  [key: string]: unknown;
}

export class DocumentChunk {
  constructor(
    public readonly id: string,
    public readonly documentId: string,
    public readonly content: string,
    public readonly chunkIndex: number,
    public readonly metadata: DocumentChunkMetadata = {},
  ) {}
}