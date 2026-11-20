export interface IngestDocumentCommand {
  userId:string;
  file: Buffer;
  fileName: string;
  mimeType: string;
}

export interface IngestDocumentResult {
  documentId: string;
  chunks: number;
  message: string;
}
